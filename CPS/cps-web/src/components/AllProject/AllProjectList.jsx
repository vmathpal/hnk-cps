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
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
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
import { Redirect } from "react-router-dom";
const AllProjectList = () => {
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");

  const [project, setProject] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const data = [
    { value: "", label: "All Project" },
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
    var m = n ? n : 1;
    var string = "" + m;
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
    }, 1000);
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

                navigate("/create-project/" + response.data.data, {
                  state: { productOwner: "creator", actionType: undefined },
                });
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
    if (!localStorage.getItem("auth-token")) {
      swal({
        title: "Time Out",
        text: "You have been logged out. Please log in again",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          navigate("/login");
          return;
        }
      });
    }
    setIsLoading(true);
    await axios({
      url: process.env.REACT_APP_API_KEY + "get-all-project",
      method: "get",
      params: {
        search: event,
        status: status,
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
        setIsLoading(false);
        //  navigate("/login");
      });
  };

  // const getListProjectApproved = async () => {
  //   setIsLoading(true);
  //   await axios({
  //     url:
  //       process.env.REACT_APP_API_KEY +
  //       "approved-project-list/" +
  //       localStorage.getItem("authID"),
  //     method: "get",
  //     params: {
  //       role: "user",
  //       userID: localStorage.getItem("authID"),
  //     },
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${localStorage.getItem("token")}`,
  //     },
  //   })
  //     .then(function (response) {
  //       getListProject("", "");
  //       setIsLoading(false);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  const renderUser = (
    <table id="myTable" className="blocks table-responsive change-request">
      <thead>
        <tr>
          <th className="blue-bold"></th>
          <th className="blue-bold">Log</th>
          <th className="blue-bold">Request ID</th>
          <th className="blue-bold">Project Number</th>
          <th className="blue-bold">Approval Status</th>
          <th className="blue-bold">Modify Change Request</th>
          <th className="blue-bold">Add Closure Request</th>
          <th className="blue-bold">Project Name</th>
          <th className="blue-bold">Project Status</th>
          <th className="blue-bold">Change Request Status</th>
          <th className="blue-bold">Closure Status</th>
          <th className="blue-bold">Current Action By</th>
          <th className="blue-bold">Request Type</th>
          <th className="blue-bold">Approver Latest Comment</th>
          <th className="blue-bold">Project Budget($)</th>
          {/* <th className="blue-bold">Project Brand</th> */}
          <th className="blue-bold">Requested On</th>
          <th className="blue-bold">Project Type</th>
          <th className="blue-bold">Project Volume</th>
          <th className="blue-bold">Cost Start Date</th>
          <th className="blue-bold">Cost End Date</th>
          <th className="blue-bold">Selling Start Date</th>
          <th className="blue-bold">Selling End Date</th>
        </tr>
      </thead>
      <tbody>
        {project.length > 0 ? (
          <>
            {project.map((pro, index) => (
              <tr key={index}>
                <td>
                  {" "}
                  <button id={pro.id} onClick={cloneProject} className="copy">
                    Copy
                  </button>
                </td>
                <td>
                  <NavLink
                    className="take-action-table"
                    state={{ projectID: pro.id }}
                    to={{
                      pathname: "/project-audit-log/" + pro.id,
                    }}
                  >
                    View Log
                  </NavLink>
                </td>
                <td>
                  <NavLink
                    className="Project-ID"
                    to={{
                      pathname: "/create-project/" + pro.id,
                    }}
                    state={{
                      productOwner:
                        pro.status === "approved" ||
                        pro.ChangeStatus !== null ||
                        pro.CloserStatus !== null
                          ? "viewer"
                          : "creator",
                    }}
                  >
                    REQ{ProjectNumber(pro.id)}
                  </NavLink>
                </td>
                <td>
                  <button
                    className={`table-btn ${
                      (pro.status === "approved" ||
                        pro.status === "closed" ||
                        pro.CloserStatus === "approved" ||
                        pro.isProjectNumber === "done") &&
                      pro.status != "rejected"
                        ? "approved"
                        : "pending"
                    }`}
                  >
                    {(pro.status === "approved" ||
                      pro.status === "closed" ||
                      pro.CloserStatus === "approved" ||
                      pro.isProjectNumber === "done") &&
                    pro.status != "rejected"
                      ? pro.projectNumber
                      : "Under Process"}
                  </button>
                </td>
                <td>
                  <NavLink
                    className="take-action-table"
                    to={{
                      pathname: "/project-runtime-status/" + pro.id,
                    }}
                  >
                    View
                  </NavLink>
                </td>
                {pro.status === "approved" &&
                pro.ChangeStatus !== "pending" &&
                pro.CloserStatus === null ? (
                  <td>
                    <NavLink
                      disabled
                      className={`take-action-table ${
                        pro.ref_no ? "old-project-disabled" : ""
                      }`}
                      to={{
                        pathname: "/project-change-request",
                      }}
                      state={{
                        projectID: pro.id,
                      }}
                    >
                      {pro.status === "approved" ? "Add" : "Modify"}
                    </NavLink>
                  </td>
                ) : (
                  <td>
                    <a href="#" className="take-action-table">
                      NA
                    </a>
                  </td>
                )}
                {(pro.status === "approved" ||
                  pro.CloserStatus === "rejected") &&
                pro.ChangeStatus !== "pending" &&
                pro.CloserStatus !== "pending" ? (
                  <td>
                    <NavLink
                      className={`take-action-table ${
                        pro.ref_no ? "old-project-disabled" : ""
                      }`}
                      to={{
                        pathname: "/my-projects/data-evaluation",
                      }}
                      state={{
                        projectID: pro.id,
                        productOwner: "creator",
                      }}
                    >
                      {pro.status === "approved" ? "Add" : "Modify"}
                    </NavLink>
                  </td>
                ) : (
                  <td>
                    <a href="#" className="take-action-table">
                      NA
                    </a>
                  </td>
                )}

                <td>{pro.name}</td>
                <td>
                  <button className={`table-btn ${pro.status}`}>
                    {pro.status === "draft"
                      ? "Draft"
                      : pro.status === "completed"
                      ? "Pending"
                      : pro.status === "approved"
                      ? "Approved"
                      : pro.status === "rejected"
                      ? "Rejected"
                      : pro.status === "cancelled"
                      ? "Cancelled"
                      : pro.status === "closed"
                      ? "Closed"
                      : pro.status === "pending"
                      ? "Pending"
                      : ""}
                  </button>
                </td>
                <td>
                  <button
                    className={`table-btn ${
                      pro.ChangeStatus ? pro.ChangeStatus : "NotApplicable"
                    }`}
                  >
                    {pro.ChangeStatus === "approved"
                      ? "Approved"
                      : pro.ChangeStatus === "rejected"
                      ? "Rejected"
                      : pro.ChangeStatus === "cancelled"
                      ? "Cancelled"
                      : pro.ChangeStatus === "closed"
                      ? "Closed"
                      : pro.ChangeStatus === "pending"
                      ? "Pending"
                      : "NA"}
                  </button>
                </td>

                <td>
                  <button
                    className={`table-btn ${
                      pro.CloserStatus ? pro.CloserStatus : "NotApplicable"
                    }`}
                  >
                    {pro.CloserStatus === "approved"
                      ? "Approved"
                      : pro.CloserStatus === "rejected"
                      ? "Rejected"
                      : pro.CloserStatus === "cancelled"
                      ? "Cancelled"
                      : pro.CloserStatus === "closed"
                      ? "Closed"
                      : pro.CloserStatus === "pending"
                      ? "Pending"
                      : "NA"}
                  </button>
                </td>

                <td>
                  {pro.runTimeStatus ? pro.runTimeStatus : "Under Process"}
                </td>
                <td>
                  <button
                    className={`table-btn ${
                      pro.ChangeStatus === null && pro.CloserStatus === null
                        ? "Fresh Request"
                        : pro.ChangeStatus !== null && pro.CloserStatus === null
                        ? "Change Request"
                        : "Close Request"
                    }
                                }`}
                  >
                    {pro.ChangeStatus === null && pro.CloserStatus === null
                      ? "Fresh Request"
                      : pro.ChangeStatus !== null && pro.CloserStatus === null
                      ? "Change Request"
                      : "Close Request"}
                  </button>
                </td>
                <td>
                  {pro.approverComment.length > 0
                    ? pro.approverComment[0].comment
                    : "-"}
                </td>
                <td>
                  {new Intl.NumberFormat("en-SG").format(pro.totalBudget)}
                </td>

                <td>{dateFormat(pro.createdAt, "dd mmm yyyy")}</td>
                <td>{pro.projectType}</td>
                <td>{pro.projectVolume}</td>
                <td>{dateFormat(pro.costStartDate, "dd mmm yyyy")}</td>
                <td>{dateFormat(pro.costEndDate, "dd mmm yyyy")}</td>
                <td>{dateFormat(pro.sellingStartDate, "dd mmm yyyy")}</td>
                <td>{dateFormat(pro.sellingEndDate, "dd mmm yyyy")}</td>
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
                    All Project{" "}
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

              <div className="execution">
                <p>
                  <img
                    src={Filter}
                    alt="Filter Icon"
                    height={28}
                    title="Filter"
                    className="mx-2"
                  ></img>
                </p>

                <Select
                  defaultValue={department}
                  onChange={levelHandleChange}
                  name="level"
                  options={data}
                  className="basic-multi-select department-based"
                  classNamePrefix="select"
                />
                <Select
                  defaultValue={status}
                  onChange={StatusHandleChange}
                  name="level"
                  options={statusData}
                  className="basic-multi-select status-based mx-3"
                  classNamePrefix="select"
                />
              </div>

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

export default AllProjectList;
