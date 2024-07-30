import React from "react";
import { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumb";
import Ilogo from "../images/info.svg";
import astrick from "../images/astick-icon.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AreaDistrict from "../components/AreaDistrict/AreaDistrict";
import BrandSelection from "../components/BrandSelection/BrandSelection";
import axios from "axios";
import swal from "sweetalert";
import { confirmAlert } from "react-confirm-alert";
import * as Yup from "yup";
import { useFormik, Field } from "formik";
import ProjectBasicInfo from "../components/ProjectBasicInfo/ProjectBasicInfo";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
const CreatProject = () => {
  const [showSubmit, setShowSubmit] = useState(false);
  const [status, setStatus] = useState("draft");
  const [formStatus, setFormStatus] = useState("");
  const [setProjectRequestor, projectOwner] = useState("");
  const [closeStatus, setCloserStatus] = useState("");
  const [changeRequestStatus, setFormChangeRequestStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadData, setIsLoadData] = useState(false);
  const [inputs, setInputs] = useState({});
  const [projectId, setProjectId] = useState("");
  const [projectIdUpdated, setNewProjectId] = useState("");
  const [PID, setPID] = useState("");
  let { ProjectStatus } = useParams();
  const [checkInactive, setCheckInactive] = useState([]);

  const [budgetData, setBudgetData] = useState();
  const navigate = useNavigate();

  const location = useLocation();
  const productOwner = location.state?.productOwner
    ? location.state?.productOwner
    : "creator";
  const actionType = location.state?.actionType;
  localStorage.setItem("productOwner", productOwner);
  localStorage.setItem("actionType", actionType);
  // const {
  //   state: { productOwner, actionType },
  // } = useLocation();
  const findProjectId = (id) => {
    setNewProjectId(id);
  };

  const handleBudgetData = (data) => {
    setBudgetData(data);
  };

  //strict the right click
  useEffect(() => {
    const handleContextmenu = (e) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextmenu);
    return function cleanup() {
      document.removeEventListener("contextmenu", handleContextmenu);
    };
  }, []);

  useEffect(() => {
    const newPID = projectIdUpdated ?? ProjectStatus;
    setPID(newPID);
    console.log("neeeeeeeeeeeeeee", ProjectStatus);
    getAllCreatedData(newPID ? newPID : ProjectStatus);
  }, [projectIdUpdated, ProjectStatus]);

  // localStorage.setItem("productOwner", productOwner);
  localStorage.setItem("actionType", actionType);
  localStorage.setItem("OldTotalBudget", "null");

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

  async function getAllCreatedData(pid) {
    console.log("anchalaaaaaaaaaaaaaaaaaaaaaa", pid);
    setIsLoadData(true);
    await axios
      .get(
        process.env.REACT_APP_API_KEY +
          "project-list/" +
          (pid ? pid : ProjectStatus),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          },
          params: {
            userID: localStorage.getItem("authID"),
            role: localStorage.getItem("auth_role"),
          },
        }
      )
      .then(function (response) {
        if (response.data) {
          localStorage.setItem(
            "projectRequestor",
            response.data.data.User?.email.split("@")[0]
          );
          setFormStatus(response.data.data.status);
          setCloserStatus(response.data.data.CloserStatus);
          setFormChangeRequestStatus(response.data.data.ChangeStatus);
          setInputs({
            rational: response.data.data.rational,
            strategy: response.data.data.strategy,
            forConsumers: response.data.data.forConsumers,
            executionPlan: response.data.data.executionPlan,
            specificMeasure: response.data.data.specificMeasure,
            criticalSuccess: response.data.data.criticalSuccess,
            launchCriteria: response.data.data.launchCriteria,
          });
          setCheckInactive(response.data.data?.ProjectBrands);
          setIsLoadData(false);
        }
      })
      .catch(function (error) {
        setIsLoadData(false);
      });
  }

  const validationSchema = Yup.object().shape({});
  const initialValues = {
    rational: inputs.rational ? inputs.rational : "",
    strategy: inputs.strategy ? inputs.strategy : "",
    forConsumers: inputs.forConsumers ? inputs.forConsumers : "",
    executionPlan: inputs.executionPlan ? inputs.executionPlan : "",
    specificMeasure: inputs.specificMeasure ? inputs.specificMeasure : "",
    criticalSuccess: inputs.criticalSuccess ? inputs.criticalSuccess : "",
    launchCriteria: inputs.launchCriteria ? inputs.launchCriteria : "",
    checkInactive: checkInactive,
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    validateOnChange: true,
    // validateOnBlur: false,
    onSubmit: async (data) => {
      if (!localStorage.getItem("auth-token")) {
        TimeOut();
        return;
      } else if (
        Math.abs(budgetData?.totalBudget - budgetData?.tAllocation) >= 0.0001
      ) {
        swal("Oops", "Allocation percent will be 100%.", "error");
        return;
      }
      setIsLoadData(true);
      await axios
        .post(process.env.REACT_APP_API_KEY + "create-project", data, {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          },
          params: {
            status: formStatus === "rejected" ? formStatus : "draft",
            // status: formStatus,
            userID: localStorage.getItem("authID"),
            projectID: PID ? PID : ProjectStatus,
            role: localStorage.getItem("auth_role"),
          },
        })

        .then((res) => {
          navigate("/create-project-financial", {
            state: {
              projectID: PID ? PID : ProjectStatus,
              productOwner: "creator",
            },
          });
          setIsLoadData(false);
        })
        .catch((error) => {
          if (error.response.status === 422) {
            swal("Oops", error.response.data.message, "error");
            setIsLoadData(false);
            return;
          }
        });
    },
  });

  const submitDraft = async (e) => {
    e.preventDefault();
    swal({
      title: "Success!",
      text: "Saved as draft",
      icon: "success",
      button: "Okay",
    });
  };

  const CancelProjectStatus = async (pid) => {
    confirmAlert({
      title: "Cancelled?",
      message: "Are you sure want to Cancelled?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            await axios
              .get(
                process.env.REACT_APP_API_KEY +
                  "cancelled-project/" +
                  pid +
                  "?userID=" +
                  localStorage.getItem("authID"),
                {
                  headers: {
                    "Content-type": "Application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              )
              .then(function (response) {
                swal({
                  title: "Cancelled!",
                  text: "Cancelled Successfully",
                  icon: "success",
                  button: "Okay",
                });
                navigate("/my-projects");
              })
              .catch(function (error) {
                // Handle error
              });
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  if (isLoadData) {
    return (
      <div>
        <h4>Loading...</h4>
      </div>
    );
  }
  console.log("anchal123456", PID);
  const urlWithState = `/overview/project-overview?productOwner=viewer&projectID=${
    PID ? PID : ProjectStatus
  }`;

  const myFunction = (a) => {
    setProjectId(a);
  };
  return (
    <>
      <div className="main_wrapper">
        <Row>
          <div className="right-contents px-0">
            <div className="main-box new-project">
              <div className="form-header">
                {formStatus === "approved" ? (
                  <Row>
                    <h3>Project Details</h3>
                    <Link
                      to={`/project-audit-log/${PID ? PID : ProjectStatus}`}
                      state={{
                        productOwner: productOwner,
                        projectID: PID ? PID : ProjectStatus,
                      }}
                      style={{ marginLeft: 100 }}
                    >
                      <button type="button" className="next-btn">
                        View Log
                      </button>
                    </Link>
                    <a
                      href={urlWithState}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginLeft: 30 }}
                    >
                      <button type="button" className="next-btn">
                        Preview
                      </button>
                    </a>
                    <h3 style={{ marginLeft: 50 }}>Project Requestor :</h3>

                    {localStorage.getItem("projectRequestor")?.toUpperCase()}
                  </Row>
                ) : formStatus === "completed" ? (
                  <Row>
                    <h3>Project Details</h3>
                    <Link
                      to={`/project-audit-log/${PID ? PID : ProjectStatus}`}
                      state={{
                        productOwner: productOwner,
                        projectID: PID ? PID : ProjectStatus,
                      }}
                      style={{ marginLeft: 100 }}
                    >
                      <button type="button" className="next-btn">
                        View Log
                      </button>
                    </Link>
                    <a
                      href={urlWithState}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginLeft: 30 }}
                    >
                      <button type="button" className="next-btn">
                        Preview
                      </button>
                    </a>
                    <h3 style={{ marginLeft: 50 }}>Project Requestor :</h3>

                    {localStorage.getItem("projectRequestor")?.toUpperCase()}
                  </Row>
                ) : formStatus === "cancelled" ? (
                  <Row>
                    <h3>Project Details</h3>
                    <Link
                      to={`/project-audit-log/${PID ? PID : ProjectStatus}`}
                      state={{
                        productOwner: productOwner,
                        projectID: PID ? PID : ProjectStatus,
                      }}
                      style={{ marginLeft: 100 }}
                    >
                      <button type="button" className="next-btn">
                        View Log
                      </button>
                    </Link>
                    <a
                      href={urlWithState}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginLeft: 30 }}
                    >
                      <button type="button" className="next-btn">
                        Preview
                      </button>
                    </a>
                    <h3 style={{ marginLeft: 50 }}>Project Requestor :</h3>

                    {localStorage.getItem("projectRequestor")?.toUpperCase()}
                  </Row>
                ) : formStatus === "rejected" ? (
                  <Row>
                    <h3>Project Details</h3>
                    <Link
                      to={`/project-audit-log/${PID ? PID : ProjectStatus}`}
                      state={{
                        productOwner: productOwner,
                        projectID: PID ? PID : ProjectStatus,
                      }}
                      style={{ marginLeft: 100 }}
                    >
                      <button type="button" className="next-btn">
                        View Log
                      </button>
                    </Link>
                    <a
                      href={urlWithState}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginLeft: 30 }}
                    >
                      <button type="button" className="next-btn">
                        Preview
                      </button>
                    </a>
                    <h3 style={{ marginLeft: 50 }}>Project Requestor :</h3>

                    {localStorage.getItem("projectRequestor")?.toUpperCase()}
                  </Row>
                ) : formStatus === "pending" ? (
                  <Row>
                    <h3>Project Details</h3>
                    <Link
                      to={`/project-audit-log/${PID ? PID : ProjectStatus}`}
                      state={{
                        productOwner: productOwner,
                        projectID: PID ? PID : ProjectStatus,
                      }}
                      style={{ marginLeft: 100 }}
                    >
                      <button type="button" className="next-btn">
                        View Log
                      </button>
                    </Link>
                    <a
                      href={urlWithState}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginLeft: 30 }}
                    >
                      <button type="button" className="next-btn">
                        Preview
                      </button>
                    </a>
                    <h3 style={{ marginLeft: 50 }}>Project Requestor :</h3>

                    {localStorage.getItem("projectRequestor")?.toUpperCase()}
                  </Row>
                ) : (
                  <Row>
                    <h3>Create New Project</h3>
                    <Link
                      to={`/project-audit-log/${PID ? PID : ProjectStatus}`}
                      state={{
                        productOwner: productOwner,
                        projectID: PID ? PID : ProjectStatus,
                      }}
                      style={{ marginLeft: 100 }}
                    >
                      <button type="button" className="next-btn">
                        View Log
                      </button>
                    </Link>
                    <a
                      href={urlWithState}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginLeft: 30 }}
                    >
                      <button type="button" className="next-btn">
                        Preview
                      </button>
                    </a>
                    <h3 style={{ marginLeft: 50 }}>Project Requestor :</h3>

                    {localStorage.getItem("projectRequestor")?.toUpperCase()}
                  </Row>
                )}

                {formStatus === "approved" &&
                productOwner === "creator" &&
                formStatus === undefined &&
                closeStatus === null ? (
                  <NavLink
                    className="add-action-button take-action"
                    to={{
                      pathname: "/project-change-request",
                    }}
                  >
                    Change Request
                  </NavLink>
                ) : (
                  ""
                )}

                <div className="breadcrumb-container">
                  <Breadcrumbs />
                </div>
              </div>

              <div className="accordion-box">
                <div className="accordion" id="accordionExample">
                  <ProjectBasicInfo
                    getProjectId={myFunction}
                    findProjectId={findProjectId}
                    projectID={PID ? PID : ProjectStatus}
                    productOwner={productOwner}
                    getData={getAllCreatedData}
                  />

                  {/* Area and District Accordian */}
                  <AreaDistrict
                    productOwner={productOwner}
                    projectID={PID ? PID : ProjectStatus}
                  />

                  <BrandSelection
                    productOwner={productOwner}
                    projectID={PID ? PID : ProjectStatus}
                    sendBudgetData={handleBudgetData}
                  />
                  {/* <BrandBugdet /> */}

                  <form onSubmit={formik.handleSubmit}>
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
                                  defaultValue={formik.values.specificMeasure}
                                  disabled={
                                    (formStatus === "draft" ||
                                      formStatus === "rejected" ||
                                      formStatus === "created" ||
                                      formStatus === "" ||
                                      formStatus === undefined) &&
                                    productOwner === "creator"
                                      ? false
                                      : true
                                  }
                                ></textarea>
                                <span className="text-danger">
                                  {formik.errors.specificMeasure &&
                                  formik.touched.specificMeasure
                                    ? formik.errors.specificMeasure
                                    : null}
                                </span>
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
                                  name="criticalSuccess"
                                  onChange={formik.handleChange}
                                  defaultValue={formik.values.criticalSuccess}
                                  disabled={
                                    (formStatus === "draft" ||
                                      formStatus === "rejected" ||
                                      formStatus === "created" ||
                                      formStatus === "" ||
                                      formStatus === undefined) &&
                                    productOwner === "creator"
                                      ? false
                                      : true
                                  }
                                ></textarea>
                                <span className="text-danger">
                                  {formik.errors.criticalSuccess &&
                                  formik.touched.criticalSuccess
                                    ? formik.errors.criticalSuccess
                                    : null}
                                </span>
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
                                    defaultValue={formik.values.launchCriteria}
                                    disabled={
                                      (formStatus === "draft" ||
                                        formStatus === "rejected" ||
                                        formStatus === "created" ||
                                        formStatus === "" ||
                                        formStatus === undefined) &&
                                      productOwner === "creator"
                                        ? false
                                        : true
                                    }
                                  ></textarea>
                                  <span className="text-danger">
                                    {formik.errors.launchCriteria &&
                                    formik.touched.launchCriteria
                                      ? formik.errors.launchCriteria
                                      : null}
                                  </span>
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
                                      defaultValue={formik.values.rational}
                                      disabled={
                                        (formStatus === "draft" ||
                                          formStatus === "rejected" ||
                                          formStatus === "created" ||
                                          formStatus === "" ||
                                          formStatus === undefined) &&
                                        productOwner === "creator"
                                          ? false
                                          : true
                                      }
                                    ></textarea>
                                  </fieldset>
                                  <span className="text-danger">
                                    {formik.errors.rational &&
                                    formik.touched.rational
                                      ? formik.errors.rational
                                      : null}
                                  </span>
                                  <div className="Blue-validation">
                                    <img src={Ilogo} alt="" />{" "}
                                    <span>
                                      Note: The description should answer ‘why
                                      are we doing this?
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div>
                                  <fieldset>
                                    <span>
                                      Strategy / Mechanics for Retailers
                                    </span>
                                    <textarea
                                      className="form-control"
                                      placeholder=""
                                      id="floatingTextarea"
                                      maxLength={500}
                                      name="strategy"
                                      onChange={formik.handleChange}
                                      defaultValue={formik.values.strategy}
                                      disabled={
                                        (formStatus === "draft" ||
                                          formStatus === "rejected" ||
                                          formStatus === "created" ||
                                          formStatus === "" ||
                                          formStatus === undefined) &&
                                        productOwner === "creator"
                                          ? false
                                          : true
                                      }
                                    ></textarea>
                                  </fieldset>
                                  <span className="text-danger">
                                    {formik.errors.strategy &&
                                    formik.touched.strategy
                                      ? formik.errors.strategy
                                      : null}
                                  </span>
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
                                      defaultValue={formik.values.forConsumers}
                                      disabled={
                                        (formStatus === "draft" ||
                                          formStatus === "rejected" ||
                                          formStatus === "created" ||
                                          formStatus === "" ||
                                          formStatus === undefined) &&
                                        productOwner === "creator"
                                          ? false
                                          : true
                                      }
                                    ></textarea>
                                  </fieldset>
                                  <span className="text-danger">
                                    {formik.errors.forConsumers &&
                                    formik.touched.forConsumers
                                      ? formik.errors.forConsumers
                                      : null}
                                  </span>
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
                                      defaultValue={formik.values.executionPlan}
                                      onKeyPress={(event) => {
                                        setShowSubmit(true);
                                      }}
                                      disabled={
                                        (formStatus === "draft" ||
                                          formStatus === "rejected" ||
                                          formStatus === "created" ||
                                          formStatus === "" ||
                                          formStatus === undefined) &&
                                        productOwner === "creator"
                                          ? false
                                          : true
                                      }
                                    ></textarea>
                                  </fieldset>
                                  <span className="text-danger">
                                    {formik.errors.executionPlan &&
                                    formik.touched.executionPlan
                                      ? formik.errors.executionPlan
                                      : null}
                                  </span>
                                </div>
                                <div className="Blue-validation">
                                  <img src={Ilogo} alt="" />
                                  <span>
                                    Note: A brief description of the specific
                                    steps this projects would take from start to
                                    completion. Highlights the key Milestones.
                                  </span>
                                </div>
                              </div>
                            </Row>
                          </div>
                        </div>
                      </div>
                    </div>
                    {formStatus === "completed" ||
                    formStatus === "approved" ||
                    formStatus === "cancelled" ||
                    formStatus === "pending" ||
                    productOwner === "Approver" ||
                    productOwner === "viewer" ? (
                      <Link
                        to="/create-project-financial"
                        state={{
                          productOwner: productOwner,
                          projectID: PID ? PID : ProjectStatus,
                        }}
                      >
                        {" "}
                        <button type="button" className="next-btn">
                          Next
                        </button>
                      </Link>
                    ) : (
                      <div className="form-btn">
                        {/* <Link to="/overview"> */}
                        <button
                          type="button"
                          className="white-btn"
                          onClick={submitDraft}
                        >
                          Draft
                        </button>
                        <button type="submit" className="white-btn">
                          Save & next
                        </button>
                        <button
                          type="button"
                          className="white-btn"
                          onClick={() =>
                            CancelProjectStatus(PID ? PID : ProjectStatus)
                          }
                        >
                          Cancel Draft Project
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Row>
      </div>
    </>
  );
};

export default CreatProject;
