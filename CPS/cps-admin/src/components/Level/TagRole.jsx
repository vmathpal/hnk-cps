import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
function TagRole() {
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedlevel, setSelectedLevel] = useState("");
  const [levels, setLevels] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);
  const navigate = useNavigate();

  const options = [];
  const data = [];

  useEffect(() => {
    getLevels();
    getRoles();
  }, []);

  const getRoles = async () => {
    await axios
      .get(process.env.REACT_APP_API_KEY + "get-department-role", {
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
      options.push({ value: element.id, label: element.role });
    });
  }
  const getLevels = async () => {
    await axios
      .get(process.env.REACT_APP_API_KEY + "get-levels", {
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
        isdisabled: element.name === "Level 1" ? true : false,
      });
    });
  }
  const validationSchema = Yup.object().shape({
    level: Yup.string().required("level is required"),
    roleId: Yup.array()
      .min(1)
      .of(Yup.string().trim().required("role is required")),
  });
  const initialValues = {
    level: selectedlevel,
    roleId: selectedValue,
    hidden_value: "Add",
  };
  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    validateOnChange: true,
    // validateOnBlur: false,
    onSubmit: async (data) => {
      setIsLoading(true);
      await axios
        .post(process.env.REACT_APP_API_KEY + "tag-role", data, {
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
                ? navigate("/tag-management")
                : navigate("/tag-management/Modify");
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
  const handleChange = (e) => {
    setSelectedValue(Array.isArray(e) ? e.map((x) => x.value) : []);
  };
  const levelHandleChange = (e) => {
    setSelectedLevel(e.value);
  };

  return (
    <>
      <div className="row">
        <div className="col">
          <div className="page-description">
            <h1>Tag Role</h1>
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
                    Select Level
                  </label>
                  <div className="col-md-6">
                    <Select
                      defaultValue={selectedlevel}
                      onChange={levelHandleChange}
                      name="level"
                      options={data}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      isOptionDisabled={(option) => option.isdisabled}
                    />
                  </div>
                  <div className="text-danger">
                    {formik.errors.level && formik.touched.level
                      ? formik.errors.level
                      : null}
                  </div>
                  <label htmlFor="inputEmail4" className="form-label">
                    Select Role
                  </label>
                  <div className="col-md-6">
                    <Select
                      isMulti
                      value={options.filter((obj) =>
                        selectedValue.includes(obj.value)
                      )}
                      name="roleId"
                      options={options}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      onChange={handleChange}
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
                      {formik.errors.roleId && formik.touched.roleId
                        ? formik.errors.roleId
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
                        ? "/tag-management/Modify"
                        : "/tag-management"
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

export default TagRole;
