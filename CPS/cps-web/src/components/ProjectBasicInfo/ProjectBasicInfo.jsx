import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { useFormik } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import moment from "moment";
import astick from "../../images/astick-icon.png";
import Badge from "react-bootstrap/Badge";

import LoadingSpinner from "../Loader/LoadingSpinner";
function ProjectBasicInfo(props) {
  const data = [];
  const projectType = [];
  const [isLoadData, setIsLoadData] = useState(false);
  const [checked, setChecked] = useState(false);
  const [selectedBusinessValue, setBusinessSelectedValue] = useState([]);
  const [projectBusinessTypes, setBusinessTypesSelected] = useState([]);
  const [selectedIDs, setSelectedIDs] = useState([]);
  const [selectedinfo, setSelectedBasicInfo] = useState("");
  const [inputs, setInputs] = useState({});
  const [volumes, setVolumes] = useState([]);
  const [projectTypes, setprojectTypes] = useState([]);
  const [businessTypes, setBusinessTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [startCostDate, setStartCostDate] = useState(new Date());
  const [endCostDate, setEndCostDate] = useState(new Date());
  const [sellingStartDate, setSellingStartDate] = useState(new Date());
  // const [endCostDate2, setEndCostDate2] = useState(new Date());
  const [sellingEndDate, setSellingEndDate] = useState(new Date());
  const [formStatus, setFormStatus] = useState("");
  const [changeStatus, setChangeStatus] = useState(null);
  const [changeRequestType, setChangeRequestType] = useState("");
  const [projectNumber, setprojectNumber] = useState("");
  const [status, setStatus] = useState("");
  const MAX_TEXT_LENGTH = 10000;
  const [description_new, setText] = useState(null);
  const [userinfo, setUserInfo] = useState({
    promotionDiscount: [],
  });
  let projectStatus = useParams();

  console.log("Basic Info", props.projectID);
  console.log("props.productOwner", props.productOwner);

  const TimeOut = () => {
    swal({
      title: "Time Out",
      text: "You have been logged out. Please log in again",
      icon: "error",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        navigate("/login");
        return;
      }
    });
  };
  useEffect(() => {
    projectVolume();
    // getSelectedBusinessTypes();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      getBusinessTypes();
    }, 1300);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    // if (
    //   projectStatus.ProjectStatus == "created" &&
    //   parseInt(localStorage.getItem("ProjectStatus"))
    // ) {
    //   localStorage.setItem("ProjectStatus", "created");
    //   localStorage.setItem("projectID", "");
    // }

    getAllCreatedData();
    getprojectTypes();
  }, []);

  async function oldBudgetProject(event) {
    // let projectID = event.target.value;
    localStorage.setItem("lastProjectID", event.target.value);

    props.getProjectId(event.target.value);

    // console.log(localStorage.getItem("lastProjectID"));
  }
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
    setIsLoading(true);
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
        setIsLoading(false);
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

  const getBusinessTypes = async () => {
    setIsLoading(true);
    await axios
      .get(process.env.REACT_APP_API_KEY + "get-business-type-lists", {
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
        params: {
          url: "get-business-type-lists",
          userID: localStorage.getItem("authID"),
          role: localStorage.getItem("auth_role"),
        },
      })
      .then(function (response) {
        setBusinessTypes(response.data.data);
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(">>>>>>>>>>>error", error);
      });
  };
  const businessType = [];
  if (businessTypes) {
    businessTypes.forEach((element) => {
      businessType.push({
        value: element.id,
        label: element.name,
      });
    });
  }

  const projectBsTypes = [];
  const projectBsTypesID = [];
  // const getSelectedBusinessTypes = async () => {
  //   setIsLoading(true);
  //   await axios({
  //     url:
  //       process.env.REACT_APP_API_KEY +
  //       "get-business-type/" +
  //       props.projectID,

  //     method: "get",
  //     params: {
  //       userID: localStorage.getItem("authID"),
  //     },
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
  //     },
  //   })
  //     .then(function (response) {
  //       if (response.data.data && response.data.data.length > 0) {
  //         response.data.data.forEach((element) => {
  //           projectBsTypes.push({
  //             value: element.id,
  //             label: element.name,
  //           });

  //           projectBsTypesID.push(element.id);
  //         });
  //         setSelectedIDs(projectBsTypesID);
  //         setBusinessTypesSelected(projectBsTypes);
  //       }

  //       setIsLoading(false);
  //     })
  //     .catch(function (error) {
  //       // if (error.response.status === 401) {
  //       //   localStorage.clear();
  //       // }
  //       if (error.response.status === 426) {
  //         swal("Oops", error.response.data.message, "error");
  //       }
  //       console.log(">>>>>>>>>>>error", error.response);
  //     });
  // };

  const BusinessHandleChange = (e) => {
    setBusinessSelectedValue(Array.isArray(e) ? e.map((x) => x.value) : []);
  };

  const getAllCreatedData = async () => {
    if (!localStorage.getItem("auth-token")) {
      TimeOut();
    }
    localStorage.removeItem("ChangeRequestStatus");

    setIsLoading(true);
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

        if (response.data.data) {
          response.data.data.ProjectBusinessesTypes.forEach((element) => {
            projectBsTypes.push({
              value: element.BusinessType.id,
              label: element.BusinessType.name,
            });

            projectBsTypesID.push(element.BusinessType.id);
          });
          setSelectedIDs(projectBsTypesID);
          setBusinessTypesSelected(projectBsTypes);
        }

        if (Object.keys(response.data.data).length <= 0) {
          localStorage.removeItem("projectID");
        } else {
          if (
            response.data.data.status === "approved" ||
            response.data.data.status === "closed" ||
            response.data.data.CloserStatus === "approved" ||
            response.data.data.isProjectNumber === "done"
          ) {
            if (response.data.data?.projectNumber) {
              setprojectNumber(response.data.data.projectNumber);
            }
          }

          localStorage.setItem("projectID", response.data.data.id);
          localStorage.setItem(
            "projectDepartment",
            response.data.data?.department
          );
          localStorage.setItem(
            "ChangeRequestStatus",
            response.data.data?.ChangeStatus
          );
          localStorage.setItem(
            "ChangeRequestType",
            response.data.data?.ChangeRequestType
          );
          localStorage.setItem(
            "OldTotalBudget",
            response.data.data.OldTotalBudget
          );
          setFormStatus(response.data.data.status);
          setChangeStatus(response.data.data.ChangeStatus);

          setChangeRequestType(response.data.data.ChangeRequestType);
          // console.log("Form Status", formStatus);
          if (response.data.data.promotionDiscount) {
            setChecked(true);
          } else {
            setChecked(false);
          }
        }

        setSelectedBasicInfo(response.data.data);
        setStatus(response.data.data.status === "draft" ? "draft" : "created");
        if (Object.keys(response.data.data).length > 0) {
          setInputs({
            name: response.data.data.name,
            department: response.data.data.department,
            description: response.data.data.description,
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
          });
          setText(response.data.data.description);
        }
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(">>>>>>>>>>>error", error);
      });
  };

  const handleChangeCheckbox = (e) => {
    // Destructuring
    const { value, checked } = e.target;
    const { promotionDiscount } = userinfo;
    // console.log("promotionDiscount.userinfo", promotionDiscount);
    // Case 1 : The user checks the box
    if (checked) {
      setUserInfo({
        promotionDiscount: [...promotionDiscount, value],
      });
    }
    // Case 2  : The user unchecks the box
    else {
      setUserInfo({
        promotionDiscount: promotionDiscount.filter((e) => e !== value),
      });
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Required").max(170),
    department: Yup.string().required("Required"),
    projectType: Yup.string().required("Required"),
    projectVolume: Yup.string().required("Required"),
    // businessType: Yup.array()
    //   .min(1)
    //   .of(Yup.string().trim().required("Business type is required")),

    // promotionDiscount: Yup.boolean()
    //   .oneOf([true])
    //   .when("isPerson", {
    //     is: true,
    //     then: Yup.boolean().oneOf([true], "Required"),
    //   }),

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

    description: Yup.string().required("Required"),
  });
  const initialValues = {
    name: inputs.name ? inputs.name : "",
    department: inputs.department ? inputs.department : "",
    promotionDiscount: inputs.promotionDiscount ? inputs.promotionDiscount : [],
    projectType: inputs.projectType ? inputs.projectType : "",
    businessType: selectedBusinessValue.length
      ? selectedBusinessValue
      : selectedIDs,
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
    description: inputs.description ? inputs.description : "",
    // costEndDay: endCostDate2,
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    //validateOnChange: true,
    enableReinitialize:
      status === "draft" ||
      formStatus === "rejected" ||
      formStatus === "created"
        ? true
        : false,
    //enableReinitialize: true,
    // validateOnBlur: false,
    onSubmit: async (data) => {
      if (!localStorage.getItem("auth-token")) {
        TimeOut();
        return;
      }
      data.promotionDiscount = userinfo.promotionDiscount;
      // data.description = description;
      data.businessType = selectedBusinessValue.length
        ? selectedBusinessValue
        : selectedIDs;
      if (!data.businessType.length) {
        swal("Oops", "Business Type Required", "error");
        return;
      }

      await axios
        .post(process.env.REACT_APP_API_KEY + "create-project", data, {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          },
          params: {
            status: formStatus === "" ? "created" : formStatus,
            projectID: props.projectID === "created" ? "" : props.projectID,
            userID: localStorage.getItem("authID"),
            role: localStorage.getItem("auth_role"),
          },
        })
        .then((res) => {
          props.findProjectId(res.data.data.id);
          localStorage.setItem("projectID", res.data.data.id);
          localStorage.setItem("ProjectStatus", res.data.data.id);
          props.findProjectId(res.data.data.id);
          localStorage.setItem("projectDepartment", data.department);
          // localStorage.setItem(
          //   "ProjectStatus",
          //   props.projectID
          // );

          if (res.status === 200) {
            swal({
              title: "Success!",
              text: "Data Saved",
              icon: "success",
              button: "Okay",
            });
          }
        })
        .catch((error) => {
          if (error.response.status === 422) {
            swal("Oops", error.response.data.message, "error");
          }
        });
      console.log(JSON.stringify(data, null, 2));
      // console.log(data);
    },
  });

  const handleCheckbox = (e) => {
    setChecked(!checked);
    // alert(checked);
  };

  // function handleTextAreaChange(event) {
  //   const value = event.target.value;
  //   if (value.length <= MAX_TEXT_LENGTH) {
  //     setText(value);
  //     inputs.description = event.target.value;
  //     formik.setFieldValue("description", event.target.value);
  //   }
  // }
  if (isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <div className="accordion-item first-acc">
        <h2 className="accordion-header" id="headingOne">
          <div className="accordian-head-first">
            <span>Basic Information</span>{" "}
            <img src={astick} alt="" className="mx-1" />
            <Form.Control
              type="text"
              value={"REQ" + (parseInt(props.projectID) ? props.projectID : "")}
              disabled
            />
          </div>

          <div className="accordian-head-first">
            <span className="mx-5">Project Number</span>{" "}
            <Form.Control
              type="text"
              value={projectNumber}
              placeholder="Project Number"
              disabled
            />
          </div>

          <div className="accordian-head-first">
            <span className="mx-5">Last Project Number</span>{" "}
            <Form.Control
              type="text"
              onChange={oldBudgetProject}
              placeholder="Eg. SG230000"
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
              <div className="d-flex check-box-wrapper">
                <p>Choose Department</p>
                <Form.Check
                  type="radio"
                  aria-label="radio 1"
                  name="department"
                  className="custom-radio"
                  id="opt1"
                  value="sales"
                  onChange={formik.handleChange}
                  defaultChecked={inputs.department === "sales"}
                  disabled={
                    formStatus === "draft" ||
                    formStatus === "rejected" ||
                    formStatus === "created" ||
                    formStatus === ""
                      ? false
                      : true
                  }
                />{" "}
                <label htmlFor="opt1">Sales</label>
                <Form.Check
                  type="radio"
                  aria-label="radio 2"
                  name="department"
                  value="marketing"
                  onChange={formik.handleChange}
                  defaultChecked={inputs.department === "marketing"}
                  className="custom-radio"
                  id="opt2"
                  disabled={
                    (formStatus === "draft" ||
                      formStatus === "rejected" ||
                      formStatus === "created" ||
                      formStatus === "" ||
                      formStatus === undefined) &&
                    props.productOwner === "creator"
                      ? false
                      : true
                  }
                />{" "}
                <label htmlFor="opt2">Marketing</label>
                <Form.Check
                  type="radio"
                  aria-label="radio 2"
                  name="department"
                  value="trade_marketing"
                  onChange={formik.handleChange}
                  defaultChecked={inputs.department === "trade_marketing"}
                  className="custom-radio"
                  id="opt3"
                  disabled={
                    (formStatus === "draft" ||
                      formStatus === "rejected" ||
                      formStatus === "created" ||
                      formStatus === "") &&
                    props.productOwner === "creator"
                      ? false
                      : true
                  }
                />{" "}
                <label htmlFor="opt3">Trade Marketing</label>
                <p className="text-danger">
                  {formik.errors.department && formik.touched.department
                    ? formik.errors.department
                    : null}
                </p>
              </div>
              &nbsp;
              <div className="d-flex check-box-wrapper">
                <p>Promotion Discount/Trade Deal Setting</p>
                <label htmlFor="opt1">Settings Required ?</label>
                <Form.Check
                  type="checkbox"
                  aria-label="checkbox"
                  className="custom-checkbox"
                  id="opt1"
                  name="isChecked"
                  defaultValue={formik.values.isChecked}
                  onChange={handleCheckbox}
                  defaultChecked={checked ? true : false}
                />{" "}
              </div>
              {checked ? (
                <div className="d-flex check-box-wrapper">
                  <Form.Check
                    type="checkbox"
                    aria-label="checkbox 2"
                    name="promotionDiscount"
                    value="APB System"
                    onChange={handleChangeCheckbox}
                    defaultChecked={
                      inputs.promotionDiscount
                        ? inputs.promotionDiscount[0].includes("APB System")
                        : false
                    }
                    className="custom-radio"
                    id="promotionDiscount1"
                  />{" "}
                  <label htmlFor="promotionDiscount1">APB System</label>
                  <Form.Check
                    type="checkbox"
                    aria-label="checkbox 3"
                    name="promotionDiscount"
                    value="Dealer System"
                    onChange={handleChangeCheckbox}
                    defaultChecked={
                      inputs.promotionDiscount
                        ? inputs.promotionDiscount[0].includes("Dealer System")
                        : false
                    }
                    className="custom-radio"
                    id="promotionDiscount2"
                  />{" "}
                  <label htmlFor="promotionDiscount2">Dealer System</label>
                </div>
              ) : (
                ""
              )}
              <p className="text-danger">
                {formik.errors.promotionDiscount &&
                formik.touched.promotionDiscount
                  ? formik.errors.promotionDiscount
                  : null}
              </p>
              <div>
                <Row className="mt-3">
                  <div className="col-md-6 ps-0">
                    <Row>
                      <div className="col-12">
                        <fieldset>
                          <span>Project Name</span>
                          <Form.Control
                            type="text"
                            className="Form-control"
                            name="name"
                            autoComplete="off"
                            onChange={(e) => {
                              formik.setFieldValue("name", e.target.value);
                              inputs.name = e.target.value;
                            }}
                            defaultValue={inputs.name}
                            disabled={
                              (formStatus === "draft" ||
                                formStatus === "rejected" ||
                                formStatus === "created" ||
                                formStatus === "") &&
                              props.productOwner === "creator"
                                ? false
                                : true
                            }
                          />
                          <b>
                            <p className="text-danger">
                              {formik.errors.name && formik.touched.name
                                ? formik.errors.name
                                : null}
                            </p>
                          </b>
                        </fieldset>
                      </div>
                      <div className="col-md-6">
                        <div className="date-type">
                          <fieldset>
                            <div className="ilogo">
                              <span>Cost Start Date</span>
                            </div>
                            <DatePicker
                              className={`form-control ${
                                changeRequestType === "date"
                                  ? "date-changeRequest"
                                  : ""
                              }`}
                              name="costStartDate"
                              dateFormat="yyyy-MM-dd"
                              selected={startCostDate}
                              onChange={(date) => {
                                setStartCostDate(date);

                                formik.setFieldValue("costStartDate", date);
                              }}
                              dropdownMode="select"
                              adjustDateOnChange
                              disabled={
                                (formStatus === "draft" ||
                                  formStatus === "rejected" ||
                                  formStatus === "created" ||
                                  formStatus === "") &&
                                props.productOwner === "creator"
                                  ? false
                                  : true
                              }
                            />
                            <b>
                              <p className="text-danger">
                                {formik.errors.costStartDate &&
                                formik.touched.costStartDate
                                  ? formik.errors.costStartDate
                                  : null}
                              </p>
                            </b>
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
                              className={`form-control ${
                                changeRequestType === "date"
                                  ? "date-changeRequest"
                                  : ""
                              }`}
                              name="costEndDate"
                              dateFormat="yyyy-MM-dd"
                              selected={endCostDate}
                              onChange={(date) => {
                                setEndCostDate(date);
                                formik.setFieldValue("costEndDate", date);
                              }}
                              dropdownMode="select"
                              adjustDateOnChange
                              disabled={
                                (formStatus === "draft" ||
                                  formStatus === "rejected" ||
                                  formStatus === "created" ||
                                  formStatus === "") &&
                                props.productOwner === "creator"
                                  ? false
                                  : true
                              }
                            />
                            <b>
                              <p className="text-danger">
                                {formik.errors.costEndDate &&
                                formik.touched.costEndDate
                                  ? formik.errors.costEndDate
                                  : null}
                              </p>
                            </b>
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
                              className={`form-control ${
                                changeRequestType === "date"
                                  ? "date-changeRequest"
                                  : ""
                              }`}
                              name="sellingStartDate"
                              dateFormat="yyyy-MM-dd"
                              selected={sellingStartDate}
                              onChange={(date) => {
                                setSellingStartDate(date);
                                formik.setFieldValue("sellingStartDate", date);
                              }}
                              dropdownMode="select"
                              adjustDateOnChange
                              disabled={
                                (formStatus === "draft" ||
                                  formStatus === "rejected" ||
                                  formStatus === "created" ||
                                  formStatus === "") &&
                                props.productOwner === "creator"
                                  ? false
                                  : true
                              }
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
                              className={`form-control ${
                                changeRequestType === "date"
                                  ? "date-changeRequest"
                                  : ""
                              }`}
                              name="sellingEndDate"
                              dateFormat="yyyy-MM-dd"
                              selected={sellingEndDate}
                              onChange={(date) => {
                                setSellingEndDate(date);
                                formik.setFieldValue("sellingEndDate", date);
                              }}
                              dropdownMode="select"
                              adjustDateOnChange
                              disabled={
                                (formStatus === "draft" ||
                                  formStatus === "rejected" ||
                                  formStatus === "created" ||
                                  formStatus === "") &&
                                props.productOwner === "creator"
                                  ? false
                                  : true
                              }
                            />
                            <b>
                              <p className="text-danger">
                                {formik.errors.sellingEndDate &&
                                formik.touched.sellingEndDate
                                  ? formik.errors.sellingEndDate
                                  : null}
                              </p>
                            </b>
                          </fieldset>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <fieldset>
                          <span>Business Type</span>
                          <Select
                            isMulti
                            defaultValue={projectBusinessTypes}
                            name="businessType"
                            options={businessType}
                            className="basic-multi-select select-color"
                            classNamePrefix="select"
                            onChange={BusinessHandleChange}
                            isDisabled={
                              (formStatus === "draft" ||
                                formStatus === "rejected" ||
                                formStatus === "created" ||
                                formStatus === "" ||
                                formStatus === undefined) &&
                              props.productOwner === "creator"
                                ? false
                                : true
                            }
                          />
                          <b>
                            <p className="text-danger">
                              {formik.errors.businessType &&
                              formik.touched.businessType
                                ? formik.errors.businessType
                                : null}
                            </p>
                          </b>
                        </fieldset>
                      </div>
                      <div className="col-md-12">
                        <fieldset>
                          <span>Description</span>
                          <textarea
                            className={`form-control mb-3 ${
                              changeStatus == null ? "" : "date-changeRequest"
                            }`}
                            placeholder=""
                            id="description"
                            name="description"
                            maxlength="10000"
                            onChange={(e) => {
                              setText(e.target.value);
                              formik.setFieldValue(
                                "description",
                                e.target.value
                              );
                            }}
                            defaultValue={inputs.description}
                            disabled={
                              (formStatus === "draft" ||
                                formStatus === "rejected" ||
                                formStatus === "created" ||
                                formStatus === "" ||
                                formStatus === undefined) &&
                              props.productOwner === "creator"
                                ? false
                                : true
                            }
                          ></textarea>
                          <b>
                            <p className="text-danger m-3">
                              {formik.errors.description &&
                              formik.touched.description
                                ? formik.errors.description
                                : null}
                            </p>
                          </b>
                        </fieldset>
                        <Badge
                          className="counter-description"
                          style={{
                            marginLeft: 470,
                            fontSize: 10,
                            color: "white",
                            padding: 5,
                          }}
                        >{`${
                          description_new
                            ? description_new.length
                            : 0 || inputs.description
                            ? inputs.description.length
                            : 0
                        } / ${MAX_TEXT_LENGTH}`}</Badge>
                      </div>
                    </Row>
                  </div>
                  <div className="col-md-6 pe-0">
                    <Row className="align-items-baseline">
                      <div className="col-md-6">
                        <fieldset>
                          <span>Project Type</span>
                          <Select
                            options={projectType}
                            menuPosition="absolute"
                            menuPortalTarget={document.body}
                            closeMenuOnScroll={true}
                            closeMenuOnSelect={() => true}
                            name="projectType"
                            defaultValue={{
                              label: inputs.projectType,
                              value: inputs.projectType,
                            }}
                            onChange={(selected) => {
                              formik.setFieldValue(
                                "projectType",
                                selected.value
                              );
                              inputs.projectType = selected.value;
                            }}
                            isDisabled={
                              (formStatus === "draft" ||
                                formStatus === "rejected" ||
                                formStatus === "created" ||
                                formStatus === "" ||
                                formStatus === undefined) &&
                              props.productOwner === "creator"
                                ? false
                                : true
                            }
                          />
                          <b>
                            <p className="text-danger">
                              {formik.errors.projectType &&
                              formik.touched.projectType
                                ? formik.errors.projectType
                                : null}
                            </p>
                          </b>
                        </fieldset>
                      </div>

                      <div className="col-md-6">
                        <fieldset>
                          <span>Project Volume Based On</span>
                          <Select
                            options={data}
                            menuPosition="absolute"
                            menuPortalTarget={document.body}
                            closeMenuOnScroll={true}
                            closeMenuOnSelect={() => true}
                            name="projectVolume"
                            defaultValue={{
                              label: inputs.projectVolume,
                              value: inputs.projectVolume,
                            }}
                            onChange={(selected) => {
                              formik.setFieldValue(
                                "projectVolume",
                                selected.value
                              );
                              inputs.projectVolume = selected.value;
                            }}
                            isDisabled={
                              (formStatus === "draft" ||
                                formStatus === "rejected" ||
                                formStatus === "created" ||
                                formStatus === "" ||
                                formStatus === undefined) &&
                              props.productOwner === "creator"
                                ? false
                                : true
                            }
                          />
                          <b>
                            <p className="text-danger">
                              {formik.errors.projectVolume &&
                              formik.touched.projectVolume
                                ? formik.errors.projectVolume
                                : null}
                            </p>
                          </b>
                        </fieldset>
                      </div>

                      <div className="col-12">
                        <div className="">
                          <fieldset>
                            <span>Remark</span>
                            <textarea
                              className="form-control"
                              placeholder=""
                              id="floatingTextarea"
                              name="remark"
                              onChange={(e) => {
                                formik.setFieldValue("remark", e.target.value);
                              }}
                              defaultValue={inputs.remark}
                              disabled={
                                (formStatus === "draft" ||
                                  formStatus === "rejected" ||
                                  formStatus === "created" ||
                                  formStatus === "" ||
                                  formStatus === undefined) &&
                                props.productOwner === "creator"
                                  ? false
                                  : true
                              }
                            ></textarea>
                            <p className="text-danger">
                              {formik.errors.remark && formik.touched.remark
                                ? formik.errors.remark
                                : null}
                            </p>
                          </fieldset>
                        </div>
                      </div>
                    </Row>
                  </div>
                </Row>
              </div>
              <div className="col-md-1 w100">
                {formStatus === "completed" ||
                formStatus === "approved" ||
                formStatus === "cancelled" ||
                formStatus === "pending" ||
                props.productOwner === "Approver" ||
                props.productOwner === "viewer" ? (
                  ""
                ) : (
                  <button type="submit" className="save-btn">
                    Save
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ProjectBasicInfo;
