import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, NavLink, Link } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { useFormik } from "formik";
import Select from "react-select";
import {TimeOutPopUp} from "../TimeOut";


import * as Yup from "yup";
function SubAdminCreation() {
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [selectedValue, setSelectedValue] = useState([]);
  

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email is invalid"),
    name: Yup.string().required("Name is required"),
    // .max("Name must not exceed 40 characters"),
    
    
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .max(40, "Password must not exceed 40 characters"),
    confirmPwd: Yup.string()
      .required("Password is required")
      .oneOf([Yup.ref("password")], "Passwords does not match"),
      
  });
  const initialValues = {
    name: '',
    email:'',
    password:'',
    confirmPwd:'',  
    isGM:'no'
  };
  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: true,
    enableReinitialize: true,
    // validateOnBlur: false,
    onSubmit: async (data) => {
      if (! localStorage.getItem("token")) {
                TimeOutPopUp(navigate);
                return;
              }
      
      data.accessRole=JSON.stringify(selectedValue);
      // console.log('input data',process.env.REACT_APP_API_KEY+"login")
      await axios
        .post(process.env.REACT_APP_API_KEY + "add-sub-admin", data, {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            swal({
              title: "Success!",
              text: "Created Successfully!",
              icon: "success",
              button: "Okay",
            });
            navigate("/sub-admin-list");
          }
        })
        .catch(function (error) {
          // console.log('>>>>>>>>>>>',error)
          if (error.response.data.status === false) {
            swal("Oops", error.response.data.message, "error");
          }
        });
      console.log(JSON.stringify(data, null, 2));
      // console.log(data);
    },
  });

  return (
    <>
      <div className="row">
        <div className="col">
          <div className="page-description">
            <h1>Add SubAdmin</h1>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="example-container">
            <div className="example-content">
              <form className="row g-3" onSubmit={formik.handleSubmit}>
          
                <div className="col-md-6">
                  <label htmlFor="inputEmail4" className="form-label">
                    Full Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    className="form-control"
                    id="inputEmail4"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    autoComplete="false"
                  />
                  <div className="text-danger">
                    {formik.errors.name && formik.touched.name ? formik.errors.name : null}
                  </div>
                </div>
                <div className="col-md-6">
                  <label htmlFor="inputEmail4" className="form-label">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    className="form-control"
                    id="inputEmail4"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    autoComplete="false"
                  />
                  <div className="text-danger">
                    {formik.errors.email && formik.touched.email? formik.errors.email : null}
                  </div>
                </div>
                <div className="col-md-6">
                  <label htmlFor="inputPassword4" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    id="inputPassword4"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                  />
                  <div className="text-danger">
                    {formik.errors.password && formik.touched.password ? formik.errors.password : null}
                  </div>
                </div>
                <div className="col-md-6">
                  <label htmlFor="inputPassword4" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPwd"
                    className="form-control"
                    id="inputPassword4"
                    onChange={formik.handleChange}
                    value={formik.values.confirmPwd}
                  />
                  <div className="text-danger">
                    {formik.errors.confirmPwd && formik.touched.confirmPwd ? formik.errors.confirmPwd : null}
                  </div>
                </div>
                
                <div className="col-12">
                  <button type="submit" className="btn btn-primary">
                  {isLoading ? (
                      <>
                        <i className="fa fa-refresh fa-spin"></i>Loading
                      </>
                    ) : (
                      "Save"
                    )}
                  </button>

                  <Link className="btn btn-primary mx-3" to="/sub-admin-list">
                    Back
                  </Link>

                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SubAdminCreation;
