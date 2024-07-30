import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import Select from "react-select";
import { useFormik } from "formik";
import {TimeOutPopUp} from "../TimeOut";


import * as Yup from "yup";
function AddCostCenterOwner() {
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedlevel, setSelectedLevel] = useState("");
  const [levels, setLevels] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);
  const navigate = useNavigate();
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const options = [];
  const data = [];

  useEffect(() => {
    getCostCenter();
    getUsers();
  }, []);

  const getUsers = async () => {
    await axios
      .get(process.env.REACT_APP_API_KEY + "user-list-for-cost", {
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        setRoles(response.data.data);
      })
      .catch(function (error) {
        console.log(">>>>>>>>>>>error", error);
      });
  };

  if (roles) {
    roles.forEach((element) => {
      options.push({ value: element.id, label: element.email });
    });
  }
  const getCostCenter = async () => {
    await axios
      .get(process.env.REACT_APP_API_KEY + "cost-center-management", {
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${token}`,
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

  const getCostCenterDepartment = async (id) => {
    await axios
      .get(process.env.REACT_APP_API_KEY + "get-cost-center-department/" + id, {
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        localStorage.setItem("costDepartment", response.data.data.department);
        setSelectedDepartment(response.data.data.department);
      })
      .catch(function (error) {
        console.log(">>>>>>>>>>>error", error);
      });
  };

  const validationSchema = Yup.object().shape({
    centerID: Yup.string().required("Cost Center is required"),
    userID: Yup.string().required("User Email is required"),
  });
  const initialValues = {
    centerID: "",
    userID: "",
    hidden_value: "Add",
  };
  const formik = useFormik({
    initialValues,
    validationSchema,
    //enableReinitialize: true,
    validateOnChange: true,
    // validateOnBlur: false,
    onSubmit: async (data) => {
      if (! localStorage.getItem("token")) {
                TimeOutPopUp(navigate);
                return;
              }
      data.department = localStorage.getItem("costDepartment");
      setIsLoading(true);

      await axios
        .post(process.env.REACT_APP_API_KEY + "add-cost-owner", data, {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        .then((res) => {
          if (res.status === 200) {
            swal({
              title: "Success!",
              text: "Create Successfully!",
              icon: "success",
              button: "Okay",
            });
            setIsLoading(false);
            {
              localStorage.getItem("user_role") === "super_admin"
                ? navigate("/cost-owner-management")
                : navigate("/cost-owner-management/Modify");
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
            <h1>Create Owner</h1>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="example-container">
            <div className="example-content">
              <form className="row g-3" onSubmit={formik.handleSubmit}>
                <div className="container">
                  <label htmlFor="inputEmail4" className="form-label">
                    Select Cost Center
                  </label>
                  <div className="col-md-6">
                    <Select
                      name="centerID"
                      onChange={(selected) => {
                        formik.setFieldValue("centerID", selected.value);
                        getCostCenterDepartment(selected.value);
                      }}
                      options={data}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      isSearchable={true}
                      noOptionsMessage={() => "No Record(s) Found"}
                    />
                  </div>
                  <div className="text-danger">
                    {formik.errors.centerID && formik.touched.centerID
                      ? formik.errors.centerID
                      : null}
                  </div>
                  <label htmlFor="inputEmail4" className="form-label mt-3">
                    Select User Email
                  </label>
                  <div className="col-md-6">
                    <Select
                      name="userID"
                      onChange={(selected) => {
                        formik.setFieldValue("userID", selected.value);
                      }}
                      options={options}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      isSearchable={true}
                      noOptionsMessage={() => "No Record(s) Found"}
                    />
                    {/* {selectedValue && (
                      <div style={{ marginTop: 20, lineHeight: "25px" }}>
                        <div>
                          <b>Selected Value: </b>{" "}
                          {JSON.stringify(selectedValue, null, 2)}
                        </div>
                      </div>
                    )} */}
                    <div className="text-danger">
                      {formik.errors.userID && formik.touched.userID
                        ? formik.errors.userID
                        : null}
                    </div>
                  </div>
                </div>
                <input type="hidden" value="Add" name="hidden_value" />
                <div className="col-12">
                  <button type="submit" className="btn btn-primary">
                    {isLoading ? (
                      <>
                        <i className="fa fa-refresh fa-spin"></i>Loading
                      </>
                    ) : (
                      "Save"
                    )}
                  </button>

                  <Link
                    className="btn btn-primary mx-3"
                    to={
                      localStorage.getItem("user_role") === "sub_admin"
                        ? "/cost-owner-management/Modify"
                        : "/cost-owner-management"
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

export default AddCostCenterOwner;
