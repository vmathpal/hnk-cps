import { useState, useEffect } from "react";
import axios from "axios";
import dateFormat from "dateformat";
import ReactPaginate from "react-paginate";
import $ from "jquery";
import moment from "moment";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import { TimeOutPopUp } from "../TimeOut";
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
import LoadingSpinner from "../Loader/LoadingSpinner";

const ProjectReportList = () => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [sellFromDate, setSellFromDate] = useState("");
  const [sellToDate, setSellToDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [finalAppFromDate,setFinalAppFromDate]=useState("");
  const [finalAppToDate,setFinalAppToDate]=useState("")
  const [project, setProject] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [resetFilter, setResetFilter] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    if (resetFilter) {
      getListProjectApi();
      setResetFilter(false);
    }
  }, [resetFilter]);
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      TimeOutPopUp(navigate);
      return;
    }
    getListProject();
  }, [page, keyword]);

  const changePage = ({ selected }) => {
    setPage(selected);
  };

  const handleClick = async () => {
    window.location.href =
      process.env.REACT_APP_API_KEY +
      "export-project-report?search=" +
      keyword +
      "&status=&level=level1&userID=2&type=&department=&fromDate=" +fromDate +"&toDate=" +toDate +"&sellFromDate=" +sellFromDate + "&sellToDate=" + sellToDate + "&finalAppFromDate=" + finalAppFromDate + "&finalAppToDate="+finalAppToDate+"";
     
  };
  function ProjectNumber(n) {
    var string = "" + n;
    var pad = "0000";
    n = pad.substring(0, pad.length - string.length) + string;
    return n;
  }

  const GetNoOfDays = (date2, date1) => {
    const diffTime = Math.abs(new Date(date2) - new Date(date1));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays + 1 : diffDays + 1;
  };
  const getListProject = () => {
    const dateF = new Date(fromDate);
    const dateT = new Date(toDate);
    const dateSF = new Date(sellFromDate);
    const dateST = new Date(sellToDate);
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
      getListProjectApi();
      console.log("date1 and date2 are the same");
    }
  };
  const getListProjectApi = async (event, status) => {
    await axios({
      url: process.env.REACT_APP_API_KEY + "get-admin-project",
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
        sellFromDate: sellFromDate,
        sellToDate: sellToDate,
        finalAppFromDate:finalAppFromDate,
        finalAppToDate:finalAppToDate
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(function (response) {
        console.log(response.data.limit);
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
  const searctData = async () => {
    getListProject();
  };

  const searchData = (e) => {
    setQuery(e);
    setPage(0);
    setKeyword(e);
  };

  const handlePaste = (event) => {
    setKeyword(event.clipboardData.getData("text"));
  };
  const handleResetFilter = () => {
    setSellFromDate("");
    setSellToDate("");
    setFinalAppFromDate("");
    setFinalAppToDate("");
    setToDate("");
    setFromDate("");
    setResetFilter(true);
  };
  const renderUser = (
    <table className="table table-responsive table-hover table-striped my-3 project-scroll">
      <thead className="table-dark">
        <tr>
          <th className="report-heading">Request/Project ID</th>
          <th className="report-heading">Project Number</th>
          <th className="report-heading">Project Name</th>
          <th className="report-heading">Project Description</th>
          <th className="report-heading">Remark</th>
          <th className="report-heading">Project Owner</th>
          <th className="report-heading">Project Department</th>
          <th className="report-heading">Project Status</th>
          <th className="report-heading">Project Closure Status</th>
          <th className="report-heading">Current Action</th>
          <th className="report-heading">Next Action By</th>
          <th className="report-heading">Request Type</th>
          <th className="report-heading">Created On</th>
          <th className="report-heading">Final Approval Date</th>
          <th className="report-heading">Selling Start Date</th>
          <th className="report-heading">Selling End Date</th>
          <th className="report-heading">Cost Start Date</th>
          <th className="report-heading">Cost End Date</th>
          <th className="report-heading">No. of Days</th>
          <th className="report-heading">Project Type</th>
          <th className="report-heading">Total Budget</th>
          <th className="report-heading">Biz Type Description</th>
          <th className="report-heading">Region</th>
          <th className="report-heading">Sales Region</th>
          <th className="report-heading">District</th>
          <th className="report-heading">Setting (APBS or Dealer)</th>
        </tr>
      </thead>
      <tbody>
        {project.length > 0 ? (
          <>
            {Object.values(project)?.map((pro, index) => (
              <tr key={pro?.id}>
                <td>REQ{ProjectNumber(pro.id)}</td>

                <td>
                  {pro.status === "approved" || pro.isProjectNumber === "done"
                    ? pro.projectNumber
                      ? pro.projectNumber
                      : "Under Process"
                    : "Under Process"}
                </td>
                <td>{pro.name}</td>
                <td>
                  {pro.description
                    ? pro.description.substr(0, 50) + "..."
                    : "-"}
                </td>
                <td>{pro.remark ? pro.remark.substr(0, 50) + "..." : "-"}</td>
                <td>{pro.User?.email.split("@")[0].toUpperCase()}</td>
                <td>{pro.department}</td>
                <td>{pro.status == "completed" ? "pending" : pro.status}</td>
                <td>
                  {" "}
                  {pro.CloserStatus === "approved"
                    ? "Approved"
                    : pro.CloserStatus === "rejected"
                    ? "Rejected"
                    : pro.CloserStatus === "cancelled"
                    ? "Cancelled"
                    : pro.CloserStatus === "closed"
                    ? "Closed"
                    : pro.CloserStatus === "pending"
                    ? "Pending"
                    : "NA"}
                </td>
                <td>
                  {pro.runTimeStatus ? pro.runTimeStatus : "Under Process"}
                </td>
                <td>{pro.nextActionBy ? pro.nextActionBy : "N/A"}</td>
                <td>
                  {pro.ChangeStatus === null && pro.CloserStatus === null
                    ? "Fresh Request"
                    : pro.ChangeStatus !== null && pro.CloserStatus === null
                    ? "Change Request"
                    : "Close Request"}
                </td>
                <td> {dateFormat(pro.createdAt, "dd mmm yyyy")}</td>
                <td>
                  {pro.final_approved_date
                    ? moment(pro.final_approved_date).format("D-MMM-YYYY")
                    : pro.status === "approved"
                    ? moment(pro.updatedAt).format("D-MMM-YYYY")
                    : null}
                </td>
                <td> {dateFormat(pro.sellingStartDate, "dd mmm yyyy")}</td>
                <td> {dateFormat(pro.sellingEndDate, "dd mmm yyyy")}</td>
                <td> {dateFormat(pro.costStartDate, "dd mmm yyyy")}</td>
                <td> {dateFormat(pro.costEndDate, "dd mmm yyyy")}</td>
                <td>
                  {GetNoOfDays(
                    dateFormat(pro.sellingEndDate, "mm/dd/yyyy"),
                    dateFormat(pro.sellingStartDate, "mm/dd/yyyy")
                  )}
                </td>
                <td>{pro.projectType}</td>
                <td>S${pro.totalBudget ? pro.totalBudget : 0}</td>

                <td>
                  {" "}
                  {pro.ProjectBusinessesTypes.length
                    ? pro.ProjectBusinessesTypes?.map((name, index) => (
                        <span key={index}>
                          {name.BusinessType?.name}
                          {index === pro.ProjectBusinessesTypes?.length - 1
                            ? ""
                            : ", "}
                        </span>
                      ))
                    : "N/A"}
                </td>
                <td>
                  {pro.ProjectAreaDistricts.length
                    ? pro.ProjectAreaDistricts?.map((name, index) => (
                        <span key={index}>
                          {name.Channel?.name}
                          {index === pro.ProjectAreaDistricts?.length - 1
                            ? ""
                            : ", "}
                        </span>
                      ))
                    : "N/A"}
                </td>
                <td>
                  {pro.ProjectAreaDistricts.length
                    ? pro.ProjectAreaDistricts?.map((name, index) => (
                        <span key={index}>
                          {name.Arium?.name}
                          {index === pro.ProjectAreaDistricts?.length - 1
                            ? ""
                            : ", "}
                        </span>
                      ))
                    : "N/A"}
                </td>
                <td>
                  {pro.ProjectAreaDistricts.length
                    ? pro.ProjectAreaDistricts?.map((name, index) => (
                        <span key={index}>
                          {name.District?.name}
                          {index === pro.ProjectAreaDistricts.length - 1
                            ? ""
                            : ", "}
                        </span>
                      ))
                    : "N/A"}
                </td>
                <td>
                  {" "}
                  {pro.promotionDiscount ? pro.promotionDiscount : "N/A"}
                </td>
              </tr>
            ))}
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
    <div className="content-wrapper">
      <div className="row">
        <div className="col">
          <div className="page-description"></div>
        </div>
      </div>

      <div className="projectInfo-Row">
        <div className="project-info">
          <div className="row mb-3">
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
            <div className="col-md-3 "></div>
          </div>
        </div>
        <div className="project-info">
          <div className="row mb-3">
            <div className="col-md-3">
              <div className="rowTitle">Final Approval Filter</div>
            </div>
            <div className="col-md-3">
             
              <DatePicker
                className="form-control"
                name="startDate"
                maxDate={new Date()}
                selected={finalAppFromDate}
                autoComplete="off"
                onChange={(date) => setFinalAppFromDate(date)}
              />
            </div>

            <div className="col-md-3">
             
              <DatePicker
                className="form-control"
                name="endDate"
                maxDate={new Date()}
                selected={finalAppToDate}
                autoComplete="off"
                onChange={(date) => setFinalAppToDate(date)}
              />
            </div>
            <div className="col-md-3 "></div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3">
              <div className="rowTitle">Selling Date Filter</div>
            </div>
            <div className="col-md-3">
             
              <DatePicker
                className="form-control"
                name="startDate"
                maxDate={new Date()}
                selected={sellFromDate}
                autoComplete="off"
                onChange={(date) => setSellFromDate(date)}
              />
            </div>

            <div className="col-md-3">
             
              <DatePicker
                className="form-control"
                name="endDate"
                maxDate={new Date()}
                selected={sellToDate}
                autoComplete="off"
                onChange={(date) => setSellToDate(date)}
              />
            </div>
            <div className="col-md-3 "></div>
          </div>
          <div className="row">
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
          <div className="ExportSearchBox mt-3">
            <button className="btn btn-info" onClick={handleClick}>
              Export
            </button>
            <div className="SearchContainerBox">
              <div className="search-container">
                <input
                  type="search"
                  value={query}
                  placeholder="Search for project"
                  name="search-projects"
                  onChange={(e) => searchData(e.target.value)}
                  onPaste={handlePaste}
                  autoComplete="off"
                  
                ></input>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="table_wrapper">
        {isLoading ? <LoadingSpinner /> : renderUser}
      </div>

      <div className="custom-pagination">
        <span>
          Total Rows: {rows} Page: {rows ? page + 1 : 0} of {pages}
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
  );
};

export default ProjectReportList;
