import Breadcrumb from "react-bootstrap/Breadcrumb";
import React from "react";
import Bcheck from "../images/bcheck.svg";

function Breadcrumbs() {
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item href="#">
          <img src={Bcheck}></img> Project Details
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <img src={Bcheck}></img> Financial Info
        </Breadcrumb.Item>
      </Breadcrumb>
    </>
  );
}

export default Breadcrumbs;
