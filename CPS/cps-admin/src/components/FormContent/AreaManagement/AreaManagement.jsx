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
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import LoadingSpinner from "../../Loader/LoadingSpinner";
import {TimeOutPopUp} from "../../TimeOut";


export default function AreaManagement() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [channels, setRoles] = useState([]);
  let { action } = useParams();
  const initializeDataTable = () => {
    $("#myTable").DataTable().clear().destroy();
    setTimeout(function () {
      $("#myTable").DataTable({
        buttons: [
          {
            extend: "excelHtml5",
            title: "",
            text: "Export",
            filename: "district",
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
    await axios({
      url: process.env.REACT_APP_API_KEY + "get-area-list",
      method: "get",
      params: {
        url: "area-management",
        userID: localStorage.getItem("userID"),
        role: localStorage.getItem("user_role"),
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(function (response) {
        setRoles(response.data.data);
        setIsLoading(false);
        initializeDataTable();
      })
      .catch(function (error) {
        if (error.response.status === 401) {
          localStorage.clear();
          navigate("/sign-in");
        }
        if (error.response.status === 422) {
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

  const deleteRole = async (id) => {
    confirmAlert({
      title: "Confirm to Delete?",
      message: "Are you sure want to delete?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            await axios
              .delete(process.env.REACT_APP_API_KEY + "delete-area/" + id, {
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
                initializeDataTable();
                getRoles();
              })
              .catch(function (error) {
                swal({
                  title: "Error!",
                  text: "District has already been assigned, you are not allowed to delete.",
                  icon: "error",
                  button: "Okay",
                });
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
          <th scope="col">District Name</th>
          <th scope="col">Region Name</th>
          {/* <th scope="col">Status</th> */}
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
        {channels?.map((channel, index) => (
          <React.Fragment key={channel.id}>
            <tr>
              <td>{++index}</td>
              <td>{channel.name}</td>
              <td>{channel.Channel.name}</td>
              {/* <td>{channel?.status === "active" ? "Active" : "Inactive"}</td> */}

              {localStorage.getItem("user_role") === "super_admin" ? (
                <td>
                  <NavLink
                    to={{ pathname: "/area-management/edit-area/"+channel.id }}
                    state={{ id: channel.id }}
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
                      deleteRole(channel.id);
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
                    to={{ pathname: "/area-management/edit-area/"+channel.id }}
                    state={{ id: channel.id }}
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
                      deleteRole(channel.id);
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
            <h1>District Management</h1>
          </div>
        </div>
      </div>
      <>
        {localStorage.getItem("user_role") === "super_admin" ? (
          <NavLink className="btn btn-info" to="/area-management/add-area">
            Create District
          </NavLink>
        ) : localStorage.getItem("user_role") === "sub_admin" &&
          action === "Modify" ? (
          <NavLink
            className="btn btn-info"
            to={{ pathname: "/area-management/add-area" }}
            state={{ action: action }}
          >
            Create District
          </NavLink>
        ) : (
          ""
        )}
      </>
      {isLoading ? <LoadingSpinner /> : renderUser}
    </div>
  );
}
