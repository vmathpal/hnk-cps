import React from "react";
import Timeline from "../components/Timeline";
import Row from "react-bootstrap/Row";
import { NavLink } from "react-router-dom";

const ApprovalStatusCard = (props) => {
  return (
    <>
      <article className="approval-status-card">
        <div className="project-info">
          <div className="inner">
            <div className="project-title">
              <h3>
                {props.title}
                <span> {props.projectType}</span>
              </h3>
            </div>
            <div className="project-subtitle">
              <h4>{props.subTitle}</h4>
            </div>
            <div className="date">
              <p>Requested on {props.date}</p>
            </div>
            <div className="action" style={{ marginTop: 15 }}>
              <NavLink
                style={{ fontWeight: 600 }}
                to={{
                  pathname: "/project-runtime-status/" + props.Id,
                }}
              >
                Check Approval Status
              </NavLink>
            </div>
          </div>
        </div>
        {/* <div className="timeline-holder">
          <Timeline />
        </div> */}
      </article>
    </>
  );
};

export default ApprovalStatusCard;
