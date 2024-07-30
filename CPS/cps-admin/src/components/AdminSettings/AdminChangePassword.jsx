import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import axios from "axios";
import swal from "sweetalert";
import { useFormik } from "formik";
import * as Yup from "yup";
function AdminChangePassword() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [users, setUsers] = useState({});

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .max(40, "Password must not exceed 40 characters"),

    confirmPwd: Yup.string()
      .required("Password is required")
      .oneOf([Yup.ref("password")], "Passwords does not match"),
    oldpassword: Yup.string()
      .required("OldPassword is required")
      .max(40, "Password must not exceed 40 characters"),
  });
  useEffect(() => {
    //$('.dt-buttons').hide();
    geUsers();
  }, []);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPwd: "",
      oldpassword: "",
    },

    validationSchema,
    validateOnChange: true,
    // validateOnBlur: false,
    onSubmit: async (data) => {
      setIsLoading(true);
      axios({
        url: process.env.REACT_APP_API_KEY + "admin-change-password",
        method: "post",
        params: {
          UserId: localStorage.getItem("userID"),
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: data,
      })
        .then((res) => {
          if (res.status === 200) {
            setIsLoading(false);
            swal({
              title: "Success!",
              text: "Updated Successfully!",
              icon: "success",
              button: "Okay",
            }).then(function () {
              localStorage.clear();
              navigate("/sign-in");
            });
          }
        })
        .catch((error) => {
          if (error.response.status === 422) {
            swal("Oops", error.response.data.message, "error");
          }
          setIsLoading(false);
        });
      console.log(JSON.stringify(data, null, 2));
      // console.log(data);
    },
  });

  const ccEmail = useFormik({
    initialValues: {
      ccEmail:
        "Yihting.chai@apb.com.sg,Rina.chan@apb.com.sg,panghui.loe@apb.com.sg",
    },
    // validateOnChange: true,
    onSubmit: async (data) => {
      setIsLoading(true);
      console.log("data==>", data);
      axios({
        url: process.env.REACT_APP_API_KEY + "admin-cc-email",
        method: "post",
        params: {
          UserId: localStorage.getItem("userID"),
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: data,
      })
        .then((res) => {
          if (res.status === 200) {
            setIsLoading(false);
            swal({
              title: "Success!",
              text: "Updated Successfully!",
              icon: "success",
              button: "Okay",
            }).then(function () {});
          }
        })
        .catch((error) => {
          if (error.response.status === 422) {
            swal("Oops", error.response.data.message, "error");
          }
          setIsLoading(false);
        });
      console.log(JSON.stringify(data, null, 2));
      // console.log(data);
    },
  });
  const geUsers = async () => {
    setIsLoading(true);
    axios({
      url:
        process.env.REACT_APP_API_KEY +
        "singleUser/" +
        localStorage.getItem("userID"),
      method: "get",
      params: {
        url: "ba-management",
        userID: localStorage.getItem("userID"),
        role: localStorage.getItem("user_role"),
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(function (response) {
        setUsers({
          ccEmail: response?.data?.ccEmail,
        });

        setIsLoading(false);
      })
      .catch(function (error) {});
  };
  return (
    <>
      <div className="row">
        <div className="col">
          <div className="page-description">
            <h1>Change Password</h1>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="example-container">
            <div className="example-content">
              <h4>Change Password</h4>
              <br></br>
              <form className="row g-3" onSubmit={formik.handleSubmit}>
                <div className="col-md-4">
                  <label htmlFor="inputPassword4" className="form-label">
                    Old Password
                  </label>
                  <input
                    type="text"
                    name="oldpassword"
                    className="form-control"
                    id="inputPassword4"
                    onChange={formik.handleChange}
                    defaultValue=""
                  />
                  <div className="text-danger">
                    {formik.errors.oldpassword && formik.touched.oldpassword
                      ? formik.errors.oldpassword
                      : null}
                  </div>
                </div>
                <div className="col-md-4">
                  <label htmlFor="inputPassword4" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    id="inputPassword4"
                  />
                  <div className="text-danger">
                    {formik.errors.password && formik.touched.password
                      ? formik.errors.password
                      : null}
                  </div>
                </div>
                <div className="col-md-4">
                  <label htmlFor="inputPassword4" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPwd"
                    className="form-control"
                    id="inputPassword4"
                    onChange={formik.handleChange}
                  />
                  <div className="text-danger">
                    {formik.errors.confirmPwd && formik.touched.confirmPwd
                      ? formik.errors.confirmPwd
                      : null}
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
                </div>
              </form>
              <br></br>
              <h4>CC Email</h4>
              <br></br>
              <form className="row g-3" onSubmit={ccEmail.handleSubmit}>
                <div className="col-md-4">
                  <label htmlFor="inputPassword4" className="form-label">
                    CC Email
                  </label>
                  <textarea
                    type="text"
                    name="ccEmail"
                    className="form-control"
                    id="inputPassword4"
                    onChange={ccEmail.handleChange}
                    defaultValue={users.ccEmail}
                  />
                  <div className="text-danger">
                    {ccEmail.errors.ccEmail && ccEmail.touched.ccEmail
                      ? ccEmail.errors.ccEmail
                      : null}
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
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminChangePassword;
