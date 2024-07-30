import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link,useLocation } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import LoadingSpinner from "../Loader/LoadingSpinner";
import {TimeOutPopUp} from "../TimeOut";

function EditLevelMapping5And6() {
    const {
        state: { department,id },
      } = useLocation();
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadData, setIsLoadData] = useState(false);

  const [roles, setUserRequest] = useState({});
  const [inputs, setInputs] = useState({ levelRole5:'', LableRole5: '',levelRole6:'',LableRole6:''});
  const navigate = useNavigate();
  const option_level6 = [];
  const option_level5 = [];

  useEffect(() => {
    if (! localStorage.getItem("token")) {
              TimeOutPopUp(navigate);
              return;
            }
    getLevelsRole();
    fetchTagRole();
  }, []);
  const fetchTagRole = () => {
    axios.get(process.env.REACT_APP_API_KEY +'single-mapping-level56/'+ id,{
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {

      setInputs({
        LableRole5: res.data.data.first['role'],
        levelRole5:res.data.data.first['id'],
        LableRole6: res.data.data.second['role'],
        levelRole6:res.data.data.second['id'],
       
      });
      res.data? setIsLoadData(true):setIsLoadData(false);
      console.log('Response>>>>>',res.data);
    }).catch((error) => {
      console.log('error>>',error.message);
    });
  };
  const { levelRole6, LableRole6,levelRole5,LableRole5} = inputs;

  const getLevelsRole = async () => {
    await axios
      .get(process.env.REACT_APP_API_KEY + "level-based-role/" + department)
      .then(function (response) {
        setUserRequest((prevState) => ({
          ...prevState,
         
          level4: response.data.level4,
          level5: response.data.level5,
        }));
      })
      .catch(function (error) {
        console.log(error.response.data);
      });
  };

  if (roles.level5) {
    roles.level5.forEach((element) => {
      option_level6.push({ value: element.role.id, label: element.role.role });
    });
  }
  if (roles.level4) {
    roles.level4.forEach((element) => {
      option_level5.push({ value: element.role.id, label: element.role.role });
    });
  }
  const validationSchema = Yup.object().shape({
    // level: Yup.string().required("level is required"),
    // role: Yup.array().min(1).of(Yup.string().trim().required())
   
  });
  const initialValues = {
    roleLevel6:levelRole6,
    roleLevel5: levelRole5,
    hiddenValue:levelRole6
 
  };
  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    validateOnChange: true,
    // validateOnBlur: false,
    onSubmit: async (data) => {
    //   console.log('<><><>',initialValues);
      setIsLoading(true);
      await axios
        .post(process.env.REACT_APP_API_KEY + "edit-level56/"+id, data, {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        .then((res) => {
          if (res.status === 200) {
            swal({
              title: "Updated!",
              text: "Updated Successfully!",
              icon: "success",
              button: "Okay",
            });
            setIsLoading(false);
            {localStorage.getItem("user_role")==='super_admin'? navigate("/relation-mapping"):navigate("/relation-mapping/Modify")}
           
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
 
  if(!isLoadData){
    return <div><LoadingSpinner></LoadingSpinner></div>
  }
  return (
    <>
      <div className="row">
        <div className="col">
          <div className="page-description">
            <h1>Edit Level 5 & 6 Mapping</h1>
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
                  Select Level 5 Role
                  </label>
                  <div className="col-md-6">
                  <Select
                    name="roleLevel5"
                    defaultValue={{
                      label:LableRole5,
                      value: levelRole5,
                    }}
                    onChange={(selected) => {
                      formik.setFieldValue("roleLevel5", selected.value);
                    }}
                    options={option_level5}
                    isSearchable={true}
                    isOptionDisabled={(option) => option.isdisabled}
                    noOptionsMessage={() => "No Record(s) Found"}
                  />
                  </div>
                  <div className="text-danger">
                    {formik.errors.level ? formik.errors.level : null}
                  </div>
                  <label htmlFor="inputEmail4" className="form-label mt-3">
                    Select Level 6 Role
                  </label>
                  <div className="col-md-6">
                    <Select
                     name="roleLevel6"
                     defaultValue={{
                       label:LableRole6,
                       value:levelRole6,
                     }}
                     onChange={(selected) => {
                       formik.setFieldValue("roleLevel6", selected.value);
                     }}
                     options={option_level6}
                     isSearchable={true}

                     noOptionsMessage={() => "No Record(s) Found"}
                    />
                    
                     <div className="text-danger">
                    {formik.errors.roleLevel6 ? formik.errors.roleLevel6 : null}
                  </div>
                  </div>
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

                  <Link className="btn btn-primary mx-3" to={localStorage.getItem("user_role") === 'sub_admin' ? '/relation-mapping/Modify':'/relation-mapping'}>
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

export default EditLevelMapping5And6;
