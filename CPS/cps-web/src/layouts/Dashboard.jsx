import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
// import Setting from "../images/setting.svg";
import Bell from "../images/discuss-issue.svg";
import Out from "../images/logout-svgrepo-com.svg";
import Row from "react-bootstrap/Row";
import { useState, useEffect } from "react";
import swal from "sweetalert";
import axios from "axios";
const Dashboard = (props) => {
  const token = localStorage.getItem("auth-token");
  const [role, setRoleName] = useState("");
  const [inputs, setInputs] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadData, setIsLoadData] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUser();
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  const Logout = () => {
    localStorage.clear();

    // swal({
    //   title: "Success!",
    //   text: "Logged-out Successfully!",
    //   icon: "success",
    //   button: "Okay",
    // });

    navigate("/login");
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
        // console.log("Logged In Person Role", res.data);
        res.data ? setIsLoadData(true) : setIsLoadData(false);
        setInputs({
          email: res.data.email,
          dept_roleId: res.data.dept_roleId,
        });
        setRoleName(
          res.data.isBA ? res.data.BusinessAnalyst.name : res.data.roleName.role
        );
        // localStorage.setItem("authDepartmentRole", res.data.roleName.role);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("error>>", error.message);
      });
  };
  return (
    <Row className="navbar">
      <div className="col-md-4 nav-left">
        <h4 className="admin-name">Welcome! {inputs.email?.split("@")[0]}</h4>
        <p className="designation">{role}</p>
      </div>
      {/* <div className="col-md-4 nav-middle">
        <div className="searchbox-wrapper">
          <input
            type="search"
            name=""
            id=""
            className="admin-search"
            placeholder="Enter search keywords"
          />
          <img src={Search} alt="" />
        </div>
      </div> */}
      <div className="col-md-2 nav-right">
        {/* <NavLink
          to="/create-project/create"
          className="button"
          title="Create Project"
        >
          <span>+</span> Create Project
        </NavLink> */}
        {/* <NavLink to="/setting" className="icon setting-icon">
          <img src={Setting} alt="Setting Icon"></img>
        </NavLink> */}
        <NavLink to="/notifications" className="icon notification-icon">
          <img src={Bell} alt="Bell Icon"></img>
        </NavLink>

        <NavLink
          to="/login"
          className="icon logout-icon"
          onClick={Logout}
          title="Logout"
        >
          <img src={Out} alt="Bell Icon"></img>
        </NavLink>
        {/* <div className="profile-wrapper">
          <NavLink to="/profile" className="icon profile-img">
            <div className="profile-image-holder">DK</div>
          </NavLink>
          <span className="dropdown-icon"></span>
          <div className="drop-down-items">
            {[""].map((variant) => (
              <DropdownButton
                as={ButtonGroup}
                key={variant}
                id={`dropdown-variants-${variant}`}
                variant={variant.toLowerCase()}
                title={variant}
              >
                <Dropdown.Item eventKey="1" onClick={Logout}>
                  Logout
                </Dropdown.Item>
              </DropdownButton>
            ))}
          </div>
        </div> */}
      </div>
    </Row>
  );
};
export default Dashboard;
