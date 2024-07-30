import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { useFormik } from "formik";
import * as Yup from "yup";
import { NavLink } from "react-router-dom";
import BrandSampleFile from "../../../../Assests/images/BrandSampleFile.xlsx";
function BrandSkuImport() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const FILE_SIZE = 16000 * 1024;
  // const SUPPORTED_FORMATS = [
  //   "image/jpg",
  //   "image/jpeg",
  //   "image/gif",
  //   "image/png",
  // ];
  const validationSchema = Yup.object().shape({
    file: Yup.mixed()
      .required("A file is required")
      .test(
        "fileSize",
        "File too large",
        (value) => value && value.size <= FILE_SIZE
      ),
    // .test(
    //   "fileFormat",
    //   "Unsupported Format",
    //   (value) => value && SUPPORTED_FORMATS.includes(value.type)
    // ),
  });
  const formik = useFormik({
    initialValues: {
      file: "",
    },

    validationSchema,
    // enableReinitialize: true,
    validateOnChange: true,
    // validateOnBlur: false,
    onSubmit: async (data) => {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", formik.values.file);

      await axios
        .post(
          process.env.REACT_APP_API_KEY + "import-expence-excel/",

          formData,
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
              text: "Upload Successfully!",
              icon: "success",
              button: "Okay",
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
      <form className="row g-3" onSubmit={formik.handleSubmit}>
        <div className="col-md-12">
          &nbsp;
          {/* <NavLink
            className="btn btn-info"
            to={BrandSampleFile}
            target="_blank"
            download
          >
            Sample File
          </NavLink> */}
          <input
            type="file"
            className="btn"
            name="file"
            onChange={(event) => {
              formik.setFieldValue("file", event.currentTarget.files[0]);
            }}
          />
          <button type="submit" className="btn btn-primary">
            {isLoading ? (
              <>
                <i className="fa fa-refresh fa-spin"></i>Uploading
              </>
            ) : (
              "Upload"
            )}
          </button>
          <span className="text-danger">
            {formik.errors.file && formik.touched.file
              ? formik.errors.file
              : null}
          </span>
        </div>
      </form>
    </>
  );
}
export default BrandSkuImport;
