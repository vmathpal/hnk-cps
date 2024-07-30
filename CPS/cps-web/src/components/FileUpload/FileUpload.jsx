import React from "react";
import { useState, useEffect } from "react";
import fileSaver from "file-saver";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Ilogo from "../../images/info.svg";
import Binimg from "../../images/bin.svg";
import Fileicon from "../../images/file.svg";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import swal from "sweetalert";

import axios from "axios";
function FileUpload(props) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [formStatus, setFormStatus] = useState("");
  const TimeOut = () => {
    swal({
      title: "Time Out",
      text: "You have been logged out. Please log in again",
      icon: "error",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        navigate("/login");
        return;
      }
    });
  };
  useEffect(() => {
    getFilesList();
  }, []);
  const getFilesList = async () => {
    if (!localStorage.getItem("auth-token")) {
      TimeOut();
      return;
    }
    await axios
      .get(process.env.REACT_APP_API_KEY + "file-list/" + props.projectID, {
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
        params: {
          fileType: props.fileType,
        },
      })
      .then(function (response) {
        setFiles(response.data.data);
        if (response.data.data && response.data.data.length) {
          setFormStatus(response.data.data[0].Project.status);
        }
      })
      .catch(function (error) {
        console.log(">>>>>>>>>>>error", error);
      });
  };

  const FILE_SIZE = 11200 * 1024;
  const SUPPORTED_FORMATS = [
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "image/png",
    "image/pdf",
  ];
  const validationSchema = Yup.object().shape({
    // description: Yup.string()
    //   .required("Description is required")
    //   .min(3, "Minimum 3 Character")
    //   .max(100, "Description must not exceed 100 characters"),
    image: Yup.mixed()
      .required("A file is required")
      .test(
        "fileSize",
        "File too large",
        (value) => value && value.size <= FILE_SIZE
      ),
    // .test(
    //   "fileFormat",
    //   "Unsupported Format",
    //   (value) => value && SUPPORTED_FORMATS.includes(value.type)
    // ),
  });
  const formik = useFormik({
    initialValues: {
      description: "",
      image: "",
    },

    validationSchema,
    enableReinitialize: true,
    validateOnChange: true,
    // validateOnBlur: false,
    onSubmit: async (data, { resetForm }) => {
      if (!localStorage.getItem("auth-token")) {
        TimeOut();
        return;
      }
      setIsLoading(true);
      const formData = new FormData();
      formData.append("image", formik.values.image);
      formData.append("description", formik.values.description);
      await axios
        .post(
          process.env.REACT_APP_API_KEY +
            "project-file-upload/" +
            props.projectID,
          formData,

          {
            headers: {
              "Content-type": "Application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            params: {
              fileType: props.fileType,
            },
          }
        )
        .then((res) => {
          resetForm({ values: "" });
          if (res.status === 200) {
            swal({
              title: "Success!",
              text: "Upload Successfully!",
              icon: "success",
              button: "Okay",
            });
            getFilesList();
            setIsLoading(false);
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

  const handleDeleteClick = async (id) => {
    //setIsLoadData(true);
    await axios
      .delete(process.env.REACT_APP_API_KEY + "delete-file/" + id)
      .then((res) => {
        getFilesList();
      })
      .catch((error) => {
        console.log("error>>>>>", error.message);
      });
  };
  // if (isLoading) {
  //   return (
  //     <div>
  //       <h4 style={{ color: "green" }}>Loading....</h4>
  //     </div>
  //   );
  // }
  return (
    <>
      <div className="accordion-item file-attach">
        <h2 class="accordion-header" id="headingOne">
          <div className="file-upload-panel">
            <span className="file-attachment">
              File Attachment <img src={Ilogo}></img>
            </span>
          </div>
          <button
            className="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseOne4"
            aria-expanded="true"
            aria-controls="collapseOne"
          ></button>
        </h2>
        <div
          id="collapseOne4"
          class="accordion-collapse collapse show"
          aria-labelledby="headingOne"
          data-bs-parent="#accordionExample"
        >
          <form onSubmit={formik.handleSubmit}>
            <div className="accordion-body">
              <div className="table-responsive-md">
                <Table responsive className="cp-table4">
                  <tr>
                    <th>File</th>
                    <th>Description</th>
                    <th></th>
                  </tr>
                  {files.length > 0 ? (
                    files.map((data, index) => (
                      <React.Fragment key={++index}>
                        <tr>
                          <td className="file-link">
                            <span
                              className="file-span"
                              onClick={() =>
                                (window.location.href =
                                  process.env.REACT_APP_CLIENT_URL + data.file)
                              }
                            >
                              <img
                                src={Fileicon}
                                alt="File"
                                className="download-file mx-2"
                              />
                              {data.file}
                            </span>
                          </td>
                          <td>{data.description}</td>
                          {props.productOwner === "Approver" ||
                          props.productOwner === "viewer" ? (
                            ""
                          ) : (
                            <td className="icon-td">
                              <img
                                src={Binimg}
                                alt=""
                                onClick={(e) => handleDeleteClick(data.id)}
                              />
                            </td>
                          )}
                        </tr>
                      </React.Fragment>
                    ))
                  ) : (
                    <span></span>
                  )}
                  <tr>
                    <td></td>
                    <td></td>
                    <td className="text-end"></td>
                  </tr>
                </Table>

                <div className="extra-row">
                  <div className="item-wrapper">
                    <div className="row-item">
                      <input
                        type="file"
                        name="image"
                        onChange={(event) => {
                          formik.setFieldValue(
                            "image",
                            event.currentTarget.files[0]
                          );
                        }}
                        disabled={
                          localStorage.getItem("ProjectOwnerStatus") == "false"
                            ? true
                            : false
                        }
                      />

                      <div className="text-danger">
                        {formik.errors.image && formik.touched.image
                          ? formik.errors.image
                          : null}
                        <div>Maximum upload file size: 10MB</div>
                      </div>
                    </div>

                    <div className="row-item">
                      <fieldset>
                        <span>Description</span>
                        <Form.Control
                          type="text"
                          className="Form-control col-md-4 mb-3"
                          name="description"
                          onChange={formik.handleChange}
                          value={formik.values.name}
                          disabled={
                            localStorage.getItem("ProjectOwnerStatus") ==
                            "false"
                              ? true
                              : false
                          }
                        />
                      </fieldset>
                      <div className="text-danger">
                        {formik.errors.description && formik.touched.description
                          ? formik.errors.description
                          : null}
                      </div>
                    </div>

                    <div className="row-item">
                      {props.productOwner === "Approver" ||
                      props.productOwner === "viewer" ? (
                        ""
                      ) : (
                        <button type="submit" className="save-btn">
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default FileUpload;
