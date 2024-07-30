import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { useFormik } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import moment from "moment";
import Badge from "react-bootstrap/Badge";
import LoadingSpinner from "./Loader/LoadingSpinner";
import { NavLink } from "react-router-dom";
function DateChangeRequestForm(props) {
  const data = [];
  const projectType = [];

  const [isLoadData, setIsLoadData] = useState(false);
  const [checked, setChecked] = useState(false);

  const [selectedinfo, setSelectedBasicInfo] = useState("");
  const [inputs, setInputs] = useState({});
  const [volumes, setVolumes] = useState([]);
  const [projectTypes, setprojectTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  //   const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [startCostDate, setStartCostDate] = useState(new Date());
  const [endCostDate, setEndCostDate] = useState(new Date());
  const [sellingStartDate, setSellingStartDate] = useState(new Date());
  // const [endCostDate2, setEndCostDate2] = useState(new Date());
  const [sellingEndDate, setSellingEndDate] = useState(new Date());
  const [formStatus, setFormStatus] = useState("");
  const [status, setStatus] = useState("");
  const [userinfo, setUserInfo] = useState({
    promotionDiscount: [],
  });
  const Level5UserID = [];
  const Level4UserID = [];
  const Level3UserID = [];
  const [BaIds, setBAIDs] = useState([]);
  useEffect(() => {
    projectVolume();
  }, []);
  useEffect(() => {
    getAllCreatedData();
    getprojectTypes();
    SelectedBaList();
    departmentBasedApprover();
  }, []);

  const selectedBaID = [];
  const SelectedBaList = async () => {
    if (!localStorage.getItem("auth-token")) {
      navigate("/login");
      return;
    }
    setIsLoading(true);
    await axios({
      url:
        process.env.REACT_APP_API_KEY + "selected-ba-list/" + props.projectID,

      method: "get",
      params: {
        userID: localStorage.getItem("authID"),
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
      },
    })
      .then(function (response) {
        if (response.data.data && response.data.data.length > 0) {
          response.data.data.forEach((element) => {
            selectedBaID.push(
              element.delegation
                ? element.delegation.baID
                : element.User?.BusinessAnalyst.id
            );
          });
          setBAIDs(selectedBaID);
        }

        setIsLoading(false);
      })
      .catch(function (error) {
        // if (error.response.status === 401) {
        //   localStorage.clear();
        // }
        console.log(">>>>>>>>>>>error", error.response);
      });
  };

  const departmentBasedApprover = async () => {
    if (!localStorage.getItem("auth-token")) {
      navigate("/login");
      return;
    }
    setIsLoading(true);
    await axios({
      url:
        process.env.REACT_APP_API_KEY +
        "approver-list/" +
        localStorage.getItem("authID"),
      method: "get",
      params: {
        userID: localStorage.getItem("authID"),
        projectID: props.projectID,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
      },
    })
      .then(async function (res) {
        if (localStorage.getItem("AuthLevel") === "level6" && res.data.data) {
          if (res.data.data.Users) {
            await res.data.data.Users.forEach((element) => {
              Level5UserID.push(element.id);
            });
            localStorage.setItem("Level5UserID", Level5UserID);
          }

          if (res.data.data.level4And5Mapping.Users) {
            res.data.data.level4And5Mapping.Users.forEach((element) => {
              Level4UserID.push(element.id);
            });
            localStorage.setItem("Level4UserID", Level4UserID);
          }
          if (res.data.data.level4And5Mapping.level3And4Mapping.Users) {
            res.data.data.level4And5Mapping.level3And4Mapping.Users.forEach(
              (element) => {
                Level3UserID.push(element.id);
              }
            );
            localStorage.setItem("Level3UserID", Level3UserID);
          }
        }
        if (localStorage.getItem("AuthLevel") === "level5" && res.data.data) {
          if (res.data.data.Users) {
            res.data.data.Users.forEach((element) => {
              Level4UserID.push(element.id);
            });
            localStorage.setItem("Level4UserID", Level4UserID);
          }
          if (res.data.data.level3And4Mapping.Users) {
            res.data.data.level3And4Mapping.Users.forEach((element) => {
              Level3UserID.push(element.id);
            });
            localStorage.setItem("Level3UserID", Level3UserID);
          }
        }
        if (localStorage.getItem("AuthLevel") === "level4" && res.data.data) {
          if (res.data.data.Users) {
            res.data.data.Users.forEach((element) => {
              Level3UserID.push(element.id);
            });
            localStorage.setItem("Level3UserID", Level3UserID);
          }
        }

        setIsLoading(false);
      })

      .catch(function (error) {
        console.log(">>>>error", error.response);
        setIsLoading(false);
      });
  };

  const projectVolume = async () => {
    await axios
      .get(process.env.REACT_APP_API_KEY + "get-volume-lists", {
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
        params: {
          url: "get-volume-lists",
          userID: localStorage.getItem("authID"),
          role: localStorage.getItem("auth_role"),
        },
      })
      .then(function (response) {
        // console.log("<>Data>>", response.data.data);
        setVolumes(response.data.data);
      })
      .catch(function (error) {
        console.log(">>>>>>>>>>>error", error);
      });
  };

  if (volumes) {
    volumes.forEach((element) => {
      data.push({
        value: element.name,
        label: element.name,
      });
    });
  }

  const getprojectTypes = async () => {
    await axios
      .get(process.env.REACT_APP_API_KEY + "project-type-lists", {
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
        params: {
          url: "project-type-lists",
          userID: localStorage.getItem("authID"),
          role: localStorage.getItem("auth_role"),
        },
      })
      .then(function (response) {
        // console.log("<>Data>>", response.data.data);
        setprojectTypes(response.data.data);
      })
      .catch(function (error) {
        console.log(">>>>>>>>>>>error", error);
      });
  };

  if (projectTypes) {
    projectTypes.forEach((element) => {
      projectType.push({
        value: element.name,
        label: element.name,
      });
    });
  }

  const getAllCreatedData = async () => {
    localStorage.removeItem("ChangeRequestStatus");
    setIsLoadData(true);
    await axios
      .get(process.env.REACT_APP_API_KEY + "project-list/" + props.projectID, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
        params: {
          userID: localStorage.getItem("authID"),
          role: localStorage.getItem("auth_role"),
        },
      })
      .then(function (response) {
        // console.log(" basic Info Created Data", response.data.data);

        if (Object.keys(response.data.data).length <= 0) {
          localStorage.removeItem("projectID");
        } else {
          localStorage.setItem("projectID", response.data.data.id);
          localStorage.setItem(
            "projectDepartment",
            response.data.data.department
          );

          setFormStatus(response.data.data.status);
          // console.log("Form Status", formStatus);
          if (response.data.data.promotionDiscount) {
            setChecked(true);
          } else {
            setChecked(false);
          }
        }
        setIsLoadData(false);
        setSelectedBasicInfo(response.data.data);
        setStatus(response.data.data.status === "draft" ? "draft" : "created");
        if (Object.keys(response.data.data).length > 0) {
          setInputs({
            name: response.data.data.name,
            department: response.data.data.department,
            promotionDiscount: response.data.data.promotionDiscount
              ? response.data.data.promotionDiscount.split()
              : response.data.data.promotionDiscount,
            projectType: response.data.data.projectType,
            costStartDate: setStartCostDate(
              moment(response.data.data.costStartDate).toDate()
            ),
            costEndDate: setEndCostDate(
              moment(response.data.data.costEndDate).toDate()
            ),
            // costEndDay: setEndCostDate2(
            //   moment(response.data.data.costEndDay).toDate()
            // ),
            sellingStartDate: setSellingStartDate(
              moment(response.data.data.sellingStartDate).toDate()
            ),
            sellingEndDate: setSellingEndDate(
              moment(response.data.data.sellingEndDate).toDate()
            ),
            projectVolume: response.data.data.projectVolume,
            remark: response.data.data.remark,
            description: response.data.data.description,
          });
        }
      })
      .catch(function (error) {
        console.log(">>>>>>>>>>>error", error);
      });
  };

  const MAX_TEXT_LENGTH = 2000;
  const [description, setText] = useState("");

  function handleTextAreaChange(event) {
    const value = event.target.value;
    if (value.length <= MAX_TEXT_LENGTH) {
      setText(value);
    }
  }

  const validationSchema = Yup.object().shape({
    costStartDate: Yup.date(),
    costEndDate: Yup.date().min(
      Yup.ref("costStartDate"),
      "cost end date can't be before start date"
    ),
    sellingStartDate: Yup.date(),
    sellingEndDate: Yup.date().min(
      Yup.ref("sellingStartDate"),
      "selling end date can't be before start date"
    ),

    // description: Yup.string().required("Required"),
  });
  const initialValues = {
    name: inputs.name ? inputs.name : "",
    department: inputs.department ? inputs.department : "",
    projectType: inputs.projectType ? inputs.projectType : "",
    costStartDate: inputs.costStartDate ? inputs.costStartDate : startCostDate,
    costEndDate: inputs.costEndDate ? inputs.costEndDate : endCostDate,
    sellingStartDate: inputs.sellingStartDate
      ? inputs.sellingStartDate
      : sellingStartDate,
    sellingEndDate: inputs.sellingEndDate
      ? inputs.sellingEndDate
      : sellingEndDate,
    projectVolume: inputs.projectVolume ? inputs.projectVolume : "",
    remark: inputs.remark ? inputs.remark : "",
    description: description ? description : inputs.description,

    // costEndDay: endCostDate2,
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    //validateOnChange: true,
    enableReinitialize: true,
    //enableReinitialize: true,
    // validateOnBlur: false,
    onSubmit: async (data) => {
      if (!localStorage.getItem("auth-token")) {
        navigate("/login");
        return;
      }
      data.Level5UserID = localStorage.getItem("Level5UserID");
      data.Level4UserID = localStorage.getItem("Level4UserID");
      data.Level3UserID = localStorage.getItem("Level3UserID");
      data.ChangeStatus = "pending";
      data.baID = BaIds;
      setIsLoading(true);
      await axios
        .post(
          process.env.REACT_APP_API_KEY + "change-request/" + props.projectID,
          data,
          {
            headers: {
              "Content-type": "Application/json",
              Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
            },
            params: {
              userID: localStorage.getItem("authID"),
              role: localStorage.getItem("auth_role"),
            },
          }
        )
        .then((res) => {})
        .catch((error) => {
          if (error.response.status === 422) {
            swal("Oops", error.response.data.message, "error");
          }
        });

      //Save Approver Data
      await axios
        .post(
          process.env.REACT_APP_API_KEY + "save-gm-director-reviewers/",
          data,
          {
            headers: {
              "Content-type": "Application/json",
              Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
            },
            params: {
              userID: localStorage.getItem("authID"),
              projectID: props.projectID,
              role: localStorage.getItem("auth_role"),
              department: localStorage.getItem("authDepartment"),
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            swal({
              title: "Success!",
              text: "Change Request Done",
              icon: "success",
              button: "Okay",
            });
            navigate("/my-projects");
            setIsLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status === 422) {
            swal("Oops", error.response.data.message, "error");
            setIsLoading(false);
          }
        });
    },
  });

  if (isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }
  return (
    <>
      <div className="accordion-item change-request change-req-date">
        <h2 className="accordion-header" id="headingOne">
          <div className="accordian-head-first">
            <span>Request ID</span>
            <Form.Control
              type="text"
              value={"REQ" + (props.projectID ? props.projectID : "")}
              disabled
            />
          </div>
          <button
            className="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseOne"
            aria-expanded="true"
            aria-controls="collapseOne"
          ></button>
        </h2>
        <div
          id="collapseOne"
          className="accordion-collapse collapse show"
          aria-labelledby="headingOne"
          data-bs-parent="#accordionExample"
        >
          {" "}
          <form onSubmit={formik.handleSubmit}>
            <div className="accordion-body basic-info">
              <div>
                <div className="contents">
                  <div className="col-md-12 p-0">
                    <Row>
                      <div className="col-12">
                        <fieldset>
                          <span>Project Name</span>
                          <Form.Control
                            type="text"
                            className="Form-control"
                            name="name"
                            autoComplete="off"
                            onChange={formik.handleChange}
                            defaultValue={inputs.name}
                            disabled
                          />
                          <p className="text-danger">
                            {formik.errors.name && formik.touched.name
                              ? formik.errors.name
                              : null}
                          </p>
                        </fieldset>
                      </div>
                      <div className="col-md-6">
                        <div className="date-type">
                          <fieldset>
                            <div className="ilogo">
                              <span>Cost Start Date</span>
                            </div>
                            <DatePicker
                              className="form-control"
                              name="costStartDate"
                              dateFormat="yyyy-MM-dd"
                              selected={startCostDate}
                              onChange={(date) => {
                                setStartCostDate(date);

                                formik.setFieldValue("costStartDate", date);
                              }}
                              dropdownMode="select"
                              // minDate={new Date()}
                              // showYearDropdown
                              adjustDateOnChange
                              //disabled={validateField}
                              //placeholderText="Entry Date"
                            />
                            <p className="text-danger">
                              {formik.errors.costStartDate &&
                              formik.touched.costStartDate
                                ? formik.errors.costStartDate
                                : null}
                            </p>
                          </fieldset>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="date-type">
                          <fieldset>
                            <div className="ilogo">
                              <span>Cost end Date</span>
                            </div>
                            <DatePicker
                              className="form-control"
                              name="costEndDate"
                              dateFormat="yyyy-MM-dd"
                              selected={endCostDate}
                              onChange={(date) => {
                                setEndCostDate(date);
                                formik.setFieldValue("costEndDate", date);
                              }}
                              dropdownMode="select"
                              // minDate={new Date()}
                              // showYearDropdown
                              adjustDateOnChange
                              //disabled={validateField}
                              //placeholderText="Entry Date"
                            />
                            <p className="text-danger">
                              {formik.errors.costEndDate &&
                              formik.touched.costEndDate
                                ? formik.errors.costEndDate
                                : null}
                            </p>
                          </fieldset>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="date-type">
                          <fieldset>
                            <div className="ilogo">
                              <span>Selling Start Date</span>
                            </div>
                            <DatePicker
                              className="form-control"
                              name="sellingStartDate"
                              dateFormat="yyyy-MM-dd"
                              selected={sellingStartDate}
                              onChange={(date) => {
                                setSellingStartDate(date);
                                formik.setFieldValue("sellingStartDate", date);
                              }}
                              dropdownMode="select"
                              // minDate={new Date()}
                              // showYearDropdown
                              adjustDateOnChange
                              //disabled={validateField}
                              //placeholderText="Entry Date"
                            />
                          </fieldset>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="date-type">
                          <fieldset>
                            <div className="ilogo">
                              <span>Selling End Date</span>
                            </div>
                            <DatePicker
                              className="form-control"
                              name="sellingEndDate"
                              dateFormat="yyyy-MM-dd"
                              selected={sellingEndDate}
                              onChange={(date) => {
                                setSellingEndDate(date);
                                formik.setFieldValue("sellingEndDate", date);
                              }}
                              dropdownMode="select"
                              // minDate={sellingStartDate}
                              // showYearDropdown
                              adjustDateOnChange
                              //disabled={validateField}
                              // placeholderText="Entry Date"
                            />
                            <p className="text-danger">
                              {formik.errors.sellingEndDate &&
                              formik.touched.sellingEndDate
                                ? formik.errors.sellingEndDate
                                : null}
                            </p>
                          </fieldset>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <fieldset>
                          <span>Description</span>
                          <textarea
                            className="form-control mb-3"
                            placeholder=""
                            id="description"
                            name="description"
                            maxlength="2000"
                            onChange={handleTextAreaChange}
                            defaultValue={inputs.description}
                          ></textarea>
                        </fieldset>
                        <Badge
                          className="counter-description"
                          style={{
                            marginLeft: 988,
                            marginBottom: 18,
                            fontSize: 10,
                            color: "white",
                            padding: 5,
                          }}
                        >{`${
                          description
                            ? description.length
                            : 0 || inputs.description
                            ? inputs.description.length
                            : 0
                        } / ${MAX_TEXT_LENGTH}`}</Badge>
                      </div>
                    </Row>
                  </div>
                </div>
              </div>
              <div className="col-md-1 w100">
                <button type="submit" className="save-btn">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default DateChangeRequestForm;
