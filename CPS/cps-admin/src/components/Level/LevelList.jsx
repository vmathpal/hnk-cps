import React, { Fragment } from "react";
import "jquery/dist/jquery.min.js";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from "jquery";
import {TimeOutPopUp} from "../TimeOut";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import LoadingSpinner from "../Loader/LoadingSpinner";

export default function LevelList() {
  let { action } = useParams();
  console.log(">>", action);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [levels, setLevels] = useState([]);
  const initializeDataTable = () => {
    $("#myTable").DataTable().clear().destroy();
    setTimeout(function () {
      $("#myTable").DataTable({
        buttons: [
          {
            extend: "excelHtml5",
            title: "",
            text: "Export",
            filename: "levels",
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
    getLevels();
    document.body.className = "pace-done no-loader users";
    if ($("body").hasClass("users")) {
      $(".dt-buttons").addClass("csv-button");
    }
    return () => {
      document.body.className = "pace-done no-loader";
    };
  }, []);

  const getLevels = async () => {
    setIsLoading(true);
    await axios({
      url: process.env.REACT_APP_API_KEY + "get-levels",
      method: "get",
      params: {
        url: "level-management",
        userID: localStorage.getItem("userID"),
        role: localStorage.getItem("user_role"),
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(function (response) {
        setLevels(response.data.data);
        setIsLoading(false);
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
        console.log(">>>>>>>>>>>error", error);
      });
  };

  //initialize datatable
  useEffect(() => {
    initializeDataTable();
  }, []);

  const renderUser = (
    <table id="myTable" className="table table-striped my-3">
      <thead className="table-dark">
        <tr>
          <th scope="col">#</th>
          <th scope="col">Level</th>
          {/* <th scope="col">Department</th> */}

          <th scope="col" className="no-export">
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {levels.map((level, index) => (
          <React.Fragment key={level.id}>
            <tr>
              <td>{++index}</td>
              <td>{level.name}</td>
              <td>
                <Link
                  to={{ pathname: "/level-management/edit-level" }}
                  state={{ id: level.id, action: action }}
                >
                  <span className="material-icons" title="View">
                    visibility
                  </span>
                </Link>
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
            <h1>Level Management</h1>
          </div>
        </div>
      </div>
      <>
        {/* <NavLink className="btn btn-info" to="/add-level">
          Add Level
        </NavLink> */}
      </>
      {isLoading ? <LoadingSpinner /> : renderUser}
    </div>
  );
}
