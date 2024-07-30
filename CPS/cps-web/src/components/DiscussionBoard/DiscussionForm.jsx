import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import Binimg from "../../images/bin.svg";
import Editimg from "../../images/edit.svg";
import Send from "../../images/sendMsg.png";
import * as Yup from "yup";
import { useFormik } from "formik";
import swal from "sweetalert";
import axios from "axios";
import $ from "jquery";
import moment from "moment";
import dateFormat from "dateformat";
import LoadingSpinner from "../Loader/LoadingSpinner";

function DiscussionForm() {
  const firstRef = useRef(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState({});
  const [messages, setMessages] = useState([]);
  const [msgID, setMessagesID] = useState(0);
  const {
    state: { projectID },
  } = useLocation();

  useEffect(() => {
    getAllCreatedData();
    getMessageList();
  }, []);
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

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      getMessageList();
    }, 4000);
    return () => {
      // Return callback to run on unmount.
      window.clearInterval(timer);
    };
  }, []);

  function ProjectNumber(n) {
    var string = "" + n;
    var pad = "0000";
    n = pad.substring(0, pad.length - string.length) + string;
    return n;
  }

  const getMessageList = async () => {
    if (!localStorage.getItem("auth-token")) {
      TimeOut();
      return;
    }
    await axios
      .get(process.env.REACT_APP_API_KEY + "project-chat-list/" + projectID, {
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
        if (response.data) {
          // return success
          if (response.status === 200) {
            setMessages(response.data.data);
            return response;
          }
          // reject errors & warnings
          return Promise.reject(response);
        }
        // default fallback
        return Promise.reject(response);
      })
      .catch(function (error) {
        console.log(">>>>>>>>>>>error", error);
      });
  };
  // setInterval(getMessageList(), 5000);

  const getAllCreatedData = async () => {
    if (!localStorage.getItem("auth-token")) {
      TimeOut();
      return;
    }
    setIsLoading(true);
    await axios
      .get(process.env.REACT_APP_API_KEY + "project-list/" + projectID, {
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
        if (Object.keys(response.data.data).length > 0) {
          setInputs({
            name: response.data.data.name,
            currentAction: response.data.data.runTimeStatus,
            user: response.data.data.User?.email,
            requestedOn: response.data.data.updatedAt,
            projectBrands: response.data.data.ProjectBrands,
            pid: response.data.data.id,
            totalBudget: response.data.data.totalBudget,
            status: response.data.data.status,
            department: response.data.data.department,
            promotionDiscount: response.data.data.promotionDiscount
              ? response.data.data.promotionDiscount.split()
              : response.data.data.promotionDiscount,
            projectType: response.data.data.projectType,
            costStartDate: response.data.data.costStartDate,

            costEndDate: moment(response.data.data.costEndDate),
            costEndDay: moment(response.data.data.costEndDay),
            sellingStartDate: moment(response.data.data.sellingStartDate),
            sellingEndDate: response.data.data.sellingEndDate,
            projectVolume: response.data.data.projectVolume,
            remark: response.data.data.remark,
          });
          setIsLoading(false);
        }
      })
      .catch(function (error) {
        console.log(">>>>>>>>>>>error", error);
      });
  };

  // function to handle when the "Edit" button is clicked
  const handleEditClick = async (id) => {
    if (!localStorage.getItem("auth-token")) {
      TimeOut();
      return;
    }
    localStorage.setItem("isEditMessage", "true");
    setMessagesID(id);
    await axios
      .get(process.env.REACT_APP_API_KEY + "get-single-chat/" + id, {
        params: {
          userID: localStorage.getItem("authID"),
          role: localStorage.getItem("auth_role"),
        },
      })
      .then((res) => {
        if (res.data.data) {
          $("#message").val(res.data.data.message);
          formik.setFieldValue("message", res.data.data.message);
        }
      })
      .catch((error) => {
        console.log("error>>>>>", error.message);
      });
  };

  const handleDeleteClick = async (id) => {
    if (!localStorage.getItem("auth-token")) {
      TimeOut();
      return;
    }
    await axios
      .get(process.env.REACT_APP_API_KEY + "delete-chat/" + id, {
        params: {
          userID: localStorage.getItem("authID"),
          role: localStorage.getItem("auth_role"),
        },
      })
      .then((res) => {
        if (res.status === 200) {
          swal({
            title: "Success!",
            text: "Deleted Successfully!",
            icon: "success",
            button: "Okay",
          });
        }
        getMessageList();
      })
      .catch((error) => {
        console.log("error>>", error.message);
      });
  };

  let url =
    localStorage.getItem("isEditMessage") === "true"
      ? "update-single-chat/" + msgID
      : "project-chat/" + projectID;
  const validationSchema = Yup.object().shape({
    message: Yup.string().required("Required"),
  });
  const initialValues = {
    message: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: true,
    enableReinitialize: true,
    // validateOnBlur: false,
    onSubmit: async (data) => {
      if (!localStorage.getItem("auth-token")) {
        TimeOut();
        return;
      }
      $("#SendButton").attr("disabled", true);
      localStorage.setItem("isEditMessage", "false");
      data.senderID = localStorage.getItem("authID");
      await axios
        .post(process.env.REACT_APP_API_KEY + url, data, {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          },
          params: {
            userID: localStorage.getItem("authID"),
          },
        })
        .then((res) => {
          formik.values.message = "";
          $("#message").val("");
          getMessageList();
          $("#SendButton").attr("disabled", false);
        })
        .catch((error) => {
          swal("Oops", error.response.data.message, "error");
          setIsLoading(false);
        });
      // console.log(JSON.stringify(data, null, 2));
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
      <div className="main_wrapper">
        <div className="right-contents">
          <div className="approver-project-list approval-status">
            <div className="project-in-exec">
              <div className="admin-content1">
                <div className="head">
                  <div className="head-left">
                    <h3>
                      <b> #{inputs.name}</b>

                      {inputs.projectBrands?.map((brand, index) => (
                        <p key={index}>{brand.Brand?.name} &nbsp;</p>
                      ))}
                    </h3>
                    <span className="tag blue">{inputs.department}</span>
                    <span className={`tag ${inputs.status}`}>
                      {inputs.status === "completed"
                        ? "pending"
                        : inputs.status}
                    </span>
                  </div>

                  <div className="date-section">
                    <div className="date-box">
                      <p>Cost Start/End Date</p>
                      <b>
                        {dateFormat(inputs.sellingStartDate, "dd mmm")} -{" "}
                        {dateFormat(inputs.sellingEndDate, "dd mmm yyyy")}
                      </b>
                    </div>
                    <div className="date-box">
                      <p>Selling Start/End Date</p>
                      <b>
                        {dateFormat(inputs.sellingStartDate, "dd mmm")} -{" "}
                        {dateFormat(inputs.sellingEndDate, "dd mmm yyyy")}
                      </b>
                    </div>
                    <div className="date-box">
                      <p>Project Budget </p>
                      <b>
                        S$
                        {new Intl.NumberFormat("en-SG").format(
                          inputs.totalBudget
                        )}
                      </b>
                    </div>
                  </div>
                </div>

                <div className="project-keys">
                  <table>
                    <tr>
                      <td>
                        <p>Request ID</p>
                        <span> REQ{ProjectNumber(inputs.pid)}</span>
                      </td>
                      <td>
                        <p>Project Owner</p>
                        <span>{inputs.user?.split("@")[0]}</span>
                      </td>
                      <td>
                        <p>Current Action By</p>
                        <span>
                          {inputs.currentAction
                            ? inputs.currentAction
                            : "Under Process"}
                        </span>
                      </td>
                      <td>
                        <p>Project Type</p>
                        <span>{inputs.projectType}</span>
                      </td>
                      <td>
                        <p>Requested On</p>

                        <span>
                          {dateFormat(inputs.requestedOn, "dd mmm yyyy")}
                        </span>
                      </td>
                    </tr>
                  </table>
                </div>
                <form onSubmit={formik.handleSubmit}>
                  <div className="comments">
                    <div className="typ-msg">
                      <div
                        className={`f-word ${localStorage
                          .getItem("authEmail")
                          .charAt(0)
                          .toUpperCase()}`}
                      >
                        <p>
                          {localStorage
                            .getItem("authEmail")
                            .charAt(0)
                            .toUpperCase()}
                        </p>
                      </div>

                      <input
                        type="text"
                        ref={firstRef}
                        id="message"
                        placeholder="Start a discussion"
                        name="message"
                        onChange={formik.handleChange}
                        defaultValue={formik.values.message}
                      />
                      <span>
                        {" "}
                        <button
                          className="SendButton"
                          id="SendButton"
                          type="submit"
                        >
                          <img
                            src={Send}
                            alt="Bell Icon"
                            height={40}
                            title="Send"
                          ></img>
                        </button>
                      </span>
                      <b className="text-danger mt-2">
                        {formik.errors.message && formik.touched.message
                          ? formik.errors.message
                          : null}
                      </b>
                    </div>
                    {messages.length > 0 ? (
                      <>
                        <div className="message-box ver-scroll">
                          {messages.map((pro, index) => (
                            <div className="Inputs" key={index}>
                              <div
                                className={`f-word ${pro.User?.email
                                  .charAt(0)
                                  .toUpperCase()}`}
                              >
                                {pro.User?.email.charAt(0).toUpperCase()}
                              </div>
                              <div className="pre-msg">
                                <div className="pre-innermsg">
                                  <label htmlFor="">
                                    {pro.User?.email
                                      .split("@")[0]
                                      .toUpperCase()}
                                  </label>
                                  <span className="time">
                                    {" "}
                                    {dateFormat(
                                      inputs.requestedOn,
                                      "mmmm dS, yyyy, h:MM:ss TT"
                                    )}
                                  </span>
                                  <span
                                    className="time mx-1"
                                    style={{ color: "DodgerBlue" }}
                                  >
                                    {pro.isEdited ? "(Edited)" : ""}
                                  </span>
                                  <br />
                                  <p>{pro.message}</p>
                                </div>
                                <div>
                                  {localStorage.getItem("authID") ===
                                  pro.senderID ? (
                                    <>
                                      {" "}
                                      <img
                                        src={Editimg}
                                        alt="Edit Icon"
                                        height={30}
                                        className="mx-1 message-action-icon"
                                        onClick={() => handleEditClick(pro.id)}
                                      ></img>
                                      <img
                                        src={Binimg}
                                        alt="Delete Icon"
                                        className="mx-1 message-action-icon"
                                        height={30}
                                        onClick={() =>
                                          handleDeleteClick(pro.id)
                                        }
                                      ></img>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div>
                        <p style={{ color: "#0f2f81", marginLeft: 20 }}>
                          <b>
                            {" "}
                            There are no discussion message yet in this project.
                          </b>
                        </p>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DiscussionForm;
