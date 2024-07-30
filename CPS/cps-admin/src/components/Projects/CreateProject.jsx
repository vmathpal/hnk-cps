import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { useFormik } from "formik";
import {TimeOutPopUp} from "../TimeOut";
import * as Yup from "yup";
function CreateProject() {
  var userID=localStorage.getItem("userID");
 
  const navigate = useNavigate();
  const validationSchema = Yup.object().shape({
    project: Yup.string().required("Project Name is required"),
   
  });
  const formik = useFormik({
    initialValues: {
      project: "",
      userID:userID
    },
    validationSchema,
    // validateOnChange: false,
    // validateOnBlur: false,
    onSubmit: async (data) => {
      if (! localStorage.getItem("token")) {
                TimeOutPopUp(navigate);
                return;
              }
      // console.log('input data',process.env.REACT_APP_API_KEY+"login")
      await axios
        .post(process.env.REACT_APP_API_KEY + "create-project", data)
        
        .then((res) => {
          if (res.status === 200) {
            swal({
              title: "Wow!",
              text: "Project Created Successfully!",
              icon: "success",
              button: "Okay",
            });
            
          } 
        }).catch(error => {
          if(error.response.status === 422) {
            swal("Oops", "Unauthorized User", "error");
          }
      });
     console.log(JSON.stringify(data, null, 2));

    },
  });

  return (
    <>
      <div className="row">
        <div className="col">
          <div className="page-description">
            <h1>Create Role</h1>
          </div>
        </div>
      </div>
     
      <div className="card">
      <div className="card-body">
      <div className="example-container">
      <div className="example-content">
      <form  className="row g-3" onSubmit={formik.handleSubmit}>
     
          <div className="col-md-4">
          <label htmlFor="inputEmail4" className="form-label">
            Project Name
          </label>
          <input
            name="project"
            type="text"
            className="form-control"
            id="inputEmail4"
            onChange={formik.handleChange}
            value={formik.values.project}
            autoComplete="false"
          />
          <div className="text-danger">
            {formik.errors.project ? formik.errors.project : null}
          </div>
        </div>
        <input
            name="userId"
            type="hidden"
            className="form-control"
            id="inputEmail4"
            onChange={formik.handleChange}
            value={userID}
            autoComplete="false"
          />
        <div className="col-12">
          <button type="submit" className="btn btn-primary">
           Create
          </button>
        </div>
      </form>
      </div></div></div></div>
    </>
  );
}

export default CreateProject;
