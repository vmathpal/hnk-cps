import { useState, useEffect } from "react";
import axios from "axios";
import dateFormat from "dateformat";
import Select from "react-select";
import moment from "moment";
import Filter from "../images/FilterIc.svg";
import { NavLink } from "react-router-dom";
import ReactPaginate from "react-paginate";
import LoadingSpinner from "../components/Loader/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import $ from "jquery";
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
import swal from "sweetalert";
import { confirmAlert } from "react-confirm-alert";
const TotalProjectList = () => {
  const navigate = useNavigate();
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [project, setProject] = useState([]);

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const data = [
    { value: "", label: "All Project" },
    { value: "sales", label: "Sales" },
    { value: "marketing", label: "Marketing" },
    { value: "trade_marketing", label: "Trade Marketing" },
  ];
  const statusData = [
    { value: "", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "cancelled", label: "Cancelled" },
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

  const ShowDataTabel = () => {
    $("#myTable").DataTable().clear().destroy();
    setTimeout(function () {
      $("#myTable").DataTable({
        // dom: "Bfrtip",
        bDestroy: true,
        fixedHeader: true,
        aaSorting: [[0, "desc"]],
        bInfo: false, //Dont display info e.g. "Showing 1 to 4 of 4 entries"
        paging: false, //Dont want paging
        bPaginate: false, //Dont want paging
        processing: true,
        searching: false,
        select: true,
        scrollX: true,
        fixedHeader: {
          headerOffset: 75,
        },
      });
    }, 1000);
  };
  useEffect(() => {
    const handleContextmenu = (e) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextmenu);
    return function cleanup() {
      document.removeEventListener("contextmenu", handleContextmenu);
    };
  }, []);
  useEffect(() => {
    ShowDataTabel();
    getListProject("", "");
  }, [page, keyword]);
  const changePage = ({ selected }) => {
    setPage(selected);
  };

  const handleChange = (event) => {
    ShowDataTabel();
    getListProject(event.target.value);
  };
  const levelHandleChange = (e) => {
    ShowDataTabel();
    setDepartment(e.value);
    getListProject(e.value, status);
  };
  const StatusHandleChange = (e) => {
    ShowDataTabel();
    setStatus(e.value);
    getListProject(department, e.value);
  };

  const getListProject = async () => {
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
      url: process.env.REACT_APP_API_KEY + "all-project-list",
      method: "get",
      params: {
        search: keyword,
        status: status,
        level: "level1",
        userID: localStorage.getItem("authID"),
        type: "report",
        department: localStorage.getItem("authDepartment"),
        page: page,
        limit: limit,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(function (response) {
        // console.log("Overview>>", response.data.data);

        setProject(response.data.result);
        setPage(response.data.page); // setPage(response.data.page);
        setPages(response.data.totalPage); // setPages(response.data.totalPage);
        setRows(response.data.totalRows); //   setRows(response.data.totalRows);
        ShowDataTabel();
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        //  navigate("/login");
      });
  };
  const cloneProject = async (pid, userID) => {
    // var projectId = event.currentTarget.id;
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
                  pid +
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
  const renderUser = (
    <table className="blocks table-responsive change-request table">
      <thead>
        <tr>
          {localStorage.getItem("AuthLevel") === "level6" ||
          localStorage.getItem("AuthLevel") === "level5" ||
          localStorage.getItem("AuthLevel") === "level4" ||
          localStorage.getItem("AuthLevel") === "level3" ? (
            <th></th>
          ) : (
            ""
          )}
          <th className="blue-bold">Request ID</th>
          <th className="blue-bold">Project Number</th>
          <th className="blue-bold">Project Log</th>
          <th className="blue-bold">Approval Status</th>
          <th className="blue-bold">Project Name</th>
          <th className="blue-bold">Requester Name</th>
          <th className="blue-bold">Project Status</th>
          <th className="blue-bold">Current Action</th>
          <th className="blue-bold">Approver Latest Comment</th>
          <th className="blue-bold">Project Budget($)</th>
          <th className="blue-bold">Request Type</th>
          <th className="blue-bold">Project Department</th>
          <th className="blue-bold">Owners Department</th>
          {/* <th className="blue-bold">Project Brand</th> */}
          <th className="blue-bold">Requested On</th>
          <th className="blue-bold">Project Type</th>
          <th className="blue-bold">Cost Start Date</th>
          <th className="blue-bold">Cost End Date</th>
          <th className="blue-bold">Selling Start Date</th>
          <th className="blue-bold">Selling End Date</th>
        </tr>
      </thead>
      <tbody>
        {project?.length !== 0 ? (
          <>
            {project.map((pro, index) => (
              <tr key={index}>
                {localStorage.getItem("AuthLevel") === "level6" ||
                localStorage.getItem("AuthLevel") === "level5" ||
                localStorage.getItem("AuthLevel") === "level4" ||
                localStorage.getItem("AuthLevel") === "level3" ? (
                  <td>
                    <button
                      id={pro.id}
                      onClick={() => cloneProject(pro.id)}
                      className="copy"
                    >
                      Copy
                    </button>
                  </td>
                ) : (
                  ""
                )}
                <td>
                  <NavLink
                    className="Project-ID"
                    to={{
                      pathname: "/create-project/" + pro.id,
                    }}
                    state={{
                      productOwner: "viewer",
                    }}
                  >
                    {" "}
                    {pro.id}
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
                    state={{ projectID: pro.id }}
                    to={{
                      pathname: "/project-audit-log/" + pro.id,
                    }}
                  >
                    View
                  </NavLink>
                </td>
                <td>
                  <NavLink
                    className="take-action-table"
                    to={{
                      pathname: "/approver-runtime-status/" + pro.id,
                    }}
                  >
                    View
                  </NavLink>
                </td>

                <td>{pro.name}</td>
                <td>{pro.User.email.split("@")[0]}</td>
                <td>
                  <button className={`table-btn ${pro.status}`}>
                    {pro.status === "approved"
                      ? "Approved"
                      : pro.status === "completed"
                      ? "Pending"
                      : pro.status === "rejected"
                      ? "Rejected"
                      : pro.status === "cancelled"
                      ? "Cancelled"
                      : pro.status === "closed"
                      ? "Closed"
                      : pro.status === "draft"
                      ? "Draft"
                      : "Pending"}
                  </button>
                </td>
                <td>
                  {pro.runTimeStatus ? pro.runTimeStatus : "Under Process"}
                </td>
                <td>
                  {pro.approverComment.length > 0
                    ? pro.approverComment[0].comment
                    : "-"}
                </td>

                <td>
                  {new Intl.NumberFormat("en-SG").format(pro.totalBudget)}
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

                <td>{pro.department}</td>
                <td>{pro.User.department}</td>

                <td>{dateFormat(pro.createdAt, "dd mmm yyyy")}</td>
                <td>{pro.projectType}</td>
                <td>{dateFormat(pro.costStartDate, "dd mmm yyyy")}</td>
                <td>{dateFormat(pro.costEndDate, "dd mmm yyyy")}</td>
                <td>{dateFormat(pro.sellingStartDate, "dd mmm yyyy")}</td>
                <td>{dateFormat(pro.sellingEndDate, "dd mmm yyyy")}</td>
              </tr>
            ))}
          </>
        ) : (
          <div>
            <p style={{ color: "#0f2f81", marginLeft: 20 }}>
              Project Not Found
            </p>
          </div>
        )}
      </tbody>
    </table>
  );

  const searchData = (e) => {
    setQuery(e);
    setPage(0);
    // setMsg("");
    setKeyword(e);
    //getProjects();
    ShowDataTabel();
  };

  const handlePaste = (event) => {
    ShowDataTabel();
    setKeyword(event.clipboardData.getData("text"));
  };
  // if (isLoading) {
  //   return (
  //     <div>
  //       <LoadingSpinner />
  //     </div>
  //   );
  // }

  return (
    <>
      <div className="content-area project-review">
        <div className="main_wrapper">
          <div className="right-contents">
            <div className="approver-project-list approval-status">
              <div className="project-in-exec">
                <header className="header">
                  <div className="title">
                    <h3 className="heading">
                      All Project{" "}
                      <span className="count">({rows ? rows : ""})</span>
                    </h3>
                  </div>
                  <div className="search-container">
                    <input
                      type="search"
                      name="search-projects"
                      onChange={(e) => searchData(e.target.value)}
                      placeholder="Search"
                      onPaste={handlePaste}
                    ></input>
                  </div>
                </header>

                <div className="execution">
                  {/* <p>
                    <p>
                      <img
                        src={Filter}
                        alt="Filter Icon"
                        height={28}
                        title="Filter"
                        className="mx-2"
                      ></img>
                    </p>
                  </p>
                  {localStorage.getItem("AuthLevel") === "level1" ||
                  localStorage.getItem("AuthLevel") === "level2" ? (
                    <Select
                      defaultValue={department}
                      onChange={levelHandleChange}
                      name="level"
                      options={data}
                      className="basic-multi-select department-based"
                      classNamePrefix="select"
                      isOptionDisabled={(option) => option.isdisabled}
                    />
                  ) : (
                    ""
                  )}

                  <Select
                    defaultValue={status}
                    onChange={StatusHandleChange}
                    name="level"
                    options={statusData}
                    className="basic-multi-select status-based mx-3"
                    classNamePrefix="select"
                  /> */}
                </div>

                <div>
                <div className="table-responsive">
                  {isLoading ? (
                    <h3 style={{ color: "green" }}>Data Loading....</h3>
                  ) : (
                    renderUser
                  )}
                  </div>

                  <div className="custom-pagination">
                    <span>
                      Total Rows: {rows}, Page: {rows ? page + 1 : 0} of {pages}
                      {/* Showing 1 to 10 of {rows} entries */}
                    </span>
                    {/* <p className="has-text-centered has-text-danger">{msg}</p> */}

                    <nav
                      className="pagination is-centered"
                      key={rows}
                      role="navigation"
                      aria-label="Page navigation example"
                    >
                      <ReactPaginate
                        previousLabel={"Previous"}
                        nextLabel={"Next"}
                        pageCount={Math.min(2000, pages)}
                        onPageChange={changePage}
                        containerClassName={"pagination"}
                        pageLinkClassName={"page-link"}
                        previousLinkClassName={"page-link"}
                        nextLinkClassName={"page-link"}
                        activeLinkClassName={"page-link is-current"}
                        disabledLinkClassName={"page-link is-disabled"}
                      />
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TotalProjectList;
