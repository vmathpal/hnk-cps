import React, { Fragment } from "react";
//Bootstrap and jQuery libraries
import "jquery/dist/jquery.min.js";
//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from "jquery";
import dateFormat from "dateformat";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import LoadingSpinner from "../Loader/LoadingSpinner";

export default function ProjectBaseAudit() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [project, setProjects] = useState([]);
  let { action } = useParams();
  const {
    state: { actionView },
  } = useLocation();
  let view = actionView ? actionView : "Modify";
  useEffect(() => {
    //$('.dt-buttons').hide();
    getRoles();
  }, []);

  const getRoles = async () => {
    setIsLoading(true);
    await axios({
      url: process.env.REACT_APP_API_KEY + "projectby-audit-log/" + action,
      method: "get",
      params: {
        role: localStorage.getItem("user_role"),
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(function (response) {
        setProjects(response.data.data);
        setIsLoading(false);
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

  //initialize datatable
  useEffect(() => {
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
  }, []);

  const renderUser = (
    <table id="myTable" className="blocks table-responsive ">
      <thead>
        <tr>
          <th className="blue-bold">Request ID</th>
          <th className="blue-bold">Project Name</th>
          <th className="blue-bold">Project Owner</th>
          <th className="blue-bold">Action Date</th>
          <th className="blue-bold">Action Taken</th>
          <th className="blue-bold">Action By</th>
          <th className="blue-bold">Comment</th>
        </tr>
      </thead>
      <tbody>
        {
          <>
            {project?.map((pro, index) => (
              <tr key={index}>
                <td>{pro.Project?.id}</td>
                <td>{pro.Project?.name}</td>
                <td>{pro.User?.email.split("@")[0]}</td>
                <td>{dateFormat(pro.createdAt, "dd mmm yyyy")}</td>
                <td>{pro.message}</td>
                <td>{pro.actionBy ? pro.actionBy : "-"}</td>
                <td>{pro.comment ? pro.comment : "-"}</td>
              </tr>
            ))}
          </>
        }
      </tbody>
    </table>
  );
  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col">
          <div className="page-description">
            <h1>Project Based Audit Log</h1>
          </div>
          <div>
            <Link
              className="btn btn-primary mx-3"
              to={
                localStorage.getItem("user_role") === "sub_admin"
                  ? `/project-management/${view}`
                  : "/project-management"
              }
            >
              Back
            </Link>
          </div>
        </div>
      </div>

      {isLoading ? <LoadingSpinner /> : renderUser}
    </div>
  );
}
