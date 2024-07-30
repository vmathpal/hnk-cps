import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, NavLink, Link, useLocation } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import swal from "sweetalert";
import axios from "axios";
import moment from "moment";
import $ from "jquery";
import Select from "react-select";
import LoadingSpinner from "../../components/Loader/LoadingSpinner";
function AddProjectAction() {
  const {
    state: { productID, userID, AuthLevel },
  } = useLocation();
  let options = [];
  localStorage.setItem("projectID", productID);
  localStorage.setItem("authID", userID);
  localStorage.setItem("AuthLevel", AuthLevel);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSpinner, setIsSpinner] = useState(false);
  const [runTimeApprovers, setrunTimeApprovers] = useState([]);
  const [formStatus, setFormStatus] = useState("");
  const [requestType, setRequestType] = useState("");
  const [statusValue, setstatusValue] = useState("");
  const [rendar, setRendar] = useState("");
  const [approverId, setuserValue] = useState(undefined);
  const [sequence, setSequence] = useState(0);
  const data = [
    { value: "cancelled", label: "Cancelled" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];
  const data2 = [
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  const [runTimeStatus, setRunTimeStatus] = useState([]);

  useEffect(() => {
    runTimeApprovalStatus();
  }, []);

  useEffect(() => {
    getProjectApprovers();
    getAllCreatedData();
    getNextApprover();
  }, []);

  const getNextApprover = async () => {
    // setIsLoading(true);
    await axios({
      url:
        process.env.REACT_APP_API_KEY +
        "check-approval-user/" +
        localStorage.getItem("projectID"),
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(function (res) {
        setIsLoading(false);
        setUsers(res.data.data);
        setSequence(res.data.data[0].sequence);
      })
      .catch(function (error) {
        setIsLoading(false);
        console.log(">>>>errorAya", error.response);
      });
  };

  const getProjectApprovers = async () => {
    // setIsLoading(true);
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
        setIsLoading(false);
        if (res.data.data) {
          setrunTimeApprovers(res.data.data);
        }
      })
      .catch(function (error) {
        setIsLoading(false);
        console.log(">>>>errorAya", error.response);
      });
  };
  const runTimeApprovalStatus = async (props) => {
    // setIsLoading(true);
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
        setFormStatus(response.data.data.CloserStatus);
        setRequestType(
          response.data.data.ChangeStatus === null &&
            response.data.data.CloserStatus === null
            ? "FreshRequest"
            : response.data.data.ChangeStatus !== null &&
              response.data.data.CloserStatus === null
            ? "ChangeRequest"
            : "CloseRequest"
        );
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(">>>>>>>>>>>error", error);
      });
  };

  if (users) {
    users.forEach((element) => {
      options.push({
        value: element.User.id,
        label: element.User.email.split("@")[0],
      });
    });
  }
  console.log("statusValue", statusValue);
  const validationSchema = Yup.object().shape({
    comment: Yup.string().when("status", {
      is: "approved",
      then: Yup.string(),
      otherwise: Yup.string().required("Comment is required."),
    }),
    status: Yup.string().required("Action is required"),
    userID: Yup.number().required("User is required"),
  });
  const formik = useFormik({
    initialValues: {
      comment: "",
      status: statusValue,
      projectID: localStorage.getItem("projectID"),
      userID: approverId,
    },

    validationSchema,
    // enableReinitialize: true,
    validateOnChange: true,
    // validateOnBlur: false,
    onSubmit: async (data) => {
      data.adminID = localStorage.getItem("userID");
      data.sequence = sequence;
      setIsSpinner(true);
      await axios
        .post(process.env.REACT_APP_API_KEY + "change-aproval-status/", data, {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            actionType: requestType,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            setTimeout(() => {
              swal({
                title: "Success!",
                text: "Action Taken Successfully",
                icon: "success",
                button: "Okay",
              });
              //  formik.setFieldValue("comment", "");
              // formik.setFieldValue("status", "");
              runTimeApprovalStatus();
              getProjectApprovers();
              getAllCreatedData();
              getNextApprover();
              setIsSpinner(false);
            }, 1500);
          }
        })
        .catch((error) => {
          if (error.response.status === 422) {
            swal("Oops", error.response.data.message, "error");
          }
          setIsSpinner(false);
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
      <div className="content-wrapper">
        <div className="row">
          <div className="col">
            <div className="page-description">
              <h1>Take Action</h1>
            </div>
          </div>
        </div>
      </div>

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
                    <div className="action-dropdown">
                      <p>
                        Select User<span className="indicator"></span>
                      </p>
                      <Select
                        name="userID"
                        options={options}
                        onChange={(selected) => {
                          formik.setFieldValue("userID", selected.value);
                          setuserValue(selected.value);
                        }}
                        className="basic-multi-select"
                        classNamePrefix="select"
                      />
                    </div>
                    <div className="text-danger">
                      {formik.errors.userID && formik.touched.userID
                        ? formik.errors.userID
                        : null}
                    </div>
                  </div>
                  <div className="row-item">
                    <fieldset>
                      <span>Comment</span>
                      <textarea
                        className="Form-control"
                        id="comment-box"
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
                        {isSpinner ? (
                          <>
                            <i className="fa fa-refresh fa-spin mx-1"></i>
                            Loading...
                          </>
                        ) : (
                          "Submit"
                        )}
                      </button>
                    ) : (
                      ""
                    )}
                    <NavLink to="/project-management" className="save-btn">
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
          </div>
        </article>

        <article className="approval-status-card runtime-approval-page">
          <div className="timeline-holder approver-flow-user">
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
          </div>
        </article>
      </>
    </>
  );
}

export default AddProjectAction;
