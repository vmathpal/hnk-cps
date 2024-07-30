import React from "react";
import { Outlet, Navigate } from "react-router-dom";
// import { useEffect} from "react";
export default function PrivateRoutes() {
  console.log("OOOOOOOOOOOOOOOO")
  let user = localStorage.getItem("token") == null ? false : true;

  console.log("USERr---","token++++++",user,localStorage.getItem("token") )

  return <>{user ? <Outlet /> : <Navigate to="/sign-in" />};</>;
}
