import db from "../../models";
import { returnResponse, projectFLow, uploadImage } from "../../helper/helper";
import { Op, where, Sequelize } from "sequelize";
import { SendEmail } from "../admin/emailController";
import * as Log from "../../audit-log/auditLog";
import * as project from "../web/ProjectFilter";
import * as Filter from "./getProjectFilter";
import { userInfo } from "os";
var moment = require("moment");
const Excel = require("exceljs");

const discussionProjectList = async (req, res) => {
  var projectID = await db.DirectorAndReviewerApprover.findAll({
    where: {
      userID: req.params.id,
    },
  }).then((project) => project.map((pro) => pro.projectID));

  var userProject = await db.Project.findAll({
    where: {
      userID: req.params.id,
      status: { [Op.notIn]: ["draft", "creadted", "closed", "deleted"] },
    },
  }).then((project) => project.map((pro) => pro.id));

  const projectIDS = [...projectID, ...userProject];
  var fileters = await filter(req, projectIDS);
  const projectArea = await db.Project.findAll({
    where: fileters,
    include: [
      {
        model: db.User,
      },
    ],
    order: [["id", "DESC"]],
  });

  return returnResponse(
    200,
    true,
    "discussion project list rander successfully!",
    res,
    projectArea
  );
};

const projectChat = async (req, res) => {
  var project = await db.Project.findOne({
    where: {
      id: req.params.id,
      // userID: req.body.senderID,
    },
    include: [
      {
        model: db.User,
      },
    ],
  });
  var user = await db.User.findByPk(req.body.senderID);

  if (req.body.senderID != project.User.id) {
    const user_name = project.User.email.split("@");
    const senderName = user.email.split("@");
    let user_data = {
      sender_name: senderName[0],
      name: user_name[0],
      email: project.User.email,
      project_name: project.name,
      project_id: project.id,
      message: req.body.message,
      url: process.env.WEB_URL,
    };
    SendEmail(user_data, "PROJECT_MSG");
  }

  req.body.ProjectID = req.params.id;
  req.body.status = "active";
  await db.discussion.create(req.body);
  return returnResponse(200, true, "message send successfully", res, {});
};

const projectDeleteChat = async (req, res) => {
  await db.discussion.update(
    { status: "deleted" },
    {
      where: {
        id: req.params.id,
        senderID: req.query.userID,
      },
    }
  );
  return returnResponse(200, true, "message deleted successfully", res, {});
};

const projectChatList = async (req, res) => {
  const chat = await db.discussion.findAll({
    where: {
      projectID: req.params.id,
      status: { [Op.ne]: "deleted" },
    },
    include: [
      {
        model: db.Project,
      },
      {
        model: db.User,
      },
    ],
    order: [["id", "DESC"]],
  });
  return returnResponse(
    200,
    true,
    "discussion project list rander successfully!",
    res,
    chat
  );
};

const filter = async (req, projectIDS) => {
  var filter = { id: { [Op.in]: projectIDS } };

  var search = {
    [Op.or]: [
      {
        id: { [Op.in]: projectIDS },
        status: { [Op.like]: "%" + req.query.search + "%" },
      },
      {
        id: { [Op.in]: projectIDS },
        name: { [Op.like]: "%" + req.query.search + "%" },
      },
      {
        id: { [Op.in]: projectIDS },
        department: { [Op.like]: "%" + req.query.search + "%" },
      },
    ],
  };
  if (req.query.status && req.query.search) {
    return {
      status: { [Op.in]: [req.query.status] },
      id: { [Op.in]: projectIDS },
      department: { [Op.like]: "%" + req.query.search + "%" },
    };
  } else if (req.query.status) {
    return {
      status: { [Op.in]: [req.query.status] },
      id: { [Op.in]: projectIDS },
    };
  } else if (req.query.search) {
    return search;
  } else {
    return filter;
  }
};

const GetSingleMessage = async (req, res) => {
  const id = req.params.id;
  await db.discussion
    .findByPk(id)
    .then((data) => {
      if (data) {
        return returnResponse(200, true, "GetSingleMessage Return ", res, data);
      } else {
        return returnResponse(422, true, "Error", res, "");
      }
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};

const UpdateMessage = async (req, res) => {
  await db.discussion.update(
    { message: req.body.message, isEdited: "true" },
    {
      where: {
        id: req.params.id,
        senderID: req.query.userID,
      },
    }
  );
  return returnResponse(200, true, "message Updated successfully", res, {});
};

const cloneProject = async (req, res) => {
  const project = await db.Project.findOne({
    where: { id: req.params.id },
    raw: true,
    attributes: { exclude: ["id", "createdAt", "updatedAt"] },
  });

  console.log("object===============>>>>>>>>>>",project)

  project.name = project.name + "(copy)";
  project.userID = req.query.userID ? req.query.userID : 0;
  project.created_by = project.userID;
  project.runTimeStatus = null;
  project.ChangeStatus = null;
  project.status = "draft";
  project.isProjectNumber = null;
  project.ref_no = null;
  project.cronUpdateStatus = null;
  project.cronStatus = null;
  project.CloserStatus = null;
  project.final_approved_date = null;
  project.costStartDate = project.costStartDate
    ? moment(project.costStartDate).format("D-MMM-YY H:m")
    : null;
  project.costEndDate = project.costEndDate
    ? moment(project.costEndDate).format("D-MMM-YY H:m")
    : null;
  project.sellingStartDate = project.sellingStartDate
    ? moment(project.sellingStartDate).format("D-MMM-YY H:m")
    : null;
  project.sellingEndDate = project.sellingEndDate
    ? moment(project.sellingEndDate).format("D-MMM-YY H:m")
    : null;
  project.ChangeStartDate = project.ChangeStartDate
    ? moment(project.ChangeStartDate).format("D-MMM-YY H:m")
    : null;
  project.ChangeEndDate = project.ChangeEndDate
    ? moment(project.ChangeEndDate).format("D-MMM-YY H:m")
    : null;
  project.NewCostStartDate = project.NewCostStartDate
    ? moment(project.NewCostStartDate).format("D-MMM-YY H:m")
    : null;
  project.NewCostEndDate = project.NewCostEndDate
    ? moment(project.NewCostEndDate).format("D-MMM-YY H:m")
    : null;
  /*
  var checkProjectNumber = await db.Project.findOne({
    where: {
      [Op.and]: Sequelize.where(
        Sequelize.fn("YEAR", Sequelize.col("createdAt")),
        moment().format("Y")
      ),
    },
    order: [["projectNumber", "DESC"]],
  });

  var projectNum = 1;
  if (checkProjectNumber.projectNumber) {
    var checkNum = checkProjectNumber.projectNumber.split(
      "SG" + moment(new Date()).format("YY")
    );

    if (parseInt(checkNum[1])) {
      projectNum = parseInt(checkNum[1]) + 1;
    }
  }

  var string = "" + projectNum;
  var pad = "0000";
  var projectNumber = pad.substring(0, pad.length - string.length) + string;
  projectNumber = "SG" + moment(new Date()).format("YY") + projectNumber;
  // console.log(project);
  var myProject = await db.Project.create(project);

  await db.Project.update(
    { projectNumber: projectNumber },
    {
      where: {
        id: myProject.id,
      },
    }
  );
*/

  project.projectNumber = null;
  var myProject = await db.Project.create(project);
  var projectID = myProject.id;
  await db.ProjectBrand.findAll({
    where: { projectID: req.params.id },
    raw: true,
    attributes: { exclude: ["id", "createdAt", "updatedAt"] },
  }).then((data) => {
    data.map((r) => {
      r.projectID = projectID;
      db.ProjectBrand.create(r);
    });
  });

  await db.ProjectExpense.findAll({
    where: { projectID: req.params.id },
    raw: true,
    attributes: { exclude: ["id", "createdAt", "updatedAt"] },
  }).then((data) => {
    data.map((r) => {
      r.projectID = projectID;
      db.ProjectExpense.create(r);
    });
  });

  await db.ProjectBusinessesType.findAll({
    where: { projectID: req.params.id },
    raw: true,
    attributes: { exclude: ["id", "createdAt", "updatedAt"] },
  }).then((data) => {
    data.map((r) => {
      r.projectID = projectID;
      db.ProjectBusinessesType.create(r);
    });
  });

  await db.ProjectAreaDistrict.findAll({
    where: { projectID: req.params.id },
    raw: true,
    attributes: { exclude: ["id", "createdAt", "updatedAt"] },
  }).then((data) => {
    data.map((r) => {
      r.projectID = projectID;
      db.ProjectAreaDistrict.create(r);
    });
  });
  await db.ProjectTotalProfit.findAll({
    where: { projectID: req.params.id },
    raw: true,
    attributes: { exclude: ["id", "createdAt", "updatedAt"] },
  }).then((data) => {
    data.map((r) => {
      r.projectID = projectID;
      db.ProjectTotalProfit.create(r);
    });
  });

  await db.ProjectReviewers.findAll({
    where: { projectID: req.params.id },
    raw: true,
    attributes: { exclude: ["id", "createdAt", "updatedAt"] },
  }).then((data) => {
    data.map((r) => {
      r.projectID = projectID;
      db.ProjectReviewers.create(r);
    });
  });
  var user = await db.User.findByPk(myProject.userID);
  var checkProject = await db.Project.findByPk(projectID);
  const auditLog = {
    userID: req.query.userID,
    projectID: checkProject.id,
    message:
      user.email.split("@")[0] +
      " has created a new project " +
      checkProject.name,
    userName: user.email.split("@")[0],
    projectName: checkProject.name,
    actionBy: user.email.split("@")[0],
    comment: null,
  };

  Log.Auditlogs(auditLog, false);
  return returnResponse(200, true, "Data copy Successfully!", res, projectID);
};
const assignAllProject = async (req, res) => {
  var assignToUser = await db.User.findOne({
    where: {
      [Op.or]: [
        {
          name: req.body.ldapIDTo.trim() ? req.body.ldapIDTo.trim() : 0,
          status: { [Op.not]: "deleted" },
        },
        {
          email: req.body.ldapIDTo.trim() ? req.body.ldapIDTo.trim() : 0,
          status: { [Op.not]: "deleted" },
        },
      ],
    },
    include: [
      {
        model: db.role,
        as: "roleName",
      },
    ],
  });
  if (!assignToUser) {
    return returnResponse(422, true, "User Not Found!", res, "");
  }

  if (assignToUser.id == req.body.userFromID) {
    return returnResponse(422, true, "User Should Different!", res, "");
  }

  if (assignToUser.id && req.body.userFromID) {
    await db.Project.update(
      {
        userID: assignToUser.id,
      },
      {
        where: {
          userID: req.body.userFromID,
          status: {
            [Op.or]: ["pending", "completed"],
          },
        },
      }
    )
      .then((data) => {
        return returnResponse(
          200,
          true,
          "Project assigned Successfully.!",
          res,
          ""
        );
      })
      .catch((err) => {
        return returnResponse(422, false, err.message, res, "");
      });
  }

  const auditLog = {
    userID: req.body.userFromID,
    message: `Admin transfer all pending project of ${req.body.ldapIDFrom} to ${
      assignToUser.email.split("@")[0]
    }`,
    userName: req.body.ldapIDFrom,
    projectName: "N/A",
    actionBy: "Admin",
    comment: null,
    isAuditLog: "true",
    delegatedUser: assignToUser.email.split("@")[0],
    createdAt: moment().format("YYYY-MM-DD H:m"),
    user: req.body.ldapIDFrom,
    startDate: req.body.startDate
      ? moment(req.body.startDate).format("YYYY-MM-DD")
      : null,
    endDate: req.body.endDate
      ? moment(req.body.endDate).format("YYYY-MM-DD")
      : null,
  };
  Log.Auditlogs(auditLog, false);
};

const assignProject = async (req, res) => {
  // console.log(req.params, req.body, req.query);

  var assignUser = await db.User.findOne({
    where: {
      [Op.or]: [
        {
          name: req.body.ldapID.trim(),
          status: { [Op.not]: "deleted" },
        },
        {
          email: req.body.ldapID.trim(),
          status: { [Op.not]: "deleted" },
        },
      ],
    },
    include: [
      {
        model: db.role,
        as: "roleName",
      },
    ],
  });

  var user = await db.User.findOne({
    where: {
      id: req.params.id,
    },
  });

  var delegationUser = await db.User.findOne({
    where: {
      delegationUserID: req.params.id,
    },
  });

  if (assignUser) {
    if (assignUser.id == user.id) {
      return returnResponse(422, true, "You can't delegate to own!", res, "");
    } else if (delegationUser) {
      return returnResponse(
        422,
        true,
        user.email.split("@")[0] +
          " is already delegated.Please cancel existing delegation first!",
        res,
        ""
      );
    } else if (user.delegationUserID || assignUser.delegationUserID) {
      if (user.delegationUserID) {
        return returnResponse(
          422,
          true,
          user.email.split("@")[0] + " is already delegated to other user!",
          res,
          ""
        );
      } else {
        return returnResponse(
          422,
          true,
          assignUser.email.split("@")[0] + " is already delegated user!",
          res,
          ""
        );
      }
    } else {
      await db.User.update(
        {
          delegationUserID: assignUser.id,
          assignEndDate: req.body.endDate
            ? moment(req.body.endDate).format("YYYY-MM-DD")
            : null,

          assignStartDate: req.body.startDate
            ? moment(req.body.startDate).format("YYYY-MM-DD")
            : null,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      const auditLog = {
        userID: user.id,
        message: "Admin assigned deletegation",
        userName: user.email.split("@")[0],
        projectName: "N/A",
        actionBy: "Admin",
        comment: null,
        isAuditLog: "true",
        delegatedUser: assignUser.email.split("@")[0],
        createdAt: moment().format("YYYY-MM-DD H:m"),
        user: user.email.split("@")[0],
        startDate: req.body.startDate
          ? moment(req.body.startDate).format("YYYY-MM-DD")
          : null,
        endDate: req.body.endDate
          ? moment(req.body.endDate).format("YYYY-MM-DD")
          : null,
      };
      Log.Auditlogs(auditLog, false);
      if (
        moment().format("YYYY-MM-DD") ==
        moment(req.body.startDate).format("YYYY-MM-DD")
      ) {
        await db.DirectorAndReviewerApprover.update(
          {
            delegationUserID: req.params.id,
            userID: assignUser.id,
            delegationRoll: assignUser.roleName?.role,
          },
          {
            where: {
              userID: req.params.id,
              status: "pending",
            },
          }
        );
      }

      return returnResponse(200, true, "Successfully assigned.!", res, "");
    }
  } else {
    return returnResponse(422, true, "User Not Found!", res, "");
  }
};
const updateProject = async (req, res) => {
  var check = await db.User.update(
    {
      assignEndDate: req.body.endDate
        ? moment(req.body.endDate).format("YYYY-MM-DD")
        : null,

      assignStartDate: req.body.startDate
        ? moment(req.body.startDate).format("YYYY-MM-DD")
        : null,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  );
  if (check) {
    const user = await db.User.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: db.User,
          as: "delegation",
        },
      ],
    });

    const auditLog = {
      userID: user.id,
      message: "Admin update deletegation",
      userName: user.email.split("@")[0],
      projectName: "N/A",
      actionBy: "Admin",
      comment: null,
      isAuditLog: "true",
      delegatedUser: user.delegation.email.split("@")[0],
      user: user.email.split("@")[0],
      createdAt: moment().format("YYYY-MM-DD H:m"),
      startDate: req.body.startDate
        ? moment(req.body.startDate).format("YYYY-MM-DD")
        : null,
      endDate: req.body.endDate
        ? moment(req.body.endDate).format("YYYY-MM-DD")
        : null,
    };
    Log.Auditlogs(auditLog, false);
  }

  return returnResponse(200, true, "Update Successfully.!", res, "");
};

const exportReport = async (req, res) => {
  // var filter = await Filter.getFilter(req);
  // if (req.query.userID == "1") {
  //   filter = { status: { [Op.notIn]: ["deleted", "draft", "created"] } };
  // }
  console.log("HEllo anchal============>>>>>>>>>>>>>>>>");
  var f_date = req.query.fromDate;
  console.log("804", f_date);
  var to_date = req.query.toDate;
  console.log(to_date);
  var whereCal = {};
  var created_at = {};
  if (f_date) {
    f_date = new Date(f_date);
    const year = f_date.getFullYear();
    const month = (f_date.getMonth() + 1).toString().padStart(2, "0");
    const day = f_date.getDate().toString().padStart(2, "0");

    f_date = `${year}-${month}-${day}T00:00:00.000Z`;
  }

  if (to_date) {
    to_date = new Date(to_date);
    const year = to_date.getFullYear();
    const month = (to_date.getMonth() + 1).toString().padStart(2, "0");
    const day = to_date.getDate().toString().padStart(2, "0");

    to_date = `${year}-${month}-${day}T23:59:59.000Z`;
  }

  if (f_date && to_date) {
    created_at = {
      createdAt: { [Op.between]: [new Date(f_date), new Date(to_date)] },
    };
  }
  if (f_date && !to_date) {
    created_at = { createdAt: { [Op.gte]: new Date(f_date) } };
  }
  if (!f_date && to_date) {
    created_at = { createdAt: { [Op.lte]: new Date(to_date) } };
  }
  whereCal = { ...whereCal, ...created_at}
  var projectExs = await db.Project.findAll({
    where: { status: { [Op.notIn]: ["deleted", "draft", "created"] }, ...whereCal} ,
    // raw: true,
    include: [
      {
        model: db.ProjectBrand,
        attributes: ["lineExtID", "brandID"],
        include: [
          {
            model: db.Brand,
          },
          {
            model: db.lineExtension,
          },
        ],
      },
      {
        model: db.ProjectBusinessesType,
        attributes: ["businessID"],
        include: [db.BusinessType],
      },

      db.User,
    ],
    order: [["id", "DESC"]],
  });
  var workbook = new Excel.Workbook();
  workbook.creator = "Me";
  workbook.lastModifiedBy = "Her";
  workbook.created = new Date(1985, 8, 30);
  workbook.modified = new Date();
  workbook.lastPrinted = new Date(2016, 9, 27);
  workbook.properties.date1904 = true;

  workbook.views = [
    {
      firstSheet: 0,
      activeTab: 1,
      visibility: "visible",
    },
  ];
  var worksheet = workbook.addWorksheet("My Sheet");
  worksheet.columns = [
    { header: "Sr.No.", key: "s_no", width: 10 },
    { header: "Company", key: "company", width: 32 },
    { header: "Request ID (CPS Ref Id)", key: "req_id", width: 32 },
    { header: "Project Number", key: "project_number", width: 32 },
    { header: "Fullname", key: "Fullname", width: 32 },
    //{ header: "Brand", key: "brand", width: 32 },
    { header: "BrandCode", key: "brandCode", width: 32 },
    //{ header: "LineExt", key: "lineExt", width: 32 },
    { header: "LineExtCode", key: "LineExtCode", width: 32 },
    { header: "Base Channel", key: "Basechannel", width: 32 },
    { header: "Project Name", key: "projectname", width: 32 },
    { header: "Status", key: "status", width: 32 },
    { header: "Created Date", key: "craeted_date", width: 32 },
    {
      header: "Offer Cost Start Date",
      key: "Offer_Cost_start_Date",
      width: 32,
    },
    { header: "Offer Cost End Date", key: "Offer_Cost_End_Date", width: 32 },
    // { header: 'Request ID (CPS Ref Id)', key: 'req_id', width: 10, outlineLevel: 1, type: 'date', formulae: [new Date(2016, 0, 1)] }
  ];
  let counter = 1;
  var datas = {};
  projectExs.forEach((data) => {
    if (data.ProjectBusinessesTypes.length > 0) {
      baseNumberGroup(data.ProjectBusinessesTypes).forEach((projectBs) => {
        var BaseChannel = projectBs.BusinessType.baseChannel;
        ProjectNumberGroup(data.ProjectBrands).forEach((projectB) => {
          datas["s_no"] = counter;
          var lineExtension = projectB.lineExtension?.name;
          // var Brand = projectB.Brand?.name;
          // var brandCode = projectB.Brand?projectB.Brand.brandCode:'N/A';
          //  var lineExtCode = projectB.lineExtension? projectB.lineExtension.lineExtCode:'N/A';
          datas["company"] = "00251";
          datas["req_id"] = "REQ" + data.id;
          datas["project_number"] =
            data.status === "approved" || data.isProjectNumber === "done"
              ? data.projectNumber
                ? data.projectNumber
                : "Under Process"
              : "Under Process";
          datas["Fullname"] = data.User.email.split("@")[0].toUpperCase();
          //datas["brand"] = Brand;
          datas["brandCode"] = projectB.Brand
            ? projectB.Brand.brandCode
            : "N/A";
          //datas["lineExt"] = lineExtension;
          datas["LineExtCode"] = projectB.lineExtension
            ? projectB.lineExtension.lineExtCode
            : "N/A";
          datas["Basechannel"] = BaseChannel;
          datas["projectname"] = data.name;
          datas["status"] =
            data.status == "completed" ? "pending" : data.status;
          datas["craeted_date"] = data.createdAt
            ? moment(data.createdAt).format("D-MMM-YY")
            : null;
          datas["Offer_Cost_start_Date"] = data.costStartDate
            ? moment(data.costStartDate).format("D-MMM-YY")
            : null;
          datas["Offer_Cost_End_Date"] = data.costEndDate
            ? moment(data.costEndDate).format("D-MMM-YY")
            : null;
          worksheet.addRow(datas);
          counter++;
        });
      });
    } else {
      ProjectNumberGroup(data.ProjectBrands).forEach((projectB) => {
        datas["s_no"] = counter;
        var lineExtension = projectB.lineExtension?.name;
        var Brand = projectB.Brand?.name;
        // var brandCode = projectB.Brand?projectB.Brand.brandCode:'N/A';
        //  var lineExtCode = projectB.lineExtension? projectB.lineExtension.lineExtCode:'N/A';
        datas["company"] = "00251";
        datas["req_id"] = "REQ" + data.id;
        datas["project_number"] =
          data.status === "approved" || data.isProjectNumber === "done"
            ? data.projectNumber
              ? data.projectNumber
              : "Under Process"
            : "Under Process";
        datas["Fullname"] = data.User.email.split("@")[0].toUpperCase();
        datas["brandCode"] = projectB.Brand ? projectB.Brand.brandCode : "N/A";
        datas["LineExtCode"] = projectB.lineExtension
          ? projectB.lineExtension.lineExtCode
          : "N/A";
        datas["Basechannel"] = "N/A";
        datas["projectname"] = data.name;
        datas["status"] = data.status == "completed" ? "pending" : data.status;
        datas["craeted_date"] = data.createdAt
          ? moment(data.createdAt).format("D-MMM-YY")
          : null;
        datas["Offer_Cost_start_Date"] = data.costStartDate
          ? moment(data.costStartDate).format("D-MMM-YY")
          : null;
        datas["Offer_Cost_End_Date"] = data.costEndDate
          ? moment(data.costEndDate).format("D-MMM-YY")
          : null;
        worksheet.addRow(datas);
        counter++;
      });
    }
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + "promoBaseReport.xlsx"
  );
  workbook.xlsx.write(res).then(function (data) {
    res.end();
  });
};
function ProjectNumberGroup(data) {
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

const exportProjectListReport = async (req, res) => {
  console.log("HEllo anchal============>>>>>>>>>>>>>>>>");
  var f_date = req.query.fromDate;
  console.log("804", f_date);
  var to_date = req.query.toDate;
  console.log(to_date);
  var sell_from = req.query.sellFromDate;
  var sell_To = req.query.sellToDate;

  var finalAppFromDate = req.query.finalAppFromDate;
  var finalAppToDate = req.query.finalAppToDate;

  var cost_from = req.query.costFromDate;
  var cost_To = req.query.costToDate;
  console.log("======================1111111111", cost_from, cost_To, "=====>");

  var whereCal = {};
  var costDate = {};
  var selling_date = {};
  var finalAppDate={};
  var created_at = {};
  if (f_date) {
    f_date = new Date(f_date);
    const year = f_date.getFullYear();
    const month = (f_date.getMonth() + 1).toString().padStart(2, "0");
    const day = f_date.getDate().toString().padStart(2, "0");

    f_date = `${year}-${month}-${day}T00:00:00.000Z`;
  }

  if (to_date) {
    to_date = new Date(to_date);
    const year = to_date.getFullYear();
    const month = (to_date.getMonth() + 1).toString().padStart(2, "0");
    const day = to_date.getDate().toString().padStart(2, "0");

    to_date = `${year}-${month}-${day}T23:59:59.000Z`;
  }

  if (f_date && to_date) {
    created_at = {
      createdAt: { [Op.between]: [new Date(f_date), new Date(to_date)] },
    };
  }
  if (f_date && !to_date) {
    created_at = { createdAt: { [Op.gte]: new Date(f_date) } };
  }
  if (!f_date && to_date) {
    created_at = { createdAt: { [Op.lte]: new Date(to_date) } };
  }

  //final

  //finalAppDate
  if (finalAppFromDate) {
    finalAppFromDate = new Date(finalAppFromDate);
    const year = finalAppFromDate.getFullYear();
    const month = (finalAppFromDate.getMonth() + 1).toString().padStart(2, "0");
    const day = finalAppFromDate.getDate().toString().padStart(2, "0");

    finalAppFromDate = `${year}-${month}-${day}T00:00:00.000Z`;
  }

  if (finalAppToDate) {
    finalAppToDate = new Date(finalAppToDate);
    const year = finalAppToDate.getFullYear();
    const month = (finalAppToDate.getMonth() + 1).toString().padStart(2, "0");
    const day = finalAppToDate.getDate().toString().padStart(2, "0");

    finalAppToDate = `${year}-${month}-${day}T23:59:59.000Z`;
  }

  if (finalAppFromDate && finalAppToDate) {
    finalAppDate = {
      final_approved_date: {
        [Op.between]: [new Date(finalAppFromDate), new Date(finalAppToDate)],
      },
    };
  }
  if (finalAppFromDate && !finalAppToDate) {
    finalAppDate = { final_approved_date: { [Op.gte]: new Date(finalAppFromDate) } };
  }
  if (!finalAppFromDate && finalAppToDate) {
    finalAppDate = { final_approved_date: { [Op.lte]: new Date(finalAppToDate) } };
  }
  if (sell_from) {
    sell_from = new Date(sell_from);
    const year = sell_from.getFullYear();
    const month = (sell_from.getMonth() + 1).toString().padStart(2, "0");
    const day = sell_from.getDate().toString().padStart(2, "0");

    sell_from = `${year}-${month}-${day}T00:00:00.000Z`;

    console.log("====>new", sell_from);
  }

  if (sell_To) {
    sell_To = new Date(sell_To);
    const year = sell_To.getFullYear();
    const month = (sell_To.getMonth() + 1).toString().padStart(2, "0");
    const day = sell_To.getDate().toString().padStart(2, "0");

    sell_To = `${year}-${month}-${day}T23:59:59.000Z`;

    console.log("====>new", sell_To);
  }
  if (sell_from && sell_To) {
    selling_date = {
      sellingStartDate: {
        [Op.between]: [new Date(sell_from), new Date(sell_To)],
      },
    };
  }
  if (sell_from && !sell_To) {
    selling_date = { sellingStartDate: { [Op.gte]: new Date(sell_from) } };
  }
  if (!sell_from && sell_To) {
    selling_date = { sellingStartDate: { [Op.lte]: new Date(sell_To) } };
  }
  if (cost_from) {
    cost_from = new Date(cost_from);
    const year = cost_from.getFullYear();
    const month = (cost_from.getMonth() + 1).toString().padStart(2, "0");
    const day = cost_from.getDate().toString().padStart(2, "0");

    cost_from = `${year}-${month}-${day}T00:00:00.000Z`;

    console.log("====>new", cost_from);
  }

  if (cost_To) {
    cost_To = new Date(cost_To);
    const year = cost_To.getFullYear();
    const month = (cost_To.getMonth() + 1).toString().padStart(2, "0");
    const day = cost_To.getDate().toString().padStart(2, "0");

    cost_To = `${year}-${month}-${day}T23:59:59.000Z`;

    console.log("====>new", cost_To);
  }

  if (cost_from && cost_To) {
    costDate = {
      costStartDate: {
        [Op.between]: [new Date(cost_from), new Date(cost_To)],
      },
    };
  }
  if (cost_from && !cost_To) {
    costDate = { costStartDate: { [Op.gte]: new Date(cost_from) } };
  }
  if (!cost_from && cost_To) {
    costDate = { costStartDate: { [Op.lte]: new Date(cost_To) } };
  }
  whereCal = { ...whereCal, ...created_at, ...selling_date,...finalAppDate };

  var joinStatus = false;
  var whereCondition1 = {};

  if (req.query.search != undefined) {
    joinStatus =true
    whereCondition1 = {
      [Op.and]: [
        {
          [Op.or]: [
            { nextActionBy: { [Op.like]: "%" + req.query.search + "%" } },
            { projectNumber: { [Op.like]: "%" + req.query.search + "%" } },
            { name: { [Op.like]: "%" + req.query.search + "%" } },
            { id: { [Op.like]: "%" + req.query.search + "%" } },
            { department: { [Op.like]: "%" + req.query.search + "%" } },
            { status: { [Op.like]: "%" + req.query.search + "%" } },
            { projectType: { [Op.like]: "%" + req.query.search + "%" } },
            {
              "$User.email$": {
                [Op.like]: "%" + req.query.search.trim() + "%",
              },
            },
          ],
        },
      ],
    };
  }
  const whereCondition2 = {
    status: { [Op.notIn]: ["deleted", "draft", "created"] },
  };
  var projectExs = await db.Project.findAll({
    // logging: (sql, queryObject) => {
    //   console.log(sql);
    // },
    where: {
      [Op.and]: [whereCondition1, whereCondition2],
      ...whereCal,
      //
    },
    include: [
      {model:db.User,required:joinStatus},
      {
        model: db.ProjectAreaDistrict,
        include: [
          {
            model: db.Channel,
            attributes: ["name"],
          },
          {
            model: db.Aria,
            attributes: ["name"],
          },
          {
            model: db.District,
            attributes: ["name"],
          },
        ],
      },

      {
        model: db.ProjectBusinessesType,
        include: [db.BusinessType],
      },
      db.ProjectFile,
    ],

    order: [["id", "DESC"]],
  });

  // console.log("896",projectExs)
  var workbook = new Excel.Workbook();

  workbook.creator = "Me";
  workbook.lastModifiedBy = "Her";
  workbook.created = new Date(1985, 8, 30);
  workbook.modified = new Date();
  workbook.lastPrinted = new Date(2016, 9, 27);
  workbook.properties.date1904 = true;

  workbook.views = [
    {
      firstSheet: 0,
      activeTab: 1,
      visibility: "visible",
    },
  ];
  var worksheet = workbook.addWorksheet("My Sheet");
  worksheet.columns = [
    { header: "Sr.No.", key: "s_no", width: 10 },
    { header: "Request/Project ID", key: "projectID", width: 32 },
    { header: "Project Number", key: "project_number", width: 32 },
    { header: "Project Name", key: "projectname", width: 32 },
    { header: "Project Description", key: "project_description", width: 32 },
    { header: "Remark", key: "Remark", width: 32 },
    { header: "Project Owner", key: "project_owner", width: 32 },
    { header: "Project Department", key: "ProjectDepartment", width: 32 },
    { header: "Project Status", key: "ProjectStatus", width: 32 },
    {
      header: "Project Closure Status",
      key: "ProjectClosureStatus",
      width: 32,
    },
    { header: "Current Action", key: "CurrentAction", width: 32 },
    { header: "Next Action By", key: "nextactionby", width: 32 },
    { header: "Request Type", key: "RequestType", width: 32 },
    { header: "Created On", key: "CreatedOn", width: 32 },
    { header: "Final Approval Date", key: "FinalDate", width: 32 },
    { header: "Selling Start Date", key: "StartDate", width: 32 },
    { header: "Selling End Date", key: "EndDate", width: 32 },
    { header: "Cost Start Date", key: "CostStartDate", width: 32 },
    { header: "Cost End Date", key: "CostEndDate", width: 32 },
    { header: "No. of Days", key: "NoofDays", width: 32 },
    { header: "Project Type", key: "ProjectType", width: 32 },
    { header: "Total Budget", key: "TotalBudget", width: 32 },

    { header: "Biz Type Description", key: "BizTypeDescription", width: 32 },
    { header: "Region", key: "Region", width: 32 },
    { header: "Sales Region", key: "SalesRegion", width: 32 },
    { header: "District", key: "District", width: 32 },
    {
      header: "Setting (APBS or Dealer)",
      key: "SettingAPBSorDealer",
      width: 32,
    },

    // { header: 'Request ID (CPS Ref Id)', key: 'req_id', width: 10, outlineLevel: 1, type: 'date', formulae: [new Date(2016, 0, 1)] }
  ];
  let counter = 1;
  var datas = {};
  projectExs.forEach((pro) => {
    datas["s_no"] = counter;
    datas["projectID"] = "REQ" + ProjectNumber(pro.id);
    datas["project_number"] =
      pro.status === "approved" || pro.isProjectNumber === "done"
        ? pro.projectNumber
          ? pro.projectNumber
          : "Under Process"
        : "Under Process";
    datas["project_description"] = pro.description ? pro.description : "N/A";
    datas["project_owner"] = pro.User?.email.split("@")[0].toUpperCase();
    datas["projectname"] = pro.name;
    datas["ProjectDepartment"] = pro.department;
    datas["ProjectStatus"] = pro.status == "completed" ? "pending" : pro.status;
    datas["ProjectClosureStatus"] =
      pro.CloserStatus === "approved"
        ? "Approved"
        : pro.CloserStatus === "rejected"
        ? "Rejected"
        : pro.CloserStatus === "cancelled"
        ? "Cancelled"
        : pro.CloserStatus === "closed"
        ? "Closed"
        : pro.CloserStatus === "pending"
        ? "Pending"
        : "NA";
    datas["CurrentAction"] = pro.runTimeStatus
      ? pro.runTimeStatus
      : "Under Process";
    datas["nextactionby"] = pro.nextActionBy ? pro.nextActionBy : "N/A";
    datas["RequestType"] =
      pro.ChangeStatus === null && pro.CloserStatus === null
        ? "Fresh Request"
        : pro.ChangeStatus !== null && pro.CloserStatus === null
        ? "Change Request"
        : "Close Request";
    datas["BizTypeDescription"] = pro.ProjectBusinessesTypes.length
      ? projectBrand(pro.ProjectBusinessesTypes, "ProjectBusinessesTypes")
      : "N/A";
    datas["CreatedOn"] = pro.createdAt
      ? moment(pro.createdAt).format("D-MMM-YY")
      : null;
    datas["FinalDate"] = pro.final_approved_date
      ? moment(pro.final_approved_date).format("D-MMM-YY")
      : pro.status === "approved"
      ? moment(pro.updatedAt).format("D-MMM-YYYY")
      : null;
    datas["StartDate"] = pro.sellingStartDate
      ? moment(pro.sellingStartDate).format("D-MMM-YY")
      : null;
    datas["CostStartDate"] = pro.costStartDate
      ? moment(pro.costStartDate).format("D-MMM-YY")
      : null;
    datas["CostEndDate"] = pro.costEndDate
      ? moment(pro.costEndDate).format("D-MMM-YY")
      : null;
    datas["NoofDays"] = noOFdays(pro.sellingStartDate, pro.sellingEndDate);

    // );
    datas["EndDate"] = pro.sellingEndDate
      ? moment(pro.sellingEndDate).format("D-MMM-YY")
      : null;
    datas["ProjectType"] = pro.projectType;
    datas["TotalBudget"] = pro.totalBudget ? "S$" + pro.totalBudget : "S$0";

    datas["Region"] = pro.ProjectAreaDistricts.length
      ? projectBrand(pro.ProjectAreaDistricts, "ProjectAreaDistricts")
      : "N/A";

    datas["SalesRegion"] = pro.ProjectAreaDistricts.length
      ? projectBrand(pro.ProjectAreaDistricts, "Arium")
      : "N/A";
    datas["District"] = pro.ProjectAreaDistricts.length
      ? projectBrand(pro.ProjectAreaDistricts, "District")
      : "N/A";

    datas["SettingAPBSorDealer"] = pro.promotionDiscount
      ? pro.promotionDiscount
      : "N/A";

    datas["Remark"] = pro.remark ? pro.remark : "-";

    // console.log(datas);
    worksheet.addRow(datas);
    counter++;
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + "projectListReport.xlsx"
  );
  workbook.xlsx.write(res).then(function (data) {
    res.end();
  });
};
function ProjectNumber(n) {
  var string = "" + n;
  var pad = "0000";
  n = pad.substring(0, pad.length - string.length) + string;
  return n;
}
function noOFdays(start, end) {
  var start = moment(start, "YYYY-MM-DD");
  var end = moment(end, "YYYY-MM-DD");
  return moment.duration(end.diff(start)).asDays() > 0
    ? moment.duration(end.diff(start)).asDays() + 1
    : moment.duration(end.diff(start)).asDays() + 1;
}
function scoa(pro) {
  var allB = [];

  pro.forEach(async (name, index) => {
    var brand = name.Brand ? name.Brand.brandCode : "";
    var lineExtension = name.lineExtension
      ? name.lineExtension.lineExtCode
      : "";
    var expenseCode = name.Expense ? name.Expense.expenseCode : "";

    allB.push(brand + lineExtension + expenseCode);
  });
  return allB.length > 0 ? allB[0] : "N/A";
}
function projectBrand(pro, type) {
  var allB = [];
  pro.forEach(async (name, index) => {
    if (type == "brand") {
      allB.push(name.Brand?.name);
    }
    if (type == "lineExtension") {
      allB.push(name.lineExtension?.name);
    }
    if (type == "PackType") {
      allB.push(name.PackType?.name);
    }
    if (type == "ProjectBusinessesTypes") {
      allB.push(name.BusinessType?.name);
    }
    if (type == "ProjectAreaDistricts") {
      allB.push(name.Channel?.name);
    }

    if (type == "Arium") {
      allB.push(name.Arium?.name);
    }
    if (type == "District") {
      allB.push(name.District?.name);
    }
  });
  return allB.toString();
}

export {
  exportProjectListReport,
  exportReport,
  cloneProject,
  discussionProjectList,
  projectChatList,
  projectDeleteChat,
  projectChat,
  GetSingleMessage,
  UpdateMessage,
  assignProject,
  updateProject,
  assignAllProject,
};
