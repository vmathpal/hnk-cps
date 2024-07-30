import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation,useParams } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import {TimeOutPopUp} from "../../TimeOut";
import { useFormik } from "formik";
import * as Yup from "yup";
import LoadingSpinner from "../../Loader/LoadingSpinner";
function EditExpense() {
  const {
    state: { id },
  } = {state:useParams()};
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    fetchExpense();
  }, []);

  const fetchExpense = () => {
    setIsLoading(true);
    axios
      .get(process.env.REACT_APP_API_KEY + "singleExpense/" + id, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(">>>>data", res.data.data);
        setInputs({
          name: res.data.data.name,
          description: res.data.data.description,
          expenseCode: res.data.data.expenseCode,
        });
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("error>>", error.message);
      });
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Required")

      .max(200, "Expense description must not exceed 200 characters"),
    description: Yup.string()
      .required("Required")

      .max(300, "Expense must not exceed 300 characters"),
    expenseCode: Yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      name: inputs.name,
      expenseCode: inputs.expenseCode,
      description: inputs.description,
      hidden_value: inputs.name,
    },
    enableReinitialize: true,
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
        .post(process.env.REACT_APP_API_KEY + "update-expense/" + id, data, {
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
            <h1>Edit Expense</h1>
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
                      "Update"
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
export default EditExpense;
