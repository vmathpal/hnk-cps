import { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import ApprovalStatusCard from "../components/ApprovalStatusCard";
import axios from "axios";
import dateFormat from "dateformat";
import Moment from "moment";
import Select from "react-select";
import Filter from "../../src/images/FilterIc.svg";
import swal from "sweetalert";
import { NavLink, useNavigate } from "react-router-dom";

const Overview = () => {
  const [selectedlevel, setSelectedLevel] = useState("");

  const [project, setProject] = useState([]);
  const [projectsData, setProjectData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const data = [
    { value: "", label: "All Project" },
    { value: "sales", label: "Sales" },
    { value: "marketing", label: "Marketing" },
    { value: "trade_marketing", label: "Trade Marketing" },
  ];
  useEffect(() => {
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
    getProject("");
    getListProject("");
  }, []);

  const getListProject = async (event) => {
    setIsLoading(true);
    await axios({
      url: process.env.REACT_APP_API_KEY + "get-all-project-execution",
      method: "get",
      params: {
        search: event,
        status: "created",
        role: "user",
        userID: localStorage.getItem("authID"),
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(function (response) {
      console.log("Overview", response.data.data);
      setProject(response.data.data);
      setIsLoading(false);
    });
  };
  function getProject(event) {
    setIsLoading(true);
    axios({
      url: process.env.REACT_APP_API_KEY + "get-all-project-execution",
      method: "get",
      params: {
        search: event,
        status: "created",
        role: "user",
        userID: localStorage.getItem("authID"),
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(function (response) {
      setProjectData(response.data.data);
      setIsLoading(false);
    });
  }
  function handleChange(event) {
    getListProject(event.target.value);
  }
  const levelHandleChange = (e) => {
    getListProject(e.value);
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
          <div className="approval-status">
            <Row className="flex">
              <div className="title-one">
                <h3 className="title">New Project Approval Status</h3>
              </div>
              {/* <div className="dropdown all-request">
                <DropdownButton
                  id="dropdown-item-button"
                  title="Dropdown button"
                >
                  <Dropdown.ItemText>Dropdown item text</Dropdown.ItemText>
                  <Dropdown.Item as="button">Actions</Dropdown.Item>
                  <Dropdown.Item as="button">Another action</Dropdown.Item>
                  <Dropdown.Item as="button">Something else</Dropdown.Item>
                </DropdownButton>
              </div> */}
            </Row>

            <div className="approval-status-container">
              {projectsData.length !== 0 ? (
                Object.values(projectsData)?.map((pro, index) =>
                  pro.status === "completed" || pro.status === "pending" ? (
                    <ApprovalStatusCard
                      title={pro.name}
                      projectType={pro.department}
                      subTitle={pro.projectType}
                      date={Moment(pro.createdAt).format("DD-MMM-YYYY")}
                      Id={pro.id}
                    />
                  ) : (
                    ""
                  )
                )
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    No matching records found
                  </td>
                </tr>
              )}
            </div>

            <div className="project-in-exec">
              <header className="header">
                <div className="title">
                  <h3 className="heading">
                    Project in Execution{" "}
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
                  defaultValue={selectedlevel}
                  onChange={levelHandleChange}
                  name="level"
                  options={data}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  isOptionDisabled={(option) => option.isdisabled}
                />
              </div>

              <div className="cards-container ver-scroll">
                {project.length > 0 ? (
                  <>
                    {project.map((pro, index) => (
                      <article className="card">
                        <div className="card-inner">
                          <div className="header">
                            <p>{"REQ" + pro.id}</p>
                            <p>{pro.projectType}</p>
                            <p
                              className={`project-badge-${pro.status}`}
                              style={{
                                width: "100%",
                                textAlign: "right",
                                fontWeight: 600,
                              }}
                            >
                              Approval Request{" "}
                              {pro.status === "draft"
                                ? "Draft"
                                : pro.status === "completed"
                                ? "Pending"
                                : pro.status === "pending"
                                ? "Pending"
                                : ""}
                            </p>
                            <p
                              className="project-badge mt-1"
                              style={{
                                width: "100%",
                                textAlign: "right",
                                color: "rgb(6 91 126)",
                                fontWeight: 600,
                              }}
                            >
                              Request Type :{" "}
                              {pro.ChangeStatus === null &&
                              pro.CloserStatus === null
                                ? "Fresh Request"
                                : pro.ChangeStatus !== null &&
                                  pro.CloserStatus === null
                                ? "Change Request"
                                : "Close Request"}
                            </p>
                          </div>
                          <div className="card-body">
                            <h4>{pro.name}</h4>
                            <div className="project-badge dept">
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
                                    ? new Intl.NumberFormat("en-SG").format(
                                        pro.totalBudget
                                      )
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
                                <div className="ellipse view-details">
                                  <NavLink
                                    to={{
                                      pathname: "/create-project/" + pro.id,
                                    }}
                                    state={{
                                      productOwner: "creator",
                                    }}
                                  >
                                    <p> View Details</p>
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

export default Overview;
