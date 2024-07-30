import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation ,useParams} from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { useFormik } from "formik";
import {TimeOutPopUp} from "../../TimeOut";
import * as Yup from "yup";
import LoadingSpinner from "../../Loader/LoadingSpinner";
function EditBusinessType() {
  const {
    state: { id },
  } = {state:useParams()};
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    FetchBusinessTypeList();
  }, []);

  const FetchBusinessTypeList = async () => {
    setIsLoading(true);
    await axios
      .get(process.env.REACT_APP_API_KEY + "singleBusinessType/" + id, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(">>>>data", res.data.data);
        setInputs({
          name: res.data.data.name,
          baseChannel: res.data.data.name,
          bizBaseDisc: res.data.data.name,
          code: res.data.data.code,
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
      name: inputs.name,
      code: inputs.code,
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
        .post(
          process.env.REACT_APP_API_KEY + "update-business-type/" + id,
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
            <h1>Edit Business Type</h1>
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
                    placeholder="Business Type Code"
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
                    Biz Type Description
                  </label>
                  <input
                    name="name"
                    type="text"
                    className="form-control"
                    id="inputEmail4"
                    onChange={formik.handleChange}
                    defaultValue={formik.values.name}
                    autoComplete="false"
                    placeholder="Biz Type Description"
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
                    defaultValue={formik.values.baseChannel}
                    autoComplete="false"
                    placeholder="Base Channel"
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
                    BaseBiz Type Description
                  </label>
                  <input
                    name="bizBaseDisc"
                    type="text"
                    className="form-control"
                    id="inputEmail4"
                    onChange={formik.handleChange}
                    defaultValue={formik.values.bizBaseDisc}
                    autoComplete="false"
                    placeholder="BaseBiz Type Description"
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
                      "Update"
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
export default EditBusinessType;
