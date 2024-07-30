import React from "react";
import moment from "moment";

const TableViewBasic = (props) => {
  console.log("1Basic Info", props.basicInfo);
  const costStartDate = new Date(props?.basicInfo?.costStartDate);
  const costFormatStartDate = moment(costStartDate).format("YYYY-MM-DD");
  const constEndDate = new Date(props?.basicInfo?.costEndDate);
  const costFormatEndDate = moment(constEndDate).format("YYYY-MM-DD");
  const selStartDate = new Date(props?.basicInfo?.sellingStartDate);
  const selFormatStartDate = moment(selStartDate).format("YYYY-MM-DD");
  const selEndDate = new Date(props?.basicInfo?.sellingEndDate);
  const selFormatEndDate = moment(selEndDate).format("YYYY-MM-DD");
  const created = new Date(props?.basicInfo?.createdAt);
  const createdFormat = moment(created).format("YYYY-MM-DD");
  let projectBsTypes = "";
  props?.basicInfo?.ProjectBusinessesTypes?.forEach((element, index) => {
    projectBsTypes += element.BusinessType.name;
    if (index < props.basicInfo.ProjectBusinessesTypes.length - 1) {
      projectBsTypes += ", ";
    }
  });
  function capitalizeFirstLetter(string) {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
  }
  return (
    <>
      <table className="classic">
        <thead>
          <tr>
            <td>
              <b>Request ID</b>
              <p>REQ{props?.basicInfo?.id}</p>
            </td>
            <td>
              <b>Project Number</b>

              {(props?.basicInfo?.status === "approved" ||
                props?.basicInfo?.status === "closed" ||
                props?.basicInfo?.CloserStatus === "approved" ||
                props?.basicInfo?.isProjectNumber === "done") &&
              props?.basicInfo?.projectNumber ? (
                <p>{props?.basicInfo?.projectNumber}</p>
              ) : (
                <p>Under Process</p>
              )}
            </td>
            <td>
              <b>Department</b>
              <p>{capitalizeFirstLetter(props?.basicInfo?.department)}</p>
            </td>
            <td>
              <b>Request Type</b>
              <p>
                {props?.basicInfo?.ChangeStatus == null &&
                props?.basicInfo?.CloserStatus == null
                  ? "Fresh Request"
                  : props?.basicInfo?.ChangeStatus != null &&
                    props?.basicInfo?.CloserStatus == null
                  ? "Change Request"
                  : "Close Request"}
              </p>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <b className="blue">Project Name</b>
              <p>{props?.basicInfo?.name}</p>
            </td>
            <td>
              <b className="blue">Requester Name</b>
              <p>{props?.basicInfo?.User?.email.split("@")[0]}</p>
            </td>
            <td>
              <b className="blue">Requested On</b>
              <p>{createdFormat}</p>
            </td>
            <td>
              <b className="blue">Promotion Discount/Trade Deal Setting</b>
              <p>
                {props?.basicInfo?.promotionDiscount !== ""
                  ? props?.basicInfo?.promotionDiscount
                  : "NA"}
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <b className="blue">Project Type</b>
              <p>{props?.basicInfo?.projectType}</p>
            </td>
            <td>
              <b className="blue">Project Volume</b>
              <p>{props?.basicInfo?.projectVolume}</p>
            </td>
            <td>
              <b className="blue">Business Type</b>
              <p>{projectBsTypes}</p>
            </td>
          </tr>
          <tr>
            <td>
              <b className="blue">Cost Start Date</b>
              <p>{costFormatStartDate}</p>
            </td>
            <td>
              <b className="blue">Cost End Date</b>
              <p>{costFormatEndDate}</p>
            </td>
            <td>
              <b className="blue">Selling Start Date</b>
              <p>{selFormatStartDate}</p>
            </td>
            <td>
              <b className="blue">Selling End Date</b>
              <p>{selFormatEndDate}</p>
            </td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default TableViewBasic;
