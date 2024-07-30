import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation,useParams } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import Select from "react-select";
import {TimeOutPopUp} from "../TimeOut";
import { useFormik } from "formik";
import * as Yup from "yup";
import LoadingSpinner from "../Loader/LoadingSpinner";
function EditBaUser() {
  const {
    state: { id },
  } ={state:useParams()};
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadData, setIsLoadData] = useState(false);
  const [selectedlevel, setSelectedLevel] = useState("");
  const [levels, setLevels] = useState([]);
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();
  const data = [];

  useEffect(() => {
    getLevels();
    fetchUser();
  }, []);
  const fetchUser = () => {
    axios
      .get(process.env.REACT_APP_API_KEY + "singleBaUser/" + id, {
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setInputs({
          name: res.data.data.name,
          email: res.data.data.email,
          value: res.data.data.BusinessAnalyst.id,
          label: res.data.data.BusinessAnalyst.name,
          role: res.data.data.BusinessAnalyst.id,
          oldRole: res.data.data.BusinessAnalyst.id,
          currentUserID: res.data.data.id,
        });
        res.data ? setIsLoadData(true) : setIsLoadData(false);
        console.log("inputs", inputs);
      })

      .catch((error) => {
        console.log("error>>", error.message);
      });
  };
  const getLevels = async () => {
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
    baID: inputs.value,
    oldRole: inputs.oldRole,
    name: inputs.name,
    email: inputs.email,
    hiddenValue: inputs.name,
    role: inputs.role,
    currentUserID: inputs.currentUserID,
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
        .post(process.env.REACT_APP_API_KEY + "edit-ba-user/" + id, data, {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
          params: {
            userType: "BA",
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
            <h1>Edit BA User</h1>
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
                    name="baID"
                    defaultValue={{
                      label: inputs.label,
                      value: inputs.value,
                    }}
                    onChange={(selected) => {
                      formik.setFieldValue("baID", selected.value);
                      formik.setFieldValue("role", selected.value);
                    }}
                    options={data}
                    isSearchable={true}
                    isOptionDisabled={(option) => option.isdisabled}
                    noOptionsMessage={() => "No Record(s) Found"}
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
                    defaultValue={inputs.name}
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

export default EditBaUser;
