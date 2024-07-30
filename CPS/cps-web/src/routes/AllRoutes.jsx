import React from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import NotFound from "../components/NotFound";
import Login from "../components/Auth/Login";
import DashboardHeader from "../components/DashboardHeader";
import Dashboard from "../layouts/Dashboard";
import FullLayout from "../layouts/FullLayout";
import Overview from "../pages/Overview";
import Createproject from "../pages/CreateProjectStep2";
import Error from "../pages/Error";
// import NewProject from "../pages/CreatProject";
import CreatProject from "../pages/CreatProject";
// import ProjectDetails from "../pages/ProjectDetailsTab";
// import ProjectEvaluation from "../pages/ProjectEvaluation";
import CreateProjectStep2 from "../pages/CreateProjectStep2";
import FileUpload from "../components/FileUpload/FileUpload";
// import AllProjectList from "../components/AllProject/AllProjectList";
// import ProjectDetailsTab from "../pages/ProjectDetailsTab";
import ProjectRunTimeStatus from "../components/ProjectRunTimeStatus";
import AddActionByApprover from "../components/AddActionByApprover";
import ChangeRequestTab from "../pages/ChangeRequestTab";
import TotalProjectList from "../components/TotalProjectList";
import ApproverProjectList from "../components/ApproverProjectList";
import AllProjectList from "../components/AllProject/AllProjectList";
import AuditLog from "../components/AllProject/AuditLog";
import CancelledRejectedProjectList from "../components/CancelledRejectedProjectList";
import RunTimeStatusForApprover from "../components/RunTimeStatusForApprover";
import DataAnalystForm from "../pages/DataEvalution";
import DataEvalution from "../pages/DataEvalution";
import ProjectAnalyst from "../pages/ProjectAnalyst";
import DiscussionProjectList from "../components/DiscussionBoard/DiscussionProjectList";
import DiscussionForm from "../components/DiscussionBoard/DiscussionForm";
import AllProjectListReport from "../components/Reports/AllProjectListReport";
import ReportTab from "../components/Reports/ReportTab";
import TempLogin from "../components/TempLogin/TempLogin";
import ProjectOverview from "../pages/ProjectOverview";

export default function AllRoutes() {
  return (
    <>
      <Routes>
        <Route exact element={<PrivateRoutes />}>
          <Route path="/" element={<FullLayout />}>
            {/* <Route path="/dashboard"/> */}
            <Route path="/overview" element={<Overview />} />
            <Route
              path="/create-project/:ProjectStatus"
              element={<CreatProject />}
            />
            <Route
              path="/project-audit-log/:ProjectId"
              element={<AuditLog />}
            />
            <Route
              path="/project-runtime-status/:ProjectId"
              element={<ProjectRunTimeStatus />}
            />
            <Route
              path="/approver-runtime-status/:ProjectId"
              element={<RunTimeStatusForApprover />}
            />
            <Route
              path="/add-project-action"
              element={<AddActionByApprover />}
            />
            <Route
              path="/project-change-request"
              element={<ChangeRequestTab />}
            />
            <Route
              path="/create-project-financial"
              element={<CreateProjectStep2 />}
            />
            <Route
              path="/my-projects/data-evaluation/"
              element={<DataEvalution />}
            />
            <Route
              path="/my-projects/data-analyst"
              element={<ProjectAnalyst />}
            />
            <Route path="/all-projects" element={<TotalProjectList />} />
            <Route
              path="/projects-for-approval"
              element={<ApproverProjectList />}
            />
            <Route path="/my-projects" element={<AllProjectList />} />
            <Route
              path="/cancelled-projects"
              element={<CancelledRejectedProjectList />}
            />
            <Route path="/project-reports" element={<ReportTab />} />
            <Route path="/notifications" element={<DiscussionProjectList />} />
            <Route path="/discussion-chat" element={<DiscussionForm />} />
            
          </Route>

          <Route path="/*" element={<Error />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route
          path="/overview/project-overview"
              element={<ProjectOverview />}
            />
        {/* <Route path="/temp-login" element={<TempLogin />} /> */}
      </Routes>
    </>
  );
}
