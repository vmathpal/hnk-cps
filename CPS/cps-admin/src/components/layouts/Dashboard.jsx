import React from "react";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
export default function Dashboard() {
  const navigate = useNavigate();
  const [userRequest, setUserRequest] = useState({
    user: "",
    role: "",
    costCenter: "0",
    BU: "0",
    level: "",
  });
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/sign-in");
    }
    const reloadCount = sessionStorage.getItem("reloadCount");
    if (reloadCount != 1) {
      sessionStorage.setItem("reloadCount", String(reloadCount + 1));
      window.location.reload();
    } else {
      sessionStorage.removeItem("reloadCount");
    }

    getUsers();
  }, []);
  // const token=localStorage.getItem("token");
  const getUsers = async () => {
    await axios
      .get(process.env.REACT_APP_API_KEY + "dashboard")
      .then(function (response) {
        setUserRequest((prevState) => ({
          ...prevState,
          user: response.data.userCount,
          role: response.data.roleCount,
          level: response.data.levelCount,
          costCenter: response.data.centerCount,
        }));
      })
      .catch(function (error) {
        if (error.response.status === 401) {
          localStorage.clear();
          navigate("/sign-in");
        }
        console.log(">>data", error.response);
      });
  };
  const { user, role, costCenter, BU, level } = userRequest;
  return (
    <>
      <div className="content-wrapper">
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="page-description">
                <h1>Dashboard</h1>
              </div>
            </div>
          </div>
          <div className="row">
            {localStorage.getItem("user_role") === "super_admin" ? (
              <>
                <div className="col-xl-4">
                  <div className="card widget widget-stats">
                    <NavLink to="/user-management">
                      <div className="card-body">
                        <div className="widget-stats-container d-flex">
                          <div className="widget-stats-icon widget-stats-icon-warning">
                            <i className="material-icons-outlined">person</i>
                          </div>
                          <div className="widget-stats-content flex-fill">
                            <span className="widget-stats-title">
                              Active Users
                            </span>
                            <span className="widget-stats-amount">{user}</span>
                          </div>
                        </div>
                      </div>
                    </NavLink>
                  </div>
                </div>
                <div className="col-xl-4">
                  <div className="card widget widget-stats">
                    <NavLink to="/cost-center-management">
                      <div className="card-body">
                        <div className="widget-stats-container d-flex">
                          <div className="widget-stats-icon widget-stats-icon-success">
                            <i className="material-icons-outlined">
                              business_center
                            </i>
                          </div>
                          <div className="widget-stats-content flex-fill">
                            <span className="widget-stats-title">
                              Total Cost Center
                            </span>
                            <span className="widget-stats-amount">
                              {costCenter}
                            </span>
                          </div>
                        </div>
                      </div>
                    </NavLink>
                  </div>
                </div>
                <div className="col-xl-4">
                  <div className="card widget widget-stats">
                    <NavLink to="/role-management">
                      <div className="card-body">
                        <div className="widget-stats-container d-flex">
                          <div className="widget-stats-icon widget-stats-icon-danger">
                            <i className="material-icons-outlined">people</i>
                          </div>
                          <div className="widget-stats-content flex-fill">
                            <span className="widget-stats-title">
                              Total Roles
                            </span>
                            <span className="widget-stats-amount">{role}</span>
                          </div>
                        </div>
                      </div>
                    </NavLink>
                  </div>
                </div>
                <div className="col-xl-4">
                  <div className="card widget widget-stats">
                    <NavLink to="/level-management">
                      <div className="card-body">
                        <div className="widget-stats-container d-flex">
                          <div className="widget-stats-icon widget-stats-icon-success">
                            <i className="material-icons-outlined">
                              trending_up
                            </i>
                          </div>
                          <div className="widget-stats-content flex-fill">
                            <span className="widget-stats-title">
                              Total Levels
                            </span>
                            <span className="widget-stats-amount">{level}</span>
                          </div>
                        </div>
                      </div>
                    </NavLink>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="col-xl-4">
                  <div className="card widget widget-stats">
                    <div className="card-body">
                      <div className="widget-stats-container d-flex">
                        <div className="widget-stats-icon widget-stats-icon-warning">
                          <i className="material-icons-outlined">person</i>
                        </div>
                        <div className="widget-stats-content flex-fill">
                          <span className="widget-stats-title">
                            Active Users
                          </span>
                          <span className="widget-stats-amount">{user}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4">
                  <div className="card widget widget-stats">
                    <div className="card-body">
                      <div className="widget-stats-container d-flex">
                        <div className="widget-stats-icon widget-stats-icon-success">
                          <i className="material-icons-outlined">
                            business_center
                          </i>
                        </div>
                        <div className="widget-stats-content flex-fill">
                          <span className="widget-stats-title">
                            Total Cost Center
                          </span>
                          <span className="widget-stats-amount">
                            {costCenter}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4">
                  <div className="card widget widget-stats">
                    <div className="card-body">
                      <div className="widget-stats-container d-flex">
                        <div className="widget-stats-icon widget-stats-icon-danger">
                          <i className="material-icons-outlined">people</i>
                        </div>
                        <div className="widget-stats-content flex-fill">
                          <span className="widget-stats-title">
                            Total Roles
                          </span>
                          <span className="widget-stats-amount">{role}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4">
                  <div className="card widget widget-stats">
                    <div className="card-body">
                      <div className="widget-stats-container d-flex">
                        <div className="widget-stats-icon widget-stats-icon-success">
                          <i className="material-icons-outlined">trending_up</i>
                        </div>
                        <div className="widget-stats-content flex-fill">
                          <span className="widget-stats-title">
                            Total Levels
                          </span>
                          <span className="widget-stats-amount">{level}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
