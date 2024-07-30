import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import moment from "moment";
import TableViewBasic from "../components/project-overview/TableViewBasic";
import CardView from "../components/project-overview/CardView";
import TableViewAreaDistrict from "../components/project-overview/TableViewAreaDistrict";
import TableViewBrand from "../components/project-overview/TableViewBrand";
import TableViewBudget from "../components/project-overview/TableViewBudget";
import TableViewExpanse from "../components/project-overview/TableViewExpanse";
import TableViewFile from "../components/project-overview/TableViewFile";
import TableViewProfit from "../components/project-overview/TableViewProfit";
import TableViewHeineken from "../components/project-overview/TableViewHeineken";
import RunTimeStatusForApprover from "../components/RunTimeStatusForApprover";

const ProjectOverview = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [projectData, setProjectData] = useState([]);
  const queryString = window.location.search;
  // Parse the query string using URLSearchParams
  const queryParams = new URLSearchParams(queryString);
  const projectID = queryParams.get('projectID');
  const TimeOut = () => {
    swal({
      title: "Time Out",
      text: "You have been logged out. Please log in again",
      icon: "error",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        navigate("/login");
        return;
      }
    });
  };
  useEffect(() => {
    getAllCreatedData();
  }, []);
  const getAllCreatedData = async () => {
    if (!localStorage.getItem("auth-token")) {
      TimeOut();
    }
    setIsLoading(true);
    await axios
      .get(process.env.REACT_APP_API_KEY + "project-list/" + projectID, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
        params: {
          userID: localStorage.getItem("authID"),
          role: localStorage.getItem("auth_role"),
        },
      })
      .then(function (response) {
        setProjectData(response.data.data);
        if (response.data.data) {
          console.log("Overview Data", response.data.data);
        }
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(">>>>>>>>>>>error", error);
      });
  };
  let formatMoney = (value, currency = "SGD") => {
      const formatter = new Intl.NumberFormat("en-SG", {
       style: "currency",
       currency: currency,
       minimumFractionDigits: 2,
      });
      return formatter.format(value);
      };
  return (
    
    <div class="project-overview wrapper">
      <section className="blocks basic-information">
        <h6>Basic Information</h6>
        <div className="table-responsive">
          <TableViewBasic basicInfo={projectData} />
        </div>
        <div className="card-area two-column description">
          <CardView cardTitle="Remark" cardContent={projectData?.remark} />
          <CardView
            cardTitle="Description" 
            cardContent={projectData?.description}
          />
        </div>
      </section>

      <section className="blocks area-district">
        <h6>Area & District</h6>
        <div className="table-responsive">
          <TableViewAreaDistrict
            areaDistrict={projectData?.ProjectAreaDistricts}
          />
        </div>
      </section>

      <section className="blocks brand">
        <h6>Selected Brand</h6>
        <div className="table-responsive">
          <TableViewBrand projectId={projectID} />
        </div>
      </section>

      <section className="blocks budget">
        <header>
          <h6>Project Budget</h6>
          <h6>
            <span>Total Project Budget Amount</span>
            <span>{formatMoney(parseInt(projectData?.totalBudget))}</span>
          </h6>
        </header>
        <div className="table-responsive">
          <TableViewBudget projectId={projectID} />
        </div>
      </section>

      <section className="blocks expanses">
        <h6>Project Expenses</h6>
        <div className="table-responsive">
          <TableViewExpanse projectId={projectID}/>
        </div>
       
      </section>

      <section className="blocks objective">
        <h6>Project Objective</h6>
        <div className="card-area three-column description">
          <CardView
            cardTitle="Specific Measure"
            cardContent={
              projectData.specificMeasure ? projectData.specificMeasure : "N/A"
            }
          />
          <CardView
            cardTitle="Critical Success Factor"
            cardContent={
              projectData.criticalSucess ? projectData.criticalSucess : "N/A"
            }
          />
          <CardView
            cardTitle="Launch Criteria"
            cardContent={
              projectData.launchCriteria ? projectData.launchCriteria : "N/A"
            }
          />
        </div>
      </section>

      <section className="blocks strategy-execution description">
        <h6>Project Strategy &amp; Execution</h6>
        <div className="card-area two-column">
          <CardView
            cardTitle="Rationale"
            cardContent={projectData.rational ? projectData.rational : "N/A"}
          />
          <CardView
            cardTitle="Strategy / Mechanics for Retailers"
            cardContent={projectData.strategy ? projectData.strategy : "N/A"}
          />
          <CardView
            cardTitle="For Consumers"
            cardContent={
              projectData.forConsumers ? projectData.forConsumers : "N/A"
            }
          />
          <CardView
            cardTitle="Execution Plan"
            cardContent={
              projectData.executionPlan ? projectData.executionPlan : "N/A"
            }
          />
        </div>
      </section>

      <section className="blocks file-attachment">
        <h6>File Attachment</h6>
        <div className="table-responsive">
          <TableViewFile projectID={projectID} />
        </div>
      </section>

      <section className="blocks approver-flow">
        <RunTimeStatusForApprover PID={projectID} />
      </section>
      <section className="blocks heineken">
        <div className="table-responsive">
          <TableViewHeineken projectID={projectID} />
        </div>
      </section>
      <section className="blocks profit">
        <div className="table-responsive">
          <TableViewProfit projectID={projectID} />
        </div>
      </section>
    </div>
  );
};

export default ProjectOverview;
