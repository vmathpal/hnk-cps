import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link,useParams } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import $ from "jquery";
import {TimeOutPopUp} from "../TimeOut";
import LoadingSpinner from "../Loader/LoadingSpinner";
function EditUser() {
  const token = localStorage.getItem("token");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dept, setDept] = useState("");
  const [isLoadData, setIsLoadData] = useState(false);
  const [inputs, setInputs] = useState({});
  const [roleId, setRoleId] = useState("");
  const [roleName, setRoleName] = useState("");
  const [rolemsg, setRoleMsg] = useState("");
  const [roles, setUserRequest] = useState({});
  const navigate = useNavigate();
  const option_level2 = [];
  const option_level3 = [];
  const option_level4 = [];
  const option_level5 = [];
  const option_level6 = [];
  // const {
  //   state: { UserId },
  // } = useLocation();

const editData = useParams();
const {
  state: { UserId },
} = {state : useParams()}

  const fetchUser = async () => {
    await axios
      .get(process.env.REACT_APP_API_KEY + "singleUser/" + UserId, {
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        res.data ? setIsLoadData(true) : setIsLoadData(false);

        setInputs({
          name: res.data.name,
          email: res.data.email,
          //  phone: res.data.mobile,
          department: res.data.department,
          level: res.data.level,
          dept_roleId: res.data.dept_roleId,
          userId: res.data.id,
        });
        setDept(res.data.department);
        setStatus(res.data.level);
        setRoleId(res.data.dept_roleId);
        setRoleName(res.data.roleName.role);

        axios
          .get(
            process.env.REACT_APP_API_KEY +
              "level-based-role/" +
              res.data.department
          )
          .then(function (response) {
            console.log("level role", response.data);
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
            setIsLoading(false);
            console.log(error.response.data);
          });
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("error>>", error.message);
      });
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email is invalid"),
    name: Yup.string().required("UserID is required"),
    // .max("Name must not exceed 40 characters"),
    //phone: Yup.number().required("Phone number is required"),
    department: Yup.string().required("Department is required"),
    level: Yup.string().required("Level is required"),
    // role:Yup.array().min(1).of(Yup.string().trim().required())
  });

  const initialValues = {
    email: inputs.email,
    name: inputs.name,
    // phone: inputs.phone,
    department: inputs.department,
    level: inputs.level,
    role: inputs.dept_roleId,
    hiddenValue: inputs.name,
    oldRole: inputs.dept_roleId,
    currentUserID: inputs.userId,
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
        .post(process.env.REACT_APP_API_KEY + "edit-user/" + UserId, data, {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
          params: {
            userType: "NotBA",
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
            {
              localStorage.getItem("user_role") === "super_admin"
                ? navigate("/user-management")
                : navigate("/user-management/Modify");
            }
          }
        })
        .catch(function (error) {
          // console.log('>>>>>>>>>>>',error)
          setIsLoading(false);
          if (error.response.status == 423) {
            setRoleMsg(error.response.data.message);
          }

          if (error.response.data.status === false) {
            swal("Oops", error.response.data.message, "error");
          }
        });
      console.log(JSON.stringify(data, null, 2));
      // console.log(data);
    },
  });
  const radioHandler = (status) => {
    setRoleName("");
    setRoleId("");
    setStatus(status);
  };
  const departmentRadioHandler = async (dept) => {
    setDept(dept);
    setRoleName("");
    setRoleId("");
    $(".css-qc6sy-singleValue").html("");
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
  useEffect(() => {
    fetchUser();
    document.body.className = "pace-done no-loader users";
    return () => {
      document.body.className = "pace-done no-loader";
    };
  }, []);

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
            <h1>Edit User</h1>
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
                        name="department"
                        value="sales"
                        id="flexRadioDefault1"
                        onChange={formik.handleChange}
                        checked={dept === "sales"}
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
                        name="department"
                        value="marketing"
                        id="flexRadioDefault2"
                        onChange={formik.handleChange}
                        checked={dept === "marketing"}
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
                        name="department"
                        value="trade_marketing"
                        id="flexRadioDefault2"
                        onChange={formik.handleChange}
                        checked={dept === "trade_marketing"}
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
                    {formik.errors.department && formik.touched.department
                      ? formik.errors.department
                      : null}
                  </div>
                </div>
                <div className="col-md-6">
                  <label htmlFor="inputEmail4" className="form-label">
                    LDAP UserID
                  </label>
                  <input
                    name="name"
                    type="text"
                    className="form-control"
                    id="inputEmail4"
                    onChange={formik.handleChange}
                    defaultValue={inputs.name}
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
                    defaultValue={inputs.email}
                    autoComplete="false"
                    disabled
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
                        checked={status === "level2"}
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
                        checked={status === "level3"}
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
                        checked={status === "level4"}
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
                        checked={status === "level5"}
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
                        checked={status === "level6"}
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
                          value={option_level2.value}
                          options={option_level2}
                          defaultValue={{
                            label: roleName,
                            value: roleId,
                          }}
                          onChange={(selected) => {
                            formik.setFieldValue("role", selected.value);
                            setRoleMsg("");
                          }}
                          isSearchable={true}
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
                          value={option_level3.value}
                          options={option_level3}
                          defaultValue={{
                            label: roleName,
                            value: roleId,
                          }}
                          onChange={(selected) => {
                            formik.setFieldValue("role", selected.value);
                            setRoleMsg("");
                          }}
                          isSearchable={true}
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
                          value={option_level4.value}
                          options={option_level4}
                          defaultValue={{
                            label: roleName,
                            value: roleId,
                          }}
                          onChange={(selected) => {
                            formik.setFieldValue("role", selected.value);
                            setRoleMsg("");
                          }}
                          isSearchable={true}
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
                          value={option_level5.value}
                          options={option_level5}
                          defaultValue={{
                            label: roleName,
                            value: roleId,
                          }}
                          onChange={(selected) => {
                            formik.setFieldValue("role", selected.value);
                            setRoleMsg("");
                          }}
                          isSearchable={true}
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
                          value={option_level6.value}
                          options={option_level6}
                          defaultValue={{
                            label: roleName,
                            value: roleId,
                          }}
                          onChange={(selected) => {
                            formik.setFieldValue("role", selected.value);
                            setRoleMsg("");
                          }}
                          isSearchable={true}
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
                      "Update"
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

export default EditUser;
