import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import Select from "./Select";
import {TimeOutPopUp} from "../TimeOut";

function LevelMapping5And6() {
  const {
    state: { department },
  } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [roles, setUserRequest] = useState({});
  const option_level6 = [];
  const option_level5 = [];

  const [form, setForm] = useState({
    roleLevel6: null,
    roleLevel5: null,
  });

  const onValidate = (value, name) => {
    setError((prev) => ({
      ...prev,
      [name]: { ...prev[name], errorMsg: value },
    }));
  };

  const [error, setError] = useState({
    roleLevel6: {
      isReq: true,
      errorMsg: "",
      onValidateFunc: onValidate,
    },
    roleLevel5: {
      isReq: true,
      errorMsg: "",
      onValidateFunc: onValidate,
    },
  });

  const onHandleChange = useCallback((value, name) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const validateForm = () => {
    let isInvalid = false;
    Object.keys(error).forEach((x) => {
      const errObj = error[x];
      if (errObj.errorMsg) {
        isInvalid = true;
      } else if (errObj.isReq && !form[x]) {
        isInvalid = true;
        onValidate(true, x);
      }
    });
    return !isInvalid;
  };

  const handleSubmit = async () => {
    const isValid = validateForm();
    if (!isValid) {
      console.error("Invalid Form!");
      return false;
    }
    console.log("Data:", form);
    axios({
      url: process.env.REACT_APP_API_KEY + "save-relation-mapping56",
      method: "post",
      params: {
        department: department,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: form,
    })
      .then((response) => {
        if (response.status === 200) {
          swal({
            title: "Success!",
            text: "Level Mapped Successfully!",
            icon: "success",
            button: "Okay",
          });
          setIsLoading(false);
          {
            localStorage.getItem("user_role") === "super_admin"
              ? navigate("/relation-mapping")
              : navigate("/relation-mapping/Modify");
          }
        }
      })
      .catch((error) => {
        if (error.response.status === 422) {
          swal("Oops", error.response.data.message, "error");
        }
        console.log("error==>", error);
      });
  };

  useEffect(() => {
    if (! localStorage.getItem("token")) {
              TimeOutPopUp(navigate);
              return;
            }
    getLevelsRole();
    console.log(">>>>>>>department", department);
  }, []);

  const getLevelsRole = async () => {
    await axios
      .get(process.env.REACT_APP_API_KEY + "level-based-role/" + department)
      .then(function (response) {
        console.log(">>responsess", response.data);
        setUserRequest((prevState) => ({
          ...prevState,
          level6: response.data.level6,
          level5: response.data.level5,
        }));
      })
      .catch(function (error) {
        console.log(error.response.data);
      });
  };

  if (roles.level6) {
    roles.level6.forEach((element) => {
      option_level6.push({ value: element.role.id, label: element.role.role });
    });
  }
  if (roles.level5) {
    roles.level5.forEach((element) => {
      option_level5.push({ value: element.role.id, label: element.role.role });
    });
  }

  return (
    <>
      <div className="row">
        <div className="col">
          <div className="page-description">
            <h1>Level 5 & 6 Relation Mapping Role</h1>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="example-container">
            <div className="example-content">
              <div className="col-md-6">
                <div className="container">
                  <Select
                    name="roleLevel5"
                    title="Level 5 Role"
                    value={form.roleLevel5}
                    options={option_level5}
                    onChangeFunc={onHandleChange}
                    {...error.roleLevel5}
                  />
                  <Select
                    name="roleLevel6"
                    title="Level 6 Role"
                    value={form.roleLevel6}
                    options={option_level6}
                    onChangeFunc={onHandleChange}
                    {...error.roleLevel6}
                  />

                  <button
                    className="btn btn-primary  mt-2"
                    onClick={handleSubmit}
                  >
                    {isLoading ? (
                      <>
                        <i className="fa fa-refresh fa-spin"></i>Loading
                      </>
                    ) : (
                      "Save"
                    )}
                  </button>

                  <Link
                    className="btn btn-primary mx-3 mt-2"
                    to={
                      localStorage.getItem("user_role") === "sub_admin"
                        ? "/relation-mapping/Modify"
                        : "/relation-mapping"
                    }
                  >
                    Back
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LevelMapping5And6;
