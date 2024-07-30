import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import moment from "moment";
const ApprovalStatus = () => {
  const {
    state: { productID, userID, AuthLevel },
  } = useLocation();
  localStorage.setItem("projectID", productID);
  localStorage.setItem("authID", userID);
  localStorage.setItem("AuthLevel", AuthLevel);
  const [runTimeApprovers, setrunTimeApprovers] = useState([]);

  const [active, setActive] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [runTimeStatus, setRunTimeStatus] = useState([]);
  const handleClick = (event) => {
    setActive(event.target.id);
  };

  useEffect(() => {
    runTimeApprovalStatus();
  }, []);

  useEffect(() => {
    getProjectApprovers();
  }, []);
  const getProjectApprovers = async () => {
    await axios({
      url:
        process.env.REACT_APP_API_KEY + "run-time-approval-users/" + productID,
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

  function runTimeApprovalStatus(props) {
    setIsLoading(true);
    axios({
      url:
        process.env.REACT_APP_API_KEY + "run-time-project-status/" + productID,
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
        console.log('<><><><><><><><<><',response.data.data);

        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("action error", error);
      });
  }
  if (isLoading) {
    return (
      <div>
        <h4 style={{ color: "green", marginTop: 50 }}>Loading....</h4>
      </div>
    );
  }
  return (
    <>
      <div className="content-wrapper">
        <div className="row">
          <div className="col">
            <div className="page-description">
              <h1>Project Runtime Approver Flow & Status</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="runTimeStatus">
        <article className="approval-status-card runtime-approval-page">
          <div className="timeline-holder">
            <div className="timeline">
              {runTimeStatus.length !== 0
                ? Object.values(runTimeStatus)?.map((product, index) => (
                    <li
                      className={
                        product.status === "approved"
                          ? "approved active"
                          : product.status
                      }
                      title={product.status}
                      onClick={handleClick}
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
          </div>
        </article>
        <article className="approval-status-card runtime-approval-page">
          <div className="timeline-holder approver-flow-user">
            <div className="accordion-body">
              <div className="accordion-body customTimeline">
                <div>
                  <h6 style={{ color: "green", textAlign: "center" }}>
                    Approver Flow
                  </h6>
                </div>
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
      </div>
    </>
  );
};

export default ApprovalStatus;
