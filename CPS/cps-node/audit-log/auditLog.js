"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auditlogs = void 0;
const models_1 = __importDefault(require("../models"));
var moment = require("moment");
const Auditlogs = (data, otherData) => __awaiter(void 0, void 0, void 0, function* () {
    var fghjk = yield models_1.default.AuditLog.create({
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
});
exports.Auditlogs = Auditlogs;
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
