import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation,useParams } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { useFormik } from "formik";
import {TimeOutPopUp} from "../../TimeOut";
import Select from "react-select";
import * as Yup from "yup";
import LoadingSpinner from "../../Loader/LoadingSpinner";
function EditSKU() {
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
    getLevels();
  }, []);
  const getLevels = async () => {
    await axios
      .get(process.env.REACT_APP_API_KEY + "get-brands-list", {
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        setLevels(response.data.data);
      })
      .catch(function (error) {
        console.log(">>>>>>>>>>>error", error);
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
  const fetchBrand = async () => {
    await axios
      .get(process.env.REACT_APP_API_KEY + "singleSKU/" + id, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(">>>>data>>", res.data.data);
        setInputs({
          name: res.data.data.name,
          value: res.data.data.Brand.id,
          label: res.data.data.Brand.name,
          valueLine: res.data.data.lineExtension.id,
          labelLine: res.data.data.lineExtension.name,
        });
        res.data ? setIsLoadData(true) : setIsLoadData(false);
      })
      .catch((error) => {
        console.log("error>>", error.message);
      });
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("PackSize name is required")
      .min(3, "Minimum 3 Character")
      .max(300, "PackSize name must not exceed 300 characters"),
    brandID: Yup.string().required("Brand is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: inputs.name,
      lineExtID: inputs.valueLine,
      brandID: inputs.value,
      hidden_value: inputs.name,
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
        .post(process.env.REACT_APP_API_KEY + "update-sku/" + id, data, {
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
                ? navigate("/sku-management")
                : navigate("/sku-management/Modify");
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
            <h1>Edit Pack Size</h1>
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

                <div className="col-md-6">
                  <label htmlFor="inputEmail4" className="form-label">
                    Select lineExtension
                  </label>

                  <Select
                    defaultValue={{
                      label: inputs.labelLine,
                      value: inputs.valueLine,
                    }}
                    name="lineExtID"
                    onChange={(selected) => {
                      formik.setFieldValue("lineExtID", selected.value);
                    }}
                    options={data}
                    isSearchable={true}
                    isDisabled={true}
                    noOptionsMessage={() => "No Record(s) Found"}
                  />

                  <div className="text-danger">
                    {formik.errors.lineExtID && formik.touched.lineExtID
                      ? formik.errors.lineExtID
                      : null}
                  </div>
                </div>

                <div className="col-md-6">
                  <label htmlFor="inputEmail4" className="form-label">
                    SKU Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    className="form-control"
                    id="inputEmail4"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    autoComplete="false"
                    placeholder="Enter PackSize Name"
                  />
                  {/* <i className="fa fa-plus-circle" aria-hidden="true"></i> */}
                  <div className="text-danger">
                    {formik.errors.name && formik.touched.name
                      ? formik.errors.name
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
                        ? "/sku-management/Modify"
                        : "/sku-management"
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

export default EditSKU;
