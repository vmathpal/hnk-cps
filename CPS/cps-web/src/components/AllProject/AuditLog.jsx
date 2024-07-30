import { useState, useEffect } from "react";
//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import "datatables.net-buttons/js/dataTables.buttons.js";
import "datatables.net-buttons/js/buttons.colVis.js";
import "datatables.net-buttons/js/buttons.colVis.min.js";
import "datatables.net-buttons/js/buttons.flash.js";
import "datatables.net-buttons/js/buttons.html5.js";
import "datatables.net-buttons/js/buttons.print.js";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import dateFormat from "dateformat";
import Select from "react-select";
import moment from "moment";
import Filter from "../../images/FilterIc.svg";
import { NavLink } from "react-router-dom";
import $ from "jquery";
import LoadingSpinner from "../Loader/LoadingSpinner";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
// let { ProjectId } = useParams();
const AuditLog = () => {
  const { state } = useLocation();

  let projectID = state ? state.projectID : "";

  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");

  const [project, setProject] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const data = [
    { value: "", label: "Audit Log" },
    { value: "sales", label: "Sales" },
    { value: "marketing", label: "Marketing" },
    { value: "trade_marketing", label: "Trade Marketing" },
  ];
  const statusData = [
    { value: "", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "draft", label: "Draft" },
    // { value: "cancelled", label: "Cancelled" },
    { value: "rejected", label: "Rejected" },
    { value: "approved", label: "Approved" },
    { value: "closed", label: "Closed" },
  ];

  function ProjectNumber(n) {
    var string = "" + n;
    var pad = "0000";
    n = pad.substring(0, pad.length - string.length) + string;
    return n;
  }
  useEffect(() => {
    const handleContextmenu = (e) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextmenu);
    return function cleanup() {
      document.removeEventListener("contextmenu", handleContextmenu);
    };
  }, []);
  const ShowDataTabel = () => {
    $("#myTable").DataTable().clear().destroy();
    setTimeout(function () {
      $("#myTable").DataTable({
        // dom: "Bfrtip",
        bDestroy: true,
        fixedHeader: true,
        aaSorting: [[0, "desc"]],
        bInfo: true, //Dont display info e.g. "Showing 1 to 4 of 4 entries"
        paging: true, //Dont want paging
        bPaginate: true, //Dont want paging
        processing: true,
        searching: true,
        select: true,
        scrollX: true,
        fixedHeader: {
          headerOffset: 75,
        },
      });
    }, 300);
  };
  useEffect(() => {
    ShowDataTabel();
    getListProject("", "");
  }, []);

  function handleChange(event) {
    getListProject(event.target.value);
  }
  const levelHandleChange = (e) => {
    setDepartment(e.value);
    ShowDataTabel();
    getListProject(e.value, status);
  };
  const StatusHandleChange = (e) => {
    ShowDataTabel();
    setStatus(e.value);
    getListProject(department, e.value);
  };
  const cloneProject = async (event) => {
    var projectId = event.currentTarget.id;
    confirmAlert({
      title: "Copy Project?",
      message: "Are you sure want to Copy Project?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            await axios
              .get(
                process.env.REACT_APP_API_KEY +
                  "clone-project/" +
                  projectId +
                  "?userID=" +
                  localStorage.getItem("authID"),
                {
                  headers: {
                    "Content-type": "Application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              )
              .then(function (response) {
                swal({
                  title: "Copy!",
                  text: "Project Copy Successfully.",
                  icon: "success",
                  button: "Okay",
                });
                ShowDataTabel();
                getListProject("", "");
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
  const getListProject = async (event, status) => {
    setIsLoading(true);
    await axios({
      url: process.env.REACT_APP_API_KEY + "projectby-audit-log/" + projectID,
      method: "get",
      params: {
        userID: localStorage.getItem("authID"),
        role: "user",
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(function (response) {
        // console.log("All Project List", response.data.data);
        ShowDataTabel();
        setProject(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const renderUser = (
    <table id="myTable" className="blocks table-responsive ">
      <thead>
        <tr>
          <th className="blue-bold">Req ID</th>
          <th className="blue-bold">Project Name</th>
          <th className="blue-bold">Project Owner</th>
          <th className="blue-bold">Action Date</th>
          <th className="blue-bold">Action Taken</th>
          <th className="blue-bold">Action By</th>
          <th className="blue-bold">Comment</th>
        </tr>
      </thead>
      <tbody>
        {project.length > 0 ? (
          <>
            {project.map((pro, index) => (
              <tr key={index}>
                <td>{pro.Project?.id}</td>
                <td>{pro.Project?.name}</td>
                <td>{pro.User?.email.split("@")[0]}</td>
                <td>{dateFormat(pro.createdAt, "dd mmm yyyy HH:MM")}</td>
                <td>{pro.message}</td>
                <td>{pro.actionBy ? pro.actionBy : "-"}</td>
                <td>{pro.comment ? pro.comment : "-"}</td>
              </tr>
            ))}
          </>
        ) : (
          ""
        )}
      </tbody>
    </table>
  );
  if (isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }
  return (
    <>
      <div className="main_wrapper">
        <div className="right-contents">
          <div className="approver-project-list approval-status">
            <div className="project-in-exec">
              <header className="header">
                <div className="title">
                  <h3 className="heading">
                    Audit Log
                    <span className="count">
                      ({project ? project.length : ""})
                    </span>
                  </h3>
                </div>
                {/* <div className="search-container">
                  <input
                    type="search"
                    placeholder="Search for project"
                    name="search-projects"
                    onChange={handleChange}
                  ></input>
                
                </div> */}
              </header>

              <div className="table-responsive">
                {isLoading ? "" : renderUser}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuditLog;
