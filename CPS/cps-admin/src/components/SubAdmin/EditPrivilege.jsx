import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import LoadingSpinner from "../Loader/LoadingSpinner";
function EditPrivilege() {
  const {
    state: { id },
  } = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadData, setIsLoadData] = useState(false);
  const [roles, setRoles] = useState([]);
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();
  const options = [];

  const data = [
    { value: "Modify", label: "Modify" },
    { value: "View", label: "View" },
  ];

  useEffect(() => {
    // var lastProjectID = lastProjectID;
    // console.log(lastProjectID, ">>>>>");
    const timer = setTimeout(() => {
      fetchPrivilegeRole();
      getRoles();
    }, 1000);
  }, []);
  const fetchPrivilegeRole = async () => {
    await axios
      .get(process.env.REACT_APP_API_KEY + "single-privilege-role/" + id, {
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        res.data ? setIsLoadData(true) : setIsLoadData(false);
        setInputs({
          actions: res.data.actions,
          permissionId: res.data.permission["id"],
          permissionValue: res.data.permission["name"],
        });
        console.log("Response>>>>>", res.data, "<>", inputs.actions);
      })
      .catch((error) => {
        console.log("error>>", error.message);
      });
  };
  const { actions, permissionValue, permissionId } = inputs;

  const getRoles = async () => {
    await axios
      .get(process.env.REACT_APP_API_KEY + "get-all-list", {
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          userRole: localStorage.getItem("user_role"),
          userID: localStorage.getItem("userID"),
        },
      })
      .then(function (response) {
        response.data ? setIsLoadData(true) : setIsLoadData(false);
        setRoles(response.data.data);
        setIsLoading(false);
      })

      .catch(function (error) {
        console.log(">>>>>>>>>>>error", error);
      });
  };

  if (roles) {
    roles.forEach((element) => {
      options.push({ value: element.id, label: element.name });
    });
  }

  const validationSchema = Yup.object().shape({
    // level: Yup.string().required("level is required"),
    // role: Yup.array().min(1).of(Yup.string().trim().required())
  });
  const initialValues = {
    actions: actions,
    permissionId: permissionId,
    // hidden_value:roleId,
  };
  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    //validateOnChange: true,
    // validateOnBlur: false,
    onSubmit: async (data) => {
      console.log("<><><>", initialValues);
      setIsLoading(true);
      await axios
        .post(process.env.REACT_APP_API_KEY + "edit-privilege/" + id, data, {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
            navigate("/sub-admin-list");
          }
        })
        .catch((error) => {
          if (error.response.status === 422) {
            swal("Oops", error.response.data.message, "error");
          }
          setIsLoading(false);
        });
      console.log(JSON.stringify(data, null, 2));
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
            <h1>Edit Privilege</h1>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="example-container">
            <div className="example-content">
              <form className="row g-3" onSubmit={formik.handleSubmit}>
                <div className="container">
                  <label htmlFor="inputEmail4" className="form-label mt-3">
                    Select Dashboard Action
                  </label>
                  <div className="col-md-6">
                    <Select
                      name="permissionId"
                      value={{
                        label: permissionValue,
                        value: permissionId,
                      }}
                      onChange={(selected) => {
                        formik.setFieldValue("permissionId", selected.value);
                        console.log(">>>>", selected.label);
                      }}
                      options={options}
                      isSearchable={true}
                      isDisabled={true}
                      noOptionsMessage={() => "No Record(s) Found"}
                    />

                    <div className="text-danger">
                      {formik.errors.permissionId && formik.touched.permissionId
                        ? formik.errors.permissionId
                        : null}
                    </div>
                  </div>
                  <label htmlFor="inputEmail4" className="form-label">
                    Select Action
                  </label>
                  <div className="col-md-6">
                    <Select
                      name="actions"
                      defaultValue={{
                        label: inputs.actions,
                        value: inputs.actions,
                      }}
                      onChange={(selected) => {
                        formik.setFieldValue("actions", selected.value);
                        console.log(">>>>", selected.value);
                      }}
                      options={data}
                      isSearchable={true}
                      isOptionDisabled={(option) => option.isdisabled}
                      noOptionsMessage={() => "No Record(s) Found"}
                    />
                  </div>
                  <div className="text-danger">
                    {formik.errors.actions && formik.touched.actions
                      ? formik.errors.actions
                      : null}
                  </div>
                </div>
                <input type="hidden" value="edit" name="hidden_value" />
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

                  <Link className="btn btn-primary mx-3" to="/sub-admin-list">
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

export default EditPrivilege;
