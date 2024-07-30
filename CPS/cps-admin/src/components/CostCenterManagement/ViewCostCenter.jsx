import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, NavLink,useParams } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import swal from "sweetalert";
import * as Yup from "yup";
import LoadingSpinner from "../Loader/LoadingSpinner";
function ViewCostCenter() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const {
    state: { id },
  } = {state:useParams()};

  const token = localStorage.getItem("token");
  const [status, setStatus] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    fetchCenter();
  }, []);
  const fetchCenter = () => {
    setIsLoading(true);
    axios
      .get(process.env.REACT_APP_API_KEY + "singleCostCenter/" + id, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log("data>>>>", res.data.data.name);
        setInputs({
          centerName: res.data.data.name,
          department: res.data.data.department,
          centerCode: res.data.data.centerCode,
        });
        console.log(">>data>>", inputs);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("error>>", error.message);
      });
  };
  const validationSchema = Yup.object().shape({
    department: Yup.string().required("Department is required"),
    role: Yup.string()
      .required("Cost Center is required")
      .min(3, "Minimum 3 Character")
      .max(90, "Cost Center must not exceed 50 characters"),
    centerCode: Yup.string()
      .required("Center code is required")
      .min(3, "Minimum 3 Character")
      .max(90, "Center code must not exceed 20 characters"),
  });
  const initialValues = {
    role: inputs.centerName,
    department: inputs.department,
    hidden_value: inputs.role,
    centerCode: inputs.centerCode,
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: true,
    enableReinitialize: true,

    onSubmit: async (data) => {
      setIsLoading(true);
      await axios
        .post(
          process.env.REACT_APP_API_KEY + "update-cost-center/" + id,
          data,
          {
            headers: {
              "Content-type": "Application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )

        .then((res) => {
          if (res.status === 200) {
            swal({
              title: "Success!",
              text: "Created Successfully!",
              icon: "success",
              button: "Okay",
            });
            setIsLoading(false);
            navigate("/cost-center-management");
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
  if (isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }
  return (
    <>
      <div className="row">
        <div className="col">
          <div className="page-description">
            <h1>Edit Cost Center</h1>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="example-container">
            <div className="example-content">
              <form className="row g-3" onSubmit={formik.handleSubmit}>
                <div className="custom-control col-md-12 ">
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
                          initialValues.department === "trade_marketing"
                            ? "form-check-input checked-class"
                            : "form-check-input"
                        }
                        type="radio"
                        name="department"
                        value="trade_marketing"
                        id="flexRadioDefault2"
                        onChange={formik.handleChange}
                        defaultChecked={
                          initialValues.department === "trade_marketing"
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
                </div>

                <div className="col-md-4">
                  <label htmlFor="inputEmail4" className="form-label">
                    Cost Center
                  </label>
                  <input
                    name="role"
                    type="text"
                    className="form-control"
                    id="inputEmail4"
                    onChange={formik.handleChange}
                    defaultValue={inputs.centerName}
                    autoComplete="false"
                    placeholder="Cost Center"
                  />
                  {/* <i className="fa fa-plus-circle" aria-hidden="true"></i> */}
                  <div className="text-danger">
                    {formik.errors.role && formik.touched.role
                      ? formik.errors.role
                      : null}
                  </div>
                </div>
                <div className="col-md-4">
                  <label htmlFor="inputEmail4" className="form-label">
                    Cost Center Code
                  </label>
                  <input
                    name="centerCode"
                    type="text"
                    className="form-control"
                    onChange={formik.handleChange}
                    defaultValue={inputs.centerCode}
                    autoComplete="false"
                    placeholder="Cost Center Code"
                  />
                  {/* <i className="fa fa-plus-circle" aria-hidden="true"></i> */}
                  <div className="text-danger">
                    {formik.errors.centerCode && formik.touched.centerCode
                      ? formik.errors.centerCode
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
                    to="/cost-center-management"
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

export default ViewCostCenter;
