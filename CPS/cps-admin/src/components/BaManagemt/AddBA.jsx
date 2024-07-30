import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { useFormik } from "formik";
import {TimeOutPopUp} from "../TimeOut";


import * as Yup from "yup";
function AddBA() {
  const [status, setStatus] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    // department: Yup.string().required("Department is required").max(40),
    role: Yup.string()
      .required("Role is required")
      .min(3, "Minimum 3 Character")
      .max(60, "Role must not exceed 60 characters"),
  });

  const formik = useFormik({
    initialValues: {
      // role: "",
      department: "",
      hidden_value: "Add",
    },

    validationSchema,
    validateOnChange: true,
    // validateOnBlur: false,
    onSubmit: async (data) => {
      if (! localStorage.getItem("token")) {
        TimeOutPopUp(navigate);
         return;
         }
      setIsLoading(true);
      await axios
        .post(process.env.REACT_APP_API_KEY + "add-ba-role", data, {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        .then((res) => {
          if (res.status === 200) {
            swal({
              title: "Success!",
              text: "Created Successfully!",
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

  return (
    <>
      <div className="row">
        <div className="col">
          <div className="page-description">
            <h1>Create BA Role</h1>
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
                        className="form-check-input"
                        type="radio"
                        name="department"
                        value="sales"
                        id="flexRadioDefault1"
                        onChange={formik.handleChange}
                        defaultChecked={formik.values.department === "sales"}
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
                        className="form-check-input"
                        type="radio"
                        name="department"
                        value="marketing"
                        id="flexRadioDefault2"
                        onChange={formik.handleChange}
                        defaultChecked={formik.values.department === "marketing"}
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
                        className="form-check-input"
                        type="radio"
                        name="department"
                        value="trade_market"
                        id="flexRadioDefault2"
                        onChange={formik.handleChange}
                        defaultChecked={formik.values.department === "trade_market"}
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
                    {formik.errors.department && formik.touched.department ? formik.errors.department : null}
                  </div>
                </div> */}

                <div className="col-md-6">
                  <label htmlFor="inputEmail4" className="form-label">
                    BA Role Name
                  </label>
                  <input
                    name="role"
                    type="text"
                    className="form-control"
                    id="inputEmail4"
                    onChange={formik.handleChange}
                    value={formik.values.role}
                    autoComplete="false"
                    placeholder="BA Name"
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
                      "Create"
                    )}
                  </button>

                  <Link
                    className="btn btn-primary mx-3"
                    to={
                      localStorage.getItem("user_role") === "sub_admin"
                        ? "/ba-management/Modify"
                        : "/ba-management"
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

export default AddBA;
