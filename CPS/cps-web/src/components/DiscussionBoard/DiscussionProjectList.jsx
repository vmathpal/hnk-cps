import React from "react";
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Bell from "../../images/bell.svg";
import Filter from "../../images/FilterIc.svg";
import axios from "axios";
import swal from "sweetalert";
import Select from "react-select";
import LoadingSpinner from "../Loader/LoadingSpinner";

function DiscussionProjectList() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [project, setProject] = useState([]);
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");

  const data = [
    { value: "", label: "All Project" },
    { value: "sales", label: "Sales" },
    { value: "marketing", label: "Marketing" },
    { value: "trade_marketing", label: "Trade Marketing" },
  ];
  const statusData = [
    { value: "", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "rejected", label: "Rejected" },
    { value: "approved", label: "Approved" },
    { value: "cancelled", label: "Cancelled" },
  ];
  const TimeOut = () => {
    swal({
      title: "Time Out",
      text: "You have been logged out. Please log in again",
      icon: "error",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        navigate("/login");
        return;
      }
    });
  };
  function handleChange(event) {
    getDiscussionProjectList(event.target.value);
  }
  const levelHandleChange = (e) => {
    setDepartment(e.value);

    getDiscussionProjectList(e.value, status);
  };
  const StatusHandleChange = (e) => {
    setStatus(e.value);
    getDiscussionProjectList(department, e.value);
  };

  function ProjectNumber(n) {
    var string = "" + n;
    var pad = "0000";
    n = pad.substring(0, pad.length - string.length) + string;
    return n;
  }
  useEffect(() => {
    getDiscussionProjectList();
  }, []);

  const getDiscussionProjectList = async (event, status) => {
    if (!localStorage.getItem("auth-token")) {
      TimeOut();
      return;
    }
    setIsLoading(true);
    await axios({
      url:
        process.env.REACT_APP_API_KEY +
        "discussion-project-list/" +
        localStorage.getItem("authID"),
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
        setProject(response.data.data);
        // console.log("Discussion Project List", response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
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
                <div className="search-container">
                  <input
                    type="search"
                    placeholder="Search for project"
                    name="search-projects"
                    onChange={handleChange}
                  ></input>
                  {/* <img src={Search} alt="Search Icon"></img> */}
                </div>
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

              <ul className="notification-list ver-scroll">
                {project.length > 0 ? (
                  <>
                    {project.map((pro, index) => (
                      <li key={index}>
                        <NavLink
                          className="Project-ID"
                          to={{
                            pathname: "/discussion-chat/",
                          }}
                          state={{
                            projectID: pro.id,
                          }}
                        >
                          <div className="notif-item">
                            <div className="bell-icon">
                              <img src={Bell} alt="Bell Icon"></img>
                            </div>
                            <div>
                              <div className="title">
                                <label htmlFor="">{pro?.name}</label>
                                <span className={`discussion ${pro.status}`}>
                                  {pro.status === "draft"
                                    ? "Draft"
                                    : pro.status === "completed"
                                    ? "pending"
                                    : pro.status === "approved"
                                    ? "approved"
                                    : pro.status === "rejected"
                                    ? "rejected"
                                    : pro.status === "cancelled"
                                    ? "cancelled"
                                    : pro.status === "closed"
                                    ? "closed"
                                    : pro.status === "pending"
                                    ? "pending"
                                    : ""}
                                </span>
                              </div>

                              <div className="status">
                                <span>REQ{ProjectNumber(pro.id)}</span>
                                <span>
                                  Project Budget -{" "}
                                  <b>
                                    S$
                                    {new Intl.NumberFormat("en-SG").format(
                                      pro.totalBudget
                                    )}
                                  </b>
                                </span>
                                <span>
                                  <span>
                                    Project Owner :{" "}
                                    {pro.User
                                      ? pro.User.email
                                          .split("@")[0]
                                          .toUpperCase()
                                      : ""}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </NavLink>
                      </li>
                    ))}
                  </>
                ) : (
                  <div>
                    <p style={{ color: "#0f2f81", marginLeft: 20 }}>
                      Project Not Found
                    </p>
                  </div>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DiscussionProjectList;
