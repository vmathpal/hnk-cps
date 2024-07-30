import React, { Fragment } from "react";
//Bootstrap and jQuery libraries
import "jquery/dist/jquery.min.js";
//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from "jquery";
import {TimeOutPopUp} from "../TimeOut";

import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import LoadingSpinner from "../Loader/LoadingSpinner";

export default function SubAdminList() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [isLoadData, setIsLoadData] = useState(true);
  const [roles, setRoles] = useState([]);

  const initializeDataTable = () => {
    $("#myTable").DataTable().clear().destroy();
    setTimeout(function () {
      $("#myTable").DataTable({
        buttons: [
          {
            extend: "excelHtml5",
            title: "",
            text: "Export",
            filename: "cost_center_users",
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

  const getRoles = async () => {
    setIsLoading(true);
    await axios
      .get(process.env.REACT_APP_API_KEY + "get-all-subAdmin", {
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        setRoles(response.data.data);
        initializeDataTable();
        setIsLoading(false);
      })
      .catch(function (error) {
        //console.log('>>>>>>>>>>>error',error)
        if (error.response.status === 401) {
          localStorage.clear();
          navigate("/sign-in");
        }
      });
  };

  const deleteRole = async (id) => {
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
                response.data ? setIsLoadData(true) : setIsLoadData(false);

                swal({
                  title: "Deleted!",
                  text: "Deleted Successfully",
                  icon: "success",
                  button: "Okay",
                });

                initializeDataTable();
                getRoles();
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

  const handleChange = async (id) => {
    await axios
      .get(process.env.REACT_APP_API_KEY + "admin-status/" + id, {
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        response.data ? setIsLoadData(true) : setIsLoadData(false);
        swal({
          title: "Updated!",
          text: "Updated Successfully",
          icon: "success",
          button: "Okay",
        });

        initializeDataTable();
        getRoles();
      })
      .catch(function (error) {
        console.log(error);
        if (error.response.data.status === 401) {
          localStorage.clear();
          navigate("/sign-in");
        }
      });
  };

  if (!isLoadData) {
    return (
      <div>
        <LoadingSpinner></LoadingSpinner>
      </div>
    );
  }
  const renderUser = (
    <table id="myTable" className="table table-striped my-3">
      <thead className="table-dark">
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Status</th>
          <th scope="col" className="no-export">
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {roles?.map((role, index) => (
          <React.Fragment key={role.id}>
            <tr>
              <td>{++index}</td>
              <td>{role?.name}</td>
              <td>{role?.email}</td>
              <td>{role.status === "active" ? "Active" : "Inactive"}</td>
              <td>
                <NavLink
                  to={{ pathname: "/sub-admin-list/edit-sub-admin/"+role.id }}
                  state={{ id: role.id }}
                >
                  <span className="material-icons" title="Edit">
                    edit
                  </span>
                </NavLink>
                &nbsp; &nbsp;
                <span
                  style={
                    role?.status === "active"
                      ? { color: "green", cursor: "pointer" }
                      : { color: "red", cursor: "pointer" }
                  }
                  className="material-icons-outlined"
                  onClick={() => {
                    handleChange(role.id);
                  }}
                  title={role?.status === "active" ? "Active" : "Inactive"}
                >
                  {role?.status === "active" ? "toggle_on" : "toggle_off"}
                </span>
                &nbsp; &nbsp;
                <span
                  style={{ color: "red", cursor: "pointer" }}
                  className="material-icons-outlined cursor-default"
                  onClick={() => {
                    deleteRole(role.id);
                  }}
                  title="Delete"
                >
                  delete
                </span>
                &nbsp; &nbsp;
                <NavLink
                  to={{ pathname: "/sub-admin-list/privilege-management" }}
                  state={{ id: role.id }}
                >
                  <span
                    style={{ color: "blue", cursor: "pointer" }}
                    className="material-icons-outlined cursor-default"
                    title="Privilege Management"
                  >
                    list
                  </span>
                </NavLink>
                &nbsp; &nbsp;
                <NavLink
                  to={{ pathname: "/sub-admin-list/assign-admin-role" }}
                  state={{ userId: role.id }}
                >
                  <span className="material-icons" title="Add Role Privilege">
                    person_add
                  </span>
                </NavLink>
              </td>
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
            <h1>SubAdmin Management</h1>
          </div>
        </div>
      </div>
      <>
        <NavLink className="btn btn-info" to="/add-subAdmin">
          Add SubAdmin
        </NavLink>
      </>
      {isLoading ? <LoadingSpinner /> : renderUser}
    </div>
  );
}
