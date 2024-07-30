import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import LoadingSpinner from "./Loader/LoadingSpinner";
import moment from "moment";
import "react-confirm-alert/src/react-confirm-alert.css";
import swal from "sweetalert";
const ProjectRunTimeStatus = () => {
  const navigate = useNavigate();
  let { ProjectId } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isRejected, setisRejected] = useState(false);
  const [runTimeStatus, setRunTimeStatus] = useState([]);
  const [runTimeApprovers, setrunTimeApprovers] = useState([]);
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
  }, []);

  const getProjectApprovers = async () => {
    if (!localStorage.getItem("auth-token")) {
      TimeOut();
    }
    await axios({
      url:
        process.env.REACT_APP_API_KEY + "run-time-approval-users/" + ProjectId,
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
      .catch(function (error) {});
  };

  const runTimeApprovalStatus = async (props) => {
    if (!localStorage.getItem("auth-token")) {
      TimeOut();
    }
    setIsLoading(true);
    await axios({
      url:
        process.env.REACT_APP_API_KEY + "run-time-project-status/" + ProjectId,
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
        response.data.data.forEach((element) => {
          if (element.status === "rejected") {
            setisRejected(true);
          }
        });
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("action error", error);
      });
  };
  if (isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }
  return (
    <>
      <article className="approval-status-card runtime-approval-page">
        <div className="timeline-holder">
          <div className="timeline">
            {runTimeStatus.length !== 0
              ? Object.values(runTimeStatus)?.map((product, index) => (
                  <li
                    className={
                      product.status === "approved"
                        ? "active"
                        : product.status === "pending"
                        ? "pending"
                        : product.status === "rejected"
                        ? "rejected"
                        : null
                    }
                    title={product.status}
                    key={index}
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
                      <li key={index}>
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
  );
};

export default ProjectRunTimeStatus;
