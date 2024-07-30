import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import {TimeOutPopUp} from "../../TimeOut";
import { useFormik } from "formik";
import * as Yup from "yup";
function AddExpense() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {}, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Required")
      .min(3, "Minimum 3 Character")
      .max(200, "Expense description must not exceed 200 characters"),
    description: Yup.string()
      .required("Required")
      .max(300, "Expense must not exceed 300 characters"),
    expenseCode: Yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      expenseCode: "",
      description: "",
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
        .post(process.env.REACT_APP_API_KEY + "add-expense", data, {
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
                ? navigate("/expense-management")
                : navigate("/expense-management/Modify");
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

  return (
    <>
      <div className="row">
        <div className="col">
          <div className="page-description">
            <h1>Create Expense</h1>
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
                    Expense Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    className="form-control"
                    id="inputEmail4"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    autoComplete="false"
                    placeholder="Enter Expense Name"
                  />
                  {/* <i className="fa fa-plus-circle" aria-hidden="true"></i> */}
                  <div className="text-danger">
                    {formik.errors.name && formik.touched.name
                      ? formik.errors.name
                      : null}
                  </div>
                </div>

                <div className="col-md-6">
                  <label htmlFor="inputEmail4" className="form-label">
                    Expense Code
                  </label>
                  <input
                    name="expenseCode"
                    type="text"
                    className="form-control"
                    id="inputEmail4"
                    onChange={formik.handleChange}
                    defaultValue={formik.values.expenseCode}
                    autoComplete="false"
                    placeholder="Enter Expense Code"
                  />
                  {/* <i className="fa fa-plus-circle" aria-hidden="true"></i> */}
                  <div className="text-danger">
                    {formik.errors.expenseCode && formik.touched.expenseCode
                      ? formik.errors.expenseCode
                      : null}
                  </div>
                </div>

                <div className="col-md-6">
                  <label htmlFor="inputEmail4" className="form-label">
                    Expense Description
                  </label>
                  <textarea
                    name="description"
                    type="text"
                    className="form-control"
                    id="inputEmail4"
                    onChange={formik.handleChange}
                    defaultValue={formik.values.description}
                    autoComplete="false"
                    placeholder="Enter Description Name"
                  />
                  {/* <i className="fa fa-plus-circle" aria-hidden="true"></i> */}
                  <div className="text-danger">
                    {formik.errors.description && formik.touched.description
                      ? formik.errors.description
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
                        ? "/expense-management/Modify"
                        : "/expense-management"
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
export default AddExpense;
