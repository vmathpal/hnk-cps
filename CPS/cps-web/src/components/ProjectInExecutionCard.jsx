import React from "react";
import { BsThreeDots } from "react-icons/bs";
import { NavLink } from "react-router-dom";

const ProjectInExecutionCard = (props) => {
  return (
    <>
      <article className="card">
        <div className="card-inner">
          <div className="header">
            <p>{props.projectId}</p>
            <p>{props.projectType}</p>
            <p
              style={{
                width: "100%",
                textAlign: "right",
                color: "rgb(67 135 227)",
              }}
            >
              {props.projectStatus}
            </p>
          </div>
          <div className="card-body">
            <h4>{props.projectName}</h4>
            <div className="project-badge">{}</div>
            <div className="flex_row">
              <div className="left">
                <p>Duration</p>
                <h4>
                  {props.duration1} - {props.duration2}
                </h4>
              </div>
              <div className="right">
                <p>Project Budget</p>
                <h4>{props.budget}</h4>
              </div>
            </div>
            <div className="brandings">
              <p>Brands</p>
              <div className="flex">
                <div className="image-container">
                  <img src={props.brand_1} alt=""></img>
                  <img src={props.brand_2} alt=""></img>
                </div>

                <div className="ellipse">
                  <NavLink
                    to={{
                      pathname: "/create-project/" + props.ProjectId,
                    }}
                  >
                    <p>Details</p>
                  </NavLink>
                  {/* <BsThreeDots /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

export default ProjectInExecutionCard;
