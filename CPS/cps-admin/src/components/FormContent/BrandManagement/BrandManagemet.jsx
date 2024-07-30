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
import * as Yup from "yup";
import { useFormik } from "formik";
import LoadingSpinner from "../../Loader/LoadingSpinner";
import BrandSkuImport from "./BulkUpload/BrandSkuImport";
import ProjectImport from "./BulkUpload/ProjectImport";
import {TimeOutPopUp} from "../../TimeOut";


export default function BrandManagemet() {
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
            filename: "brands_list",
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
    //$('.dt-buttons').hide();
    if (! localStorage.getItem("token")) {
       TimeOutPopUp(navigate);
       return;
      }
      
    getBrands();
    document.body.className = "pace-done no-loader users";
    if ($("body").hasClass("users")) {
      $(".dt-buttons").addClass("csv-button");
    }
    return () => {
      document.body.className = "pace-done no-loader";
    };
  }, []);

  const getBrands = async () => {
    setIsLoading(true);
    await axios({
      url: process.env.REACT_APP_API_KEY + "get-brands-list",
      method: "get",
      params: {
        url: "brand-management",
        userID: localStorage.getItem("userID"),
        role: localStorage.getItem("user_role"),
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(function (response) {
        console.log(response.data.data);
        setRoles(response.data.data);
        setIsLoading(false);
        initializeDataTable();
      })
      .catch(function (error) {
        if (error.response.status === 401) {
          localStorage.clear();
          navigate("/sign-in");
        }
        // if (error.response.status === 422) {
        //   swal({
        //     title: "Error!",
        //     text: "Permission Denied",
        //     icon: "error",
        //     button: "Okay",
        //   });
        //   navigate("/dashboard");
        //   return false;
        // }
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
              .delete(process.env.REACT_APP_API_KEY + "delete-brand/" + id, {
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
                getBrands();
              })
              .catch(function (error) {
                swal({
                  title: "Error!",
                  text: "Brand has already been assigned, you are not allowed to delete.",
                  icon: "error",
                  button: "Okay",
                });
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
      .get(process.env.REACT_APP_API_KEY + "brand-status/" + id, {
        headers: {
          "Content-type": "Application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        swal({
          title: "Updated!",
          text: "Updated Successfully",
          icon: "success",
          button: "Okay",
        });
        initializeDataTable();
        getBrands();
      })
      .catch(function (error) {
        console.log(error);
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
          <th scope="col">Name</th>
          <th scope="col">Brand Code</th>
          <th scope="col">Status</th>
          {localStorage.getItem("user_role") === "super_admin" ? (
            <th scope="col" className="np-export">
              Action
            </th>
          ) : localStorage.getItem("user_role") === "sub_admin" &&
            action === "Modify" ? (
            <th scope="col" className="np-export">
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
              <td>{channel.brandCode}</td>
              <td>{channel?.status === "active" ? "Active" : "Inactive"}</td>

              {localStorage.getItem("user_role") === "super_admin" ? (
                <td>
                  <NavLink
                    to={{ pathname: "/brand-management/edit-brand/"+channel.id }}
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
                  <span
                    style={
                      channel?.status === "active"
                        ? { color: "green", cursor: "pointer" }
                        : { color: "red", cursor: "pointer" }
                    }
                    className="material-icons-outlined"
                    onClick={() => {
                      handleChange(channel.id);
                    }}
                    title={channel?.status === "active" ? "Active" : "Inactive"}
                  >
                    {channel?.status === "active" ? "toggle_on" : "toggle_off"}
                  </span>
                  &nbsp;
                </td>
              ) : localStorage.getItem("user_role") === "sub_admin" &&
                action === "Modify" ? (
                <td>
                  <NavLink
                    to={{ pathname: "/brand-management/edit-brand/"+channel.id }}
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
                  <span
                    style={
                      channel?.status === "active"
                        ? { color: "green", cursor: "pointer" }
                        : { color: "red", cursor: "pointer" }
                    }
                    className="material-icons-outlined"
                    onClick={() => {
                      handleChange(channel.id);
                    }}
                    title={channel?.status === "active" ? "Active" : "Inactive"}
                  >
                    {channel?.status === "active" ? "toggle_on" : "toggle_off"}
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
            <h1>Brand Management</h1>
          </div>
          <>{/* <ProjectImport /> */}</>
          <div className="mt-2">
            {localStorage.getItem("user_role") === "super_admin" ? (
              <NavLink
                className="btn btn-info"
                to="/brand-management/add-brand"
              >
                Create Brand
              </NavLink>
            ) : localStorage.getItem("user_role") === "sub_admin" &&
              action === "Modify" ? (
              <NavLink
                className="btn btn-info"
                to={{ pathname: "/brand-management/add-brand" }}
                state={{ action: action }}
              >
                Create Brand
              </NavLink>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <>{isLoading ? <LoadingSpinner /> : renderUser}</>
    </div>
  );
}
