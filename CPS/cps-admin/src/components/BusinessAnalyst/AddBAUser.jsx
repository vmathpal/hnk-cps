import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import Select from "react-select";
import { useFormik } from "formik";
import {TimeOutPopUp} from "../TimeOut";


import * as Yup from "yup";
function AddBAUser() {
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedlevel, setSelectedLevel] = useState("");
  const [department, setDepartment] = useState("");
  const [selectedchannel, setSelectedChannel] = useState("");
  const [levels, setLevels] = useState([]);
  const [channels, setChannels] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);
  const navigate = useNavigate();

  const options = [];
  const data = [];

  useEffect(() => {
    getBaRoles();
  }, []);

  const getDepartment = async (id) => {
    await axios
      .get(process.env.REACT_APP_API_KEY + "get-ba-department/" + id, {
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        setDepartment(response.data.data.department);
      })
      .catch(function (error) {
        console.log(">>>>>>>>>>>error", error);
      });
  };

  const getBaRoles = async () => {
    await axios
      .get(process.env.REACT_APP_API_KEY + "getActiveBARoles", {
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

  const validationSchema = Yup.object().shape({
    baID: Yup.string().required("Role is required"),
    name: Yup.string().required("UserID is required"),
    email: Yup.string().required("Email is required").email("Email is invalid"),
  });
  const initialValues = {
    baID: selectedlevel,

    name: "",
    email: "",
    department: department,
    hidden_value: "Add",
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
      setIsLoading(true);
      await axios
        .post(process.env.REACT_APP_API_KEY + "add-ba-user", data, {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        .then((res) => {
          if (res.status === 200) {
            swal({
              title: "Success!",
              text: "Tag Role Successfully!",
              icon: "success",
              button: "Okay",
            });
            setIsLoading(false);
            {
              localStorage.getItem("user_role") === "super_admin"
                ? navigate("/business-analyst-management")
                : navigate("/business-analyst-management/Modify");
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
  // handle onChange event of the dropdown
  // const handleChange = (e) => {
  //   setSelectedValue(Array.isArray(e) ? e.map((x) => x.value) : []);
  // };
  const levelHandleChange = (e) => {
    setSelectedLevel(e.value);
    getDepartment(e.value);
  };
  const channelHandleChange = (e) => {
    setSelectedChannel(e.value);
  };
  return (
    <>
      <div className="row">
        <div className="col">
          <div className="page-description">
            <h1>Add BA User</h1>
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
                    Select Role
                  </label>

                  <Select
                    defaultValue={selectedlevel}
                    onChange={levelHandleChange}
                    name="baID"
                    options={data}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    isOptionDisabled={(option) => option.isdisabled}
                  />

                  <div className="text-danger">
                    {formik.errors.baID && formik.touched.baID
                      ? formik.errors.baID
                      : null}
                  </div>
                </div>

                <div className="col-md-4">
                  <label htmlFor="inputEmail4" className="form-label">
                    LDAP UserID
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
                  />
                  <div className="text-danger">
                    {formik.errors.email && formik.touched.email
                      ? formik.errors.email
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
                      "Save"
                    )}
                  </button>

                  <Link
                    className="btn btn-primary mx-3"
                    to={
                      localStorage.getItem("user_role") === "sub_admin"
                        ? "/business-analyst-management/Modify"
                        : "/business-analyst-management"
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

export default AddBAUser;
