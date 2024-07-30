import React from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import Ilogo from "../images/info.svg";
import astick from "../images/astick-icon.png";
import Form from "react-bootstrap/Form";
import swal from "sweetalert";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import * as Yup from "yup";
import axios from "axios";
import FileUpload from "../components/FileUpload/FileUpload";
import LoadingSpinner from "../components/Loader/LoadingSpinner";
const DataEvalution = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [projectName, setprojectName] = useState("");
  const [ownerName, setownerName] = useState("");
  const [closureStatus, setClosureStatus] = useState("");
  const {
    state: { projectID, productOwner, actionType },
  } = useLocation();
  localStorage.setItem("projectID", projectID);
  localStorage.setItem("productOwner", productOwner);
  localStorage.setItem("actionType", actionType);
  useEffect(() => {
    getDataEvaluation();
    getAllBrandSKU();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      getDataEvaluation();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const getDataEvaluation = async () => {
    if (!localStorage.getItem("auth-token")) {
      navigate("/login");
      return;
    }
    setIsLoading(true);
    await axios
      .get(process.env.REACT_APP_API_KEY + "get-data-evaluation/" + projectID, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
        params: {
          userID: localStorage.getItem("authID"),
          role: localStorage.getItem("auth_role"),
        },
      })
      .then(function (response) {
        // console.log("Data Evaluation>>>>", response.data.data);
        setprojectName(response.data.data.Project.name);
        localStorage.setItem("ProjectName", response.data.data.Project.name);
        localStorage.setItem(
          "ProjectOwnerName",
          response.data.data.User.email.split("@")[0]
        );
        setownerName(response.data.data.User.email.split("@")[0]);

        setInputs({
          scopeofevaluation: response.data.data.scopeofevaluation,
          whatweworked: response.data.data.whatweworked,
          whatwedidnotwork: response.data.data.whatwedidnotwork,
          scopeofevaluation: response.data.data.scopeofevaluation,
          explanation: response.data.data.explanation,
          eventhighlights: response.data.data.eventhighlights,
          objective: response.data.data.objective,
        });
        setIsLoading(false);
      })
      .catch(function (error) {
        setIsLoading(false);
        console.log(">>>>>>>>>>>error", error);
      });
  };
  const getAllBrandSKU = async (id) => {
    if (!localStorage.getItem("auth-token")) {
      navigate("/login");
      return;
    }
    setIsLoading(true);
    await axios({
      url: process.env.REACT_APP_API_KEY + "all-brand-sku/" + projectID,
      method: "get",
      params: {
        userID: localStorage.getItem("authID"),
        projectID: projectID,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
      },
    })
      .then(function (response) {
        if (response.data.data && response.data.data.length) {
          setClosureStatus(response.data.data[0].Project.CloserStatus);
          // console.log("closureStatus", closureStatus);
        }
        setIsLoading(false);
      })
      .catch(function (error) {
        // if (error.response.status === 401) {
        //   localStorage.clear();
        // }
        console.log(">>>>>>>>>>>error", error.response);
      });
  };

  const validationSchema = Yup.object().shape({
    scopeofevaluation: Yup.string().required("Required"),
    explanation: Yup.string().required("Required"),
    whatweworked: Yup.string().required("Required"),
    whatwedidnotwork: Yup.string().required("Required"),
    eventhighlights: Yup.string().required("Required"),
    objective: Yup.string().required("Required"),
  });
  const initialValues = {
    scopeofevaluation: inputs.scopeofevaluation ? inputs.scopeofevaluation : "",
    explanation: inputs.explanation ? inputs.explanation : "",
    whatweworked: inputs.whatweworked ? inputs.whatweworked : "",
    whatwedidnotwork: inputs.whatwedidnotwork ? inputs.whatwedidnotwork : "",
    eventhighlights: inputs.eventhighlights ? inputs.eventhighlights : "",
    objective: inputs.objective ? inputs.objective : "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: true,
    enableReinitialize: true,
    // validateOnBlur: false,
    onSubmit: async (data) => {
      if (!localStorage.getItem("auth-token")) {
        navigate("/login");
        return;
      }
      setIsLoading(true);
      await axios
        .post(process.env.REACT_APP_API_KEY + "data-evaluation", data, {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          },
          params: {
            userID: localStorage.getItem("authID"),
            projectID: projectID,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            swal({
              title: "Success!",
              text: "Data Saved",
              icon: "success",
              button: "Okay",
            });
            setIsLoading(false);

            navigate("/my-projects/data-analyst");
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

  //   Getting Uploaded Filename
  if (isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <div className="content-area tradeOfferWrapper">
        <div className="top-bar">
          <NavLink to="/my-projects">
            <div id="backButton"></div>
            <h4>Back</h4>
          </NavLink>
        </div>
        <div className="page-title">
          <h4>{projectName}</h4>

          {localStorage.getItem("productOwner") === "Approver" ||
          localStorage.getItem("productOwner") === "viewer" ? (
            <b>
              Post By: <span>{ownerName}</span>
            </b>
          ) : (
            ""
          )}
        </div>

        <section className="form-holder">
          <div className="form-wrapper">
            <form onSubmit={formik.handleSubmit}>
              <section className="containers">
                <b className="form-title">
                  <img src={astick} alt="" className="mb-3"></img>Project
                  Evaluation <img src={Ilogo} alt="" className="mx-2"></img>
                </b>
                <div className="form-group">
                  <div className="col-6 mx-2">
                    <div className="">
                      <fieldset>
                        <label htmlFor="scopeofevaluation">
                          Scope Of Evaluation
                        </label>
                        <textarea
                          className="form-control"
                          id="scopeofevaluation"
                          name="scopeofevaluation"
                          type="text"
                          onChange={formik.handleChange}
                          defaultValue={formik.values.scopeofevaluation}
                          placeholder="Type here..."
                        ></textarea>
                        <p className="text-danger mx-2">
                          {formik.errors.scopeofevaluation &&
                          formik.touched.scopeofevaluation
                            ? formik.errors.scopeofevaluation
                            : null}
                        </p>
                      </fieldset>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="">
                      <fieldset>
                        <label htmlFor="scopeofevaluation">
                          Please Explain
                        </label>
                        <textarea
                          className="form-control"
                          id="explanation"
                          name="explanation"
                          type="text"
                          onChange={formik.handleChange}
                          defaultValue={formik.values.explanation}
                          placeholder="Type here..."
                        ></textarea>
                        <p className="text-danger mx-2">
                          {formik.errors.explanation &&
                          formik.touched.explanation
                            ? formik.errors.explanation
                            : null}
                        </p>
                      </fieldset>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="col-6 mx-2">
                    <div className="">
                      <fieldset>
                        <label htmlFor="scopeofevaluation">
                          What worked and we should continue Executing
                        </label>
                        <textarea
                          className="form-control"
                          id="whatweworked"
                          name="whatweworked"
                          type="text"
                          onChange={formik.handleChange}
                          defaultValue={formik.values.whatweworked}
                          placeholder="Type here..."
                        ></textarea>
                        <p className="text-danger mx-2">
                          {formik.errors.whatweworked &&
                          formik.touched.whatweworked
                            ? formik.errors.whatweworked
                            : null}
                        </p>
                      </fieldset>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="">
                      <fieldset>
                        <label htmlFor="scopeofevaluation">
                          What did NOT worked and we should stop?
                        </label>
                        <textarea
                          className="form-control"
                          id="whatwedidnotwork"
                          name="whatwedidnotwork"
                          type="text"
                          onChange={formik.handleChange}
                          defaultValue={formik.values.whatwedidnotwork}
                          placeholder="Type here..."
                        ></textarea>
                        <p className="text-danger mx-2">
                          {formik.errors.whatwedidnotwork &&
                          formik.touched.whatwedidnotwork
                            ? formik.errors.whatwedidnotwork
                            : null}
                        </p>
                      </fieldset>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="col-6 mx-2">
                    <div className="">
                      <fieldset>
                        <label htmlFor="scopeofevaluation">
                          Event Highlights
                        </label>
                        <textarea
                          className="form-control"
                          id="eventhighlights"
                          name="eventhighlights"
                          type="text"
                          onChange={formik.handleChange}
                          defaultValue={formik.values.eventhighlights}
                          placeholder="Type here..."
                        ></textarea>
                        <p className="text-danger mx-2">
                          {formik.errors.eventhighlights &&
                          formik.touched.eventhighlights
                            ? formik.errors.eventhighlights
                            : null}
                        </p>
                      </fieldset>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="objective" className="radio-btn">
                      Was Objective Achieved?
                    </label>
                    <div className="radio-wrapper">
                      <div>
                        <Form.Check
                          type="radio"
                          aria-label="radio 1"
                          name="objective"
                          className="custom-radio"
                          id="opt1"
                          value="yes"
                          onChange={formik.handleChange}
                          defaultChecked={inputs.objective === "yes"}
                        />{" "}
                        <label htmlFor="yes">Yes</label>
                      </div>
                      <div>
                        <Form.Check
                          type="radio"
                          aria-label="radio 1"
                          name="objective"
                          className="custom-radio"
                          id="opt1"
                          value="no"
                          onChange={formik.handleChange}
                          defaultChecked={inputs.objective === "no"}
                        />{" "}
                        <label htmlFor="no">No</label>
                      </div>

                      <p className="text-danger mx-2">
                        {formik.errors.objective && formik.touched.objective
                          ? formik.errors.objective
                          : null}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* <section className="containers">
                <Table variant="light">
                  <thead>
                    <tr>
                      <th className="form-title" colSpan={3}>
                        File Attachment
                      </th>
                    </tr>
                  </thead>
                  <tbody className="table-body">
                    <tr className="table-context">
                      <td>File</td>
                      <td>Description</td>
                      <td></td>
                    </tr>
                    <tr className="upload-area">
                      <td>
                        <label htmlFor="uploadFile" className="upload">
                          <img src={uploadFileIcon} alt="Upload File"></img>
                        </label>
                        <span
                          id="uploadedFilename"
                          className="uploadedFilename"
                        >
                          File attachment 1.ppt
                        </span>
                        <input
                          type="file"
                          id="uploadFile"
                          onChange={handleChange}
                        ></input>
                      </td>
                      <td>Description 01</td>
                      <td className="addRow" onClick={appendRow}>
                        + Add
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </section> */}

              <div className="button-container">
                {localStorage.getItem("productOwner") === "creator" &&
                (closureStatus === "rejected" || closureStatus === null) ? (
                  <button type="submit">Save & Next</button>
                ) : (
                  <Link to="/my-projects/data-analyst">
                    {" "}
                    <button type="button" className="next-btn">
                      Next
                    </button>
                  </Link>
                )}
              </div>
            </form>

            {/* <div className="create-project">
              <FileUpload projectID={projectID} fileType="closer-request" />
            </div> */}
          </div>
        </section>
      </div>
    </>
  );
};

export default DataEvalution;
