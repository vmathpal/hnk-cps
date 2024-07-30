import React, { Fragment } from "react";
//Bootstrap and jQuery libraries
import "jquery/dist/jquery.min.js";
//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from "jquery";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import LoadingSpinner from "../Loader/LoadingSpinner";
import {TimeOutPopUp} from "../TimeOut";

export default function LevelMapping3And4Listing() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const {
    state: { department, action },
  } = useLocation();
  const initializeDataTable = () => {
    $("#myTable").DataTable().clear().destroy();
    setTimeout(function () {
      $("#myTable").DataTable({
        buttons: [
          {
            extend: "excelHtml5",
            title: "",
            text: "Export",
            filename: "role_level_mapping",
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
      .get(process.env.REACT_APP_API_KEY + "role-level34", {
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        initializeDataTable();

        setRoles(response.data.data);
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(">>>>>>>>>>>error", error);
      });
  };

  const deleteRole = async (id) => {
    confirmAlert({
      title: "Confirm to Delete?",
      message: "Are you sure to delete?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            await axios
              .delete(
                process.env.REACT_APP_API_KEY + "delete-levelRole34/" + id,
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

  const renderUser = (
    <table id="myTable" className="table table-striped my-3">
      <thead className="table-dark">
        <tr>
          <th scope="col">#</th>
          <th scope="col">Level 3 Role</th>
          <th scope="col">Level 4 Role</th>
          <th scope="col">Department</th>

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
              <td>{role?.first.role}</td>
              <td>{role?.second.role}</td>
              <td>
                {role?.department === "sales"
                  ? "Sales"
                  : role.department === "trade_marketing"
                  ? "Trade Marketing"
                  : "Marketing"}
              </td>
              {localStorage.getItem("user_role") === "super_admin" ? (
                <td>
                  <NavLink
                    to={{ pathname: "/relation-mapping/edit-role-mapping34" }}
                    state={{ id: role.id, department: role?.department }}
                  >
                    <span className="material-icons" title="Edit">
                      edit
                    </span>
                  </NavLink>
                  &nbsp;
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
                </td>
              ) : localStorage.getItem("user_role") === "sub_admin" &&
                action === "Modify" ? (
                <td>
                  <NavLink
                    to={{ pathname: "/relation-mapping/edit-role-mapping34" }}
                    state={{ id: role.id, department: role?.department }}
                  >
                    <span className="material-icons" title="Edit">
                      edit
                    </span>
                  </NavLink>
                  &nbsp;
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
            <h1>Level 3 & 4 Relation Mapping Role Listing</h1>
          </div>
        </div>
      </div>
      <>
        <NavLink
          className="btn btn-info"
          to={
            localStorage.getItem("user_role") === "sub_admin"
              ? "/relation-mapping/" + action
              : "/relation-mapping"
          }
        >
          Back
        </NavLink>
      </>
      {isLoading ? <LoadingSpinner /> : renderUser}
    </div>
  );
}
