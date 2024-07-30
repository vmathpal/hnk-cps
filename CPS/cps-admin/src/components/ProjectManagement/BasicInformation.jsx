import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link, NavLink, useParams } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import Ilogo from "../../Assests/images/info.svg";
import DatePicker from "react-datepicker";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import dateFormat from "dateformat";
import LoadingSpinner from "../Loader/LoadingSpinner";
import moment from "moment";
import Badge from "react-bootstrap/Badge";
function BasicInformation() {
  const options = [
    { value: "Trade Promotion", label: "Trade Promotion" },
    { value: "Consumer Promotion", label: "Consumer Promotion" },
    { value: "Sponsorship", label: "Sponsorship" },
    { value: "Brand Campaign", label: "Brand Campaign" },
    { value: "Research", label: "Research" },
    { value: "Others", label: "Others" },
  ];
  const data = [];
  const projectType = [];
  useEffect(() => {
    projectVolume();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      getBusinessTypes();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  const {
    state: { productID, userID, action },
  } = {state:useParams()};

  console.log("0000",action)
  


  localStorage.setItem("projectID", productID);
  localStorage.setItem("authID", userID);
  localStorage.setItem("action", action);
  const [checked, setChecked] = useState(false);
  const [isLoadData, setIsLoadData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedinfo, setSelectedBasicInfo] = useState("");
  const [inputs, setInputs] = useState({});
  const [projectNumber, setprojectNumber] = useState("");

  //   const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [startCostDate, setStartCostDate] = useState(new Date());
  const [endCostDate, setEndCostDate] = useState(new Date());
  const [sellingStartDate, setSellingStartDate] = useState(new Date());
  const [endCostDate2, setEndCostDate2] = useState(new Date());
  const [sellingEndDate, setSellingEndDate] = useState(new Date());
  const [volumes, setVolumes] = useState([]);
  const [projectTypes, setprojectTypes] = useState([]);
  const [changeStatus, setChangeStatus] = useState(null);
  const [status, setStatus] = useState("completed");
  const [userinfo, setUserInfo] = useState({
    promotionDiscount: [],
  });
  const [businessTypes, setBusinessTypes] = useState([]);
  const [selectedBusinessValue, setBusinessSelectedValue] = useState([]);
  const [projectBusinessTypes, setBusinessTypesSelected] = useState([]);
  const [selectedIDs, setSelectedIDs] = useState([]);
  const [changeRequestType, setChangeRequestType] = useState("");
  const MAX_TEXT_LENGTH = 10000;
  const [description_new, setText] = useState(null);
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
        //  console.log("<>Data>>", response.data.data);
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

  const getAllCreatedData = async () => {
    setIsLoading(true);
    await axios
      .get(process.env.REACT_APP_API_KEY + "project-list/" + productID, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          userID: userID,
        },
      })
      .then(function (response) {
        if (response.data.data) {
          localStorage.setItem(
            "projectRequestor",
            response.data.data.User.email.split("@")[0]
          );
          setChangeStatus(response.data.data.ChangeStatus);
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
        setStatus(response.data.data.status);
        if (
          response.data.data.status === "approved" ||
          response.data.data.status === "closed" ||
          response.data.data.CloserStatus === "approved" ||
          response.data.data.isProjectNumber === "done"
        ) {
          if (response.data.data.projectNumber) {
            setprojectNumber(response.data.data.projectNumber);
          }
        }
        localStorage.setItem(
          "projectDepartment",
          response.data.data.department
        );
        localStorage.setItem(
          "OldTotalBudget",
          response.data.data.OldTotalBudget
        );

        setChangeRequestType(response.data.data.ChangeRequestType);
        if (response.data.data.promotionDiscount) {
          setChecked(true);
        } else {
          setChecked(false);
        }

        setSelectedBasicInfo(response.data.data);
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
          costEndDay: setEndCostDate2(
            moment(response.data.data.costEndDay).toDate()
          ),
          sellingStartDate: setSellingStartDate(
            moment(response.data.data.sellingStartDate).toDate()
          ),
          sellingEndDate: setSellingEndDate(
            moment(response.data.data.sellingEndDate).toDate()
          ),
          projectVolume: response.data.data.projectVolume,
          remark: response.data.data.remark,
          specificMeasure: response.data.data.specificMeasure,
          criticalSucess: response.data.data.criticalSucess,
          launchCriteria: response.data.data.launchCriteria,
          rational: response.data.data.rational,
          strategy: response.data.data.strategy,
          forConsumers: response.data.data.forConsumers,
          executionPlan: response.data.data.executionPlan,
          description: response.data.data.description,
        });
        // setText(response.data.data.description);
        //  console.log("Date>>>", inputs);
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(">>>>>>>>>>>error", error);
      });
  };
  useEffect(() => {
    getAllCreatedData();
    getprojectTypes();
  }, []);

  const BusinessHandleChange = (e) => {
    setBusinessSelectedValue(Array.isArray(e) ? e.map((x) => x.value) : []);
    //console.log(">>>>>>>BusinessHandleChange", selectedBusinessValue);
  };
  const handleChangeCheckbox = (e) => {
    // Destructuring
    const { value, checked } = e.target;
    const { promotionDiscount } = userinfo;
    console.log("promotionDiscount.userinfo", promotionDiscount);
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
    name: Yup.string().required("Required").max(130),
    department: Yup.string().required("Required"),
    projectType: Yup.string().required("Required"),
    projectVolume: Yup.string().required("Required"),
    // promotionDiscount: Yup.string().required("Required"),
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
    //remark: Yup.string().required("Required"),
  });

  const initialValues = {
    name: inputs.name ? inputs.name : "",
    department: inputs.department ? inputs.department : "",
    promotionDiscount: inputs.promotionDiscount ? inputs.promotionDiscount : [],
    projectType: inputs.projectType ? inputs.projectType : "",
    costStartDate: startCostDate,
    costEndDate: endCostDate,
    sellingStartDate: sellingStartDate,
    sellingEndDate: sellingStartDate,
    projectVolume: inputs.projectVolume ? inputs.projectVolume : "",
    description: inputs.description ? inputs.description : "",
    remark: inputs.remark ? inputs.remark : "",
    businessType: selectedBusinessValue.length
      ? selectedBusinessValue
      : selectedIDs,
    // endCostDate2: endCostDate2,
  };
  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: true,
    enableReinitialize: true,
    // validateOnBlur: false,
    onSubmit: async (data) => {
      // data.promotionDiscount = userinfo.promotionDiscount;
      // data.description = description;
      await axios
        .post(process.env.REACT_APP_API_KEY + "create-project", data, {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            status: status,
            projectID: productID,
            userID: userID,
          },
        })
        .then((res) => {
          localStorage.setItem("projectID", res.data.data.id);
          localStorage.setItem("projectDepartment", data.department);
          if (res.status === 200) {
            swal({
              title: "Success!",
              text: "Data Saved",
              icon: "success",
              button: "Okay",
            });
            navigate("/project-management/edit-districts");
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
  
  const handleCheckbox = () => {
    setChecked(!checked);
  };
  if (isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );

  }
  const urlWithState = `/overview/project-overview?productOwner=viewer&projectID=${productID}`;
  
  return (
    <>
      <div className="row">
        <div className="col">
          <div className="page-description">
            <h1>
              {localStorage.getItem("user_role") === "sub_admin" ? "View" : "Edit"}{" "}
              Project Form
            </h1>
          </div>
        </div>
      </div>
     
      <div className="accordion-item first-acc">
        <h2 className="accordion-header" id="headingOne">
        <div className="headButton">
        <a href={urlWithState} target="_blank" rel="noopener noreferrer"><button type="button nnnn">Preview</button></a> </div>
          <button className="accordion-button"
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
              <div className="custom-coloumn">
              <div className="accordian-head-first">
            <span>Project Details</span>
            <img src={Ilogo} alt="" className="ms-3" />
          </div>
          <div className="accordian-head-first">
            {/* <span>Basic Information</span>{" "} */}
            <Form.Control
              type="text"
              value={
                "REQ" +
                (localStorage.getItem("projectID")
                  ? localStorage.getItem("projectID")
                  : "")
              }
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
            <span className="mx-5">Project Requestor </span>{" "}
            <Form.Control
              type="text"
              value={localStorage.getItem("projectRequestor")?.toUpperCase()}
              placeholder="Project Number"
              disabled
            />
          </div>
              </div>
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
                    localStorage.getItem("action") === "view" ? true : false
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
                    localStorage.getItem("action") === "view" ? true : false
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
                    localStorage.getItem("action") === "view" ? true : false
                  }
                />{" "}
                <label htmlFor="opt3">Trade Marketing</label>
                <span className="text-danger my-3">
                  {formik.errors.department && formik.touched.department
                    ? formik.errors.department
                    : null}
                </span>
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
                  value="Settings Required"
                  onChange={handleCheckbox}
                  defaultChecked={checked ? true : false}
                  disabled={
                    localStorage.getItem("action") === "view" ? true : false
                  }
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
                    id="opt2"
                  />{" "}
                  <label htmlFor="opt2">APB System</label>
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
                    id="opt3"
                  />{" "}
                  <label htmlFor="opt3">Dealer System</label>
                </div>
              ) : (
                ""
              )}
              <span className="text-danger my-3">
                {formik.errors.promotionDiscount &&
                formik.touched.promotionDiscount
                  ? formik.errors.promotionDiscount
                  : null}
              </span>
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
                            onChange={(e) => {
                              formik.setFieldValue("name", e.target.value);
                              console.log("e.target.value", e.target.value);
                            }}
                            defaultValue={inputs.name}
                            disabled={
                              localStorage.getItem("action") === "view"
                                ? true
                                : false
                            }
                          />
                          <span className="text-danger my-3">
                            {formik.errors.name && formik.touched.name
                              ? formik.errors.name
                              : null}
                          </span>
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
                              dateFormat="dd-MM-yyyy"
                              selected={startCostDate}
                              onChange={(date) => {
                                setStartCostDate(date);

                                formik.setFieldValue(
                                  "costStartDate",
                                  dateFormat(date, "yyyy-mm-dd")
                                );
                              }}
                              dropdownMode="select"
                              // minDate={new Date()}

                              adjustDateOnChange
                              //disabled={validateField}
                              //placeholderText="Entry Date"
                              disabled={
                                localStorage.getItem("action") === "view"
                                  ? true
                                  : false
                              }
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
                              className={`form-control ${
                                changeRequestType === "date"
                                  ? "date-changeRequest"
                                  : ""
                              }`}
                              name="costEndDate"
                              dateFormat="dd-MM-yyyy"
                              selected={endCostDate}
                              onChange={(date) => {
                                setEndCostDate(date);
                                formik.setFieldValue(
                                  "costEndDate",
                                  dateFormat(date, "yyyy-mm-dd")
                                );
                              }}
                              dropdownMode="select"
                              adjustDateOnChange
                              disabled={
                                localStorage.getItem("action") === "view"
                                  ? true
                                  : false
                              }
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
                              className={`form-control ${
                                changeRequestType === "date"
                                  ? "date-changeRequest"
                                  : ""
                              }`}
                              name="sellingStartDate"
                              dateFormat="dd-MM-yyyy"
                              selected={sellingStartDate}
                              onChange={(date) => {
                                setSellingStartDate(date);
                                formik.setFieldValue(
                                  "sellingStartDate",
                                  dateFormat(date, "yyyy-mm-dd")
                                );
                              }}
                              dropdownMode="select"
                              adjustDateOnChange
                              disabled={
                                localStorage.getItem("action") === "view"
                                  ? true
                                  : false
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
                              dateFormat="dd-MM-yyyy"
                              selected={sellingEndDate}
                              onChange={(date) => {
                                setSellingEndDate(date);
                                formik.setFieldValue(
                                  "sellingEndDate",
                                  dateFormat(date, "yyyy-mm-dd")
                                );
                              }}
                              dropdownMode="select"
                              adjustDateOnChange
                              disabled={
                                localStorage.getItem("action") === "view"
                                  ? true
                                  : false
                              }
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
                      <div className="col-12">
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
                            isDisabled={
                              localStorage.getItem("action") === "view"
                                ? true
                                : false
                            }
                            onChange={(selected) => {
                              formik.setFieldValue(
                                "projectVolume",
                                selected.value
                              );
                            }}
                            disabled={
                              localStorage.getItem("action") === "view"
                                ? true
                                : false
                            }
                          />
                        </fieldset>
                        <span className="text-danger my-3">
                          {formik.errors.projectVolume &&
                          formik.touched.projectVolume
                            ? formik.errors.projectVolume
                            : null}
                        </span>
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
                              localStorage.getItem("action") === "view"
                                ? true
                                : false
                            }
                          />
                          <p className="text-danger">
                            {formik.errors.businessType &&
                            formik.touched.businessType
                              ? formik.errors.businessType
                              : null}
                          </p>
                        </fieldset>
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
                            }}
                            isDisabled={
                              localStorage.getItem("action") === "view"
                                ? true
                                : false
                            }
                          />
                        </fieldset>
                        <span className="text-danger my-3">
                          {formik.errors.projectType &&
                          formik.touched.projectType
                            ? formik.errors.projectType
                            : null}
                        </span>
                      </div>

                      {/* <div className="col-md-6">
                        <fieldset>
                          <span>Cost end Date</span>
                          <DatePicker
                            className="form-control"
                            name="endCostDate2"
                            dateFormat="dd-MM-yyyy"
                            selected={endCostDate2}
                            onChange={(date) => {
                              setEndCostDate2(date);
                              formik.setFieldValue(
                                "endCostDate2",
                                dateFormat(date, "yyyy-mm-dd")
                              );
                            }}
                            dropdownMode="select"
                            // minDate={new Date()}
                            // showYearDropdown
                            adjustDateOnChange
                            //disabled={validateField}
                            //placeholderText="Entry Date"
                          />
                        </fieldset>
                      </div> */}

                      <div className="col-12">
                        <div className="">
                          <fieldset>
                            <span>Remark</span>
                            <textarea
                              className="form-control"
                              placeholder=""
                              id="floatingTextarea"
                              name="remark"
                              onChange={formik.handleChange}
                              defaultValue={formik.values.remark}
                              disabled={
                                localStorage.getItem("action") === "view"
                                  ? true
                                  : false
                              }
                            ></textarea>
                          </fieldset>
                          <span className="text-danger my-3">
                            {formik.errors.remark && formik.touched.remark
                              ? formik.errors.remark
                              : null}
                          </span>
                        </div>
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
                              localStorage.getItem("action") === "view"
                                ? true
                                : false
                            }
                          ></textarea>
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
                </Row>
              </div>
              <br></br>
              <div className="accordion-item fifth-acc">
                <h2 className="accordion-header" id="headingOne">
                  <div className="accordian-head-first">
                    <span>Project Objectives</span>
                    <img src={Ilogo} alt="" className="ms-3" />
                  </div>
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne5"
                    aria-expanded="true"
                    aria-controls="collapseOne"
                  ></button>
                </h2>
                <div
                  id="collapseOne5"
                  className="accordion-collapse collapse show"
                  aria-labelledby="headingOne"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    <div>
                      <Row>
                        <div className="col-md-4">
                          <div className="textarea-head">
                            <div className="d-flex align-items-center">
                              <p>Specific Measure</p>
                              <img src={Ilogo} alt="" />
                            </div>
                            <div>
                              <span>500 Words</span>
                            </div>
                          </div>
                          <textarea
                            className="form-control"
                            id="floatingTextarea"
                            maxLength={500}
                            name="specificMeasure"
                            onChange={formik.handleChange}
                            defaultValue={inputs.specificMeasure}
                            disabled={
                              localStorage.getItem("action") === "view"
                                ? true
                                : false
                            }
                          ></textarea>
                        </div>
                        <div className="col-md-4">
                          <div className="textarea-head">
                            <div className="d-flex align-items-center">
                              <p>Critical Success Factor</p>
                              <img src={Ilogo} alt="" />
                            </div>
                            <div>
                              <span>500 Words</span>
                            </div>
                          </div>
                          <textarea
                            className="form-control"
                            id="floatingTextarea"
                            maxLength={500}
                            name="criticalSucess"
                            onChange={formik.handleChange}
                            defaultValue={inputs.criticalSucess}
                            disabled={
                              localStorage.getItem("action") === "view"
                                ? true
                                : false
                            }
                          ></textarea>
                        </div>

                        <div className="col-md-4">
                          <div>
                            <div className="textarea-head">
                              <div className="d-flex align-items-center">
                                <p>Launch Criteria</p>
                                <img src={Ilogo} alt="" />
                              </div>
                              <div>
                                <span>500 Words</span>
                              </div>
                            </div>
                            <textarea
                              className="form-control"
                              id="floatingTextarea"
                              maxLength={500}
                              name="launchCriteria"
                              onChange={formik.handleChange}
                              defaultValue={inputs.launchCriteria}
                              disabled={
                                localStorage.getItem("action") === "view"
                                  ? true
                                  : false
                              }
                            ></textarea>
                          </div>
                        </div>
                      </Row>
                    </div>
                  </div>
                </div>
              </div>
              <div className="accordion-item sixth-acc">
                <h2 className="accordion-header" id="headingOne">
                  <div className="accordian-head-first">
                    <span>Project Strategy & Execution</span>
                    <img src={Ilogo} alt="" className="ms-3" />
                  </div>
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne6"
                    aria-expanded="true"
                    aria-controls="collapseOne"
                  ></button>
                </h2>
                <div
                  id="collapseOne6"
                  className="accordion-collapse collapse show"
                  aria-labelledby="headingOne"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body project-strategy">
                    <div>
                      <Row className="mt-3">
                        <div className="col-md-6">
                          <div>
                            <fieldset>
                              <span>Rationale</span>
                              <textarea
                                className="form-control"
                                placeholder=""
                                id="floatingTextarea"
                                maxLength={500}
                                name="rational"
                                onChange={formik.handleChange}
                                defaultValue={inputs.rational}
                                disabled={
                                  localStorage.getItem("action") === "view"
                                    ? true
                                    : false
                                }
                              ></textarea>
                            </fieldset>
                            <div className="Blue-validation">
                              <img src={Ilogo} alt="" />{" "}
                              <span>
                                Note: The description should answer ‘why are we
                                doing this?
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div>
                            <fieldset>
                              <span>Strategy / Mechanics for Retailers</span>
                              <textarea
                                className="form-control"
                                placeholder=""
                                id="floatingTextarea"
                                maxLength={500}
                                name="strategy"
                                onChange={formik.handleChange}
                                defaultValue={inputs.strategy}
                                disabled={
                                  localStorage.getItem("action") === "view"
                                    ? true
                                    : false
                                }
                              ></textarea>
                            </fieldset>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div>
                            <fieldset>
                              <span>For Consumers</span>
                              <textarea
                                className="form-control"
                                placeholder=""
                                id="floatingTextarea"
                                maxLength={500}
                                name="forConsumers"
                                onChange={formik.handleChange}
                                defaultValue={inputs.forConsumers}
                                disabled={
                                  localStorage.getItem("action") === "view"
                                    ? true
                                    : false
                                }
                              ></textarea>
                            </fieldset>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div>
                            <fieldset>
                              <span>Execution Plan</span>
                              <textarea
                                className="form-control"
                                placeholder=""
                                id="floatingTextarea"
                                maxLength={500}
                                name="executionPlan"
                                onChange={formik.handleChange}
                                defaultValue={inputs.executionPlan}
                                disabled={
                                  localStorage.getItem("action") === "view"
                                    ? true
                                    : false
                                }
                                // onKeyPress={(event) => {
                                //   setShowSubmit(true);
                                // }}
                              ></textarea>
                            </fieldset>
                          </div>
                          <div className="Blue-validation">
                            <img src={Ilogo} alt="" />
                            <span>
                              Note: A brief description of the specific steps
                              this projects would take from start to completion.
                              Highlights the key Milestones.
                            </span>
                          </div>
                        </div>
                      </Row>
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-btn">
                {localStorage.getItem("action") !== "view" ? (
                  <button type="submit" className="white-btn">
                    Save & Next
                  </button>
                ) : (
                  <NavLink
                    className="white-btn action-btn"
                    to="/project-management/edit-districts"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    NEXT
                  </NavLink>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default BasicInformation;
