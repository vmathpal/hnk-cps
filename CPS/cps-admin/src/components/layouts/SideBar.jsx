import { React, useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import axios from "axios";
export default function SideBar() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [levels, setLevels] = useState([]);
  const Logout = () => {
    localStorage.clear();
    navigate("/sign-in");
  };
  const options = [];
  const menuId = [];
  useEffect(() => {
    getLevels();
  }, []);

  const getLevels = async () => {
    setIsLoading(true);
    axios({
      url: process.env.REACT_APP_API_KEY + "get-all-list",
      method: "get",
      params: {
        userRole: localStorage.getItem("user_role"),
        userID: localStorage.getItem("userID"),
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log(">>>", response.data.data);
        if (localStorage.getItem("user_role") === "super_admin") {
          setLevels(response.data.data);
          // response.data.data.forEach((menu) => {
          //   setMenus(menu.parentMenuId);
          // });
        } else {
          response.data.data.forEach((element) => {
            options.push({
              id: element.permission.id,
              name: element.permission.name,
              icon: element.permission.icon,
              route: element.permission.route,
              action: element.actions,
            });
          });
          setLevels(options);
        }
        console.log(">>>ddd", menuId);
      })
      .catch((error) => {
        console.log("error==>", error);
      });
  };
  return (
    <div className="app align-content-stretch d-flex flex-wrap">
      <div className="app-sidebar">
        <div className="logo">
          <NavLink to="/dashboard" className="logo-icon">
            {/* <span className="logo-text">CPS</span> */}
          </NavLink>
          <div className="sidebar-user-switcher user-activity-online">
            <NavLink to="/dashboard">
              <h3 className="user-info-text">
                CPS System
                <br />
              </h3>
            </NavLink>
          </div>
        </div>
        <div className="app-menu">
          <ul className="accordion-menu">
            <li>
              <NavLink to="dashboard">
                <i className="material-icons-two-tone">dashboard</i>
                Dashboard
              </NavLink>
            </li>
            {levels.map((level, index) => (
              <li key={level.id}>
                <NavLink
                  to={
                    localStorage.getItem("user_role") === "super_admin"
                      ? level.route
                      : level.route + "/" + level.action
                  }
                  className={level.route}
                >
                  <i className="material-icons-two-tone">{level.icon}</i>
                  {level.name}
                </NavLink>
              </li>
            ))}
            {/* <li>
              <a href="#">
                <i className="material-icons-two-tone">view_agenda</i>Dropdown
                Content
                <i className="material-icons has-sub-menu">
                  keyboard_arrow_right
                </i>
              </a>
              <ul className="sub-menu">
                <li>
                  <NavLink to="brand-management">Brand Management</NavLink>
                </li>
                <li>
                  <NavLink to="line-extension-management">
                    Line Extension
                  </NavLink>
                </li>
                <li>
                  <NavLink to="sku-management">Pack Size Management</NavLink>
                </li>
                <li>
                  <NavLink to="packtype-management">
                    Pack Type Management
                  </NavLink>
                </li>
                <li>
                  <NavLink to="category-management">
                    Category Management
                  </NavLink>
                </li>
                <li>
                  <NavLink to="expense-management">Expense Management</NavLink>
                </li>
                <li>
                  <NavLink to="project-volume-management">
                    Project Volume Management
                  </NavLink>
                </li>
                <li>
                  <NavLink to="project-type-management">
                    Project Type Management
                  </NavLink>
                </li>
                <li>
                  <NavLink to="business-type-management">
                    Business Type Management
                  </NavLink>
                </li>

                <li>
                  <NavLink to="channel-management">Region Management</NavLink>
                </li>
                <li>
                  <NavLink to="area-management">District Management</NavLink>
                </li>
                <li>
                  <NavLink to="district-management">Sales Region</NavLink>
                </li>
              </ul>
            </li> */}
          </ul>
        </div>
      </div>
      <div className="app-container">
        <div className="app-header">
          <nav className="navbar navbar-light navbar-expand-lg">
            <div className="container-fluid">
              <div className="navbar-nav" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <a className="nav-link hide-sidebar-toggle-button" href="#">
                      <i className="material-icons">first_page</i>
                    </a>
                  </li>
                  <li className="nav-item dropdown hidden-on-mobile">
                    {/* <NavLink
                      className="nav-link dropdown-toggle"
                      to="#"
                      id="addDropdownLink"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="material-icons">add</i>
                    </NavLink> */}
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="addDropdownLink"
                    >
                      <li>
                        <NavLink className="dropdown-item" to="/create-project">
                          Create Project
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                  <li className="nav-item dropdown hidden-on-mobile">
                    {/* <a
                      className="nav-NavLink dropdown-toggle"
                      href="#"
                      id="exploreDropdownNavLink"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="material-icons-outlined">explore</i>
                    </a> */}
                    <ul
                      className="dropdown-menu dropdown-lg large-items-menu"
                      aria-labelledby="exploreDropdownNavLink"
                    >
                      <li>
                        <h6 className="dropdown-header">Repositories</h6>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          <h5 className="dropdown-item-title">
                            Neptune iOS
                            <span className="badge badge-warning">1.0.2</span>
                            <span className="hidden-helper-text">
                              switch
                              <i className="material-icons">
                                keyboard_arrow_right
                              </i>
                            </span>
                          </h5>
                          <span className="dropdown-item-description">
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry.
                          </span>
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          <h5 className="dropdown-item-title">
                            Neptune Android
                            <span className="badge badge-info">dev</span>
                            <span className="hidden-helper-text">
                              switch
                              <i className="material-icons">
                                keyboard_arrow_right
                              </i>
                            </span>
                          </h5>
                          <span className="dropdown-item-description">
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry.
                          </span>
                        </a>
                      </li>
                      <li className="dropdown-btn-item d-grid">
                        <button className="btn btn-primary">
                          Create new repository
                        </button>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
              <div className="d-flex">
                <ul className="navbar-nav">
                  <li className="nav-item hidden-on-mobile">
                    <Link to="admin-change-pass">
                      <i
                        className="material-icons-two-tone"
                        title="Admin Settings"
                      >
                        settings
                      </i>
                    </Link>
                  </li>

                  <li className="nav-item hidden-on-mobile active">
                    <a href="#">
                      <i
                        className="material-icons-two-tone active"
                        title="Logout"
                        onClick={Logout}
                      >
                        logout
                      </i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
