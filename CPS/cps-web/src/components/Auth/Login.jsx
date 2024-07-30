import { React, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import LoginBanner from "../../images/login_image_1x.png";
import Logo from "../../images/logo.png";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";

function Login(props) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  // var temp = process.env.REACT_APP_TEMP_LOGIN;

  const token = localStorage.getItem("auth-token");
  // const tempLogin = localStorage.getItem("temp-login");
  useEffect(() => {
    if (token) {
      navigate("/overview");
    }
    // if (temp === "yes" && tempLogin !== "true") {
    //   navigate("/temp-login");
    // }
  }, []);

  const validationSchema = Yup.object().shape({
    userID: Yup.string().required("UserID is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .max(40, "Password must not exceed 40 characters"),
  });
  const formik = useFormik({
    initialValues: {
      userID: "",
      password: "",
    },
    validationSchema,
    validateOnChange: true,
    // validateOnBlur: false,
    onSubmit: async (data) => {
      setIsLoading(true);
      await axios
        .post(process.env.REACT_APP_API_KEY + "user-login", data)

        .then((res) => {
          if (res.status === 200) {
            swal({
              title: "Success!",
              text: "Logged-in Successfully!",
              icon: "success",
              button: "Okay",
            });
            localStorage.setItem("auth-token", res.data.accessToken);
            localStorage.setItem("auth_role", res.data.role);
            localStorage.setItem("authID", res.data.id);
            localStorage.setItem("authEmail", res.data.email);
            localStorage.setItem("authDepartment", res.data.department);
            localStorage.setItem("AuthStatus", res.data.status);
            localStorage.setItem("AuthLevel", res.data.level);
            localStorage.setItem("isBA", res.data.isBA);
            if (
              res.data.level === "level1" ||
              res.data.level === "level2" ||
              res.data.level === "level3"
            ) {
              navigate("/projects-for-approval");
            } else {
              if (
                res.data.level === "level4" &&
                res.data.department === "sales"
              ) {
                navigate("/projects-for-approval");
              } else {
                navigate("/overview");
              }
            }

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
      console.log(JSON.stringify(data, null, 2));
    },
  });
  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
    } else {
      setPasswordType("password");
    }
  };

  const [passwordType, setPasswordType] = useState("password");

  const handleShowPassword = () => {
    if (passwordType === "password") setPasswordType("text");
    else setPasswordType("password");
  };

  return (
    <>
      <div className="login">
        <Row>
          <div className="col-md-6">
            <div className="login-form-container">
              <div className="login-head">
                <div>
                  <img src={Logo} alt="" className="img-fluid" />
                </div>
              </div>
              <div>
                <div className="login-form-head">
                  <div className="form-heading">
                    <h3>Commercial Project System</h3>
                    <p>
                      Welcome to CPS! <br /> Please login using your network ’s
                      ID and Password.
                    </p>
                  </div>
                </div>
                <div className="login-form">
                  <div className="main-form">
                    <div>
                      <form onSubmit={formik.handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Label>User ID:</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter your user ID"
                            onChange={formik.handleChange}
                            value={formik.values.userID}
                            name="userID"
                          />
                        </Form.Group>
                        <div className="text-danger">
                          {formik.errors.userID && formik.touched.userID
                            ? formik.errors.userID
                            : null}
                        </div>
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicPassword"
                        >
                          <Form.Label>Password:</Form.Label>
                          <div className="icon-input">
                            <Form.Control
                              type={passwordType}
                              placeholder="Enter your password"
                              autoComplete="off"
                              onChange={formik.handleChange}
                              value={formik.values.password}
                              name="password"
                            />
                            <span
                              style={{ cursor: "pointer" }}
                              className="field_icon toggle-password"
                              onClick={handleShowPassword}
                            >
                              <i
                                className={
                                  passwordType === "password"
                                    ? `fa fa-eye`
                                    : `fa fa-eye-slash`
                                }
                                aria-hidden="true"
                                onClick={togglePassword}
                              />
                            </span>
                          </div>
                        </Form.Group>
                        <div className="text-danger">
                          {formik.errors.password && formik.touched.password
                            ? formik.errors.password
                            : null}
                        </div>
                        {/* <div className="text-center mb-3">
                                                    <a href="" className="forgot-pass-link red">Forgot Password</a>
                                                </div> */}
                        <div className="login-btn-box d-flex justify-content-center">
                          <button
                            className="btn btn-red-bg btn-md nav-btn02 fill02"
                            type="submit"
                          >
                            {isLoading ? (
                              <>
                                <i className="fa fa-refresh fa-spin"></i>Loading
                              </>
                            ) : (
                              "Login"
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="right-box">
              <img src={LoginBanner} alt="" className="img-fluid login-bg" />
            </div>
          </div>
        </Row>
      </div>
    </>
  );
}

export default Login;
