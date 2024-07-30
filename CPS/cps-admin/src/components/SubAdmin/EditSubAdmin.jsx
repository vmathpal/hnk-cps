import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link,useParams } from "react-router-dom";
import axios from "axios";
import {TimeOutPopUp} from "../TimeOut";
import swal from "sweetalert";
import { useFormik } from "formik";
import Select from "react-select";
import * as Yup from "yup";
import LoadingSpinner from "../Loader/LoadingSpinner";
function EditSubAdmin() {
  const {
    state: { id },
  } ={state:useParams()};
  const navigate = useNavigate();
  const [isLoadData, setIsLoadData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState([]);
  const [inputs, setInputs] = useState({ name: "", email: "", mobile: "" });

  useEffect(() => {
    fetchTagRole();
  }, []);
  const fetchTagRole = async () => {
    axios
      .get(process.env.REACT_APP_API_KEY + "single-sub-admin/" + id, {
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log("<><><>", res.data);
        setInputs({
          name: res.data.name,
          email: res.data.email,
          mobile: res.data.mobile,
        });

        res.data ? setIsLoadData(true) : setIsLoadData(false);
      })
      .catch((error) => {
        console.log("error>>", error.message);
      });
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email is invalid"),
    name: Yup.string().required("Name is required"),
    // .max("Name must not exceed 40 characters"),
    // mobile: Yup.number().required("mobile number is required"),
  });
  const initialValues = {
    name: inputs.name,
    email: inputs.email,
    // mobile:inputs.mobile
  };
  const formik = useFormik({
    initialValues,
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
        .post(process.env.REACT_APP_API_KEY + "edit-sub-admin/" + id, data, {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          setIsLoading(false);
          if (res.status === 200) {
            swal({
              title: "Success!",
              text: "Updated Successfully!",
              icon: "success",
              button: "Okay",
            });
            navigate("/sub-admin-list");
          }
        })
        .catch(function (error) {
          // console.log('>>>>>>>>>>>',error)
          setIsLoading(false);
          if (error.response.data.status === false) {
            swal("Oops", error.response.data.message, "error");
          }
        });
      console.log(JSON.stringify(data, null, 2));
      // console.log(data);
    },
  });

  if (!isLoadData) {
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
            <h1>Edit SubAdmin</h1>
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
                    Full Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    className="form-control"
                    id="inputEmail4"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    autoComplete="false"
                  />
                  <div className="text-danger">
                    {formik.errors.name && formik.touched.name
                      ? formik.errors.name
                      : null}
                  </div>
                </div>
                <div className="col-md-6">
                  <label htmlFor="inputEmail4" className="form-label">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    className="form-control"
                    id="inputEmail4"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    autoComplete="false"
                    disabled
                  />
                  <div className="text-danger">
                    {formik.errors.email && formik.touched.email
                      ? formik.errors.email
                      : null}
                  </div>
                </div>
                {/* <div className="col-md-4">
                  <label htmlFor="inputEmail4" className="form-label">
                    mobile Number
                  </label>
                  <input
                    name="mobile"
                    type="text"
                    className="form-control"
                    id="inputEmail4"
                    onChange={formik.handleChange}
                    value={formik.values.mobile}
                    autoComplete="false"
                  />
                  <div className="text-danger">
                    {formik.errors.mobile && formik.touched.mobile ? formik.errors.mobile : null}
                  </div>
                </div> */}

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

                  <Link className="btn btn-primary mx-3" to="/sub-admin-list">
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
export default EditSubAdmin;
