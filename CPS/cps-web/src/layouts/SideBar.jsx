import React from "react";
import ReactBootstrap from "react-bootstrap";
import Logo from "../images/logo.png";
import Overview from "../images/overview.png";
import AllProjects from "../images/all-projects.png";
import CreateProject from "../images/create-project.png";
import UserGuide from "../images/user-guide.png";
import LogOut from "../images/logout.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

const SideBar = () => {
  const [role, setRoleName] = useState("");
  const token = localStorage.getItem("auth-token");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadData, setIsLoadData] = useState(false);
  const navigate = useNavigate();
  const Logout = () => {
    localStorage.clear();
    navigate("/login");
  };
  const logoutTimerIdRef = useRef(null);

  useEffect(() => {
    const autoLogout = () => {
      if (document.visibilityState === "hidden") {
        // const timeOutId = window.setTimeout(Logout(), 5 * 60 * 9000);
        const timeOutId = setTimeout(
          function () {
            Logout();
          }.bind(this),
          1800000
        );

        logoutTimerIdRef.current = timeOutId;
      } else {
        window.clearTimeout(logoutTimerIdRef.current);
      }
    };

    document.addEventListener("visibilitychange", autoLogout);

    return () => {
      document.removeEventListener("visibilitychange", autoLogout);
    };
  }, []);
  const handleClick = async () => {
    window.location.href = process.env.REACT_APP_CLIENT_URL + "CPS.pdf";
  };
  const fetchUser = async () => {
    setIsLoading(true);
    await axios
      .get(
        process.env.REACT_APP_API_KEY +
          "singleUser/" +
          localStorage.getItem("authID"),
        {
          headers: {
            "Content-type": "Application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        res.data ? setIsLoadData(true) : setIsLoadData(false);
        setRoleName(res.data.roleName.role);
        localStorage.setItem("authDepartmentRole", res.data.roleName.role);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("error>>", error.message);
      });
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUser();
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  return (
    <aside className="sidebar text-left">
      <div className="brand-logo">
        <NavLink to="/overview">
          <img src={Logo} alt="Logo" />
        </NavLink>
      </div>
      <ul className="navigations">
        <li className="nav-link active">
          <NavLink to="/overview" title="Overview">
            <img src={Overview} alt="Overview"></img>Overview
          </NavLink>
        </li>

        <li className="nav-link">
          <NavLink to="/all-projects" title="All Projects">
            <img src={AllProjects} alt="All Projects"></img>All Projects
          </NavLink>
        </li>

        {localStorage.getItem("AuthLevel") === "level6" ||
        localStorage.getItem("AuthLevel") === "level5" ||
        localStorage.getItem("AuthLevel") === "level4" ||
        localStorage.getItem("AuthLevel") === "level3" ? (
          <>
            <li className="nav-link">
              <NavLink
                to="/create-project/created"
                title="Create Projects"
                state={{
                  productOwner: "creator",
                }}
              >
                <img src={CreateProject} alt="Create Project"></img>Create
                Project
              </NavLink>
            </li>
            <li className="nav-link">
              <NavLink to="/my-projects" title="My Projects">
                <img src={CreateProject} alt="My Project"></img>My Projects
              </NavLink>
            </li>
            <li className="nav-link">
              <NavLink to="/cancelled-projects" title="Cancelled Projects">
                <img src={CreateProject} alt="My Project"></img>My Cancelled
                Projects
              </NavLink>
            </li>
          </>
        ) : (
          ""
        )}
        <li className="nav-link">
          <NavLink to="/projects-for-approval" title="Projects For My Approval">
            <img src={CreateProject} alt="Project For Approval"></img>
            Projects For My Approval
          </NavLink>
        </li>

        <li className="nav-link">
          <NavLink to="/project-reports" title="All Projects Reports">
            <img src={AllProjects} alt="All Projects"></img>Generate Report
          </NavLink>
        </li>

        <li className="nav-link">
          <a onClick={handleClick} className="user-guide" title="User Guide">
            <img src={UserGuide} alt="User Guide"></img>
            User Guide
          </a>
        </li>
      </ul>

      {/* <div className="logout">
        <li className="nav-link">
          <NavLink to="/login" title="Log Out" onClick={Logout}>
            <img src={LogOut} alt="User Guide"></img>Logout
          </NavLink>
        </li>
      </div> */}
    </aside>
  );
};

export default SideBar;
