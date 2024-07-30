import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link,useLocation ,useParams} from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import {TimeOutPopUp} from "../TimeOut";
import $ from "jquery";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import LoadingSpinner from "../Loader/LoadingSpinner";
function EditTagLevel() {
    const {
        state: { id },
      } = {state:useParams()};
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadData, setIsLoadData] = useState(false);
  const [selectedlevel, setSelectedLevel] = useState("");
  const [levels, setLevels] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);
  const [inputs, setInputs] = useState({ level:'', levelId: '',role:'',roleId:''});
  const navigate = useNavigate();
  const options = [];
  const data = [];

  useEffect(() => {
      console.log(id,'>>>s',inputs);
    getLevels();
    getRoles();
    fetchTagRole();
  }, []);
  const fetchTagRole = () => {
    axios.get(process.env.REACT_APP_API_KEY +'single-tag-role/'+ id,{
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {

      setInputs({
        level: res.data.Level['name'],
        levelId:res.data.Level['id'],
        role: res.data.role['role'],
        roleId: res.data.role['id']
       
      });
      res.data? setIsLoadData(true):setIsLoadData(false);
      console.log('Response>>>>>',res.data);
    }).catch((error) => {
      console.log('error>>',error.message);
    });
  };
  const { level, levelId,role,roleId} = inputs;

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
        isdisabled:
          element.name === "Level 1"
            ? true
            : false,
      });
    });
  }
  const validationSchema = Yup.object().shape({
    // level: Yup.string().required("level is required"),
    // role: Yup.array().min(1).of(Yup.string().trim().required())
   
  });
  const initialValues = {
    levelId:levelId,
    roleId: roleId,
    hidden_value:roleId,
    
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
      console.log('<><><>',initialValues);
      setIsLoading(true);
      await axios
        .post(process.env.REACT_APP_API_KEY + "edit-tag/"+id, data, {
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
            navigate("/tag-management");
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
  // handle onChange event of the dropdown
//   const handleChange = (e) => {
//       console.log(selectedValue);
//     setSelectedValue(Array.isArray(e) ? e.map((x) => x.value) : []);
//   };
  // const levelHandleChange = (e) => {
  //  setSelectedLevel(e.value);
  // };

  if(!isLoadData){
    return <div><LoadingSpinner></LoadingSpinner></div>
  }
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
                    name="levelId"
                    defaultValue={{
                      label:level,
                      value: levelId,
                    }}
                    onChange={(selected) => {
                      formik.setFieldValue("levelId", selected.value);
                    }}
                    options={data}
                    isSearchable={true}
                    isOptionDisabled={(option) => option.isdisabled}
                    noOptionsMessage={() => "No Record(s) Found"}
                  />
                  </div>
                  <div className="text-danger">
                    {formik.errors.level && formik.touched.level  ? formik.errors.level : null}
                  </div>
                  <label htmlFor="inputEmail4" className="form-label mt-3">
                    Select Role
                  </label>
                  <div className="col-md-6">
                    <Select
                     name="roleId"
                     defaultValue={{
                       label:role,
                       value:roleId,
                     }}
                     onChange={(selected) => {
                       formik.setFieldValue("roleId", selected.value);
                     }}
                     options={options}
                     isSearchable={true}
                     noOptionsMessage={() => "No Record(s) Found"}
                    />
                    
                     <div className="text-danger">
                    {formik.errors.role && formik.touched.role ? formik.errors.role : null}
                  </div>
                  </div>
                </div>
                <input type='hidden' value="edit" name="hidden_value"/>
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

                  <Link className="btn btn-primary mx-3" to={localStorage.getItem("user_role") === 'sub_admin' ? '/tag-management/Modify':'/tag-management'}>
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

export default EditTagLevel;
