import React from "react";
import {  useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
// import { useLocation } from "react-router-dom";
import BizBaseChannelReport from "./BizBaseChannelReport";
import ProjectReportList from "./ProjectReportList";
import { useNavigate } from "react-router-dom";
import {TimeOutPopUp} from "../TimeOut";


const ProjectReportTab = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (! localStorage.getItem("token")) {
   TimeOutPopUp(navigate);
      return;
     }
  }, );
  return (
    <div className="content-area project-review mt-3">
      <Tabs>
        <TabList>
          <Tab>Project List Reports</Tab>
          <Tab>CPS Promo Base Report</Tab>
        </TabList>
        <TabPanel>
          {/* Tab Panel 01 */}
          <ProjectReportList />
        </TabPanel>

        <TabPanel>
          {/* Tab Panel 02 */}
          <BizBaseChannelReport />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default ProjectReportTab;
