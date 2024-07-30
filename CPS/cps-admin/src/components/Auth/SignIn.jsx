import { React, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .max(40, "Password must not exceed 40 characters"),
  });
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    validateOnChange: true,
    // validateOnBlur: false,
    onSubmit: async (data) => {
      setIsLoading(true);
      await axios
        .post(process.env.REACT_APP_API_KEY + "login", data)

        .then((res) => {
          if (res.status === 200) {
            swal({
              title: "Success!",
              text: "Login Successfully!",
              icon: "success",
              button: "Okay",
            });
            localStorage.setItem("token", res.data.accessToken);
            localStorage.setItem("user_role", res.data.role);
            localStorage.setItem("userID", res.data.id);
            localStorage.setItem("email", res.data.email);
            localStorage.setItem("Status", res.data.status);
            navigate("/dashboard");
            setIsLoading(false);
          }
        })
        .catch((error) => {
          if (error.response.status === 422) {
            swal("Oops", error.response.data.message, "error");
          }
          setIsLoading(false);
          // console.log('aya',error.response);
        });
      // console.log(JSON.stringify(data, null, 2));
    },
  });
  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
    } else {
      setPasswordType("password");
    }
  };
  return (
    <div className="app app-auth-sign-in align-content-stretch d-flex flex-wrap justify-content-end">
      <div className="app-auth-background"></div>
      <div className="app-auth-container">
        <div className="sign-in-container">
          <div className="logo">
            <NavLink to="#"></NavLink>
          </div>
          <form className="row g-3" onSubmit={formik.handleSubmit}>
            <div className="auth-credentials m-b-xxl">
              <div className="form-group">
                <label htmlFor="signInEmail" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  className={
                    formik.errors.email
                      ? "form-control error-border "
                      : "form-control"
                  }
                  id="signInEmail"
                  aria-describedby="signInEmail"
                  placeholder="Email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
                <div className="text-danger">
                  {formik.errors.email && formik.touched.email
                    ? formik.errors.email
                    : null}
                </div>
              </div>
              <div className="form-group my-3">
                <label htmlFor="signInPassword" className="form-label">
                  Password
                </label>
                <div className="icon-input">
                  <input
                    type={passwordType}
                    name="password"
                    className={
                      formik.errors.password
                        ? "form-control error-border "
                        : "form-control"
                    }
                    id="signInPassword"
                    aria-describedby="signInPassword"
                    placeholder="Password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                  />

                  {passwordType === "password" ? (
                    <i
                      className="fa fa-eye"
                      aria-hidden="true"
                      onClick={togglePassword}
                      style={
                        formik.values.password.length > 0
                          ? {}
                          : { display: "none" }
                      }
                    ></i>
                  ) : (
                    <i className="fa fa-eye-slash" onClick={togglePassword}></i>
                  )}
                </div>
                <div className="text-danger">
                  {formik.errors.password && formik.touched.password
                    ? formik.errors.password
                    : null}
                </div>
              </div>
            </div>

            <div className="auth-submit">
              <button className="btn btn-primary" type="submit">
                {isLoading ? (
                  <>
                    <i className="fa fa-refresh fa-spin"></i>Loading
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>
          <div className="divider" />
        </div>
      </div>
    </div>
  );
}
