import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, NavLink,useParams } from "react-router-dom";
import axios from "axios";
import {TimeOutPopUp} from "../TimeOut";
import swal from "sweetalert";
import $ from "jquery";
import { useFormik } from "formik";
import * as Yup from "yup";
function EditBaRole() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const {
    state: { id },
  } = {state:useParams()};
  const token = localStorage.getItem("token");
  const [status, setStatus] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    fetchUser();
    resetState();
  }, []);
  const fetchUser = () => {
    axios
      .get(process.env.REACT_APP_API_KEY + "singleBaRole/" + id, {
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log("data>>>>", res.data);
        setInputs({
          name: res.data.data.name,
          // department: res.data.data.department,
        });
      })
      .catch((error) => {
        console.log("error>>", error.message);
      });
  };
  const resetState = () => {
    setInputs(inputs);
  };
  // console.log('dd',inputs.role);
  const validationSchema = Yup.object().shape({
    // department: Yup.string().required("Department is required").max(40),
    role: Yup.string()
      .required("Role is required")
      .min(3, "Minimum 3 Character")
      .max(60, "Role must not exceed 60 characters"),
  });
  const initialValues = {
    role: inputs.name,
    // department: inputs.department,
    hidden_value: inputs.name,
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    // validateOnChange: false,
    // validateOnBlur: false,
    onSubmit: async (data) => {
      if (! localStorage.getItem("token")) {
        TimeOutPopUp(navigate);
        return;
      }
      setIsLoading(true);
      await axios
        .post(process.env.REACT_APP_API_KEY + "edit-Barole/" + id, data, {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        .then((res) => {
          if (res.status === 200) {
            swal({
              title: "Wow!",
              text: "Updated Successfully!",
              icon: "success",
              button: "Okay",
            });
            setIsLoading(false);
            {
              localStorage.getItem("user_role") === "super_admin"
                ? navigate("/ba-management")
                : navigate("/ba-management/Modify");
            }
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

  const radioHandler = (status) => {
    setStatus(status);
  };

  let checked = document.querySelector(".checked-class");
  let radio = document.querySelectorAll(".form-check-input");
  radio.forEach((radio) => {
    radio.addEventListener("click", function () {
      checked.classList.remove("checked-class");
    });
  });
  return (
    <>
      <div className="row">
        <div className="col">
          <div className="page-description">
            <h1>Edit BA Role</h1>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="example-container">
            <div className="example-content">
              <form className="row g-3" onSubmit={formik.handleSubmit}>
                {/* <div className="custom-control col-md-12 ">
                  <label htmlFor="inputEmail4" className="form-label">
                    Choose Department
                  </label>
                  <div className="department">
                    <div className="form-check">
                      <input
                        className={
                          initialValues.department === "sales"
                            ? "form-check-input checked-class"
                            : "form-check-input"
                        }
                        type="radio"
                        name="department"
                        value="sales"
                        id="flexRadioDefault1"
                        onChange={formik.handleChange}
                        defaultChecked={initialValues.department === "sales"}
                        onClick={(e) => radioHandler(1)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexRadioDefault1"
                      >
                        Sales
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className={
                          initialValues.department === "marketing"
                            ? "form-check-input checked-class"
                            : "form-check-input"
                        }
                        type="radio"
                        name="department"
                        value="marketing"
                        id="flexRadioDefault2"
                        onChange={formik.handleChange}
                        defaultChecked={
                          initialValues.department === "marketing"
                        }
                        onClick={(e) => radioHandler(2)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexRadioDefault2"
                      >
                        Marketing
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className={
                          initialValues.department === "trade_market"
                            ? "form-check-input checked-class"
                            : "form-check-input"
                        }
                        type="radio"
                        name="department"
                        value="trade_market"
                        id="flexRadioDefault2"
                        onChange={formik.handleChange}
                        defaultChecked={
                          initialValues.department === "trade_market"
                        }
                        onClick={(e) => radioHandler(2)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexRadioDefault2"
                      >
                        Trade Marketing
                      </label>
                    </div>
                  </div>
                  <div className="text-danger">
                    {formik.errors.department && formik.touched.department
                      ? formik.errors.department
                      : null}
                  </div>
                </div> */}

                <div className="col-md-6">
                  <label htmlFor="inputEmail4" className="form-label">
                    Role Name
                  </label>
                  <input
                    name="role"
                    type="text"
                    className="form-control"
                    id="inputEmail4"
                    onChange={formik.handleChange}
                    defaultValue={inputs.name}
                    autoComplete="false"
                    placeholder="Enter Role Name"
                  />
                  {/* <i className="fa fa-plus-circle" aria-hidden="true"></i> */}
                  <div className="text-danger">
                    {formik.errors.role && formik.touched.role
                      ? formik.errors.role
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
                      "Update"
                    )}
                  </button>
                  <NavLink
                    className="btn btn-primary mx-3"
                    to={
                      localStorage.getItem("user_role") === "sub_admin"
                        ? "/ba-management/Modify"
                        : "/ba-management"
                    }
                  >
                    Back
                  </NavLink>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditBaRole;
