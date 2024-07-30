import React, { Fragment } from "react";
//Bootstrap and jQuery libraries
import "jquery/dist/jquery.min.js";
//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import DatePicker from "react-datepicker";
import $ from "jquery";
import dateFormat from "dateformat";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { TimeOutPopUp } from "../TimeOut";
import LoadingSpinner from "../Loader/LoadingSpinner";

export default function DelegationAudit() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [project, setProjects] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fromStartDate, setFromStartDate] = useState("");
  const [toStartDate, setToStartDate] = useState("");
  
  const [resetFilter, setResetFilter] = useState(false);
  let { action } = useParams();

  useEffect(() => {
    if (resetFilter) {
      // Call the API function when resetFilter is true
      initializeDataTable();
      getRoles();
      // Reset the flag to avoid repeated calls
      setResetFilter(false);
    }
  }, [resetFilter]);

  const initializeDataTable = () => {
    $("#myTable").DataTable().clear().destroy();
    setTimeout(function () {
      $("#myTable").DataTable({
        buttons: [
          {
            extend: "excelHtml5",
            title: "",
            text: "Export",
            filename: "project_audit_logs",
            className: "btn btn-info mt-2",
            exportOptions: {
              columns: ":not(.no-export)", // Exclude columns with the "no-export" class
            },
          },
        ],
        bDestroy: true,
        fixedHeader: true,
        pagingType: "full_numbers",
        pageLength: 10,
        processing: true,
        dom: "Bfrtip",
        select: true,
      });
    }, 500);
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      TimeOutPopUp(navigate);
      return;
    }
    getRoles();
    document.body.className = "pace-done no-loader users";
    if ($("body").hasClass("users")) {
      $(".dt-buttons").addClass("csv-button");
    }
    return () => {
      document.body.className = "pace-done no-loader";
    };
  }, []);

  const getRolesList = () => {
    const dateF = new Date(fromDate);
    const dateT = new Date(toDate);
    const dateSF = new Date(fromStartDate);
    const dateST = new Date(toStartDate);
    var dateError = false;
    if (dateF && dateT && dateF > dateT) {
      swal("Oops", "To Date is earlier than From Date", "error");
      dateError = true;
    }
    if (dateSF && dateST && dateSF > dateST) {
      swal("Oops", "To Date is earlier than From Date", "error");
      dateError = true;
    }
    if (dateError === false) {
      initializeDataTable();
      getRoles();
      console.log("date2 and date2 are the same");
    }
  };


  const getRoles = async () => {
    setIsLoading(true);
    await axios({
      url: process.env.REACT_APP_API_KEY + "user-delegation-audit-log/",
      method: "get",
      params: {
        role: localStorage.getItem("user_role"), 
        fromDate: fromDate,
        toDate: toDate,
        fromStartDate: fromStartDate,
        toStartDate: toStartDate,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(function (response) {
        console.log("pivk")
        setProjects(response.data.data);
        setIsLoading(false);
        initializeDataTable();
      })
      .catch(function (error) {
        if (error.response.status === 401) {
          localStorage.clear();
          navigate("/sign-in");
          setIsLoading(false);
        }
        if (error.response.status === 423) {
          swal({
            title: "Error!",
            text: "Permission Denied",
            icon: "error",
            button: "Okay",
          });
          setIsLoading(false);
          navigate("/dashboard");
          return false;
        }
        console.log(">>>>>>>>>>>error", error.response);
      });
  };
  const searctData = async (test) => {
    if(test != 'fromsearch'){
   initializeDataTable();
    }
    getRolesList();
  };
  const handleResetFilter = () => {
    // Reset state values
    setToDate("");
    setFromDate("");
    setFromStartDate("");
    setToStartDate("");
    // Set the flag to trigger the useEffect
    setResetFilter(true);
  };
  const renderUser = (
    <table id="myTable" className="table table-striped my-3">
      <thead className="table-dark">
        <tr>
          <th scope="col">#</th>
          <th scope="col">User</th>
          <th scope="col">Delegated User</th>
          <th scope="col">Start Date</th>
          <th scope="col">End Date</th>
          <th scope="col">Action Date</th>
          <th scope="col">Action Taken</th>
        </tr>
      </thead>
      <tbody>
        {Object.values(project)?.map((item, index) => (
          <tr key={item?.id}>
            <td>{++index}</td>
            <td>{item.user}</td>
            <td>{item.delegatedUser}</td>
            <td>{dateFormat(item.startDate, "yyyy-mm-dd")}</td>
            <td>{dateFormat(item.endDate, "yyyy-mm-dd")}</td>
            <td>{dateFormat(item.createdAt, "dd mmm yyyy HH:MM")}</td>
            <td>{item.message}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col">
          <div className="page-description">
            <h1>User Delegation Audit Log</h1>
          </div>
          <div className="projectInfo-Row">
            <div className="project-info">
              <div className="row">
                <div className="col-md-3">
                  <div className="rowTitle">Action Date</div>
                </div>
                <div className="col-md-3">
                  <label htmlFor="inputTitle" className="form-label">
                    From Date
                  </label>
                  <DatePicker
                    className="form-control"
                    name="startDate"
                    maxDate={new Date()}
                    selected={fromDate}
                    autoComplete="off"
                    onChange={(date) => setFromDate(date)}
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor="inputTitle" className="form-label">
                    To Date
                  </label>
                  <DatePicker
                    className="form-control"
                    name="endDate"
                    maxDate={new Date()}
                    selected={toDate}
                    autoComplete="off"
                    onChange={(date) => setToDate(date)}
                  />
                </div>
                <div className="col-md-3 button">
                  <div className="LoadBtnBox">
                    <button
                      id="load-dt"
                      className="btn btn-info"
                      onClick={()=>{
                        searctData('fromsearch')
                      }}
                      type="button"
                    >
                      Apply Filter
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="project-info">
              <div className="row mb-2">
                <div className="col-md-3">
                  <div className="rowTitle">Start Date</div>
                </div>
                <div className="col-md-3">
                  <label htmlFor="inputTitle" className="form-label">
                    From Date
                  </label>
                  <DatePicker
                    className="form-control"
                    name="startDate"
                    maxDate={new Date()}
                    selected={fromStartDate}
                    autoComplete="off"
                    onChange={(date) => setFromStartDate(date)}
                  />
                </div>

                <div className="col-md-3">
                  <label htmlFor="inputTitle" className="form-label">
                    To Date
                  </label>
                  <DatePicker
                    className="form-control"
                    name="endDate"
                    maxDate={new Date()}
                    selected={toStartDate}
                    autoComplete="off"
                    onChange={(date) => setToStartDate(date)}
                  />
                </div>   
                <div className="col-md-3 button">
                  <div className="LoadBtnBox">
                    <button
                    id="load-dt"
                    className="btn btn-info"
                    onClick={handleResetFilter}
                    type="button"
                  >
                    Reset Filter
                  </button>
                  </div>
                </div>          
              </div>
            </div>
          </div>
          {/* <div>
            <Link
              className="btn btn-primary mx-3"
              to={
                localStorage.getItem("user_role") === "sub_admin"
                  ? "/project-management/Modify"
                  : "/project-management"
              }
            >
              Back
            </Link>
          </div> */}
        </div>
      </div>

      {isLoading ? <LoadingSpinner /> : renderUser}
    </div>
  );
}
