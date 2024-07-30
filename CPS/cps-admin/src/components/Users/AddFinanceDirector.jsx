import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { useFormik } from "formik";
import {TimeOutPopUp} from "../TimeOut";
import * as Yup from "yup";
function AddFinanceDirector() {
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(false);
  const [roleId, setRoleID] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getRoleID();
  }, []);

  const getRoleID = async () => {
    await axios({
      url: process.env.REACT_APP_API_KEY + "get-role-id",
      method: "get",
      params: {
        deptRole: "Finance Director",
        userID: localStorage.getItem("userID"),
        role: localStorage.getItem("user_role"),
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(function (response) {
        if (response.data.data) {
          console.log(">>>>>>>>>", response.data.data);
          setRoleID(response.data.data.id);
          localStorage.setItem("commercialRole", response.data.data.id);
        }
      })
      .catch(function (error) {
        console.log(">>>>>>>>>>>error", error);
      });
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email is invalid"),
    name: Yup.string().required("UserID is required"),
  });
  const initialValues = {
    name: "",
    email: "",
    level: "level1",
  };
  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: true,
    // enableReinitialize: true,
    // validateOnBlur: true,
    onSubmit: async (data) => {
      if (! localStorage.getItem("token")) {
         TimeOutPopUp(navigate);
        return;
         }
      data.dept_roleId = localStorage.getItem("commercialRole");
      setIsLoading(true);
      await axios
        .post(
          process.env.REACT_APP_API_KEY + "register-commercial-user",
          data,
          {
            headers: {
              "Content-type": "Application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            swal({
              title: "Success!",
              text: "Created Successfully!",
              icon: "success",
              button: "Okay",
            });
            setIsLoading(false);
            navigate("/user-management");
          }
        })
        .catch(function (error) {
          // console.log('>>>>>>>>>>>',error)
          setIsLoading(false);
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
            <h1>Finance Director User</h1>
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
                    LDAP UserID
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
                    {formik.errors.name && formik.touched.name
                      ? formik.errors.name
                      : null}
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
                    {formik.errors.email && formik.touched.email
                      ? formik.errors.email
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

                  <Link
                    className="btn btn-primary mx-3"
                    to={
                      localStorage.getItem("user_role") === "sub_admin"
                        ? "/user-management/Modify"
                        : "/user-management"
                    }
                  >
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

export default AddFinanceDirector;
