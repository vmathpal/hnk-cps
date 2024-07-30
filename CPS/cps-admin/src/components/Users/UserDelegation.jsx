import React, { Fragment } from "react";
//Bootstrap and jQuery libraries
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useFormik } from "formik";
import {TimeOutPopUp} from "../TimeOut";
import * as Yup from "yup";
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
import moment from "moment";
export default function UserDelegation() {
  let { action } = useParams();

  const handleClose = () => setShow(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [id, setPID] = useState(0);
  const [show, setShow] = useState(false);
  const [userName, setUserName] = useState(false);
  const [userDelegation, setUserDelegation] = useState(false);
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
  const handleShow = (user) => {
    setPID(user.id);
    setUserName(user.email.split("@")[0]);
    setStartDate(moment(user.assignStartDate).toDate());
    setEndDate(moment(user.assignEndDate).toDate());
    setUserDelegation(user.delegation.email.split("@")[0]);
    setShow(true);
  };
  const getUsers = async () => {
    setIsLoading(true);
    await axios({
      url: process.env.REACT_APP_API_KEY + "delegation-list",
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
    validateOnChange: true,
    // validateOnBlur: false,
    onSubmit: async (data) => {
      initializeDataTable();
      data.userID = localStorage.getItem("userID");
      setIsLoading(true);
      await axios
        .post(process.env.REACT_APP_API_KEY + "update-delegation/" + id, data, {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then(function (response) {
          setIsLoading(false);
          swal("Success!", "Project assigned Successfully!", "success");
          setShow(false);
          getUsers();
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

  // const assignProject = async (event) => {
  //   var userId = event.currentTarget.id;

  //   swal({
  //     text: "Please enter the LDAP ID OR Email ID.",
  //     content: "input",
  //     button: {
  //       text: "Assign user!",
  //       closeModal: false,
  //     },
  //   })
  //     .then((name) => {
  //       if (!name) throw null;
  //       axios
  //         .post(
  //           process.env.REACT_APP_API_KEY + "assign-project/" + userId,
  //           { userID: localStorage.getItem("userID"), ldapID: name },
  //           {
  //             headers: {
  //               "Content-type": "Application/json",
  //               Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
  //             },
  //           }
  //         )
  //         .then(function (response) {
  //           swal("Success!", "Project assigned Successfully!", "success");
  //           $("#myTable").DataTable().clear().destroy();
  //           setTimeout(function () {
  //             $("#myTable").DataTable({
  //               buttons: ["csvHtml5"],
  //               bDestroy: true,
  //               fixedHeader: true,
  //               pagingType: "full_numbers",
  //               pageLength: 10,
  //               processing: true,
  //               dom: "Bfrtip",
  //               select: true,
  //             });
  //           }, 300);
  //           getUsers();
  //         })
  //         .catch((error) => {
  //           return swal("Oops!", error.response.data.message, "error");
  //         });
  //     })
  //     .then((results) => {
  //       console.log(results);
  //       return results.json();
  //     })
  //     .then((json) => {
  //       const resp = json.results[0];
  //       console.log(json);
  //       // if (!movie) {
  //       //   return swal("No movie was found!");
  //       // }

  //       // const name = movie.trackName;
  //       // const imageURL = movie.artworkUrl100;

  //       // swal({
  //       //   title: "Top result:",
  //       //   text: name,
  //       //   icon: imageURL,
  //       // });
  //     })
  //     .catch((err) => {
  //       if (err) {
  //         // swal("Oh noes!", "The AJAX request failed!", "error");
  //       } else {
  //         swal.stopLoading();
  //         swal.close();
  //       }
  //     });
  // };
  const handleChange = async (id) => {
    await axios
      .get(
        process.env.REACT_APP_API_KEY + "admin-status/" + id,

        {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
        getUsers();
      })
      .catch(function (error) {
        console.log(error);
        if (error.response.data.status === 401) {
          localStorage.clear();
          navigate("/sign-in");
        }
      });
  };
  const deleteUser = async (id) => {
    confirmAlert({
      title: "Cancel Delegation?",
      message: "Are you sure want to cancel delegation?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            await axios
              .delete(
                process.env.REACT_APP_API_KEY + "delete-delegation/" + id,
                {
                  headers: {
                    "Content-type": "Application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              )
              .then(function (response) {
                swal({
                  title: "Cancelled!",
                  text: "Cancelled Successfully",
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
          <th scope="col">User</th>
          <th scope="col">Delegated User</th>
          <th scope="col">Start Date</th>
          <th scope="col">End Date</th>
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
            <td>{user.email.split("@")[0]}</td>
            <td>{user.delegation?.email.split("@")[0]}</td>
            <td>{dateFormat(user.assignStartDate, "yyyy-mm-dd")}</td>
            <td>{dateFormat(user.assignEndDate, "yyyy-mm-dd")}</td>

            {localStorage.getItem("user_role") === "super_admin" ? (
              <td>
                <span
                  id={user.id}
                  onClick={() => handleShow(user)}
                  class="material-icons"
                  title="Edit"
                  style={{ cursor: "pointer" }}
                >
                  edit
                </span>
                &nbsp;
                <span
                  style={{ color: "red", cursor: "pointer" }}
                  className="material-icons-outlined cursor-default"
                  onClick={() => {
                    deleteUser(user.id);
                  }}
                  title="Cancel"
                >
                  cancel
                </span>
              </td>
            ) : localStorage.getItem("user_role") === "sub_admin" &&
              action === "Modify" ? (
              <td>
                <span
                  id={user.id}
                  onClick={() => handleShow(user)}
                  class="material-icons"
                  style={{ cursor: "pointer" }}
                  title="Assign User"
                >
                  edit
                </span>
                &nbsp;
                <span
                  style={{ color: "red", cursor: "pointer" }}
                  className="material-icons-outlined cursor-default"
                  onClick={() => {
                    deleteUser(user.id);
                  }}
                  title="Cancel"
                >
                  cancel
                </span>
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
            <h1>User Delegation</h1>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Edit User Delegation</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Modal.Title></Modal.Title>
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
                      Please enter the LDAP ID OR Email ID.
                    </Modal.Title>
                    <Form.Control
                      name="ldapID"
                      type="text"
                      placeholder
                      disabled
                      onChange={formik.handleChange}
                      value={userDelegation}
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
      {isLoading ? <LoadingSpinner /> : renderUser}
    </div>
  );
}
