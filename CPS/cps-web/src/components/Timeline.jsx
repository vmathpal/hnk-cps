import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const Timeline = () => {
  const [active, setActive] = useState("");
  const [runTimeStatus, setRunTimeStatus] = useState([]);
  const handleClick = (event) => {
    setActive(event.target.id);
  };
  useEffect(() => {
    runTimeApprovalStatus();
  }, []);

  function runTimeApprovalStatus() {
    axios({
      url: process.env.REACT_APP_API_KEY + "run-time-project-status/20",
      method: "get",
      params: {
        userID: localStorage.getItem("authID"),
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(function (response) {
      setRunTimeStatus(response.data.data);
      // console.log("Run Time Status", response.data.data);
    });
  }

  return (
    <div className="timeline">
      {runTimeStatus.length !== 0
        ? Object.values(runTimeStatus)?.map((product, index) => (
            <li
              className={product.status === "approved" ? "active" : null}
              title="Marketing Manager"
              onClick={handleClick}
              id={"1"}
            >
              {product.role_name}
            </li>
          ))
        : ""}
    </div>
  );
};

export default Timeline;
