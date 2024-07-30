import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useState } from "react";
import AllProjectList from "../components/AllProject/AllProjectList";
import ApproverProjectList from "../components/ApproverProjectList";
import CancelledRejectedProjectList from "../components/CancelledRejectedProjectList";

import TotalProjectList from "../components/TotalProjectList";

const ProjectDetailsTab = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="content-area project-review">
      {localStorage.getItem("authDepartmentRole") === "Commercial Controller" ||
      localStorage.getItem("isBA") === "true" ||
      localStorage.getItem("AuthLevel") === "level1" ||
      localStorage.getItem("AuthLevel") === "level2" ||
      localStorage.getItem("AuthLevel") === "level3" ? (
        <Tabs>
          <TabList>
            <Tab>All Projects</Tab>
            <Tab>Project For My Approval</Tab>
          </TabList>
          <TabPanel>
            {/* Tab Panel 02 */}
            <TotalProjectList />
          </TabPanel>
          <TabPanel>
            {/* Tab Panel 02 */}
            <ApproverProjectList />
          </TabPanel>
        </Tabs>
      ) : (
        <Tabs>
          <TabList>
            <Tab>My Projects</Tab>
            <Tab>Projects For My Approval</Tab>
            <Tab>My Cancelled/Reject Projects</Tab>
            {/* <Tab>Approved Project</Tab> */}
            {/* <Tab>Change Request</Tab> */}
          </TabList>

          <TabPanel>
            {/* Tab Panel 01 */}
            <AllProjectList />
          </TabPanel>
          <TabPanel>
            {/* Tab Panel 02 */}
            <ApproverProjectList />
          </TabPanel>
          <TabPanel>
            {/* Cancelled Project */}
            <CancelledRejectedProjectList />
          </TabPanel>

          {/* <TabPanel> */}
          {/* Approved Project List */}
          {/* <ApprovedProjectList />
          </TabPanel> */}

          {/* Change Request Tab Content */}
          {/* <TabPanel>
            <ChangeRequestProjectList />
          </TabPanel> */}
        </Tabs>
      )}
    </div>
  );
};

export default ProjectDetailsTab;
