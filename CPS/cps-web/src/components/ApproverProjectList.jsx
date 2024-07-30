import { useState, useEffect } from "react";
import axios from "axios";
import dateFormat from "dateformat";
import { NavLink } from "react-router-dom";
import LoadingSpinner from "./Loader/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import $ from "jquery";
import swal from "sweetalert";
const ApproverProjectList = () => {
  const navigate = useNavigate();
  const [project, setProject] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const data = [
    { value: "", label: "All Project" },
    { value: "sales", label: "Sales" },
    { value: "marketing", label: "Marketing" },
    { value: "trade_marketing", label: "Trade Marketing" },
  ];
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
    getListProject();
    const handleContextmenu = (e) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextmenu);
    return function cleanup() {
      document.removeEventListener("contextmenu", handleContextmenu);
    };
  }, []);

  function getListProject(event) {
    if (!localStorage.getItem("auth-token")) {
      TimeOut();
      return;
    }
    setIsLoading(true);
    axios({
      url:
        process.env.REACT_APP_API_KEY +
        "approver-project-list/" +
        localStorage.getItem("authID"),
      method: "get",
      params: {
        search: event,
        role: "user",
        userID: localStorage.getItem("authID"),
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(function (response) {
        // console.log("Approver Project List", response.data.data);
        setProject(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        navigate("/login");
      });
  }

  function handleChange(event) {
    getListProject(event.target.value);
  }
  const levelHandleChange = (e) => {
    getListProject(e.value);
  };
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
                    Project(s) for My Approval{" "}
                    <span className="count">
                      ({project ? project.length : ""})
                    </span>
                  </h3>
                </div>
              </header>

              <div className="cards-container cards-container-disabled">
                {project.length > 0 ? (
                  <>
                    {project.map((pro, index) => (
                      <article className="card" key={index}>
                        <div
                          className={`card-inner ${
                            pro.delegationUserID
                              ? "delegated-card"
                              : "card-inner"
                          }`}
                        >
                          <div className="header">
                            <p>{"REQ" + pro.projectID}</p>
                            <p>{pro.Project ? pro.Project.projectType : ""}</p>
                            <p
                              className={`project-badge-${pro.status}`}
                              style={{
                                width: "100%",
                                textAlign: "right",
                                fontWeight: 600,
                                padding: 2,
                              }}
                            >
                              Approval Request :{" "}
                              {pro.status === "approved"
                                ? "Approved"
                                : pro.status === "rejected"
                                ? "Rejected"
                                : pro.status === "cancelled"
                                ? "Cancelled"
                                : "Pending"}
                            </p>
                            <p
                              className="project-badge mt-1"
                              style={{
                                width: "100%",
                                textAlign: "right",
                                color: "rgb(6 91 126)",
                                fontWeight: 600,
                                padding: 2,
                              }}
                            >
                              Request Type :{" "}
                              {pro.Project?.ChangeStatus === null &&
                              pro.Project?.CloserStatus === null
                                ? "Fresh Request"
                                : pro.Project?.ChangeStatus !== null &&
                                  pro.Project?.CloserStatus === null
                                ? "Change Request"
                                : "Close Request"}
                            </p>
                            <p
                              className="project-badge mt-1"
                              style={{
                                width: "100%",
                                textAlign: "right",
                                color: "rgb(191 53 113)",
                                fontWeight: 600,
                                padding: 2,
                              }}
                            >
                              Requestor :
                              {(pro.Project?.User?.email)
                                .split("@")[0]
                                .toUpperCase()}
                            </p>
                          </div>
                          <div className="card-body">
                            <h4>{pro.Project.name ? pro.Project.name : ""}</h4>
                            {pro.delegationUserID ? (
                              <>
                                {" "}
                                <div className="project-badge sales">
                                  {pro.role_name}
                                </div>
                                <div className="project-badge sales">
                                  {pro.delegation?.email
                                    .split("@")[0]
                                    .toUpperCase()}
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="project-badge dept">
                                  {pro.Project?.department}
                                </div>
                              </>
                            )}

                            <div className="flex_row">
                              <div className="left">
                                <p>Duration</p>
                                <h4>
                                  {dateFormat(
                                    pro.Project?.sellingStartDate,
                                    "dd mmm"
                                  )}{" "}
                                  -{" "}
                                  {dateFormat(
                                    pro.Project?.sellingEndDate,
                                    "dd mmm yyyy"
                                  )}
                                </h4>
                              </div>
                              <div className="right">
                                <p>Projects Budget</p>
                                <h4>
                                  $
                                  {pro.Project?.totalBudget
                                    ? pro.Project?.totalBudget !== null
                                      ? new Intl.NumberFormat("en-SG").format(
                                          pro.Project?.totalBudget
                                        )
                                      : 0
                                    : "0"}
                                </h4>
                              </div>
                            </div>
                            <></>
                            <div className="brandings">
                              <p>Brands</p>
                              <div className="flex">
                                <div className="image-container">
                                  {pro.Project
                                    ? pro.Project.ProjectBrands.map(
                                        (name, index) => (
                                          <span>{name.Brand.name}&nbsp;</span>
                                        )
                                      )
                                    : ""}
                                </div>
                                {/* {pro.status === "draft" ? ( */}
                                <div className="view-details">
                                  {pro.Project.CloserStatus !== null ? (
                                    <NavLink
                                      // className="take-action-table"
                                      to={{
                                        pathname:
                                          "/my-projects/data-evaluation",
                                      }}
                                      state={{
                                        projectID: pro.Project.id,
                                        productOwner: "Approver",
                                        actionType: "CloseRequest",
                                      }}
                                    >
                                      View Details
                                    </NavLink>
                                  ) : (
                                    <NavLink
                                      to={{
                                        pathname:
                                          "/create-project/" + pro.projectID,
                                      }}
                                      state={{
                                        productOwner: "Approver",
                                        actionType:
                                          pro.Project.ChangeStatus === null &&
                                          pro.Project.CloserStatus === null
                                            ? "FreshRequest"
                                            : pro.Project.ChangeStatus !==
                                                null &&
                                              pro.Project.CloserStatus === null
                                            ? "ChangeRequest"
                                            : "CloseRequest",
                                      }}
                                    >
                                      View Details
                                    </NavLink>
                                  )}
                                </div>
                                {/* ) : (
                              ""
                            )} */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </>
                ) : (
                  <div>
                    <p style={{ color: "#0f2f81", marginLeft: 20 }}>
                      Project Not Found
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApproverProjectList;
