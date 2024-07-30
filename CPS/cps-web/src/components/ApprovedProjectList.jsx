import { useState, useEffect } from "react";
import axios from "axios";
import dateFormat from "dateformat";
import Select from "react-select";
import { NavLink } from "react-router-dom";
import LoadingSpinner from "./Loader/LoadingSpinner";

const ApprovedProjectList = () => {
  const [selectedlevel, setSelectedLevel] = useState("");

  const [project, setProject] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getListProject();
  }, []);

  const getListProject = async () => {
    setIsLoading(true);
    await axios({
      url:
        process.env.REACT_APP_API_KEY +
        "approved-project-list/" +
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
        // console.log("Approved List", response.data.data);
        setProject(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //   function handleChange(event) {
  //     getListProject(event.target.value);
  //   }
  //   const levelHandleChange = (e) => {
  //     getListProject(e.value);
  //   };
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
              </header>

              <div className="cards-container">
                {project.length > 0 ? (
                  <>
                    {project.map((pro, index) => (
                      <article className="card" key={index}>
                        <div className="card-inner">
                          <div className="header">
                            <p>{"REQ" + pro.id}</p>
                            <p>{pro.projectType}</p>
                            <p
                              className={`project-badge-${pro.status}`}
                              style={{
                                width: "100%",
                                textAlign: "right",
                                color: "rgb(67 135 227)",
                                fontWeight: 600,
                              }}
                            >
                              Request{" "}
                              {pro.status === "approved"
                                ? "Approved"
                                : "Completed"}
                            </p>
                          </div>
                          <div className="card-body">
                            <h4>{pro.name}</h4>
                            <div className={`project-badge ${pro.department}`}>
                              {pro.department === "sales"
                                ? "Sales"
                                : pro.department === "marketing"
                                ? "Marketing"
                                : "Trade Marketing"}
                            </div>
                            <div className="flex_row">
                              <div className="left">
                                <p>Duration</p>
                                <h4>
                                  {dateFormat(pro.sellingStartDate, "dd mmm")} -{" "}
                                  {dateFormat(
                                    pro.sellingEndDate,
                                    "dd mmm yyyy"
                                  )}
                                </h4>
                              </div>
                              <div className="right">
                                <p>Projects Budget</p>
                                <h4>
                                  $
                                  {pro.totalBudget !== null
                                    ? pro.totalBudget
                                    : 0}
                                </h4>
                              </div>
                            </div>
                            <div className="brandings">
                              <p>Brands</p>
                              <div className="flex">
                                <div className="image-container">
                                  {pro.ProjectBrands.map((name, index) => (
                                    <span>{name.Brand.name}&nbsp;</span>
                                  ))}
                                </div>
                                {/* {pro.status === "draft" ? ( */}
                                <div className="view-details">
                                  <NavLink
                                    to={{
                                      pathname: "/create-project/" + pro.id,
                                    }}
                                    state={{
                                      productOwner: "creator",
                                    }}
                                  >
                                    {" "}
                                    View Details
                                  </NavLink>
                                  {/* <BsThreeDots /> */}
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

export default ApprovedProjectList;
