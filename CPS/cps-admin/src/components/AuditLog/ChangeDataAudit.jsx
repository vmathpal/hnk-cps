import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../Loader/LoadingSpinner";
import $ from "jquery";
function ChangeDataAudit() {
  const [isLoading, setIsLoading] = useState(false);
  const [auditsNew, setAuditLogNew] = useState(undefined);
  const [auditsOld, setAuditLogOld] = useState(undefined);
  const {
    state: { id },
  } = useLocation();
  useEffect(() => {
    setTimeout(function () {
      $("#myTable").DataTable({
        bDestroy: true,
        fixedHeader: true,
        pagingType: "full_numbers",
        pageLength: 10,
        bInfo: false, //Dont display info e.g. "Showing 1 to 4 of 4 entries"
        paging: false, //Dont want paging
        bPaginate: false, //Dont want paging
        processing: true,
        searching: false,
        dom: "Bfrtip",
        select: true,
      });
    }, 400);
    setTimeout(function () {
      $("#myTableOld").DataTable({
        bDestroy: true,
        fixedHeader: true,
        pagingType: "full_numbers",
        pageLength: 10,
        bInfo: false, //Dont display info e.g. "Showing 1 to 4 of 4 entries"
        paging: false, //Dont want paging
        bPaginate: false, //Dont want paging
        processing: true,
        searching: false,
        dom: "Bfrtip",
        select: true,
      });
    }, 400);
  }, []);
  useEffect(() => {
    AuditLogList();
  }, []);

  const AuditLogList = async () => {
    setIsLoading(true);
    await axios({
      url: process.env.REACT_APP_API_KEY + "project-audit-log-check/" + id,
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(function (response) {
        setAuditLogNew(JSON.parse(response.data.data.newValue));
        setAuditLogOld(JSON.parse(response.data.data.oldValue));
        setIsLoading(false);
      })
      .catch(function (error) {
        setIsLoading(false);
        console.log(error.message);
      });
  };

  const renderNewData = (
    <table id="myTable" className="table table-striped my-3">
      <tbody>
        {auditsNew &&
          Object.entries(auditsNew).map(([key, value, index]) => (
            <tr>
              <td key={index}>
                <b> {key}</b>
              </td>
              <td key={index}>{value}</td>
            </tr>
          ))}
      </tbody>

      {/* <tbody>
        <tr>
          {auditsNew &&
            Object.entries(auditsNew).map(([key, value, index]) => (
              <td key={index}>{value}</td>
            ))}
        </tr>
      </tbody> */}
    </table>
  );

  const renderNewDataOld = (
    <table id="myTable" className="table table-striped my-3">
      <tbody>
        {auditsOld &&
          Object.entries(auditsOld).map(([key, value, index]) => (
            <tr>
              <td key={index}>
                <b> {key}</b>{" "}
              </td>
              <td key={index}>{value}</td>
            </tr>
          ))}
      </tbody>

      {/* <tbody>
        <tr>
          {auditsNew &&
            Object.entries(auditsNew).map(([key, value, index]) => (
              <td key={index}>{value}</td>
            ))}
        </tr>
      </tbody> */}
    </table>
  );

  // const renderOldData = (
  //   <table id="myTableOld" className="table table-striped my-3">
  //     <thead>
  //       {auditsNew &&
  //         Object.entries(auditsNew).map(([key, value, index]) => (
  //           <tr>
  //             <th key={index}>{key}</th>
  //           </tr>
  //         ))}
  //     </thead>

  //     <tbody>
  //       <tr>
  //         {auditsOld &&
  //           Object.entries(auditsOld).map(([key, value, index]) => (
  //             <td key={index}>{value}</td>
  //           ))}
  //       </tr>
  //     </tbody>
  //   </table>
  // );

  if (isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }
  return (
    <>
      <div className="row">
        <div className="col">
          <div className="page-description">
            <h1>Audit Log Data</h1>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="example-container">
            <div className="example-content d-flex">
              <div className="example-content-date newDate">
                <h3>New Data</h3>
                {isLoading ? <LoadingSpinner /> : renderNewData}
              </div>
              <div className="example-content-date oldDate">
                <h3>Old Data</h3>

                {isLoading ? <LoadingSpinner /> : renderNewDataOld}
              </div>
              {/* <div style={{ marginTop: 60 }}>
                <h3>Old Data</h3>
                {isLoading ? <LoadingSpinner /> : renderOldData}
              </div> */}
            </div>
            <Link className="btn btn-primary mx-3 mb-3" to="/project-audit-log">
              Back
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChangeDataAudit;
