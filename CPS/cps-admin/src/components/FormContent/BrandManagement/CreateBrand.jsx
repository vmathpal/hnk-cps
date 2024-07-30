import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { useFormik } from "formik";
import {TimeOutPopUp} from "../../TimeOut";


import * as Yup from "yup";
function CreateBrand() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  // const FILE_SIZE = 16000 * 1024;
  // const SUPPORTED_FORMATS = [
  //   "image/jpg",
  //   "image/jpeg",
  //   "image/gif",
  //   "image/png",
  // ];
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Brand name is required")
      .min(3, "Minimum 3 Character")
      .max(30, "Brand must not exceed 30 characters"),
    brandCode: Yup.string()
      .required("Brand code is required")
      .min(3, "Minimum 3 Character")
      .max(15, "Center code must not exceed 10 characters"),
    // image: Yup.mixed()
    //   .required("A file is required")
    //   .test(
    //     "fileSize",
    //     "File too large",
    //     (value) => value && value.size <= FILE_SIZE
    //   )
    //   .test(
    //     "fileFormat",
    //     "Unsupported Format",
    //     (value) => value && SUPPORTED_FORMATS.includes(value.type)
    //   ),
  });
  const formik = useFormik({
    initialValues: {
      name: "",
      brandCode: "",
      // image: "",
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
      console.log(data);
      // const formData = new FormData();
      // formData.append("brandCode", formik.values.brandCode);
      // formData.append("name", formik.values.name);
      await axios
        .post(process.env.REACT_APP_API_KEY + "add-brand", data, {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            swal({
              title: "Success!",
              text: "Brand Created Successfully!",
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

  // const GenerateCode = () => {
  //   var text = "";
  //   var possible = "ABCDEFGHIJKLMNPQRSTUVWXYZ";
  //   var number = "123456789";

  //   for (var i = 0; i < 4; i++)
  //     text += possible.charAt(Math.floor(Math.random() * possible.length));
  //   for (var j = 0; j < 1; j++)
  //     text += number.charAt(Math.floor(Math.random() * number.length));
  //   $("#promocode").val("BCODE" + text);
  //   formik.values.brandCode = "BCODE" + text;
  // };

  return (
    <>
      <div className="row">
        <div className="col">
          <div className="page-description">
            <h1>Create Brand</h1>
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
                    Brand Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    className="form-control"
                    id="inputEmail4"
                    onChange={formik.handleChange}
                    defualtValue={formik.values.name}
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
                <div className="col-md-6">
                  <label htmlFor="inputEmail4" className="form-label">
                    Brand Code
                  </label>
                  <input
                    name="brandCode"
                    type="text"
                    className="form-control"
                    id="inputEmail4"
                    onChange={formik.handleChange}
                    defualtValue={formik.values.brandCode}
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
                {/* <div className="col-md-6">
                  <label htmlFor="inputEmail4" className="form-label">
                    Brand Image
                  </label>
                  <div className="captcha-generate-wrapper">
                    <input
                      name="image"
                      type="file"
                      className="form-control"
                      onChange={(event) => {
                        formik.setFieldValue(
                          "image",
                          event.currentTarget.files[0]
                        );
                      }}
                      // value={formik.values.image}
                      // autoComplete="false"
                    />
                  </div>
                  <div className="text-danger">
                    {formik.errors.image && formik.touched.image
                      ? formik.errors.image
                      : null}
                  </div>
                </div> */}

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
export default CreateBrand;
