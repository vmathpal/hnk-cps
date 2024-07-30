import React, { Fragment } from "react";
//Bootstrap and jQuery libraries
import "jquery/dist/jquery.min.js";
//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from "jquery";
import dateFormat from "dateformat";
import DatePicker from "react-datepicker";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { useState, useEffect } from "react";
import { TimeOutPopUp } from "../TimeOut";

import { NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import LoadingSpinner from "../Loader/LoadingSpinner";

export default function AuditLog() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [project, setProjects] = useState([]);
  let { action } = useParams();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [resetFilter, setResetFilter] = useState(false);

  useEffect(() => {
    if (resetFilter) {
      // Call the API function when resetFilter is true
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
    //$('.dt-buttons').hide();
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

  const getRoleList = () => {
    const dateF = new Date(fromDate);
    const dateT = new Date(toDate);

    var dateError = false;
    if (dateF && dateT && dateF > dateT) {
      swal("Oops", "To Date is earlier than From Date", "error");
      dateError = true;
    }

    if (dateError === false) {
      getRoles();
      console.log("date1 and date2 are the same");
    }
  };

  const getRoles = async () => {
    setIsLoading(true);
    await axios({
      url: process.env.REACT_APP_API_KEY + "project-audit-log",
      method: "get",
      params: {
        url: "audit-log-management",
        userID: localStorage.getItem("userID"),
        role: localStorage.getItem("user_role"),
        fromDate: fromDate,
        toDate: toDate,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(function (response) {
        setProjects(response.data.result);
        setIsLoading(false);
        initializeDataTable();
      })
      .catch(function (error) {
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
        console.log(">>>>>>>>>>>error", error.response);
      });
  };
  const handleResetFilter = () => {
    setToDate("");
    setFromDate("");
    setResetFilter(true);
  };

  const searctData = async (test) => {
    if(test != 'fromsearch'){
      initializeDataTable();
       }
    getRoleList();
  };

  console.log(
    "NEWNWNWNWNWNNWNWNWNWNWNNWNWNNWNWNWNWNNWNWNWWNWN",
    fromDate,
    toDate
  );
  const renderUser = (
    <div className="table-responsive">
      <table id="myTable" className="table  table-hover table-striped my-3">
        <thead className="table-dark">
          <tr>
            <th scope="col">Sr No.</th>
            <th scope="col">Request ID</th>
            <th scope="col">Project Name</th>
            <th scope="col">Project Owner</th>
            <th scope="col">Action Date</th>
            <th scope="col">Action Taken</th>
            <th scope="col">Action By</th>
            <th scope="col">Comment</th>
          </tr>
        </thead>
        <tbody>
          {project?.map((product, index) => (
            <tr key={index}>
              <td>{++index}</td>
              <td>{product.Project?.id}</td>
              <td>{product.Project?.name}</td>
              <td>{product.User?.email.split("@")[0]}</td>
              <td>{dateFormat(product.createdAt, "dd mmm yyyy")}</td>
              <td>{product?.message}</td>
              <td>{product?.actionBy ? product.actionBy : "-"}</td>
              <td>{product?.comment ? product.comment : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col">
          <div className="page-description">
            <h1>Audit Log Management</h1>
          </div>
          <div className="project-info">
            <div className="row">
              <div className="col-md-2">
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
              <div className="col-md-4 button">
                <div className="LoadBtnBox">
                  <button
                    id="load-dt"
                    className="btn btn-info  me-2"
                    onClick={()=>{
                        searctData('fromsearch')
                      }}
                    type="button"
                  >
                    Apply Filter
                  </button>
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
      </div>

      {isLoading ? <LoadingSpinner /> : renderUser}
    </div>
  );
}
