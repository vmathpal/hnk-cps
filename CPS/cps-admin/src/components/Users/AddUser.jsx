import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {TimeOutPopUp} from "../TimeOut";
import swal from "sweetalert";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import $ from "jquery";
function AddUser() {
  const token = localStorage.getItem("token");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dept, setDept] = useState("");
  const [rolemsg, setRoleMsg] = useState("");
  const [roleValue, setRoleValue] = useState({});
  const [roles, setUserRequest] = useState({});
  const navigate = useNavigate();
  const option_level2 = [];
  const option_level3 = [];
  const option_level4 = [];
  const option_level5 = [];
  const option_level6 = [];

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email is invalid"),
    name: Yup.string().required("UserID is required"),
    // .max("Name must not exceed 40 characters"),
    dept: Yup.string().required("Department is required"),
    level: Yup.string().required("Level is required"),
  });
  const formik = useFormik({
    initialValues: {
      email: "",
      name: "",
      dept: "",
      level: "",
      isGM: "no",
      role: "",
    },
    validationSchema,
    // validateOnChange: false,
    // validateOnBlur: false,
    onSubmit: async (data) => {
      console.log("token ::: ",localStorage.getItem("token"))
      if (! localStorage.getItem("token")) {
         TimeOutPopUp(navigate);
         return;
        }
      // console.log('input data',process.env.REACT_APP_API_KEY+"login")
      setIsLoading(true);
      await axios
        .post(process.env.REACT_APP_API_KEY + "register", data, {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            swal({
              title: "Wow!",
              text: "Created Successfully!",
              icon: "success",
              button: "Okay",
            });
            {
              localStorage.getItem("user_role") === "super_admin"
                ? navigate("/user-management")
                : navigate("/user-management/Modify");
            }
          }
          setIsLoading(false);
        })
        .catch(function (error) {
          if (error.response.status == 423) {
            setRoleMsg(error.response.data.message);
          } else {
            swal("Oops", error.response.data.message, "error");
          }
          setIsLoading(false);
        });
      console.log("8989",JSON.stringify(data, null, 2));
      // console.log(data);
    },
  });
  const radioHandler = (status) => {
    setStatus(status);
  };
  const departmentRadioHandler = async (dept) => {
    setDept(dept);
    $(".css-qc6sy-singleValue").html("");
    // setStatus('');
    setRoleValue({});
    await axios
      .get(process.env.REACT_APP_API_KEY + "level-based-role/" + dept)
      .then(function (response) {
        console.log(">>responsess", response.data, "Department", dept);
        setUserRequest((prevState) => ({
          ...prevState,
          level2: response.data.level2,
          level3: response.data.level3,
          level4: response.data.level4,
          level5: response.data.level5,
          level6: response.data.level6,
        }));
      })
      .catch(function (error) {
        console.log(error.response.data);
      });
  };
  if (roles.level2) {
    roles.level2.forEach((element) => {
      option_level2.push({ value: element.role.id, label: element.role.role });
    });
  }
  if (roles.level3) {
    roles.level3.forEach((element) => {
      option_level3.push({ value: element.role.id, label: element.role.role });
    });
  }
  if (roles.level4) {
    roles.level4.forEach((element) => {
      option_level4.push({ value: element.role.id, label: element.role.role });
    });
  }
  if (roles.level5) {
    roles.level5.forEach((element) => {
      option_level5.push({ value: element.role.id, label: element.role.role });
    });
  }
  if (roles.level6) {
    roles.level6.forEach((element) => {
      option_level6.push({ value: element.role.id, label: element.role.role });
    });
  }
  return (
    <>
      <div className="row">
        <div className="col">
          <div className="page-description">
            <h1>Add User</h1>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="example-container">
            <div className="example-content">
              <form className="row g-3" onSubmit={formik.handleSubmit}>
                <div className="custom-control col-md-12 ">
                  <label htmlFor="inputEmail4" className="form-label">
                    Choose Department
                  </label>
                  <div className="department">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="dept"
                        value="sales"
                        id="flexRadioDefault1"
                        onChange={formik.handleChange}
                        defaultChecked={formik.values.dept === "sales"}
                        onClick={(e) => departmentRadioHandler("sales")}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexRadioDefault1"
                      >
                        Sales
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="dept"
                        value="marketing"
                        id="flexRadioDefault2"
                        onChange={formik.handleChange}
                        defaultChecked={formik.values.dept === "marketing"}
                        onClick={(e) => departmentRadioHandler("marketing")}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexRadioDefault2"
                      >
                        Marketing
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="dept"
                        value="trade_marketing"
                        id="flexRadioDefault2"
                        onChange={formik.handleChange}
                        defaultChecked={
                          formik.values.dept === "trade_marketing"
                        }
                        onClick={(e) =>
                          departmentRadioHandler("trade_marketing")
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexRadioDefault2"
                      >
                        Trade Marketing
                      </label>
                    </div>
                  </div>
                  <div className="text-danger">
                    {formik.errors.dept && formik.touched.dept
                      ? formik.errors.dept
                      : null}
                  </div>
                </div>
                <div className="col-md-4">
                  <label htmlFor="inputEmail4" className="form-label">
                    LDAP UserId
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
                <div className="col-md-4">
                  <label htmlFor="inputEmail4" className="form-label">
                    Email ID
                  </label>
                  <input
                    name="email"
                    type="email"
                    className="form-control"
                    id="inputEmail4"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    autoComplete="false"
                  />
                  <div className="text-danger">
                    {formik.errors.email && formik.touched.email
                      ? formik.errors.email
                      : null}
                  </div>
                </div>
                <div className="custom-control col-md-12 ">
                  <label htmlFor="inputEmail4" className="form-label">
                    Choose Level
                  </label>
                  <div className="department">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="level"
                        value="level2"
                        id="flexRadioDefault1"
                        onChange={formik.handleChange}
                        defaultChecked={formik.values.level === "level2"}
                        onClick={(e) => radioHandler("level2")}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexRadioDefault1"
                      >
                        Level 2
                      </label>
                    </div>
                    <div className="form-check  mx-3">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="level"
                        value="level3"
                        id="flexRadioDefault2"
                        onChange={formik.handleChange}
                        defaultChecked={formik.values.level === "level3"}
                        onClick={(e) => radioHandler("level3")}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexRadioDefault2"
                      >
                        Level 3
                      </label>
                    </div>
                    <div className="form-check  mx-3">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="level"
                        value="level4"
                        id="flexRadioDefault2"
                        onChange={formik.handleChange}
                        defaultChecked={formik.values.level === "level4"}
                        onClick={(e) => radioHandler("level4")}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexRadioDefault2"
                      >
                        Level 4
                      </label>
                    </div>
                    <div className="form-check  mx-3">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="level"
                        value="level5"
                        id="flexRadioDefault2"
                        onChange={formik.handleChange}
                        defaultChecked={formik.values.level === "level5"}
                        onClick={(e) => radioHandler("level5")}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexRadioDefault2"
                      >
                        Level 5
                      </label>
                    </div>
                    <div className="form-check  mx-3">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="level"
                        value="level6"
                        id="flexRadioDefault2"
                        onChange={formik.handleChange}
                        defaultChecked={formik.values.level === "level6"}
                        onClick={(e) => radioHandler("level6")}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexRadioDefault2"
                      >
                        Level 6
                      </label>
                    </div>
                  </div>
                  <div className="text-danger">
                    {formik.errors.level && formik.touched.level
                      ? formik.errors.level
                      : null}
                  </div>
                </div>
                <div className="col-md-12">
                  {status === "level2" && (
                    <>
                      <label htmlFor="inputEmail4" className="form-label">
                        Choose Role
                      </label>
                      <div className="col-md-4">
                        <Select
                          name="role"
                          onChange={(selected) => {
                            formik.setFieldValue("role", selected.value);
                            setRoleMsg("");
                          }}
                          defaultValue={roleValue}
                          options={option_level2}
                          isSearchable={true}
                          isOptionDisabled={(option) => option.isdisabled}
                          noOptionsMessage={() => "No Record(s) Found"}
                        />
                      </div>
                      <div className="text-danger">
                        {rolemsg ? rolemsg : null}
                      </div>
                    </>
                  )}
                  {status === "level3" && (
                    <>
                      <label htmlFor="inputEmail4" className="form-label">
                        Choose Role
                      </label>
                      <div className="col-md-4">
                        <Select
                          name="role"
                          onChange={(selected) => {
                            formik.setFieldValue("role", selected.value);
                            setRoleMsg("");
                            setRoleValue(selected.value);
                          }}
                          defaultValue={roleValue}
                          options={option_level3}
                          isSearchable={true}
                          isOptionDisabled={(option) => option.isdisabled}
                          noOptionsMessage={() => "No Record(s) Found"}
                        />
                      </div>
                      <div className="text-danger">
                        {rolemsg ? rolemsg : null}
                      </div>
                    </>
                  )}
                  {status === "level4" && (
                    <>
                      <label htmlFor="inputEmail4" className="form-label">
                        Choose Role
                      </label>
                      <div className="col-md-4">
                        <Select
                          name="role"
                          onChange={(selected) => {
                            formik.setFieldValue("role", selected.value);
                            setRoleMsg("");
                          }}
                          options={option_level4}
                          isSearchable={true}
                          isOptionDisabled={(option) => option.isdisabled}
                          noOptionsMessage={() => "No Record(s) Found"}
                        />
                      </div>
                      <div className="text-danger">
                        {rolemsg ? rolemsg : null}
                      </div>
                    </>
                  )}
                  {status === "level5" && (
                    <>
                      <label htmlFor="inputEmail4" className="form-label">
                        Choose Role
                      </label>
                      <div className="col-md-4">
                        <Select
                          name="role"
                          onChange={(selected) => {
                            formik.setFieldValue("role", selected.value);
                            setRoleMsg("");
                          }}
                          options={option_level5}
                          isSearchable={true}
                          isOptionDisabled={(option) => option.isdisabled}
                          noOptionsMessage={() => "No Record(s) Found"}
                        />
                      </div>
                      <div className="text-danger">
                        {rolemsg ? rolemsg : null}
                      </div>
                    </>
                  )}
                  {status === "level6" && (
                    <>
                      <label htmlFor="inputEmail4" className="form-label">
                        Choose Role
                      </label>
                      <div className="col-md-4">
                        <Select
                          name="role"
                          onChange={(selected) => {
                            formik.setFieldValue("role", selected.value);
                            setRoleMsg("");
                          }}
                          options={option_level6}
                          isSearchable={true}
                          isOptionDisabled={(option) => option.isdisabled}
                          noOptionsMessage={() => "No Record(s) Found"}
                        />
                      </div>
                      <div className="text-danger">
                        {rolemsg ? rolemsg : null}
                      </div>
                    </>
                  )}
                </div>
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
                        ? "/user-management/Modify"
                        : "/user-management"
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

export default AddUser;
