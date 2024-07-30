import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import "datatables.net-buttons/js/dataTables.buttons.js";
import "datatables.net-buttons/js/buttons.colVis.js";
import "datatables.net-buttons/js/buttons.flash.js";
import "datatables.net-buttons/js/buttons.html5.js";
import "datatables.net-buttons/js/buttons.print.js";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { Link, useNavigate, NavLink, useParams } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert"; // Import
import swal from "sweetalert";
import LoadingSpinner from "../Loader/LoadingSpinner";
import moment from "moment";
const ProjectList = () => {
  const [project, setUsers] = useState([]);

  const navigate = useNavigate();
  //const [index, setIndex] = useState(1);
  let { action } = useParams();

  const [adminID, setAdminID] = useState({});
  const [id, setPID] = useState(0);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (id) => {
    setPID(id);
    setShow(true);
  };

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/sign-in");
    }
    getProjects();
  }, [page, keyword]);

  const getProjects = async () => {
    setIsLoading(true);
    await axios({
      url: process.env.REACT_APP_API_KEY + "all-project-list",
      method: "get",
      params: {
        search: keyword,
        status: "",
        level: "level1",
        userID: localStorage.getItem("userID"),
        department: "",
        page: page,
        limit: limit,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(function (response) {
        setIsLoading(false);
        setUsers(response.data.result);
        setPage(response.data.page);
        setPages(response.data.totalPage);
        setRows(response.data.totalRows);
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
      });
  };

  const changePage = ({ selected }) => {
    setPage(selected);
  };

  const handleChange = async (id) => {
    await axios
      .get(
        process.env.REACT_APP_API_KEY + "generate-project-number/" + id,

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
            text: "Project Number Status Update SuccessFully!",
            icon: "success",
            button: "Okay",
          });
          getProjects();
        }
      })
      .catch(function (error) {
        // console.log(error);
        if (error.response.data.status === 401) {
          localStorage.clear();
          navigate("/sign-in");
        }
      });
  };
  const closeProject = async (id) => {
    confirmAlert({
      title: "Confirm to close project?",
      message: "Are you sure want to close project?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            adminID.userID = localStorage.getItem("userID");
            await axios
              .post(
                process.env.REACT_APP_API_KEY + "closed-project-status/" + id,
                adminID,
                {
                  headers: {
                    "Content-type": "Application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              )
              .then(function (response) {
                swal({
                  title: "Project Closed!",
                  text: "Project Closed Successfully!",
                  icon: "success",
                  button: "Okay",
                });

                getProjects();
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
    <table id="myTable" className="table  table-hover table-striped my-3">
      <thead className="table-dark">
        <tr>
          <th scope="col" className="report-heading">
            #
          </th>
          <th scope="col" className="report-heading">
            REQ ID
          </th>
          <th scope="col" className="report-heading">
            Project Name
          </th>
          <th scope="col" className="report-heading">
            Project Owner
          </th>
          <th scope="col" className="report-heading">
            Department
          </th>
          <th scope="col" className="report-heading">
            Project Number
          </th>
          <th scope="col" className="report-heading">
            Final Approval Date
          </th>
          <th scope="col" className="report-heading">
            Status
          </th>
          <th scope="col" className="report-heading">
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {project.length !== 0 ? (
          Object.values(project)?.map((product, index) => (
            <tr key={product?.id}>
              <td>{++index}</td>
              <td>{product?.id}</td>
              <td>{product?.name}</td>
              <td>{product.User.email.split("@")[0]}</td>
              <td>{product?.department}</td>
              <td>
                {product.status === "approved" ||
                product.status === "closed" ||
                product.CloserStatus === "approved" ||
                product.isProjectNumber === "done"
                  ? product.projectNumber
                  : "Under Process"}
              </td>
              <td>
                {product.final_approved_date
                  ? moment(product.final_approved_date).format("D-MMM-YYYY")
                  : product.status === "approved"
                  ? moment(product.updatedAt).format("D-MMM-YYYY")
                  : null}
              </td>
              <td>
                {product?.status === "completed" ? "pending" : product?.status}
              </td>
              {localStorage.getItem("user_role") === "super_admin" ? (
                <td>
                  <Link
                    to={{ pathname: "/project-based-audit-log/" + product.id }}
                    state={{ productID: product.id, userID: product.User.id }}
                  >
                    <span
                      className="material-icons-outlined assignProject"
                      title="Audit Log"
                    >
                      manage_history
                    </span>
                  </Link>
                  &nbsp;
                  <Link
                    to={{ pathname: "/project-management/edit-basic-info/"+product.id +'/'+product.User.id }}
                    state={{ productID: product.id, userID: product.User.id }}
                  >
                    <span className="material-icons mx-3" title="Edit">
                      edit
                    </span>
                  </Link>
                  &nbsp;
                  <Link
                    to={{ pathname: "/project-management/approval-status" }}
                    state={{
                      productID: product.id,
                      userID: product.User.id,
                      AuthLevel: product.User.level,
                    }}
                  >
                    <span
                      className="material-icons  mx-2"
                      title="Approval Status"
                    >
                      location_searching
                    </span>
                  </Link>
                  &nbsp;&nbsp;
                  <span
                    style={
                      product.status === "approved" ||
                      product.isProjectNumber === "done"
                        ? { color: "green", cursor: "pointer" }
                        : { color: "red", cursor: "pointer" }
                    }
                    className="material-icons-outlined"
                    onClick={() => {
                      handleChange(product.id);
                    }}
                    title={
                      product.status === "approved" ||
                      product.isProjectNumber === "done"
                        ? "Project Number Generated"
                        : "Project Number Pending"
                    }
                  >
                    {product.status === "approved" ||
                    product.isProjectNumber === "done"
                      ? "check_circle_outline"
                      : "pending_actions"}
                  </span>
                  &nbsp; &nbsp;
                  <Link
                    to={{
                      pathname: "/project-management/take-approval-action",
                    }}
                    state={{ productID: product.id, userID: product.User.id }}
                  >
                    <span
                      className="material-icons"
                      title="Take Approval Action"
                    >
                      schedule
                    </span>
                  </Link>
                  &nbsp; &nbsp;
                  {product.status === "approved" ? (
                    <span
                      style={
                        product.status === "closed"
                          ? { color: "green", cursor: "pointer" }
                          : { color: "orange", cursor: "pointer" }
                      }
                      className="material-icons-outlined"
                      onClick={() => closeProject(product.id)}
                      title={
                        product.status === "closed"
                          ? "Project Closed"
                          : "Project Closure Pending"
                      }
                    >
                      {product.status === "closed" ? "task" : "pending_actions"}
                    </span>
                  ) : (
                    ""
                  )}
                </td>
              ) : localStorage.getItem("user_role") === "sub_admin" &&
                action === "Modify" ? (
                <td>
                  <Link
                    to={{ pathname: "/project-based-audit-log/" + product.id }}
                    state={{ productID: product.id, userID: product.User.id }}
                  >
                    <span
                      className="material-icons-outlined assignProject"
                      title="Audit Log"
                    >
                      manage_history
                    </span>
                  </Link>
                  &nbsp;
                  <Link
                    to={{ pathname: "/project-management/edit-basic-info/"+product.id+'/'+product.User.id }}
                    state={{ productID: product.id, userID: product.User.id }}
                  >
                    <span className="material-icons mx-3" title="Edit">
                      edit
                    </span>
                  </Link>
                  &nbsp;
                  <Link
                    to={{ pathname: "/project-management/approval-status" }}
                    state={{
                      productID: product.id,
                      userID: product.User.id,
                      AuthLevel: product.User.level,
                    }}
                  >
                    <span
                      className="material-icons  mx-2"
                      title="Approval Status"
                    >
                      location_searching
                    </span>
                  </Link>
                  &nbsp;&nbsp;
                  <span
                    style={
                      product.status === "approved" ||
                      product.isProjectNumber === "done"
                        ? { color: "green", cursor: "pointer" }
                        : { color: "red", cursor: "pointer" }
                    }
                    className="material-icons-outlined"
                    onClick={() => {
                      handleChange(product.id);
                    }}
                    title={
                      product.status === "approved" ||
                      product.isProjectNumber === "done"
                        ? "Project Number Generated"
                        : "Project Number Pending"
                    }
                  >
                    {product.status === "approved" ||
                    product.isProjectNumber === "done"
                      ? "check_circle_outline"
                      : "pending_actions"}
                  </span>
                  &nbsp; &nbsp;
                  <Link
                    to={{
                      pathname: "/project-management/take-approval-action",
                    }}
                    state={{ productID: product.id, userID: product.User.id }}
                  >
                    <span
                      className="material-icons"
                      title="Take Approval Action"
                    >
                      schedule
                    </span>
                  </Link>
                  &nbsp; &nbsp;
                  {product.status === "approved" ? (
                    <span
                      style={
                        product.status === "closed"
                          ? { color: "green", cursor: "pointer" }
                          : { color: "orange", cursor: "pointer" }
                      }
                      className="material-icons-outlined"
                      onClick={() => closeProject(product.id)}
                      title={
                        product.status === "closed"
                          ? "Project Closed"
                          : "Project Closure Pending"
                      }
                    >
                      {product.status === "closed" ? "task" : "pending_actions"}
                    </span>
                  ) : (
                    ""
                  )}
                </td>
              ) : (
                <>
                  <td>
                    <Link
                      to={{ pathname: "/project-management/edit-basic-info/"+product.id+'/'+product.User.id }}
                      state={{
                        productID: product.id,
                        userID: product.User.id,
                        actionView: "view",
                      }}
                    >
                      <span className="material-icons" title="visibility">
                        visibility
                      </span>
                    </Link>
                    &nbsp; &nbsp;
                    <Link
                      to={{
                        pathname: "/project-based-audit-log/" + product.id,
                      }}
                      state={{
                        productID: product.id,
                        userID: product.User.id,
                        actionView: "view",
                      }}
                    >
                      <span
                        className="material-icons-outlined assignProject"
                        title="Audit Log"
                      >
                        manage_history
                      </span>
                    </Link>
                    &nbsp; &nbsp;
                    <Link
                      to={{ pathname: "/project-management/approval-status" }}
                      state={{
                        productID: product.id,
                        userID: product.User.id,
                        AuthLevel: product.User.level,
                      }}
                    >
                      <span
                        className="material-icons  mx-2"
                        title="Approval Status"
                      >
                        location_searching
                      </span>
                    </Link>
                  </td>
                </>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="8" style={{ textAlign: "center" }}>
              No matching records found
            </td>
          </tr>
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
  };

  const handlePaste = (event) => {
    setKeyword(event.clipboardData.getData("text"));
  };
  const handleClick = async () => {
    window.location.href =
      process.env.REACT_APP_API_KEY +
      "export-project-report?search=&status=&level=level1&userID=2&type=&department=";
  };
  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col">
          <div className="page-description">
            <h1>Project Management</h1>
            <button className="btn btn-info mt-2" onClick={handleClick}>
              Export
            </button>
          </div>
        </div>
      </div>

      <div
        className="field has-addons"
        style={{ float: "right", marginBottom: 12 }}
      >
        <div className="input-group">
          <div className="form-outline">
            <input
              type="search"
              className="form-control"
              value={query}
              onChange={(e) => searchData(e.target.value)}
              placeholder="Search"
              onPaste={handlePaste}
            />
          </div>
        </div>
      </div>

      {isLoading ? <LoadingSpinner /> : renderUser}
      <div className="custom-pagination">
        <span>
          Total Rows: {rows} Page: {rows ? page + 1 : 0} of {pages}
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
            pageCount={Math.min(10, pages)}
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
  );
};

export default ProjectList;
