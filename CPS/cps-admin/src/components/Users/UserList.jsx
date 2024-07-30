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
import { Link, useNavigate, NavLink } from "react-router-dom";
import swal from "sweetalert";
import LoadingSpinner from "../Loader/LoadingSpinner";
const UserList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  //const [index, setIndex] = useState(1);
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
    getUsers();
  }, [page, keyword]);

  const getUsers = async () => {
    setIsLoading(true);
    axios({
      url: process.env.REACT_APP_API_KEY + "allUsers",
      method: "get",
      params: {
        search_query: keyword,
        page: page,
        limit: limit,
        url: "user-management",
        userID: localStorage.getItem("userID"),
        role: localStorage.getItem("user_role"),
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
        process.env.REACT_APP_API_KEY + "admin-status/" + id,

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
            text: "Update SuccessFully!",
            icon: "success",
            button: "Okay",
          });
          navigate("/user-management");
        }
        getUsers();
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
    <table id="myTable" className="table  table-hover table-striped my-3">
      <thead className="table-dark">
        <tr>
          <th scope="col">#</th>
          <th scope="col">UserId</th>
          <th scope="col">Email</th>
          {/* <th scope="col">Role</th> */}
          <th scope="col">Department</th>
          <th scope="col">Status</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        {users.length !== 0 ? (
          Object.values(users)?.map((user, index) => (
            <tr key={user?.id}>
              <td>{++index}</td>
              <td>{user?.name}</td>
              <td>{user?.email}</td>
              {/* <td>{user?.roleName.role}</td> */}
              <td>
                {user?.department === "sales"
                  ? "Sales"
                  : user.department === "trade_market"
                  ? "Trade Marketing"
                  : user.department === "marketing"
                  ? "Marketing"
                  : "All"}
              </td>
              <td>{user?.status}</td>
              <td>
                {user?.isGM === "yes" ? (
                  <Link
                    to={{ pathname: "/edit-gm-user" }}
                    state={{ UserId: user.id }}
                  >
                    <span className="material-icons" title="Edit">
                      edit
                    </span>
                  </Link>
                ) : (
                  <Link
                    to={{ pathname: "/edit-user" }}
                    state={{ UserId: user.id }}
                  >
                    <span className="material-icons" title="Edit">
                      edit
                    </span>
                  </Link>
                )}
                &nbsp;
                <span
                  style={
                    user.status === "active"
                      ? { color: "green", cursor: "pointer" }
                      : { color: "red", cursor: "pointer" }
                  }
                  className="material-icons-outlined"
                  onClick={() => {
                    handleChange(user.id);
                  }}
                  title={user.status === "active" ? "Active" : "Inactive"}
                >
                  {user.status === "active" ? "toggle_on" : "toggle_off"}
                </span>
              </td>
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
    //getUsers();
  };

  const handlePaste = (event) => {
    setKeyword(event.clipboardData.getData("text"));
  };
  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col">
          <div className="page-description">
            <h1>User Management</h1>
          </div>
        </div>
      </div>
      <>
        <NavLink className="btn btn-info" to="/add-user">
          Add User
        </NavLink>
        <NavLink className="btn btn-info mx-3" to="/add-gm-user">
          Add GM
        </NavLink>
      </>
      <div
        className="field has-addons"
        style={{ float: "right", marginBottom: 12 }}
      >
        <div className="input-group">
          <div className="form-outline">
            <input
              type="text"
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

export default UserList;
