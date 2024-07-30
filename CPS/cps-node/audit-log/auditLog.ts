import db from "../models";
import { Op, where, Sequelize } from "sequelize";
var moment = require("moment");
export const Auditlogs = async (data, otherData) => {
  var fghjk = await db.AuditLog.create({
    userID: data.userID,
    projectID: data.projectID,
    message: data.message,
    userName: data.userName,
    actionBy: data.actionBy,
    comment: data.comment,
    projectName: data.projectName,
    user: data.user,
    delegatedUser: data.delegatedUser,
    isAuditLog: data.isAuditLog,
    startDate: data.startDate,
    endDate: data.endDate,
  });
};

// var user = await db.User.findByPk(req.query.userID);
// var getProject = await db.Project.findByPk(req.params.id);
// const auditLog = {
//   userID: user.id,
//   projectID: getProject.id,
//   message: "Requested for change request",
//   userName: user.email.split("@")[0],
//   projectName: getProject.name,
//   chnageByadmin: null,
//actionBy: data.actionBy,
//  comment: data.comment,
// };
// Log.Auditlogs(auditLog, false);
