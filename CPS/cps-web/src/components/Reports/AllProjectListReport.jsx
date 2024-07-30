import { useState, useEffect } from "react";
import axios from "axios";
import dateFormat from "dateformat";
import DatePicker from "react-datepicker";
import Select from "react-select";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import Filter from "../../images/FilterIc.svg";
import $ from "jquery";
import swal from "sweetalert";
import LoadingSpinner from "../Loader/LoadingSpinner";
import ReactPaginate from "react-paginate";
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

const AllProjectListReport = () => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sellFromDate, setSellFromDate] = useState("");
  const [sellToDate, setSellToDate] = useState("");
  const navigate = useNavigate();
  const [project, setProject] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [resetFilter, setResetFilter] = useState(false);

  const data = [
    { value: "", label: "All Project" },
    { value: "sales", label: "Sales" },
    { value: "marketing", label: "Marketing" },
    { value: "trade_marketing", label: "Trade Marketing" },
  ];
  const statusData = [
    { value: "", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "cancelled", label: "Cancelled" },
    { value: "rejected", label: "Rejected" },
    { value: "approved", label: "Approved" },
    { value: "closed", label: "Closed" },
  ];
  useEffect(() => {
    if (resetFilter) {
      // Call the API function when resetFilter is true
      getListProjectApi();
      // Reset the flag to avoid repeated calls
      setResetFilter(false);
    }
  }, [resetFilter]);

  useEffect(() => {
    getListProject();
  }, [page, keyword]);



  const handleClick = async () => {
    var fullUrl =
      process.env.REACT_APP_API_KEY +
      "export-project-report?search=" +
      keyword +
      "&status=&level=level1&userID=2&type=&department=&fromDate=" +
      fromDate +
      "&toDate=" +
      toDate +
      "&sellFromDate=" +
      sellFromDate +
      "&sellToDate=" +
      sellToDate +
      "";
    window.location.href = fullUrl;
  };
  const changePage = ({ selected }) => {
    setPage(selected);
  };

  const searchData = (e) => {
    setQuery(e);
    setPage(0);
    setKeyword(e);
  };

  const handlePaste = (event) => {
    setKeyword(event.clipboardData.getData("text"));
  };
  function ProjectNumber(n) {
    var m = n ? n : 1;
    var string = "" + m;
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

  const getListProjectApi = async () => {
    //  setIsLoading(true);
    var type =
      localStorage.getItem("AuthLevel") === "level1" ||
      localStorage.getItem("AuthLevel") === "level2"
        ? ""
        : "report";
    await axios({
      url: process.env.REACT_APP_API_KEY + "get-admin-project",
      method: "get",
      params: {
        search: keyword,
        status: "",
        level: "level1",
        userID: localStorage.getItem("authID"),
        type: type,
        department: "",
        page: page,
        limit: limit,
        fromDate: fromDate,
        toDate: toDate,
        sellFromDate: sellFromDate,
        sellToDate: sellToDate,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
      },
    })
      .then(function (response) {
        setProject(response.data.result);
        setPage(response.data.page); // setPage(response.data.page);
        setPages(response.data.totalPage); // setPages(response.data.totalPage);
        setRows(response.data.totalRows); //   setRows(response.data.totalRows);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        navigate("/login");
      });
  };

  const searctData = async () => {
    getListProject();
  };
  const handleResetFilter = () => {
    // Reset state values
    setSellFromDate("");
    setSellToDate("");
    setToDate("");
    setFromDate("");
    // Set the flag to trigger the useEffect
    setResetFilter(true);
  };
  const renderUser = (
    <table className="report-table blocks table-responsive change-request">
      <thead>
        <tr>
          <th className="blue-bold">Request/Project ID</th>
          <th className="blue-bold">Project Number</th>
          <th className="blue-bold">Project Name</th>
          <th className="blue-bold">Project Description</th>
          <th className="blue-bold">Remark</th>
          <th className="blue-bold">Project Owner</th>
          <th className="blue-bold">Project Department</th>
          <th className="blue-bold">Project Status</th>
          <th className="blue-bold">Project Closure Status</th>
          <th className="blue-bold">Current Action</th>
          <th className="report-heading">Next Action By</th>
          <th className="blue-bold">Request Type</th>
          <th className="blue-bold">Created On</th>
          <th className="blue-bold">Final Approval Date</th>
          <th className="report-heading">Selling Start Date</th>
          <th className="report-heading">Selling End Date</th>
          <th className="report-heading">Cost Start Date</th>
          <th className="report-heading">Cost End Date</th>
          <th className="blue-bold">No. of Days</th>
          <th className="blue-bold">Project Type</th>
          <th className="blue-bold">Total Budget</th>
          <th className="blue-bold">Biz Type Description</th>
          <th className="blue-bold">Region</th>
          <th className="blue-bold">Sales Region</th>
          <th className="blue-bold">District</th>
          <th className="blue-bold">Setting (APBS or Dealer)</th>
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
                <td>{pro.remark ? pro.remark.substr(0, 25) : "N/A"}</td>
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
                <td>
                  S${new Intl.NumberFormat("en-SG").format(pro.totalBudget)}
                </td>

                <td>
                  {" "}
                  {pro.ProjectBusinessesTypes?.map((name, index) => (
                    <span key={index}>
                      {name.BusinessType?.name}
                      {index === pro.ProjectBusinessesTypes?.length - 1
                        ? ""
                        : ", "}
                    </span>
                  ))}
                </td>
                <td>
                  {pro.ProjectAreaDistricts?.map((name, index) => (
                    <span key={index}>
                      {name.Channel?.name}
                      {index === pro.ProjectAreaDistricts.length - 1
                        ? ""
                        : ", "}
                    </span>
                  ))}
                </td>
                <td>
                  {pro.ProjectAreaDistricts?.map((name, index) => (
                    <span key={index}>
                      {name.Arium?.name}
                      {index === pro.ProjectAreaDistricts?.length - 1
                        ? ""
                        : ", "}
                    </span>
                  ))}
                </td>
                <td>
                  {pro.ProjectAreaDistricts?.map((name, index) => (
                    <span key={index}>
                      {name.District?.name}
                      {index === pro.ProjectAreaDistricts?.length - 1
                        ? ""
                        : ", "}
                    </span>
                  ))}
                </td>

                <td> {pro.promotionDiscount ? pro.promotionDiscount : ""}</td>
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
    <>
      <div className="content-area project-review">
        <div className="main_wrapper">
          <div className="right-contents">
            <div className="approver-project-list approval-status">
              <div className="project-in-exec project-report-list-section">
                <header className="header">
                  <div className="title">
                    <h3 className="heading">
                      All Project{" "}
                      <span className="count">({rows ? rows : ""})</span>
                    </h3>

                    <div className="project-info">
                      <div className="row">
                        <div className="col-md-3">Created On</div>
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
                          <button
                            id="load-dt"
                            className="btn btn-primary"
                            onClick={searctData}
                            type="button"
                          >
                            Apply Filter
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="project-info">
                      <div className="row">
                        <div className="col-md-3">Selling Date</div>
                        <div className="col-md-3">
                          <label htmlFor="inputTitle" className="form-label">
                            From Date
                          </label>
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
                          <label htmlFor="inputTitle" className="form-label">
                            To Date
                          </label>
                          <DatePicker
                            className="form-control"
                            name="endDate"
                            maxDate={new Date()}
                            selected={sellToDate}
                            autoComplete="off"
                            onChange={(date) => setSellToDate(date)}
                          />
                        </div>
                    
                        <div className="col-md-3 button">
                          <button
                            id="load-dt"
                            className="btn btn-primary"
                            onClick={handleResetFilter}
                            type="button"
                          >
                            Reset Filter
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-md-6">
                        <button
                          className="btn btn-primary"
                          onClick={handleClick}
                        >
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
                          ></input>
                        </div>
                      </div>
                    </div>
                  </div>
                </header>

                <div className="execution"></div>

                <section className="ver-scroll-report">
                  <div className="table-responsive">
                    {isLoading ? "" : renderUser}
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
                        pageCount={Math.min(2000, pages)}
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
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllProjectListReport;
