import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation ,useParams} from "react-router-dom";
import axios from "axios";
import {TimeOutPopUp} from "../../TimeOut";
import swal from "sweetalert";
import { useFormik } from "formik";
import Select from "react-select";
import * as Yup from "yup";
import LoadingSpinner from "../../Loader/LoadingSpinner";
function EditLineExtension() {
  const {
    state: { id },
  } = {state:useParams()};
  const data = [];
  const [inputs, setInputs] = useState({});
  const [isLoadData, setIsLoadData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [levels, setLevels] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetchBrand();
    BrandList();
  }, []);
  const BrandList = async () => {
    setIsLoading(true);
    await axios
      .get(process.env.REACT_APP_API_KEY + "get-brands-list", {
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        setLevels(response.data.data);
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(">>>>>>>>>>>error", error);
        setIsLoading(false);
      });
  };

  if (levels) {
    levels.forEach((element) => {
      data.push({
        value: element.id,
        label: element.name,
      });
    });
  }
  const fetchBrand = () => {
    setIsLoading(true);
    axios
      .get(process.env.REACT_APP_API_KEY + "singleLineExtension/" + id, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(">>>>data", res.data.data);
        setInputs({
          lineExtension: res.data.data.name,
          lineExtCode: res.data.data.lineExtCode,
          value: res.data.data.Brand.id,
          label: res.data.data.Brand.name,
        });
        res.data ? setIsLoadData(true) : setIsLoadData(false);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("error>>", error.message);
        setIsLoading(false);
      });
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Line Extension name is required")
      .min(3, "Minimum 3 Character")
      .max(40, "Line Extension name must not exceed 40 characters"),
    brandID: Yup.string().required("Brand is required"),
    lineExtCode: Yup.string()
      .required("Line Extension Code is required")
      .min(3, "Minimum 3 Character")
      .max(40, "Line Extension Code must not exceed 40 characters"),
  });

  const formik = useFormik({
    initialValues: {
      name: inputs.lineExtension,
      lineExtCode: inputs.lineExtCode,
      brandID: inputs.value,
      hidden_value: inputs.lineExtension,
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
      await axios
        .post(
          process.env.REACT_APP_API_KEY + "update-line-extension/" + id,
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
              text: "Updated Successfully!",
              icon: "success",
              button: "Okay",
            });
            setIsLoading(false);
            {
              localStorage.getItem("user_role") === "super_admin"
                ? navigate("/line-extension-management")
                : navigate("/line-extension-management/Modify");
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
            <h1>Edit Line Extension</h1>
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
                    Select Brand
                  </label>

                  <Select
                    defaultValue={{
                      label: inputs.label,
                      value: inputs.value,
                    }}
                    name="brandID"
                    onChange={(selected) => {
                      formik.setFieldValue("brandID", selected.value);
                    }}
                    options={data}
                    isSearchable={true}
                    isDisabled={true}
                    noOptionsMessage={() => "No Record(s) Found"}
                  />

                  <div className="text-danger">
                    {formik.errors.brandID && formik.touched.brandID
                      ? formik.errors.brandID
                      : null}
                  </div>
                </div>
                <div className="col-md-4">
                  <label htmlFor="inputEmail4" className="form-label">
                    Line Extension Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    className="form-control"
                    id="inputEmail4"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    autoComplete="false"
                    placeholder="Enter PackType Name"
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
                    Line Extension Code
                  </label>
                  <input
                    name="lineExtCode"
                    type="text"
                    className="form-control"
                    id="inputEmail4"
                    onChange={formik.handleChange}
                    value={formik.values.lineExtCode}
                    autoComplete="false"
                    placeholder="Enter line Ext Code"
                  />
                  {/* <i className="fa fa-plus-circle" aria-hidden="true"></i> */}
                  <div className="text-danger">
                    {formik.errors.lineExtCode && formik.touched.lineExtCode
                      ? formik.errors.lineExtCode
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
                        ? "/line-extension-management/Modify"
                        : "/line-extension-management"
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

export default EditLineExtension;
