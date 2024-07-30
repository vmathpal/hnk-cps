import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation ,useParams} from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import {TimeOutPopUp} from "../../TimeOut";
import { useFormik } from "formik";
import * as Yup from "yup";
function EditBrand() {
  const {
    state: { id },
  } = {state:useParams()};
  console.log(">>ID", id);
  const [inputs, setInputs] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetchBrand();
  }, []);
  const fetchBrand = () => {
    axios
      .get(process.env.REACT_APP_API_KEY + "singleBrand/" + id, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(">>>>ddta", res.data.data);
        setInputs({
          brand: res.data.data.name,
          brandCode: res.data.data.brandCode,
        });
      })
      .catch((error) => {
        console.log("error>>", error.message);
      });
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Brand name is required")
      .min(3, "Minimum 3 Character")
      .max(40, "Brand name must not exceed 40 characters"),
  });

  const formik = useFormik({
    initialValues: {
      name: inputs.brand,
      brandCode: inputs.brandCode,
      hidden_value: inputs.brand,
    },

    validationSchema,
    validateOnChange: true,
    enableReinitialize: true,
    // validateOnBlur: false,
    onSubmit: async (data) => {
      if (! localStorage.getItem("token")) {
        TimeOutPopUp(navigate);
        return;
      }
      setIsLoading(true);
      await axios
        .post(process.env.REACT_APP_API_KEY + "update-brand/" + id, data, {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            swal({
              title: "Success!",
              text: "Updated Successfully!",
              icon: "success",
              button: "Okay",
            });
            setIsLoading(false);
            {
              localStorage.getItem("user_role") === "super_admin"
                ? navigate("/brand-management")
                : navigate("/brand-management/Modify");
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
            <h1>Edit Brand</h1>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="example-container">
            <div className="example-content">
              <form className="row g-3" onSubmit={formik.handleSubmit}>
                <div className="col-md-4">
                  <label htmlFor="inputEmail4" className="form-label">
                    Brand Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    className="form-control"
                    id="inputEmail4"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    autoComplete="false"
                    placeholder="Enter Brand Name"
                  />
                  {/* <i className="fa fa-plus-circle" aria-hidden="true"></i> */}
                  <div className="text-danger">
                    {formik.errors.name && formik.touched.name
                      ? formik.errors.name
                      : null}
                  </div>
                </div>
                <div className="col-md-4">
                  <label htmlFor="inputEmail4" className="form-label">
                    Brand Code
                  </label>
                  <input
                    name="brandCode"
                    type="text"
                    className="form-control"
                    id="inputEmail4"
                    onChange={formik.handleChange}
                    value={formik.values.brandCode}
                    autoComplete="false"
                    placeholder="Enter Brand Code"
                  />
                  {/* <i className="fa fa-plus-circle" aria-hidden="true"></i> */}
                  <div className="text-danger">
                    {formik.errors.brandCode && formik.touched.brandCode
                      ? formik.errors.brandCode
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
                        ? "/brand-management/Modify"
                        : "/brand-management"
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

export default EditBrand;
