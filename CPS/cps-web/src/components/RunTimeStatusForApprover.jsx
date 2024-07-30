import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "./Loader/LoadingSpinner";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import moment from "moment";
import swal from "sweetalert";
function RunTimeStatusForApprover(props) {
  const navigate = useNavigate();
  let { ProjectId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [runTimeStatus, setRunTimeStatus] = useState([]);
  const [runTimeApprovers, setrunTimeApprovers] = useState([]);
  const projectID = ProjectId ? ProjectId : props.PID;
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
        process.env.REACT_APP_API_KEY + "run-time-approval-users/" + projectID,
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
          console.log(">>>>>>>>runtime", res.data.data);
        }
      })
      .catch(function (error) {
        console.log(">>>>errorAya", error.response);
      });
  };

  const runTimeApprovalStatus = async (props) => {
    if (!localStorage.getItem("auth-token")) {
      TimeOut();
    }
    setIsLoading(true);
    await axios({
      url:
        process.env.REACT_APP_API_KEY + "run-time-project-status/" + projectID,
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
            <article>
              <p style={{ color: "green" }}>Project Run Time Approval Status</p>
            </article>
          </>
        </div>
      </article>

      <article className="approval-status-card runtime-approval-page">
        <div className="timeline-holder approver-flow-user">
          

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
          <div style={{ marginTop: "20px" }}>
            <p style={{ color: "green" }}>Approver Flow</p>
          </div>
          <>
            {!props.PID && (
              <Link to="/my-projects">
                <button type="button" className="next-btn mt-4">
                  Back
                </button>
              </Link>
            )}
          </>
        </div>
      </article>
    </>
  );
}

export default RunTimeStatusForApprover;
