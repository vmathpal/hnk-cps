import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useLocation } from "react-router-dom";
import AmountChangeRequestForm from "../components/AmountChangeRequestForm";
import DateChangeRequestForm from "../components/DateChangeRequestForm";

const ChangeRequestTab = () => {
  const {
    state: { projectID },
  } = useLocation();
  return (
    <div className="content-area project-review">
      <Tabs>
        <TabList>
          <Tab>Change Request Budget Amount</Tab>
          <Tab>Change Request Date</Tab>
        </TabList>
        <TabPanel>
          {/* Tab Panel 01 */}
          <AmountChangeRequestForm projectID={projectID} />
        </TabPanel>
        <TabPanel>
          {/* Tab Panel 02 */}
          <DateChangeRequestForm projectID={projectID} />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default ChangeRequestTab;
