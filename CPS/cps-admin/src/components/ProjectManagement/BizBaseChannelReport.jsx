import { useState, useEffect } from "react";
import axios from "axios";
import dateFormat from "dateformat";
import Select from "react-select";
import moment from "moment";
import { TimeOutPopUp } from "../TimeOut";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
// import Filter from "../../images/FilterIc.svg";
import ReactPaginate from "react-paginate";
import $ from "jquery";
import LoadingSpinner from "../Loader/LoadingSpinner";
import swal from "sweetalert";
//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import "datatables.net-buttons/js/dataTables.buttons.js";
import "datatables.net-buttons/js/buttons.colVis.js";
import "datatables.net-buttons/js/buttons.colVis.min.js";
import "datatables.net-buttons/js/buttons.flash.js";
import "datatables.net-buttons/js/buttons.html5.js";
import "datatables.net-buttons/js/buttons.print.js";
import "datatables.net-dt/css/jquery.dataTables.min.css";

const BizBaseChannelReport = () => {
  const navigate = useNavigate();
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [project, setProject] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [resetFilter, setResetFilter] = useState(false);

  function ProjectNumber(n) {
    var string = "" + n;
    var pad = "0000";
    n = pad.substring(0, pad.length - string.length) + string;
    return n;
  }
  useEffect(() => {
    if (resetFilter) {
      getListProjectApi();
      setResetFilter(false);
    }
  }, [resetFilter]);

  function group(data) {
    const uniqueArray = data.filter(
      (obj, index, self) =>
        index ===
        self.findIndex(
          (t) => t.lineExtID === obj.lineExtID && t.brandID === obj.brandID
        )
    );
    return uniqueArray;
  }
  function baseNumberGroup(data) {
    const uniqueArray = data.filter(
      (obj, index, self) =>
        index === self.findIndex((t) => t.businessID === obj.businessID)
    );
    return uniqueArray;
  }
  const changePage = ({ selected }) => {
    setPage(selected);
  };
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      TimeOutPopUp(navigate);
      return;
    }
    getListProject();
  }, [page, keyword]);

  const handleClick = async () => {
    window.location.href =
      process.env.REACT_APP_API_KEY +
      "export-report?search=" +
      keyword +
      "&userID=1&fromDate=" +
      fromDate +
      "&toDate=" +
      toDate +
      "";
  };

  const getListProject = () => {
    const dateF = new Date(fromDate);
    const dateT = new Date(toDate);
   
    var dateError = false;
    if (dateF && dateT && dateF > dateT) {
      swal("Oops", "To Date is earlier than From Date", "error");
      dateError = true;
    }
   
    if (dateError === false) {
      getListProjectApi();
      console.log("date1 and date2 are the same");
    }
  };

  const getListProjectApi = async (event, status) => {
    await axios({
      url: process.env.REACT_APP_API_KEY + "get-promo-report",
      method: "get",
      params: {
        search: keyword,
        status: "",
        level: "level1",
        userID: localStorage.getItem("userID"),
        type: "",
        department: "",
        page: page,
        limit: limit,
        fromDate: fromDate,
        toDate: toDate,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
      },
    })
      .then(function (response) {
        console.log(response.data);
        setProject(response.data.result);
        setPage(response.data.page); 
        setPages(response.data.totalPage); 
        setRows(response.data.totalRows);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };
  const searchData = (e) => {
    setQuery(e);
    setPage(0);
    setKeyword(e);
  };

  const handlePaste = (event) => {
    setKeyword(event.clipboardData.getData("text"));
  };

  console.log("154",project)

  const searctData = async () => {
    getListProject();
  };
  const handleResetFilter = () => {
  
    setToDate("");
    setFromDate("");
    setResetFilter(true);
  };
  const renderUser = (
    <table className="table  table-hover table-striped my-3">
      <thead className="table-dark">
        <tr>
          <th className="report-heading">Company</th>
          <th className="report-heading">Request ID (CPS Ref Id)</th>
          <th className="report-heading">Project Number</th>
          <th className="report-heading">Full Name</th>
          <th className="report-heading">Brand Code</th>
          <th className="report-heading">LineExt Code</th>
          <th className="report-heading">BASE-Channel</th>
          <th className="report-heading">Project Name</th>
          <th className="report-heading">Status</th>
          <th className="report-heading">Created Date</th>
          <th className="report-heading">Offer Cost Start Date</th>
          <th className="report-heading">Offer Cost End Date</th>
        </tr>
      </thead>
      <tbody>
        {project.length > 0 ? (
          <>
            {Object.values(project)?.map((pro, index) =>
              pro.ProjectBusinessesTypes.length
                ? baseNumberGroup(pro.ProjectBusinessesTypes).map(
                    (data, index) =>
                      group(pro.ProjectBrands).map((brand, index) => (
                        <tr key={brand?.id}>
                          <td>00251</td>
                          <td>REQ{pro?.id}</td>
                          <td>
                            {pro.projectNumber && pro.projectNumber !== "NULL"
                              ? pro.projectNumber
                              : "N/A"}
                          </td>
                          <td>{pro.User.email.split("@")[0].toUpperCase()}</td>
                          <td>{brand.Brand ? brand.Brand.brandCode : "N/A"}</td>

                          <td>
                            {brand.lineExtension
                              ? brand.lineExtension.lineExtCode
                              : "N/A"}
                          </td>
                          <td>{data.BusinessType?.baseChannel}</td>
                          <td>{pro.name}</td>
                          <td>
                            {pro.status == "completed" ? "pending" : pro.status}
                          </td>

                          <td> {dateFormat(pro.createdAt, "dd mmm yyyy")}</td>
                          <td>
                            {" "}
                            {dateFormat(pro.costStartDate, "dd mmm yyyy")}
                          </td>
                          <td> {dateFormat(pro.costEndDate, "dd mmm yyyy")}</td>
                        </tr>
                      ))
                  )
                : group(pro.ProjectBrands).map((brand, index) => (
                    <tr key={brand?.id}>
                      <td>00251</td>
                      <td>REQ{pro?.id}</td>
                      <td>
                        {pro.projectNumber && pro.projectNumber !== "NULL"
                          ? pro.projectNumber
                          : "N/A"}
                      </td>
                      <td>{pro.User.email.split("@")[0].toUpperCase()}</td>
                      <td>{brand.Brand ? brand.Brand.brandCode : "N/A"}</td>

                      <td>
                        {brand.lineExtension
                          ? brand.lineExtension.lineExtCode
                          : "N/A"}
                      </td>
                      <td>N/A</td>
                      <td>{pro.name}</td>
                      <td>
                        {pro.status == "completed" ? "pending" : pro.status}
                      </td>

                      <td> {dateFormat(pro.createdAt, "dd mmm yyyy")}</td>
                      <td> {dateFormat(pro.costStartDate, "dd mmm yyyy")}</td>
                      <td> {dateFormat(pro.costEndDate, "dd mmm yyyy")}</td>
                    </tr>
                  ))
            )}
          </>
        ) : (
          ""
        )}
      </tbody>
    </table>
  );
  if (isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }
  return (
    <>
      <div className="content-wrapper">
        <div className="row">
          <div className="col">
            <div className="page-description"></div>
          </div>
        </div>

        <div className="projectInfo-Row">
          <div className="project-info">
            <div className="row">
              <div className="col-md-3">
                <div className="rowTitle">Created On</div>
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
              <div className="col-md-3"></div>
            </div>
          </div>
          <div className="project-info">
            <div className="row mb-3 p-4">
             
             <div className="col-md-3"></div>
              
              <div className="col-md-3 button">
                <div className="LoadBtnBox">
                  <button
                    id="load-dt"
                    className="btn btn-info"
                    onClick={searctData}
                    type="button"
                  >
                    Apply Filter
                  </button>
                </div>
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
              <div className="col-md-3"></div>
            </div>
            <button className="btn btn-info" onClick={handleClick}>
              Export
            </button>
          </div>
          <div className="col-md-6">
            <div className="search-container">
              <input
                type="search"
                value={query}
                placeholder="Search for project"
                name="search-projects"
                onChange={(e) => searchData(e.target.value)}
                onPaste={handlePaste}
                autoComplete="off"
                autoFocus
              ></input>
            </div>
          </div>
        </div>
        <div className="table_wrapper">
          {isLoading ? <LoadingSpinner /> : renderUser}
        </div>
        <div className="custom-pagination">
          <span>
            Page: {rows ? page + 1 : 0} of {pages}
          </span>

          <nav
            className="pagination is-centered"
            key={rows}
            role="navigation"
            aria-label="Page navigation example"
          >
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              pageCount={Math.min(1000, pages)}
              onPageChange={changePage}
              containerClassName={"pagination"}
              pageLinkClassName={"page-link"}
              previousLinkClassName={"page-link"}
              nextLinkClassName={"page-link"}
              activeLinkClassName={"page-link is-current"}
              disabledLinkClassName={"page-link is-disabled"}
            />
          </nav>
        </div>
      </div>
    </>
  );
};

export default BizBaseChannelReport;
