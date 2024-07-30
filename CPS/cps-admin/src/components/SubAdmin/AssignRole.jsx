import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link,useLocation } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
function AssignRole() {
    const {
        state: { userId },
      } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedlevel, setSelectedLevel] = useState("");
  const [roles, setRoles] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);
  const navigate = useNavigate();
  const options = [];
  
  const data = [
    { value: "Modify", label: "Modify" },
    { value: "View", label: "View" },
    
  ];

  useEffect(() => {
    getRoles();
    console.log('userId>>',userId);
  }, []);

  const getRoles = async () => {
    axios({
      url: process.env.REACT_APP_API_KEY + "get-all-list",
      method: "get",
      params: {
        userRole: localStorage.getItem("user_role"),
        userID: localStorage.getItem("userID"),
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
       // console.log('>>>>data',response.data.data);
        let myArray = response.data.data.filter(function( obj ) {
          return obj.key !== 'sub-admin';
      });
       setRoles(myArray)
      })
      .catch((error) => {
        console.log("error==>", error);
      });
  };

  if (roles) {
    roles.forEach((element) => {
      options.push({ value: element.id, label: element.name });
    });
  }
 
  const validationSchema = Yup.object().shape({
    actions: Yup.string().required("actions is required"),
    permissionId: Yup.array().min(1).of(Yup.string().trim().required())
  
   
  });
  const initialValues = {
    actions:selectedlevel,
    adminId:userId,
    hidden_value:'Add',
    permissionId: selectedValue
   
    
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
        .post(process.env.REACT_APP_API_KEY + "save-role-permission", data, {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        .then((res) => {
          if (res.status === 200) {
            swal({
              title: "Success!",
              text: "Taged Role Successfully!",
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
            <h1>Assign Action Privilege</h1>
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
                    Select Action
                  </label>
                  <div className="col-md-6">
                    <Select
                      defaultValue={selectedlevel}
                      onChange={levelHandleChange}
                      name="actions"
                      options={data}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      isOptionDisabled={(option) => option.isdisabled}
                    />
                  </div>
                  <div className="text-danger">
                    {formik.errors.actions ? formik.errors.actions : null}
                  </div>
                  <label htmlFor="inputEmail4" className="form-label">
                    Select Management
                  </label>
                  <div className="col-md-6">
                    <Select
                      isMulti
                      value={options.filter((obj) =>
                        selectedValue.includes(obj.value)
                      )}
                      name="permissionId"
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
                    {formik.errors.permissionId ? formik.errors.permissionId : null}
                  </div>
                  </div>
                </div>
                <input type='hidden' value="Add" name="hidden_value"/>
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

export default AssignRole;
