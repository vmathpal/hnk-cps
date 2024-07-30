import { useState, useEffect } from "react";
import axios from "axios";
import dateFormat from "dateformat";
import Select from "react-select";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import Filter from "../../images/FilterIc.svg";
import $ from "jquery";
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

const BizBaseChannelReport = () => {
  const navigate = useNavigate();
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [project, setProject] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);

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

  const changePage = ({ selected }) => {
    setPage(selected);
  };
  useEffect(() => {
    // ShowDataTabel();
    getListProject("", "");
  }, [page]);

  function ProjectNumber(n) {
    var m = n ? n : 1;
    var string = "" + m;
    var pad = "0000";
    n = pad.substring(0, pad.length - string.length) + string;
    return n;
  }

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

  const ShowDataTabel = () => {
    $("#myTable").DataTable().clear().destroy();
    setTimeout(function () {
      // $("#myTable").DataTable({
      //   dom: "Bfrtip",
      //   buttons: [
      //     {
      //       extend: "excelHtml5",
      //       title: "",
      //       text: "Export Report",
      //       filename: "CPS_PROMO_REPORT",
      //       className: "next-btn",
      //     },
      //   ],
      //   bDestroy: true,
      //   fixedHeader: true,
      //   aaSorting: [[1, "desc"]],
      //   bInfo: false, //Dont display info e.g. "Showing 1 to 4 of 4 entries"
      //   paging: false, //Dont want paging
      //   bPaginate: false, //Dont want paging
      //   processing: true,
      //   searching: true,
      //   select: true,
      //   scrollX: true,
      //   fixedHeader: {
      //     headerOffset: 75,
      //   },
      // });
    }, 300);
  };

  const levelHandleChange = (e) => {
    // ShowDataTabel();
    setDepartment(e.value);
    getListProject(e.value, status);
  };
  // const StatusHandleChange = (e) => {
  //   ShowDataTabel();
  //   getListProject(department, e.value);
  // };
  const handleClick = async () => {
    window.location.href =
      process.env.REACT_APP_API_KEY + "export-report?search=&userID=1";
  };
  const getListProject = async (event, status) => {
    // setIsLoading(true);
    await axios({
      url: process.env.REACT_APP_API_KEY + "get-promo-report",
      method: "get",
      params: {
        search: "",
        status: "",
        level: "level1",
        userID: localStorage.getItem("authID"),
        type: "",
        department: "",
        page: page,
        limit: limit,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
      },
    })
      .then(function (response) {
        console.log("<<>>", response.data.result);
        ShowDataTabel();
        setProject(response.data.result);
        setPage(response.data.page); // setPage(response.data.page);
        setPages(response.data.totalPage); // setPages(response.data.totalPage);
        setRows(response.data.totalRows); //   setRows(response.data.totalRows);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  // //initialize datatable
  // useEffect(() => {
  //   ShowDataTabel();
  // }, []);

  const renderUser = (
    <table className="report-table blocks table-responsive change-request">
      <thead>
        <tr>
          <th className="blue-bold">Company</th>
          <th className="blue-bold">Department</th>
          <th className="blue-bold">Request ID (CPS Ref Id)</th>
          <th className="blue-bold">Project Number</th>
          <th className="blue-bold">Fullname</th>
          <th className="blue-bold">Brand Code</th>
          <th className="blue-bold">LineExt Code</th>
          <th className="blue-bold">BASE-Channel</th>
          <th className="blue-bold">Project Name</th>
          <th className="blue-bold">Status</th>
          <th className="blue-bold">Created Date</th>
          <th className="blue-bold">Offer Cost Start Date</th>
          <th className="blue-bold">Offer Cost End Date</th>
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
                        <tr key={pro?.id}>
                          <td>00251</td>
                          <td>{pro.department}</td>
                          <td>REQ{pro?.id}</td>
                          <td>
                            {pro.status === "approved" ||
                            pro.isProjectNumber === "done"
                              ? pro.projectNumber
                                ? pro.projectNumber
                                : "Under Process"
                              : "Under Process"}
                          </td>
                          <td>{pro.User.email.split("@")[0].toUpperCase()}</td>
                          <td>{brand.Brand ? brand.Brand.brandCode : "N/A"}</td>
                          <td>
                            {brand.lineExtension
                              ? brand.lineExtension.lineExtCode
                              : "N/A"}
                          </td>
                          <td>
                            {" "}
                            <td>{data.BusinessType?.baseChannel}</td>
                          </td>
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
                    <tr key={pro?.id}>
                      <td>00251</td>
                      <td>{pro.department}</td>
                      <td>REQ{pro?.id}</td>
                      <td>
                        {pro.status === "approved" ||
                        pro.isProjectNumber === "done"
                          ? pro.projectNumber
                            ? pro.projectNumber
                            : "Under Process"
                          : "Under Process"}
                      </td>
                      <td>{pro.User.email.split("@")[0].toUpperCase()}</td>
                      <td>{brand.Brand ? brand.Brand.brandCode : "N/A"}</td>
                      <td>
                        {brand.lineExtension
                          ? brand.lineExtension.lineExtCode
                          : "N/A"}
                      </td>
                      <td>
                        {" "}
                        <td>N/A</td>
                      </td>
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
                    <button
                      className="btn btn-primary mt-3"
                      onClick={handleClick}
                    >
                      Export
                    </button>
                  </div>
                  {/* <div className="search-container">
                    <input
                      type="search"
                      placeholder="Search for project"
                      name="search-projects"
                      onChange={handleChange}
                    ></input>
                   
                  </div> */}
                </header>

                <div className="execution">
                  {/* <p>
                    <img
                      src={Filter}
                      alt="Filter Icon"
                      height={28}
                      title="Filter"
                      className="mx-2"
                    ></img>
                  </p> */}
                  {/* {localStorage.getItem("AuthLevel") === "level1" ||
                  localStorage.getItem("AuthLevel") === "level2" ? (
                    <Select
                      defaultValue={department}
                      onChange={levelHandleChange}
                      name="level"
                      options={data}
                      className="basic-multi-select department-based"
                      classNamePrefix="select"
                    />
                  ) : (
                    ""
                  )} */}

                  {/* <Select
                    defaultValue={status}
                    onChange={StatusHandleChange}
                    name="level"
                    options={statusData}
                    className="basic-multi-select status-based mx-3"
                    classNamePrefix="select"
                  /> */}
                </div>

                <section className="ver-scroll">
                  <div className="table-responsive">
                    {isLoading ? "" : renderUser}
                  </div>
                  <div className="custom-pagination">
                    <span>
                      Page: {rows ? page + 1 : 0} of {pages}
                      {/* Showing 1 to 10 of {rows} entries */}
                    </span>
                    {/* <p className="has-text-centered has-text-danger">{msg}</p> */}

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

export default BizBaseChannelReport;
