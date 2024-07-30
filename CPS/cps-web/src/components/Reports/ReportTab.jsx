import React from "react";
import { useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useNavigate } from "react-router-dom";
// import { useLocation } from "react-router-dom";
import AllProjectListReport from "../Reports/AllProjectListReport";
import BizBaseChannelReport from "./BizBaseChannelReport";

const ReportTab = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("auth-token")) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="content-area project-review">
      <Tabs>
        <TabList>
          <Tab>Project List Reports</Tab>
          {localStorage.getItem("AuthLevel") === "level1" ? (
            <Tab>CPS Promo Base Report</Tab>
          ) : (
            ""
          )}
        </TabList>
        <TabPanel>
          {/* Tab Panel 01 */}
          <AllProjectListReport />
        </TabPanel>
        {localStorage.getItem("AuthLevel") === "level1" ? (
          <TabPanel>
            {/* Tab Panel 02 */}
            <BizBaseChannelReport />
          </TabPanel>
        ) : (
          ""
        )}
      </Tabs>
    </div>
  );
};

export default ReportTab;
