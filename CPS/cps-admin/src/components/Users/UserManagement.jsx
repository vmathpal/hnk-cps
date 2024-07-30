import React, { Fragment } from "react";
//Bootstrap and jQuery libraries
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import {TimeOutPopUp} from "../TimeOut";

import DatePicker from "react-datepicker";
import dateFormat from "dateformat";
import "jquery/dist/jquery.min.js";

//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import "datatables.net-buttons/js/dataTables.buttons.js";
import "datatables.net-buttons/js/buttons.colVis.js";
import "datatables.net-buttons/js/buttons.flash.js";
import "datatables.net-buttons/js/buttons.html5.js";
import "datatables.net-buttons/js/buttons.print.js";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from "jquery";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { useState, useEffect } from "react";
import { NavLink, useNavigate, Link, useParams } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import LoadingSpinner from "../Loader/LoadingSpinner";

export default function UserManagement() {
  let { action } = useParams();

  const handleClose = () => setShow(false);
  const handlePopupClose = () => setPopupShow(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [id, setPID] = useState(0);
  const [show, setShow] = useState(false);
  const [popupShow, setPopupShow] = useState(false);

  const [userName, setUserName] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  useEffect(() => {
    if (! localStorage.getItem("token")) {
      TimeOutPopUp(navigate);
      return;
       }
    getUsers();
    document.body.className = "pace-done no-loader users";
    if ($("body").hasClass("users")) {
      $(".dt-buttons").addClass("csv-button");
    }
    return () => {
      document.body.className = "pace-done no-loader";
    };
  }, []);
  const initializeDataTable = () => {
    $("#myTable").DataTable().clear().destroy();
    setTimeout(function () {
      $("#myTable").DataTable({
        buttons: [
          {
            extend: "excelHtml5",
            title: "",
            text: "Export",
            filename: "Users",
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
  const handleShow = (user) => {
    setPID(user.id);
    setUserName(user.email.split("@")[0]);
    setShow(true);
  };
  const handlePopup = (user) => {
    setPID(user.id);
    formikProject.setFieldValue("ldapIDFrom", user.email.split("@")[0]);
    formikProject.setFieldValue("userFromID", user.id);
    setPopupShow(true);
  };
  const getUsers = async () => {
    setIsLoading(true);
    await axios({
      url: process.env.REACT_APP_API_KEY + "user-list",
      method: "get",
      params: {
        url: "user-management",
        userID: localStorage.getItem("userID"),
        role: localStorage.getItem("user_role"),
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(function (response) {
        console.log("response.data.data", response.data.data);
        setUsers(response.data.data);
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
      .max(500, "LDAP 500 characters"),
    startDate: Yup.date(),
    endDate: Yup.date().min(
      Yup.ref("startDate"),
      "End date can't be before start date"
    ),
  });

  const validationSchemaProject = Yup.object().shape({
    ldapIDTo: Yup.string()
      .required("Field is required")
      .min(3, "Minimum 3 Character")
      .max(500, "LDAP 500 characters"),
  });

  const formikProject = useFormik({
    initialValues: {
      ldapIDFrom: "",
      ldapIDTo: "",
    },
    validationSchema: validationSchemaProject,
    validateOnChange: false,
    enableReinitialize: true,
    validateOnBlur: false,
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
        .post(
          process.env.REACT_APP_API_KEY + "assign-all-project/" + id,
          data,
          {
            headers: {
              "Content-type": "Application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then(function (response) {
          formikProject.setFieldValue("ldapIDFrom", null);

          setIsLoading(false);
          swal("Success!", "Transfer Project Successfully", "success");
          setPopupShow(false);
          getUsers();
          formikProject.setFieldValue("ldapIDTo", "");
        })
        .catch((error) => {
          if (error.response.status === 422) {
            swal("Oops", error.response.data.message, "error");
          }
          if (error.response.status === 401) {
            swal("Oops", error.response.data.message, "error");
          }
          setIsLoading(false);
        });
    },
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
          getUsers();
        })
        .catch((error) => {
          if (error.response.status === 422) {
            swal("Oops", error.response.data.message, "error");
          }
          if (error.response.status === 401) {
            swal("Oops", error.response.data.message, "error");
          }
          setIsLoading(false);
        });
    },
  });
  const handleChange = async (id, status) => {
    await axios
      .get(
        process.env.REACT_APP_API_KEY + "admin-status/" + id,

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
        getUsers();
        initializeDataTable();
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
  const deleteUser = async (id) => {
    confirmAlert({
      title: "Confirm to Delete?",
      message: "Are you sure want to delete?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            await axios
              .delete(
                process.env.REACT_APP_API_KEY + "delete-sub-admin/" + id,
                {
                  headers: {
                    "Content-type": "Application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              )
              .then(function (response) {
                swal({
                  title: "Deleted!",
                  text: "Deleted Successfully",
                  icon: "success",
                  button: "Okay",
                });
                initializeDataTable();
                getUsers();
              })
              .catch(function (error) {
                console.log(error);
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

  const renderUser = (
    <table id="myTable" className="table table-striped my-3">
      <thead className="table-dark">
        <tr>
          <th scope="col">#</th>
          <th scope="col">LDAP UserID</th>
          <th scope="col">Email</th>
          <th scope="col">Role</th>
          <th scope="col">Level</th>
          <th scope="col">Department</th>
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
        {Object.values(users)?.map((user, index) => (
          <tr key={user?.id}>
            <td>{++index}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.roleName.role}</td>
            <td>{user.level}</td>
            <td>
              {user.department === "sales"
                ? "Sales"
                : user.department === "trade_marketing"
                ? "Trade Marketing"
                : user.department === "marketing"
                ? "Marketing"
                : "Other"}
            </td>
            <td>{user.status === "active" ? "Active" : "Inactive"}</td>
            {localStorage.getItem("user_role") === "super_admin" ? (
              <td>
                {user.status === "active" ? (
                  <>
                    <span
                      id={user.id}
                      onClick={() => handleShow(user)}
                      class="material-icons assignProject"
                      title="Assign User"
                    >
                      3p
                    </span>{" "}
                    &nbsp; &nbsp;
                    <span
                      id={user.id}
                      onClick={() => handlePopup(user)}
                      class="material-icons assignProject"
                      title="Transfer Project"
                    >
                      assignment_return
                    </span>{" "}
                    &nbsp; &nbsp;
                  </>
                ) : (
                  ""
                )}
                {user?.isGM === "yes" ? (
                  <Link
                    to={{ pathname: "/user-management/edit-gm-user" }}
                    state={{ UserId: user.id }}
                  >
                    <span className="material-icons" title="Edit">
                      edit
                    </span>
                  </Link>
                ) : (
                  <Link
                    to={{ pathname: "/user-management/edit-user/"+  user.id }}
                  
                  >
                    <span className="material-icons" title="Edit">
                      edit
                    </span>
                  </Link>
                )}
                &nbsp; &nbsp;
                <span
                  style={
                    user.status === "active"
                      ? { color: "green", cursor: "pointer" }
                      : { color: "red", cursor: "pointer" }
                  }
                  className="material-icons-outlined"
                  onClick={() => {
                    handleChange(user.id, user.status);
                  }}
                  title={user.status === "active" ? "Active" : "Inactive"}
                >
                  {user.status === "active" ? "toggle_on" : "toggle_off"}
                </span>
                &nbsp; &nbsp;
              </td>
            ) : localStorage.getItem("user_role") === "sub_admin" &&
              action === "Modify" ? (
              <td>
                {user.status === "active" ? (
                  <>
                    <span
                      id={user.id}
                      onClick={() => handleShow(user)}
                      class="material-icons assignProject"
                      title="Assign User"
                    >
                      3p
                    </span>{" "}
                    &nbsp; &nbsp;
                    <span
                      id={user.id}
                      onClick={() => handlePopup(user)}
                      class="material-icons assignProject"
                      title="Transfer Project"
                    >
                      assignment_return
                    </span>{" "}
                    &nbsp; &nbsp;
                  </>
                ) : (
                  ""
                )}
                {user?.isGM === "yes" ? (
                  <Link
                    to={{ pathname: "/user-management/edit-gm-user" }}
                    state={{ UserId: user.id }}
                  >
                    <span className="material-icons" title="Edit">
                      edit
                    </span>
                  </Link>
                ) : (
                  <Link
                    to={{ pathname: "/user-management/edit-user/"+  user.id}}
                    // state={{ UserId: user.id }}
                  >
                    <span className="material-icons" title="Edit">
                      edit
                    </span>
                  </Link>
                )}
                &nbsp; &nbsp;
                <span
                  style={
                    user.status === "active"
                      ? { color: "green", cursor: "pointer" }
                      : { color: "red", cursor: "pointer" }
                  }
                  className="material-icons-outlined"
                  onClick={() => {
                    handleChange(user.id, user.status);
                  }}
                  title={user.status === "active" ? "Active" : "Inactive"}
                >
                  {user.status === "active" ? "toggle_on" : "toggle_off"}
                </span>
                &nbsp; &nbsp;
              </td>
            ) : (
              ""
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col">
          <div className="page-description">
            <h1>User Management</h1>
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
                      className="ldapIDTo"
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
                      selected={formik.values.startDate} 
                      onChange={(date) => {
                        console.log("12345678",date)
                        formik.setFieldValue(
                          "startDate",
                          date
                        );
                      }}
                      dropdownMode="select"
                      minDate={new Date()}
                      adjustDateOnChange
                    />
                    <Modal.Title>End Date</Modal.Title>
                    <DatePicker
                      className="form-control"
                      name="endDate"
                      dateFormat="dd-MM-yyyy"
                      selected={formik.values.endDate} 
                      onChange={(date) => {
                        formik.setFieldValue(
                          "endDate",
                          date
                        );
                      }}
                      dropdownMode="select"
                      minDate={startDate}
                      adjustDateOnChange
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

      <Modal show={popupShow} onHide={handlePopupClose}>
        <Modal.Header closeButton>
          <Modal.Title>Product Transfer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Modal.Title>From</Modal.Title>
              <Form.Control
                name="ldapIDFrom"
                type="text"
                placeholder="From"
                readOnly="true"
                onChange={formikProject.handleChange}
                value={formikProject.values.ldapIDFrom}
              />
              <br />
              <Modal.Title>To (LDAP ID OR Email ID.)</Modal.Title>
              <Form.Control
                name="ldapIDTo"
                type="text"
                placeholder="LDAP ID OR Email ID"
                onChange={formikProject.handleChange}
                value={formikProject.values.ldapIDTo}
              />
              <div className="text-danger">
                {formikProject.errors.ldapIDTo && formikProject.touched.ldapIDTo
                  ? formikProject.errors.ldapIDTo
                  : null}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handlePopupClose}>
            Close
          </Button>
          <Button variant="primary" onClick={formikProject.handleSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <>
        {localStorage.getItem("user_role") === "super_admin" ? (
          <>
            <NavLink className="btn btn-info" to="/add-user">
              Add User
            </NavLink>
            <NavLink className="btn btn-info mx-3" to="/add-gm-user">
              Add GM
            </NavLink>
            <NavLink className="btn btn-info mx-3" to="/add-commercial-user">
              Commercial Controller User
            </NavLink>
            <NavLink className="btn btn-info mx-3" to="/add-finance-user">
              Add Finance Director
            </NavLink>
          </>
        ) : localStorage.getItem("user_role") === "sub_admin" &&
          action === "Modify" ? (
          <>
            <NavLink className="btn btn-info" to="/add-user">
              Add User
            </NavLink>
            <NavLink className="btn btn-info mx-3" to="/add-gm-user">
              Add GM
            </NavLink>
          </>
        ) : (
          ""
        )}
      </>
      {isLoading ? <LoadingSpinner /> : renderUser}
    </div>
  );
}
