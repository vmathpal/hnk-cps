import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation,useParams } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import {TimeOutPopUp} from "../TimeOut";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import LoadingSpinner from "../Loader/LoadingSpinner";
function EditCostCenterOwner() {
  const {
    state: { id },
  } ={state:useParams()};
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [isLoadData, setIsLoadData] = useState(false);
  const [selectedlevel, setSelectedLevel] = useState("");
  const [levels, setLevels] = useState([]);
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const data = [];
  const options = [];
  useEffect(() => {
    getLevels();
    fetchUser();
    getUsers();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      getCostCenterDepartment(inputs.costValue);
    }, 1000);

    return () => clearTimeout(delay);
  }, [inputs.costValue]);

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
  const fetchUser = async () => {
    setIsLoading(true);
    await axios
      .get(process.env.REACT_APP_API_KEY + "single-cost-center-user/" + id, {
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log("single-cost-center-user", res.data.data);
        setInputs({
          costValue: res.data.data.CostCenter.id,
          costLabel: res.data.data.CostCenter.name,
          userValue: res.data.data.User.id,
          userLabel: res.data.data.User.email,
        });

        setIsLoading(false);
      })

      .catch((error) => {
        console.log("error>>", error.message);
        setIsLoading(false);
      });
  };
  const getLevels = async () => {
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
    centerID: Yup.string().required("Cost center is required"),
    userID: Yup.string().required("UserID is required"),
  });
  const initialValues = {
    centerID: inputs.costValue,
    userID: inputs.userValue,
    oldCostCenterID: inputs.costValue,
    oldUserID: inputs.userValue,
  };
  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
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
        .post(process.env.REACT_APP_API_KEY + "update-cost-user/" + id, data, {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${token}`,
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
            <h1>Edit</h1>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="example-container">
            <div className="example-content">
              <form className="row g-3" onSubmit={formik.handleSubmit}>
                <div className="col-md-5">
                  <label htmlFor="inputEmail4" className="form-label">
                    Select Cost Center
                  </label>

                  <Select
                    name="centerID"
                    defaultValue={{
                      label: inputs.costLabel,
                      value: inputs.costValue,
                    }}
                    onChange={(selected) => {
                      formik.setFieldValue("centerID", selected.value);
                      getCostCenterDepartment(selected.value);
                    }}
                    options={data}
                    isSearchable={true}
                    isOptionDisabled={(option) => option.isdisabled}
                    noOptionsMessage={() => "No Record(s) Found"}
                  />

                  <div className="text-danger">
                    {formik.errors.centerID && formik.touched.centerID
                      ? formik.errors.centerID
                      : null}
                  </div>
                </div>

                {/* <div className="col-md-6">
                  <label htmlFor="inputEmail4" className="form-label">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    className="form-control"
                    id="inputEmail4"
                    onChange={formik.handleChange}
                    defaultValue={inputs.userLabel}
                    autoComplete="false"
                  />
                  <div className="text-danger">
                    {formik.errors.email && formik.touched.email
                      ? formik.errors.email
                      : null}
                  </div>
                </div> */}
                {/* <label htmlFor="inputEmail4" className="form-label mt-3">
                  Select User Email
                </label> */}
                <div className="col-md-5">
                  <label htmlFor="inputEmail4" className="form-label">
                    Select User Email
                  </label>
                  <Select
                    name="userID"
                    onChange={(selected) => {
                      formik.setFieldValue("userID", selected.value);
                    }}
                    defaultValue={{
                      label: inputs.userLabel,
                      value: inputs.userValue,
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

                <input type="hidden" value="Add" name="hidden_value" />
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

export default EditCostCenterOwner;
