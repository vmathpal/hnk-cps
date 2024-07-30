import React from "react";
import { NavLink } from "react-router-dom";

export default function NotFound() {
  return (
   <div className="app not-found-page app-error align-content-stretch d-flex flex-wrap">
  <div className="app-error-info">
    <h5>Oops!</h5>
    <span>It seems that the page you are looking for no longer exists.<br />
      We will try our best to fix this soon.</span>
    <NavLink to="/overview" className="btn btn-dark">Go to dashboard</NavLink>
  </div>
  <div className="app-error-background" />
</div>

  );
}
