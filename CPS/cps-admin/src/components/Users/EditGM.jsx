import React from "react";
import { useState, useEffect } from "react";
import { useNavigate,useLocation, Link } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { useFormik } from "formik";
import Select from "react-select";
import * as Yup from "yup";
import LoadingSpinner from "../Loader/LoadingSpinner";
function EditGM() {
    const {
        state: { UserId },
      } = useLocation();
  const navigate = useNavigate();
  const [isLoadData, setIsLoadData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState({ name:'', email: '',phone:''});
  
  useEffect(() => {
    fetchTagRole();

  }, []);
  const fetchTagRole = async() => {
      axios.get(process.env.REACT_APP_API_KEY +'singleUser/'+ UserId,{
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }).then((res) => {
        console.log('<><><>',res.data);
           setInputs({
            name: res.data.name,
            email:res.data.email,
            phone: res.data.mobile,
      
        });
        
        res.data? setIsLoadData(true):setIsLoadData(false);
       
      }).catch((error) => {
        console.log('error>>',error.message);
      });
    };

  const validationSchema = Yup.object().shape({
    accessRole:Yup.array().min(1).of(Yup.string().trim().required()),
    email: Yup.string().required("Email is required").email("Email is invalid"),
    name: Yup.string().required("UserID is required"),
    // .max("Name must not exceed 40 characters"),
   // phone: Yup.number().required("mobile number is required"),
  
      
  });
  const initialValues = {
    name: inputs.name,
    email:inputs.email,
    hiddenValue:inputs.name
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: true,
    enableReinitialize: true,
    // validateOnBlur: false,
    onSubmit: async (data) => {
      
      setIsLoading(true);
      await axios
        .post(process.env.REACT_APP_API_KEY + "edit-user/"+UserId, data, {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
            {localStorage.getItem("user_role")==='super_admin'? navigate("/user-management"):navigate("/user-management/Modify")}
          }
        })
        .catch(function (error) {
          setIsLoading(false);
          // console.log('>>>>>>>>>>>',error)
          if (error.response.data.status === false) {
            swal("Oops", error.response.data.message, "error");
          }
        });
      console.log(JSON.stringify(data, null, 2));
      // console.log(data);
    },
  });
 
  if(!isLoadData){
    return <div><LoadingSpinner/></div>
  }
  return (
    <>
      <div className="row">
        <div className="col">
          <div className="page-description">
            <h1>Edit GM</h1>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="example-container">
            <div className="example-content">
              <form className="row g-3" onSubmit={formik.handleSubmit}>
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
                    {formik.errors.name && formik.touched.name ? formik.errors.name : null}
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
                    {formik.errors.email && formik.touched.email ? formik.errors.email : null}
                  </div>
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

                  <Link className="btn btn-primary mx-3" to={localStorage.getItem("user_role") === 'sub_admin' ? '/user-management/Modify':'/user-management'}>
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
export default EditGM;
