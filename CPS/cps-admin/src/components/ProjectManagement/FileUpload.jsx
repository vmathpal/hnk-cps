import React from "react";
import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Ilogo from "../../Assests/images/info.svg";
import Binimg from "../../Assests/images/bin.svg";
import Fileicon from "../../Assests/images/file.svg";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import swal from "sweetalert";
import axios from "axios";
function FileUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    getFilesList();
  }, []);
  const getFilesList = async () => {
    await axios
      .get(
        process.env.REACT_APP_API_KEY +
          "file-list/" +
          localStorage.getItem("projectID"),
        {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            fileType: "new-request",
          },
        }
      )
      .then(function (response) {
        setFiles(response.data.data);
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
    description: Yup.string()
      .required("Description is required")
      .min(3, "Minimum 3 Character")
      .max(100, "Description must not exceed 100 characters"),
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
    onSubmit: async (data) => {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("image", formik.values.image);
      formData.append("description", formik.values.description);
      await axios
        .post(
          process.env.REACT_APP_API_KEY +
            "project-file-upload/" +
            localStorage.getItem("projectID"),
          formData,
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
  return (
    <>
      <div className="accordion-item file-attach">
        <h2 class="accordion-header" id="headingOne">
          <div className="file-upload-panel">
            <span className="file-attachment" style={{ fontSize: 12 }}>
              File Attachment <img src={Ilogo}></img>
            </span>
          </div>
          <button
            className="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseOne5"
            aria-expanded="true"
            aria-controls="collapseOne"
          ></button>
        </h2>
        <div
          id="collapseOne5"
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
                              <img src={Fileicon} alt="File" className="mx-2" />
                              {data.file}
                            </span>
                            <p>Maximu</p>
                          </td>
                          <td>{data.description}</td>
                          {localStorage.getItem("action") !== "view" ? (
                            <td class="icon-td">
                              <img
                                src={Binimg}
                                alt=""
                                onClick={(e) => handleDeleteClick(data.id)}
                              />
                            </td>
                          ) : (
                            ""
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
                          localStorage.getItem("action") === "view"
                            ? true
                            : false
                        }
                      />
                      <div className="text-danger">
                        {formik.errors.image && formik.touched.image
                          ? formik.errors.image
                          : null}
                      </div>
                    </div>

                    <div className="row-item">
                      <fieldset>
                        <span>Description</span>
                        <Form.Control
                          type="text"
                          className="Form-control col-md-4"
                          name="description"
                          autoComplete="off"
                          onChange={formik.handleChange}
                          value={formik.values.name}
                          disabled={
                            localStorage.getItem("action") === "view"
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
                      {localStorage.getItem("action") !== "view" ? (
                        <button type="submit" className="save-btn">
                          Add
                        </button>
                      ) : (
                        ""
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
