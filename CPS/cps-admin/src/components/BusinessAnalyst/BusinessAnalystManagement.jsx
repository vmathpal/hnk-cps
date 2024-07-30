import React, { Fragment } from "react";
//Bootstrap and jQuery libraries
import "jquery/dist/jquery.min.js";
//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from "jquery";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import dateFormat from "dateformat";
import {TimeOutPopUp} from "../TimeOut";

import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { useState, useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import LoadingSpinner from "../Loader/LoadingSpinner";
import moment from "moment";

export default function BusinessAnalystManagement() {
  const handleClose = () => setShow(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [id, setPID] = useState(0);
  const [show, setShow] = useState(false);
  const [userName, setUserName] = useState(false);
  const [roles, setRoles] = useState([]);
  let { action } = useParams();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const initializeDataTable = () => {
    $("#myTable").DataTable().clear().destroy();
    setTimeout(function () {
      $("#myTable").DataTable({
        buttons: [
          {
            extend: "excelHtml5",
            title: "",
            text: "Export",
            filename: "ba",
            className: "btn btn-info mt-2",
            exportOptions: {
              columns: ":not(.no-export)", // Exclude columns with the "no-export" class
            },
          },
        ],
        bDestroy: true,
        fixedHeader: true,
        pagingType: "full_numbers",
        pageLength: 10,
        processing: true,
        dom: "Bfrtip",
        select: true,
      });
    }, 500);
  };
  useEffect(() => {
    if (! localStorage.getItem("token")) {
              TimeOutPopUp(navigate);
              return;
            }
    //$('.dt-buttons').hide();
    getRoles();
    document.body.className = "pace-done no-loader users";
    if ($("body").hasClass("users")) {
      $(".dt-buttons").addClass("csv-button");
    }
    return () => {
      document.body.className = "pace-done no-loader";
    };
  }, []);
  const handleShow = (user) => {
    setPID(user.id);
    setUserName(user.email.split("@")[0]);
    setShow(true);
  };
  const getRoles = async () => {
    setIsLoading(true);
    await axios({
      url: process.env.REACT_APP_API_KEY + "getbaUsers-list",
      method: "get",
      params: {
        url: "business-analyst-management",
        userID: localStorage.getItem("userID"),
        role: localStorage.getItem("user_role"),
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(function (response) {
        console.log(">>>data", response.data.data);
        setRoles(response.data.data);
        setIsLoading(false);
        initializeDataTable();
      })
      .catch(function (error) {
        if (error.response.status === 401) {
          localStorage.clear();
          navigate("/sign-in");
        }
        if (error.response.status === 423) {
          swal({
            title: "Error!",
            text: "Permission Denied",
            icon: "error",
            button: "Okay",
          });
          navigate("/dashboard");
          return false;
        }
        console.log(">>>>>>>>>>>error", error.response);
      });
  };
  const validationSchema = Yup.object().shape({
    ldapID: Yup.string()
      .required("Field is required")
      .min(3, "Minimum 3 Character")
      .max(500, "Max 500 "),
    startDate: Yup.date(),
    endDate: Yup.date().test(
      "is-greater",
      "End date can't be before start date",
      function (value) {
        const { startDate } = this.parent;
        console.log(
          "???????????????",
          moment(startDate).format("YYYY-MM-DD"),
          moment(value).format("YYYY-MM-DD")
        );
        return (
          moment(startDate).format("YYYY-MM-DD") <=
          moment(value).format("YYYY-MM-DD")
        );
      }
    ),
  });

  const formik = useFormik({
    initialValues: {
      ldapID: "",
      startDate: startDate,
      endDate: endDate,
    },
    validationSchema,
    validateOnChange: false,
    // validateOnBlur: false,
    enableReinitialize: true,
    onSubmit: async (data) => {
      $("#myTable").DataTable().clear().destroy();
      setTimeout(function () {
        $("#myTable").DataTable({
          buttons: ["csvHtml5"],
          bDestroy: true,
          fixedHeader: true,
          pagingType: "full_numbers",
          pageLength: 10,
          processing: true,
          dom: "Bfrtip",
          select: true,
        });
      }, 300);
      data.userID = localStorage.getItem("userID");
      setIsLoading(true);
      await axios
        .post(process.env.REACT_APP_API_KEY + "assign-project/" + id, data, {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then(function (response) {
          setIsLoading(false);
          swal("Success!", "Delegation Successfully", "success");
          setShow(false);
          formik.setFieldValue("ldapID", "");
        })
        .catch((error) => {
          if (error.response.status === 422) {
            swal("Oops", error.response.data.message, "error");
          }
          setIsLoading(false);
        });

      // console.log(data);
    },
  });
  const deleteRole = async (id) => {
    confirmAlert({
      title: "Confirm to Delete?",
      message: "Are you sure want to delete?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            await axios
              .delete(process.env.REACT_APP_API_KEY + "delete-baUser/" + id, {
                headers: {
                  "Content-type": "Application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              })
              .then(function (response) {
                swal({
                  title: "Deleted!",
                  text: "Deleted Successfully",
                  icon: "success",
                  button: "Okay",
                });
                $("#myTable").DataTable().clear().destroy();
                setTimeout(function () {
                  $("#myTable").DataTable({
                    bDestroy: true,
                    fixedHeader: true,
                    pagingType: "full_numbers",
                    pageLength: 10,
                    processing: true,
                    dom: "Bfrtip",

                    select: true,
                  });
                }, 300);
                getRoles();
              })
              .catch(function (error) {
                if (error.response.status === 422) {
                  swal(
                    "Oops",
                    "The role has already assigned to a user, you are not allowed to delete",
                    "error"
                  );
                }
                setIsLoading(false);
              });
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };
  const handleChange = async (id, status) => {
    await axios
      .get(
        process.env.REACT_APP_API_KEY + "ba-user-status/" + id,

        {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            status: status,
          },
        }
      )
      .then(function (response) {
        if (response.status === 200) {
          swal({
            title: "Success!",
            text: "Update SuccessFully!",
            icon: "success",
            button: "Okay",
          });
        }
        initializeDataTable();
        getRoles();
      })
      .catch(function (error) {
        if (error.response.data.status === 422) {
          swal("Oops", error.response.data.message, "error");
          return;
        }
        if (error.response.data.status === 401) {
          localStorage.clear();
          navigate("/sign-in");
        }
      });
  };

  const renderUser = (
    <table id="myTable" className="table table-striped my-3">
      <thead className="table-dark">
        <tr>
          <th scope="col">#</th>
          <th scope="col">UserID</th>
          <th scope="col">Email</th>

          <th scope="col">BA Role</th>

          <th scope="col">Status</th>
          {localStorage.getItem("user_role") === "super_admin" ? (
            <th scope="col" className="no-export">
              Action
            </th>
          ) : localStorage.getItem("user_role") === "sub_admin" &&
            action === "Modify" ? (
            <th scope="col" className="no-export">
              Action
            </th>
          ) : (
            ""
          )}
        </tr>
      </thead>
      <tbody>
        {roles?.map((role, index) => (
          <React.Fragment key={role.id}>
            <tr>
              <td>{++index}</td>
              <td>{role.name}</td>
              <td>{role.email}</td>
              <td>
                {role.BusinessAnalyst.name ? role.BusinessAnalyst.name : ""}
              </td>

              <td>{role.status === "active" ? "Active" : "Inactive"}</td>

              {localStorage.getItem("user_role") === "super_admin" ? (
                <td>
                  <span
                    id={role.id}
                    onClick={() => handleShow(role)}
                    class="material-icons assignProject"
                    title="Assign User"
                  >
                    3p
                  </span>
                  <NavLink
                    to={{
                      pathname: "/business-analyst-management/edit-ba-user/"+role.id
                    }}
                    state={{ id: role.id }}
                  >
                    <span className="material-icons" title="EDIT">
                      edit
                    </span>
                  </NavLink>
                  &nbsp;
                  {/* <span
                    style={{ color: "red", cursor: "pointer" }}
                    className="material-icons-outlined cursor-default"
                    onClick={() => {
                      deleteRole(role.id);
                    }}
                    title="Delete"
                  >
                    delete
                  </span> */}
                  <span
                    style={
                      role.status === "active"
                        ? { color: "green", cursor: "pointer" }
                        : { color: "red", cursor: "pointer" }
                    }
                    className="material-icons-outlined"
                    onClick={() => {
                      handleChange(role.id, role.status);
                    }}
                    title={role.status === "active" ? "Active" : "Inactive"}
                  >
                    {role.status === "active" ? "toggle_on" : "toggle_off"}
                  </span>
                  &nbsp;
                </td>
              ) : localStorage.getItem("user_role") === "sub_admin" &&
                action === "Modify" ? (
                <td>
                  <span
                    id={role.id}
                    onClick={() => handleShow(role)}
                    class="material-icons assignProject"
                    title="Assign User"
                  >
                    3p
                  </span>
                  <NavLink
                    to={{
                      pathname: "/business-analyst-management/edit-ba-user/"
                      +role.id}}
                    state={{ id: role.id }}
                  >
                    <span className="material-icons" title="EDIT">
                      edit
                    </span>
                  </NavLink>
                  &nbsp;
                  {/* <span
                    style={{ color: "red", cursor: "pointer" }}
                    className="material-icons-outlined cursor-default"
                    onClick={() => {
                      deleteRole(role.id);
                    }}
                    title="Delete"
                  >
                    delete
                  </span> */}
                  <span
                    style={
                      role.status === "active"
                        ? { color: "green", cursor: "pointer" }
                        : { color: "red", cursor: "pointer" }
                    }
                    className="material-icons-outlined"
                    onClick={() => {
                      handleChange(role.id, role.status);
                    }}
                    title={role.status === "active" ? "Active" : "Inactive"}
                  >
                    {role.status === "active" ? "toggle_on" : "toggle_off"}
                  </span>
                  &nbsp;
                </td>
              ) : (
                ""
              )}
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col">
          <div className="page-description">
            <h1>Business Analyst Management</h1>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>User Delegation</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Modal.Title>From</Modal.Title>
                    <Form.Control
                      name="ldapID"
                      type="text"
                      placeholder
                      disabled
                      onChange={formik.handleChange}
                      value={userName}
                    />
                    <br />
                    <Modal.Title>
                      Please enter the LDAP ID OR Email ID.(To)
                    </Modal.Title>
                    <Form.Control
                      name="ldapID"
                      type="text"
                      placeholder
                      onChange={formik.handleChange}
                      value={formik.values.ldapID}
                    />
                    <div className="text-danger">
                      {formik.errors.ldapID && formik.touched.ldapID
                        ? formik.errors.ldapID
                        : null}
                    </div>
                    <Modal.Title>Start Date</Modal.Title>
                    <DatePicker
                      className="form-control"
                      name="startDate"
                      dateFormat="dd-MM-yyyy"
                      selected={startDate}
                      onChange={(date) => {
                        setStartDate(date);
                        formik.setFieldValue(
                          "startDate",
                          dateFormat(date, "yyyy-mm-dd")
                        );
                      }}
                      dropdownMode="select"
                      minDate={new Date()}
                      adjustDateOnChange
                      //disabled={validateField}
                      //placeholderText="Entry Date"
                    />
                    <Modal.Title>End Date</Modal.Title>
                    <DatePicker
                      className="form-control"
                      name="endDate"
                      dateFormat="dd-MM-yyyy"
                      selected={endDate}
                      onChange={(date) => {
                        setEndDate(date);

                        formik.setFieldValue(
                          "endDate",
                          dateFormat(date, "yyyy-mm-dd")
                        );
                      }}
                      dropdownMode="select"
                      minDate={startDate}
                      adjustDateOnChange
                      //disabled={validateField}
                      //placeholderText="Entry Date"
                    />
                    <p className="text-danger">
                      {formik.errors.endDate && formik.touched.endDate
                        ? formik.errors.endDate
                        : null}
                    </p>
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={formik.handleSubmit}>
                  Save
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
      <>
        {localStorage.getItem("user_role") === "super_admin" ? (
          <NavLink
            className="btn btn-info"
            to="/business-analyst-management/add-ba-user"
          >
            Create BA
          </NavLink>
        ) : localStorage.getItem("user_role") === "sub_admin" &&
          action === "Modify" ? (
          <NavLink
            className="btn btn-info"
            to={{ pathname: "/business-analyst-management/add-ba-user" }}
            state={{ action: action }}
          >
            Create BA
          </NavLink>
        ) : (
          ""
        )}
      </>
      {isLoading ? <LoadingSpinner /> : renderUser}
    </div>
  );
}
