import React from "react";
import { Outlet, Navigate } from "react-router-dom";
// import { useEffect} from "react";
export default function PrivateRoutes() {
  // var temp = process.env.REACT_APP_TEMP_LOGIN;

  let user = localStorage.getItem("auth-token") == null ? false : true;
  // console.log("Ayy>>");
  return <>{user ? <Outlet /> : <Navigate to="/login" />}</>;
}
