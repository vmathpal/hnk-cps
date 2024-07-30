import React, { Fragment } from "react";
//Bootstrap and jQuery libraries
import "jquery/dist/jquery.min.js";
//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from "jquery";
import {TimeOutPopUp} from "../TimeOut";

import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { useState, useEffect } from "react";
import { NavLink, useNavigate,useParams } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import LoadingSpinner from "../Loader/LoadingSpinner";

export default function EmailTemplateList() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [emailTemp, setEmailTemp] = useState([]);
  let { action } = useParams()
  console.log('>>', action)

  useEffect(() => {
    if (! localStorage.getItem("token")) {
              TimeOutPopUp(navigate);
              return;
            }
      
    getEmailTemplate();
  }, []);

  const getEmailTemplate = async () => {
    setIsLoading(true);
    axios({
      url: process.env.REACT_APP_API_KEY + "email-templates",
      method: "get",
      params: {
        url: "email-templates",
        userID: localStorage.getItem("userID"),
        role: localStorage.getItem("user_role"),
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(function (response) {
        setEmailTemp(response.data.data);
        setIsLoading(false);
        setTimeout(function () {
          $("#myTable").DataTable({
            bDestroy: true,
            fixedHeader: true,
            pagingType: "full_numbers",
            pageLength: 10,
            processing: true,
            dom: "Bfrtip",

            select: true,
          });
        }, 300);
      })
      .catch(function (error) {
        //console.log('>>>>>>>>>>>error',error)
        if (error.response.status === 401) {
          localStorage.clear();
          navigate("/sign-in");
        }
        if (error.response.status === 423) {
          swal({
            title: "Error!",
            text: "Permission Denied",
            icon: "error",
            button: "Okay",
          });
          navigate("/dashboard");
          return false;
        }
      });
  };

  //initialize datatable
  useEffect(() => {
    setTimeout(function () {
      $("#myTable").DataTable({
        bDestroy: true,
        fixedHeader: true,
        pagingType: "full_numbers",
        pageLength: 10,
        processing: true,
        bRetrieve: true,
        dom: "Bfrtip",

        select: true,
      });
    }, 200);
  }, []);
  const renderUser = (
    <table id="myTable" className="table table-striped my-3">
      <thead className="table-dark">
        <tr>
          <th scope="col">#</th>
          <th scope="col">Subject</th>
          <th scope="col">Alias</th>
          <th scope="col">Variables</th>
          {
            (
                  localStorage.getItem("user_role") === 'super_admin'?
                    <th scope="col">Action</th>
                    : localStorage.getItem("user_role") === 'sub_admin' && action==='Modify'?
                    <th scope="col">Action</th>:''
            )
          }

        </tr>
      </thead>
      <tbody>
        {emailTemp?.map((role, index) => (
          <React.Fragment key={role.id}>
            <tr>
              <td>{++index}</td>
              <td>{role?.subject}</td>
              <td>{role?.variable_name  }</td>
              <td>{role?.variables}</td>
              {
         (
          localStorage.getItem("user_role") === 'super_admin'?
              <td>
                <NavLink
                  to={{ pathname: "/email-templates/edit-email-templates/"+role.id }}
                  state={{ id: role.id }}
                >
                  <span className="material-icons" title="Edit">
                    edit
                  </span>
                </NavLink>
                &nbsp;
              </td>
             : localStorage.getItem("user_role") === 'sub_admin' && action==='Modify'?
             <td>
             <NavLink
               to={{ pathname: "/email-templates/edit-email-templates/"+role.id }}
               state={{ id: role.id }}
             >
               <span className="material-icons" title="Edit">
                 edit
               </span>
             </NavLink>
             &nbsp;
           </td>:''
         )}
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col">
          <div className="page-description">
            <h1>Email Templates</h1>
          </div>
        </div>
      </div>
      {isLoading ? <LoadingSpinner /> : renderUser}
    </div>
  );
}
