import { useState, useEffect } from "react";
import axios from "axios";
import dateFormat from "dateformat";
import { NavLink, useNavigate } from "react-router-dom";
import LoadingSpinner from "./Loader/LoadingSpinner";
import Table from "react-bootstrap/Table";
import swal from "sweetalert";
const CancelledRejectedProjectList = () => {
  const navigate = useNavigate();
  const [project, setProjectList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const TimeOut = () => {
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
    getListProject();
  }, []);

  const getListProject = async () => {
    if (!localStorage.getItem("auth-token")) {
      TimeOut();
      return;
    }
    setIsLoading(true);
    axios({
      url:
        process.env.REACT_APP_API_KEY +
        "cancel-or-rejected/" +
        localStorage.getItem("authID"),
      method: "get",
      params: {
        role: "user",
        userID: localStorage.getItem("authID"),
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(function (response) {
        if (response.data.data) {
          setProjectList(response.data.data);
        }

        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  // function handleChange(event) {
  //   getListProject(event.target.value);
  // }
  // const levelHandleChange = (e) => {
  //   getListProject(e.value);
  // };
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
                      ({project ? project.length : 0})
                    </span>
                  </h3>
                </div>
              </header>

              <section className="blocks padding-0 total-project">
                <Table
                  stripped
                  className="blocks table-responsive change-request"
                >
                  {/* Table 08 */}

                  <tbody>
                    <tr>
                      <th className="blue-bold">Request ID</th>
                      <th className="blue-bold">Project Status</th>
                      <th className="blue-bold">Project Name</th>
                      <th className="blue-bold">Project Status</th>
                      <th className="blue-bold">Cancelled By</th>
                      <th className="blue-bold">Reason</th>
                      <th className="blue-bold">Project Budget($)</th>
                      <th className="blue-bold">Request Type</th>
                      <th className="blue-bold">Requested On</th>
                      <th className="blue-bold">Project Type</th>
                      <th className="blue-bold">Project Volume</th>
                      <th className="blue-bold">Cost Start Date</th>
                      <th className="blue-bold">Cost End Date</th>
                      <th className="blue-bold">Selling Start Date</th>
                      <th className="blue-bold">Selling End Date</th>
                    </tr>

                    {project.length > 0 ? (
                      <>
                        {project.map((pro, index) => (
                          <tr key={index}>
                            <td>
                              <NavLink
                                className="Project-ID"
                                to={{
                                  pathname: "/create-project/" + pro.id,
                                }}
                                state={{
                                  productOwner: "creator",
                                }}
                              >
                                {" "}
                                REQ{pro.id}
                              </NavLink>
                            </td>
                            <td>
                              <NavLink
                                className="add-action-button take-action"
                                to={{
                                  pathname: "/project-runtime-status/" + pro.id,
                                }}
                              >
                                View
                              </NavLink>
                            </td>
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
                                  : pro.status === "pending"
                                  ? "Pending"
                                  : ""}
                              </button>
                            </td>
                            <td>
                              {pro.runTimeStatus
                                ? pro.runTimeStatus
                                : "Under Process"}
                            </td>
                            <td>
                              {pro.DirectorAndReviewerApprover
                                ? pro.DirectorAndReviewerApprover.comment
                                : ""}
                            </td>
                            <td>{pro.totalBudget ? pro.totalBudget : 0}</td>

                            <td>
                              <button
                                className={`table-btn ${
                                  pro.ChangeStatus === null
                                    ? "Fresh Request"
                                    : "Change Request"
                                }`}
                              >
                                {pro.ChangeStatus === null
                                  ? "Fresh Request"
                                  : "Change Request"}
                              </button>
                            </td>
                            <td>{dateFormat(pro.updatedAt, "dd mmm yyyy")}</td>
                            <td>{pro.projectType}</td>
                            <td>{pro.projectVolume}</td>
                            <td>
                              {dateFormat(pro.costStartDate, "dd mmm yyyy")}
                            </td>
                            <td>
                              {dateFormat(pro.costEndDate, "dd mmm yyyy")}
                            </td>
                            <td>
                              {dateFormat(pro.sellingStartDate, "dd mmm yyyy")}
                            </td>
                            <td>
                              {dateFormat(pro.sellingEndDate, "dd mmm yyyy")}
                            </td>
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
                </Table>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CancelledRejectedProjectList;
