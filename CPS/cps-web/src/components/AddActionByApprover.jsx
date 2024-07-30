import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, NavLink, Link } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import moment from "moment";
import swal from "sweetalert";
import axios from "axios";
import Select from "react-select";
import LoadingSpinner from "./Loader/LoadingSpinner";
function AddActionByApprover() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [runTimeApprovers, setrunTimeApprovers] = useState([]);
  const [formStatus, setFormStatus] = useState("");
  const [statusValue, setstatusValue] = useState("");
  const [sequence, setSequenceNumber] = useState(0);

  const data = [
    { value: "cancelled", label: "Cancel" },
    { value: "approved", label: "Approve" },
    { value: "rejected", label: "Reject" },
  ];
  const data2 = [
    { value: "approved", label: "Approve" },
    { value: "rejected", label: "Reject" },
  ];
  let reqType;

  const [runTimeStatus, setRunTimeStatus] = useState([]);
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
    runTimeApprovalStatus();
  }, []);

  useEffect(() => {
    getProjectApprovers();
    getAllCreatedData();
    getApprvalSequence();
  }, []);

  const getApprvalSequence = async () => {
    await axios({
      url:
        process.env.REACT_APP_API_KEY +
        "get-sequence-number/" +
        localStorage.getItem("projectID"),
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      params: {
        userID: localStorage.getItem("authID"),
      },
    })
      .then(function (res) {
        setSequenceNumber(res.data.data.sequence);
      })
      .catch(function (error) {
        console.log(">>>>errorAya", error.response);
      });
  };

  const getProjectApprovers = async () => {
    if (!localStorage.getItem("auth-token")) {
      TimeOut();
      return;
    }
    await axios({
      url:
        process.env.REACT_APP_API_KEY +
        "run-time-approval-users/" +
        localStorage.getItem("projectID"),
      method: "get",
      params: {
        userID: localStorage.getItem("authID"),
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
      },
    })
      .then(function (res) {
        if (res.data.data) {
          setrunTimeApprovers(res.data.data);
        }
      })
      .catch(function (error) {
        console.log(">>>>errorAya", error.response);
      });
  };
  const runTimeApprovalStatus = async (props) => {
    if (!localStorage.getItem("auth-token")) {
      TimeOut();
      return;
    }
    setIsLoading(true);
    await axios({
      url:
        process.env.REACT_APP_API_KEY +
        "run-time-project-status/" +
        localStorage.getItem("projectID"),
      method: "get",
      params: {
        userID: localStorage.getItem("authID"),
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(function (response) {
        setRunTimeStatus(response.data.data);
        setIsLoading(false);
        // console.log("Run Time Status", response.data.data);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("action error", error);
      });
  };
  const getAllCreatedData = async () => {
    if (!localStorage.getItem("auth-token")) {
      TimeOut();
      return;
    }
    setIsLoading(true);
    await axios
      .get(
        process.env.REACT_APP_API_KEY +
          "project-list/" +
          localStorage.getItem("projectID"),
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
        if (response.data.data) {
          reqType =
            response.data.data.ChangeStatus === null &&
            response.data.data.CloserStatus === null
              ? "FreshRequest"
              : response.data.data.ChangeStatus !== null &&
                response.data.data.CloserStatus === null
              ? "ChangeRequest"
              : "CloseRequest";
        }

        localStorage.setItem("actionType", reqType);

        setFormStatus(response.data.data.CloserStatus);

        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(">>>>>>>>>>>error", error);
      });
  };

  const validationSchema = Yup.object().shape({
    // comment: Yup.string()
    //   .required("Comments is required")
    //   .max(500, "Comments must not exceed 500 characters"),
    comment:
      statusValue === "approved"
        ? Yup.string()
        : Yup.string()
            .required("Comment is required.")
            .max(500, "Comments must not exceed 500 characters"),
    status: Yup.string().required("Action is required"),
  });
  const formik = useFormik({
    initialValues: {
      comment: "",
      status: "",
      projectID: localStorage.getItem("projectID"),
      userID: localStorage.getItem("authID"),
    },

    validationSchema,
    // enableReinitialize: true,
    validateOnChange: true,
    // validateOnBlur: false,
    onSubmit: async (data, { resetForm }) => {
      data.sequence = sequence;
      if (!localStorage.getItem("auth-token")) {
        TimeOut();
        return;
      }
      setIsLoading(true);
      await axios
        .post(process.env.REACT_APP_API_KEY + "change-aproval-status/", data, {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            actionType: localStorage.getItem("actionType"),
          },
        })
        .then((res) => {
          if (res.status === 200) {
            swal({
              title: "Success!",
              text: "Status Update",
              icon: "success",
              button: "Okay",
            });
            navigate("/projects-for-approval");
            setIsLoading(false);
          }
        })
        .catch((error) => {
          if (error.response.status === 422) {
            swal("Oops", error.response.data.message, "error");
          }
          setIsLoading(false);
          console.log("action error", error);
        });
      console.log(JSON.stringify(data, null, 2));
      // console.log(data);
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
      <div className="add-action-page project-review">
        <form onSubmit={formik.handleSubmit}>
          <div className="accordion-body">
            <div className="table-responsive-md">
              <div className="extra-row">
                <div className="item-wrapper">
                  <div className="row-item">
                    <div className="action-dropdown">
                      <p>
                        Select Action<span className="indicator"></span>
                      </p>
                      <Select
                        name="status"
                        options={formStatus !== null ? data2 : data}
                        onChange={(selected) => {
                          formik.setFieldValue("status", selected.value);
                          setstatusValue(selected.value);
                        }}
                        className="basic-multi-select"
                        classNamePrefix="select"
                      />
                    </div>
                    <div className="text-danger">
                      {formik.errors.status && formik.touched.status
                        ? formik.errors.status
                        : null}
                    </div>
                  </div>
                  <div className="row-item">
                    <fieldset>
                      <span>Comment</span>
                      <textarea
                        className="Form-control"
                        name="comment"
                        cols={30}
                        onChange={formik.handleChange}
                        defaultValue={formik.values.comment}
                      />
                    </fieldset>
                    <div className="text-danger">
                      {formik.errors.comment && formik.touched.comment
                        ? formik.errors.comment
                        : null}
                    </div>
                  </div>

                  <div className="row-item action">
                    {formStatus !== "completed" ? (
                      <button type="submit" className="save-btn">
                        Submit
                      </button>
                    ) : (
                      ""
                    )}
                    <NavLink to="/projects-for-approval" className="save-btn">
                      Back
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <>
        <article className="approval-status-card runtime-approval-page">
          <div className="timeline-holder">
            <div className="timeline">
              {runTimeStatus.length !== 0
                ? Object.values(runTimeStatus)?.map((product, index) => (
                    <li
                      key={index}
                      className={
                        product.status === "approved"
                          ? "active"
                          : product.status === "pending"
                          ? "pending"
                          : product.status === "cancelled"
                          ? "cancelled"
                          : product.status === "rejected"
                          ? "rejected"
                          : null
                      }
                      title={product.status}
                      id={"1"}
                    >
                      {product.role_name}
                      <p>
                        {product.status !== "pending"
                          ? moment
                              .utc(product.approverDate?.toLocaleString())
                              .format("YYYY-MM-DD HH:m")
                          : ""}
                      </p>
                    </li>
                  ))
                : ""}
            </div>
            <>
              {" "}
              <article>
                <h6 style={{ color: "green" }}>
                  Project Run Time Approval Status
                </h6>
              </article>
            </>
          </div>
        </article>

        <article className="approval-status-card runtime-approval-page">
          <div className="timeline-holder approver-flow-user">
            <div>
              <h6 style={{ color: "green" }}>Approver Flow</h6>
            </div>
            <div className="accordion-body">
              <div className="accordion-body customTimeline">
                <ul>
                  {runTimeApprovers.length !== 0
                    ? Object.values(runTimeApprovers)?.map((data, index) => (
                        <li>
                          {data.user?.map((name, index) => (
                            <b
                              key={index}
                              style={
                                name.delegationUserID
                                  ? { color: "red" }
                                  : { color: "black" }
                              }
                            >
                              {name.User.email.split("@")[0]}
                              {index === data.user.length - 1 ? "" : ", "}
                            </b>
                          ))}
                          <p>{data.role_name}</p>
                        </li>
                      ))
                    : ""}
                </ul>
              </div>
            </div>
            <>
              <Link to="/my-projects">
                {" "}
                <button type="button" className="next-btn mt-4">
                  Back
                </button>
              </Link>
            </>
          </div>
        </article>
      </>
    </>
  );
}

export default AddActionByApprover;
