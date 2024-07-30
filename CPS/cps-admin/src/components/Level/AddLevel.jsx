import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { useFormik } from "formik";
import * as Yup from "yup";
function AddLevel() {
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
   
    level: Yup.string()
      .required("level is required")
      // .min(6, "Minimum 6 Character")
      .max(9, "level must not exceed 9 characters")
      .matches(/^Level\b \d+$/, "Invalid name must be like Level 7"),
  });

  const formik = useFormik({
    initialValues: {
      level: "",
    },

    validationSchema,
    validateOnChange: true,
    // validateOnBlur: false,
    onSubmit: async (data) => {
      setIsLoading(true);
      await axios
        .post(process.env.REACT_APP_API_KEY + "add-level", data, {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        .then((res) => {
          if (res.status === 200) {
            swal({
              title: "Success!",
              text: "Level Create Successfully!",
              icon: "success",
              button: "Okay",
            }).then(function() {
            navigate("/level-management");
            });
            setIsLoading(false);
            
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
            <h1>Create Level</h1>
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
                    Level
                  </label>
                  <input
                    name="level"
                    type="text"
                    className="form-control"
                    id="inputEmail4"
                    onChange={formik.handleChange}
                    value={formik.values.level}
                    autoComplete="false"
                    placeholder="Eg. Level 7"
                  />
                  {/* <i className="fa fa-plus-circle" aria-hidden="true"></i> */}
                  <div className="text-danger">
                    {formik.errors.level ? formik.errors.level : null}
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

                  <Link className="btn btn-primary mx-3" to="/level-management">
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

export default AddLevel;
