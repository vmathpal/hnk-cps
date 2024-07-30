import React, { Fragment } from "react";
//Bootstrap and jQuery libraries
import "jquery/dist/jquery.min.js";
//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from "jquery";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { useState, useEffect } from "react";
import { NavLink,useNavigate,useLocation } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import LoadingSpinner from "../Loader/LoadingSpinner";

export default function ActionRoleList() {
    const {
        state: { id },
      } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState([]);
 
  useEffect(() => {
    getRoles();
    console.log('userId',id);
  }, []);
  
  const getRoles = async () => {
    setIsLoading(true)
    await axios
      .get(process.env.REACT_APP_API_KEY + "all-action-role/"+id,
      {headers: {
        "Content-type": "Application/json",
        //"Authorization": `Bearer ${localStorage.getItem("token")}`
        }   
    })
      .then(function (response) {
        setRoles(response.data.data);
        setIsLoading(false)
;      })
      .catch(function (error) {
       console.log('>>>>>>>>>>>error',error)
        // if(error.response.data.statusCode===401){
        //   localStorage.clear();
        //   navigate("/sign-in");
        // }
    
      });
  };

  const deleteRole = async (id) => {
    confirmAlert({
      title: "Confirm to Delete?",
      message: "Are you sure want to delete?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            await axios
              .delete(process.env.REACT_APP_API_KEY+'delete-admin-dashboard-action/'+ id,
              {headers: {
                "Content-type": "Application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
                }   
            })
              .then(function (response) {
                swal({
                  title: "Deleted!",
                  text: "Deleted Successfully",
                  icon: "success",
                  button: "Okay",
                });
               $('#myTable').DataTable().clear().destroy();
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
                getRoles();
              })
              .catch(function (error) {
                console.log(error);
              });
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
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
        dom: "Bfrtip",
  
        select: true,
      });
    }, 300);
  }, []);

  const renderUser = (
  
    <table id="myTable" className="table table-striped my-3">
    <thead className="table-dark">
      <tr>
        <th scope="col">#</th>
        <th scope="col">Name</th>
        <th scope="col">Privilege</th>
        
        <th scope="col">Action</th>
      </tr>
    </thead>
    <tbody>
      {roles?.map((role, index) => (
     (<React.Fragment key={role.id}>
         <tr>
          <td>{++index}</td>
          <td>{role?.permission['name']}</td>
          <td>{role?.actions}</td> 
          <td>     
            <NavLink to={{ pathname: "/sub-admin-list/edit-privilege" }} state={{ id: role?.id }}>
              <span className="material-icons" title='Edit'>edit</span>
            </NavLink>
            &nbsp;
          
            &nbsp;
            <span style={{color:'red',cursor:"pointer"}}
              className="material-icons-outlined cursor-default"
              onClick={() => {
                deleteRole(role?.id);
              }}
              title='Delete'
            >
              delete
            </span>
            &nbsp;
          </td>
        </tr>
        </React.Fragment>
)

      ))}
    </tbody>
   
  </table>
  
  );
  return (
  
    <div className="content-wrapper">
      <div className="row">
        <div className="col">
          <div className="page-description">
            <h1>Privilege Management</h1>
          </div>
        </div>
      </div>
    <><NavLink className="btn btn-info" to="/sub-admin-list">Back</NavLink></>
    {isLoading ? <LoadingSpinner /> : renderUser}
    </div>
    
  );
}
