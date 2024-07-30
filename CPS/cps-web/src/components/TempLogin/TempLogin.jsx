import { React, useState, useEffect } from "react";

import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import { NavLink, useNavigate } from "react-router-dom";
import $ from "jquery";
function TempLogin(props) {
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  var pass = "CPS@123";

  const handleSubmit = (event) => {
    //Prevent page reload
    event.preventDefault();

    if (pass === $("#uname").val()) {
      localStorage.setItem("temp-login", "true");
      navigate("/login");
    }
  };

  // Generate JSX code for error message
  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );
  return (
    <>
      <div className="login">
        <Row>
          <div className="col-md-6 temp-login">
            <div className="login-form-container login-form-temp">
              <div>
                <div className="login-head"></div>
                <div className="login-form">
                  <div className="main-form">
                    <h4>Temp Login</h4>
                    <br></br>
                    <div>
                      <form onSubmit={handleSubmit}>
                        <div className="input-container">
                          <h5>Password :</h5>
                          <br></br>
                          <input type="text" name="uname" required id="uname" />
                          {renderErrorMessage("uname")}

                          <input type="submit" />
                        </div>
                        {/* <div className="input-container">
                          <label>Password </label>
                          <br></br>
                          <input type="password" name="pass" required />
                          {renderErrorMessage("pass")}
                        </div> */}
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Row>
      </div>
    </>
  );
}

export default TempLogin;
