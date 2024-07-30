import React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, Link, useLocation ,useParams} from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import {TimeOutPopUp} from "../TimeOut";
import { useFormik } from "formik";
import * as Yup from "yup";
import JoditEditor from "jodit-react";
function EditEmailTemplate() {
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState({});
  const [description, setContent] = useState("");
  const editor = useRef(null);
  const navigate = useNavigate();
  const {
    state: { id },
  } = {state:useParams()};

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = () => {
    axios
      .get(process.env.REACT_APP_API_KEY + "singleEmail/" + id, {
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log("data>>>>", res.data);
        setInputs({
          subject: res.data.subject,
          alias: res.data.variable_name,
          content: res.data.description,
        });
      })
      .catch((error) => {
        console.log("error>>", error.message);
      });
  };

  const validationSchema = Yup.object().shape({
    subject: Yup.string().required("Subject is required").max(100),
  });

  const initialValues = {
    subject: inputs.subject,
    description: inputs.content,
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
      data = {
        description: description,
      };
      setIsLoading(true);
      await axios
        .post(
          process.env.REACT_APP_API_KEY + "edit-email-template/" + id,
          data,
          {
            headers: {
              "Content-type": "Application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )

        .then((res) => {
          if (res.status === 200) {
            swal({
              title: "Success!",
              text: "Updated Successfully",
              icon: "success",
              button: "Okay",
            });
            setIsLoading(false);
            navigate("/email-templates");
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

  return (
    <>
      <div className="row">
        <div className="col">
          <div className="page-description">
            <h1>Edit Email Template</h1>
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
                    Subject Name
                  </label>
                  <input
                    name="subject"
                    type="text"
                    className="form-control"
                    onChange={formik.handleChange}
                    defaultValue={formik.values.subject}
                    autoComplete="false"
                    placeholder="Enter Subject Name"
                    readOnly
                  />
                  {/* <i className="fa fa-plus-circle" aria-hidden="true"></i> */}
                  <div className="text-danger">
                    {formik.errors.subject && formik.touched.subject
                      ? formik.errors.subject
                      : null}
                  </div>
                </div>
                <div className="col-md-6">
                  <label htmlFor="inputEmail4" className="form-label">
                    Variable Name
                  </label>
                  <input
                    name="alias"
                    type="text"
                    className="form-control"
                    id="inputEmail4"
                    onChange={formik.handleChange}
                    defaultValue={inputs.alias}
                    autoComplete="false"
                    placeholder="Enter Role Name"
                    readOnly
                  />
                  {/* <i className="fa fa-plus-circle" aria-hidden="true"></i> */}
                  <div className="text-danger">
                    {formik.errors.alias && formik.touched.alias
                      ? formik.errors.alias
                      : null}
                  </div>
                </div>
                <div className="col-12">
                  <JoditEditor
                    ref={editor}
                    value={inputs.content}
                    tabIndex={1} // tabIndex of textarea
                    onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                    onChange={(newContent) => setContent(newContent)}
                  />
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
                        ? "/email-templates/Modify"
                        : "/email-templates"
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

export default EditEmailTemplate;
