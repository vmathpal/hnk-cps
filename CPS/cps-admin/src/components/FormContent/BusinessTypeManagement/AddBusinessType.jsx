import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { useFormik } from "formik";
import {TimeOutPopUp} from "../../TimeOut";


import * as Yup from "yup";
function AddBusinessType() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {}, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Required")
      .max(500, "Description must not exceed 200 characters"),
    code: Yup.string()
      .required("Required")
      .max(300, "Code must not exceed 300 characters"),
    baseChannel: Yup.string()
      .required("Required")
      .max(300, "BaseChannel not exceed 300 characters"),
    bizBaseDisc: Yup.string()
      .required("Required")
      .max(500, "BaseChannel Description not exceed 500 characters"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      code: "",
      baseChannel: "",
      bizBaseDisc: "",
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
        .post(process.env.REACT_APP_API_KEY + "add-businessType", data, {
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
                ? navigate("/business-type-management")
                : navigate("/business-type-management/Modify");
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
            <h1>Create Business Type</h1>
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
                    Business Type Code
                  </label>
                  <input
                    name="code"
                    type="text"
                    className="form-control"
                    id="inputEmail4"
                    onChange={formik.handleChange}
                    defaultValue={formik.values.code}
                    autoComplete="false"
                    placeholder="Enter Code"
                  />
                  {/* <i className="fa fa-plus-circle" aria-hidden="true"></i> */}
                  <div className="text-danger">
                    {formik.errors.code && formik.touched.code
                      ? formik.errors.code
                      : null}
                  </div>
                </div>
                <div className="col-md-6">
                  <label htmlFor="inputEmail4" className="form-label">
                    BaseBiz Type Description
                  </label>
                  <input
                    name="name"
                    type="text"
                    className="form-control"
                    id="inputEmail4"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    autoComplete="false"
                    placeholder="Enter Business Type Name"
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
                    Base Channel
                  </label>
                  <input
                    name="baseChannel"
                    type="text"
                    className="form-control"
                    id="inputEmail4"
                    onChange={formik.handleChange}
                    value={formik.values.baseChannel}
                    autoComplete="false"
                    placeholder="Enter BaseChannel Name"
                  />
                  {/* <i className="fa fa-plus-circle" aria-hidden="true"></i> */}
                  <div className="text-danger">
                    {formik.errors.baseChannel && formik.touched.baseChannel
                      ? formik.errors.baseChannel
                      : null}
                  </div>
                </div>
                <div className="col-md-6">
                  <label htmlFor="inputEmail4" className="form-label">
                    BaseBizType Description
                  </label>
                  <input
                    name="bizBaseDisc"
                    type="text"
                    className="form-control"
                    id="inputEmail4"
                    onChange={formik.handleChange}
                    value={formik.values.bizBaseDisc}
                    autoComplete="false"
                    placeholder="Description"
                  />
                  {/* <i className="fa fa-plus-circle" aria-hidden="true"></i> */}
                  <div className="text-danger">
                    {formik.errors.bizBaseDisc && formik.touched.bizBaseDisc
                      ? formik.errors.bizBaseDisc
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
                        ? "/business-type-management/Modify"
                        : "/business-type-management"
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
export default AddBusinessType;
