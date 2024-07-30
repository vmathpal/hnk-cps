import db from "../../models";
import { Op, where, Sequelize } from "sequelize";
import { returnResponse, projectFLow, uploadImage } from "../../helper/helper";
import { SendEmail } from "../admin/emailController";

import * as Log from "../../audit-log/auditLog";
var moment = require("moment");

const rejectApproveProject = async (req, res) => {
  //   console.log(req.body, req.params.ud);
  const projectID = await db.Project.findAll({
    where: { userID: req.params.id },
  }).then((project) => project.map((account) => account.id));

  const cancel = await db.DirectorAndReviewerApprover.findAll({
    where: {
      projectID: { [Op.in]: projectID },
      status: { [Op.in]: ["cancelled"] },
    },
    include: [
      {
        model: db.Project,
      },
    ],
    order: [["id", "DESC"]],
  });
  cancel.forEach(async (element) => {
    if (element.status == "rejected") {
      await db.Project.update(
        { status: "rejected" },
        {
          where: { id: element.projectID },
        }
      );
      await db.Project.update(
        { ChangeStatus: "rejected" },
        {
          where: { id: element.projectID, ChangeStatus: "pending" },
        }
      );
    }
    if (element.status == "cancelled") {
      await db.Project.update(
        { status: "cancelled" },
        {
          where: { id: element.projectID },
        }
      );
      await db.Project.update(
        { ChangeStatus: "cancelled" },
        {
          where: { id: element.projectID, ChangeStatus: "pending" },
        }
      );
    }
    // const project = await db.Project.findByPk(element.projectID);
    // const check = await db.DirectorAndReviewerApprover.findOne({
    //   where: { userID: element.userID },
    // });
    // const approver = await db.User.findByPk(check.userID);

    // const user = await db.User.findByPk(project.userID);
    // const name = user.email.split("@");
    // const approver_name = approver.email.split("@");
    // let user_data = {
    //   name: name[0],
    //   email: user.email,
    //   type: check.type,
    //   approver_name: approver_name[0],
    //   status: req.body.status,
    //   project_name: project.name,
    //   project_id: project.id,
    //   department: project.department,
    //   project_type: project.projectType,
    //   cost_start_date: project.costStartDate,
    //   cost_end_date: project.costEndDate,
    //   selling_start_date: project.sellingStartDate,
    //   selling_end_date: project.sellingEndDate,
    //   project_volume: project.projectVolume,
    //   remark: project.remark,
    //   url: process.env.WEB_URL,
    // };

    // SendEmail(user_data, "CANCELLED_REJECT_STATUS");
  });
  const project = await db.Project.findAll({
    where: { userID: req.params.id, status: "cancelled" },
    include: [
      {
        model: db.DirectorAndReviewerApprover,
        where: { status: "cancelled" },
        required: false,
      },
    ],
  });
  return returnResponse(
    200,
    true,
    "Project Listing Successfully.",
    res,
    project
  );
};
const GetBusinessTpe = async (req, res) => {
  var businessType = [];

  if (Number.isInteger(parseInt(req.params.id))) {
    var checkProject = await db.Project.findOne({
      where: {
        id: { [Op.eq]: req.params.id },
      },
    });
    // console.log(checkProject);
    businessType = await db.BusinessType.findAll({
      where: {
        id: { [Op.in]: checkProject.businessType.split(",") },
      },
    });
  }

  return returnResponse(
    200,
    true,
    "Project status change Successfully.",
    res,
    businessType
  );
};
const projectReStatus = async (req, res) => {
  await db.DirectorAndReviewerApprover.update(
    { projectID: req.params.id },
    {
      where: { status: "pending" },
    }
  );

  return returnResponse(
    200,
    true,
    "Project status change Successfully.",
    res,
    []
  );
};

const approvalProjectList = async (req, res) => {
  const userID = req.body.userID;
  const projectID = await db.Project.findAll({
    where: {
      [Op.or]: [
        { userID: req.params.id, ChangeStatus: { [Op.eq]: null } },
        { userID: req.params.id, ChangeStatus: { [Op.eq]: "pending" } },
      ],
    },
  }).then((project) => project.map((account) => account.id));

  var abcd = [];
  await projectID.forEach(async (element) => {
    var getProjectID = await checkProjectApproved(element);

    if (getProjectID) {
      abcd.push(getProjectID);
      // <<<<<<<<<<<<<<<<<Start Email Section >>>>>>>>>>>>
      const project = await db.Project.findByPk(getProjectID);
      const user = await db.User.findByPk(project.userID);
      const name = user.email.split("@");

      let user_data = {
        name: name[0],
        email: user.email,
        status: "approved",
        project_name: project.name,
        url: process.env.WEB_URL,
        project_id: project.id,
        department: project.department,
        project_type: project.projectType,
        cost_start_date: moment(project.costStartDate).format(
          "dddd, MMMM Do YYYY"
        ),
        cost_end_date: moment(project.costEndDate).format("dddd, MMMM Do YYYY"),
        selling_start_date: moment(project.sellingStartDate).format(
          "dddd, MMMM Do YYYY"
        ),
        selling_end_date: moment(project.sellingEndDate).format(
          "dddd, MMMM Do YYYY"
        ),
        project_volume: project.projectVolume,
        remark: project.remark,
      };

      // SendEmail(user_data, "PROJECT_FINAL_STATUS");

      // <<<<<<<<<<<<<<<<<<<<End Email Section >>>>>>>>>>>>

      // await db.DirectorAndReviewerApprover.update(
      //   { finalEmailStatus: "1" },
      //   {
      //     where: { projectID: getProjectID },
      //   }
      // );

      // await db.Project.update(
      //   { ChangeStatus: "approved" },
      //   {
      //     where: { id: getProjectID, ChangeStatus: "pending" },
      //   }
      // );
    }
  });
  setTimeout(async () => {
    // var checkProject = await db.Project.findAll({
    //   where: {
    //     id: { [Op.in]: abcd },
    //   },
    //   include: [
    //     {
    //       model: db.ProjectAreaDistrict,
    //       include: [
    //         {
    //           model: db.Channel,
    //         },
    //         {
    //           model: db.Aria,
    //         },
    //         {
    //           model: db.District,
    //         },
    //         {
    //           model: db.Project,
    //         },
    //       ],
    //     },
    //     {
    //       model: db.ProjectBrand,
    //       include: [
    //         {
    //           model: db.Project,
    //         },
    //         {
    //           model: db.Brand,
    //         },
    //         {
    //           model: db.Category,
    //         },
    //         {
    //           model: db.PackType,
    //         },
    //         {
    //           model: db.SKU,
    //         },
    //       ],
    //     },
    //   ],
    // });
    return returnResponse(
      200,
      true,
      "Project Reviewers Successfully.",
      res,
      projectID
    );
  }, 1000);
};

async function checkProjectApproved(projectID) {
  const getProject = await db.DirectorAndReviewerApprover.findAll({
    where: {
      projectID: projectID,

      finalEmailStatus: { [Op.eq]: null },
    },

    //  distinct: "type",
  }).then((project) => project.map((account) => account.type));
  // console.log(getProject);
  var uSet = new Set(getProject);
  const type = [...uSet].length;

  const getProjectData = await db.DirectorAndReviewerApprover.findAll({
    where: {
      projectID: projectID,
      status: "approved",
    },
  }).then((pro) => pro.map((acc) => acc.type));
  var uSets = new Set(getProjectData);
  const getApproveType = [...uSets].length;

  if (type == getApproveType && type > 1) {
    return projectID;
  }
  return null;
}
const changeAprovalStatus = async (req, res) => {
  if (req.body.status != "approved") {
    var updateProject = await db.Project.findOne({
      where: { id: req.body.projectID },
    });

    if (
      updateProject.ChangeRequestType == "date" &&
      updateProject.ChangeStatus != null
    ) {
      let data = {
        costStartDate: formatDate(updateProject.NewCostEndDate),
        costEndDate: formatDate(updateProject.NewCostEndDate),
        sellingStartDate: formatDate(updateProject.ChangeStartDate),
        sellingEndDate: formatDate(updateProject.ChangeEndDate),
        description: updateProject.crDescription,
      };

      await db.Project.update(data, { where: { id: req.body.projectID } });
    }

    if (
      updateProject.ChangeRequestType == "amount" &&
      updateProject.ChangeStatus != null
    ) {
      await db.ProjectExpense.update(
        {
          newBudgetExpenses: null,
        },
        { where: { projectID: req.body.projectID } }
      );

      await db.Project.update(
        {
          totalBudget: updateProject.OldTotalBudget,
          description: updateProject.crDescription,
        },
        { where: { id: req.body.projectID } }
      );

      await db.ChangeRequest.findAll({
        where: { projectID: req.body.projectID },
      }).then((data) => {
        data.map((r) => {
          var cinsert = {
            projectBrandID: r.projectBrandID,
            budgetRef: r.budgetRef,
            allocationPercent: r.allocationPercent,
            allocation: r.allocation,
            budgetAmount: r.budgetAmount,
            fy: r.fy,
          };

          db.ProjectBrand.update(cinsert, {
            where: { id: r.projectBrandID },
          });
        });
      });
    }

    // await db.ProjectBrand.update(
    //   {
    //     newAllocation: null,
    //     newAllocationPercent: null,
    //     newBudgetAmount: null,
    //   },
    //   { where: { projectID: req.body.projectID } }
    // );
  }

  if (req.query.actionType == "CloseRequest" && req.body.status != "approved") {
    console.log("Req Type", req.query.actionType, req.body.status);
    await db.Project.update(
      { CloserStatus: req.body.status, updatedAt: Sequelize.fn("NOW") },
      {
        where: { id: req.body.projectID },
      }
    );
  } else if (
    req.query.actionType == "ChangeRequest" &&
    req.body.status != "approved"
  ) {
    console.log("Req Type,Status", req.query.actionType, req.body.status);
    await db.Project.update(
      { ChangeStatus: req.body.status, updatedAt: Sequelize.fn("NOW") },
      {
        where: { id: req.body.projectID },
      }
    );
  }

  if (req.query.actionType == "FreshRequest" && req.body.status != "approved") {
    console.log("Req Type,Status", req.query.actionType, req.body.status);
    await db.Project.update(
      { status: req.body.status, updatedAt: Sequelize.fn("NOW") },
      {
        where: { id: req.body.projectID },
      }
    );
  }

  if (req.body.status == "approved") {
    await db.DirectorAndReviewerApprover.update(
      {
        status: req.body.status,
        comment: req.body.comment,
        actionDate: moment(new Date()).format("D-MMM-YY H:m"),
      },
      {
        where: {
          projectID: req.body.projectID,
          userID: req.body.userID,
          sequence: req.body.sequence,
        },
      }
    );
  } else {
    await db.DirectorAndReviewerApprover.update(
      {
        status: req.body.status,
        comment: req.body.comment,
        actionDate: moment(new Date()).format("D-MMM-YY H:m"),
      },
      {
        where: {
          projectID: req.body.projectID,
          userID: req.body.userID,
          sequence: req.body.sequence,
        },
      }
    );
  }
  const project = await db.Project.findByPk(req.body.projectID);
  const check = await db.DirectorAndReviewerApprover.findOne({
    where: { userID: req.body.userID },
  });
  const approver = await db.User.findByPk(check.userID);

  const user = await db.User.findByPk(project.userID);
  const name = user.email.split("@");
  const approver_name = approver.email.split("@");

  const auditLog = {
    userID: user.id,
    projectID: project.id,
    message:
      project.name + " has been " + req.body.status + " by " + approver_name[0],
    userName: name[0],
    projectName: project.name,
    actionBy: approver_name[0],
    comment: req.body.comment ? req.body.comment : "-",
  };
  Log.Auditlogs(auditLog, false);

  if (req.body.status !== "approved") {
    let user_data = {
      name: name[0],
      email: user.email,
      type: check.type,
      approver_name: approver_name[0],
      status: req.body.status,
      project_name: project.name,
      project_id: project.id,
      department: project.department,
      project_type: project.projectType,
      cost_start_date: moment(project.costStartDate).format(
        "dddd, MMMM Do YYYY"
      ),
      cost_end_date: moment(project.costEndDate).format("dddd, MMMM Do YYYY"),
      selling_start_date: moment(project.sellingStartDate).format(
        "dddd, MMMM Do YYYY"
      ),
      selling_end_date: moment(project.sellingEndDate).format(
        "dddd, MMMM Do YYYY"
      ),
      project_volume: project.projectVolume,
      remark: project.remark,
      url: process.env.WEB_URL,
      reason: req.body.comment,
    };

    SendEmail(user_data, "CANCELLED_REJECT_STATUS");
    // const auditLog = {
    //   userID: user.id,
    //   projectID: project.id,
    //   message:
    //     project.name +
    //     " has been " +
    //     req.body.status +
    //     " by " +
    //     approver_name[0],
    //   userName: name[0],
    //   projectName: project.name,
    // };
    // Log.Auditlogs(auditLog, false);
  }

  var getProjectID = await checkProjectApproved(req.body.projectID);
  if (getProjectID) {
    // <<<<<<<<<<<<<<<<<Start Email Section >>>>>>>>>>>>
    const project = await db.Project.findByPk(req.body.projectID);
    const user = await db.User.findByPk(project.userID);
    const name = user.email.split("@");

    let user_data = {
      name: name[0],
      email: user.email,
      status: "approved",
      project_name: project.name,
      url: process.env.WEB_URL,
      project_id: project.id,
      department: project.department,
      project_type: project.projectType,
      cost_start_date: moment(project.costStartDate).format(
        "dddd, MMMM Do YYYY"
      ),
      cost_end_date: moment(project.costEndDate).format("dddd, MMMM Do YYYY"),
      selling_start_date: moment(project.sellingStartDate).format(
        "dddd, MMMM Do YYYY"
      ),
      selling_end_date: moment(project.sellingEndDate).format(
        "dddd, MMMM Do YYYY"
      ),
      project_volume: project.projectVolume,
      remark: project.remark,
    };

    SendEmail(user_data, "PROJECT_FINAL_STATUS", 1);
    const auditLog = {
      userID: user.id,
      projectID: project.id,
      message: project.name + " project is finally approved.",
      userName: name[0],
      projectName: project.name,
      actionBy: "-",
      comment: null,
    };
    Log.Auditlogs(auditLog, false);
    // <<<<<<<<<<<<<<<<<<<<End Email Section >>>>>>>>>>>>

    await db.DirectorAndReviewerApprover.update(
      { finalEmailStatus: "1" },
      {
        where: { projectID: req.body.projectID },
      }
    );
  }
  setTimeout(async () => {
    await checkStepApproval(req.body.projectID, req.body.userID);
    // await UpdateProjectStatus(req.body.projectID);
  }, 1000);
  return returnResponse(200, true, "change Approver Successfully.", res, []);
};

async function checkStepApproval(projectID, userID) {
  const checkChancelProject = await db.DirectorAndReviewerApprover.findOne({
    where: {
      projectID: projectID,
      status: { [Op.in]: ["cancelled", "rejected"] },
    },
  });

  const approvedProject = await db.DirectorAndReviewerApprover.findOne({
    where: {
      projectID: projectID,
      status: {
        [Op.and]: [
          { [Op.notIn]: ["cancelled", "rejected", "pending"] },
          { [Op.eq]: "approved" },
        ],
      },
    },
    order: [["sequence", "DESC"]],
  });
  if (approvedProject) {
    await db.Project.update(
      { nextActionBy: null },
      {
        where: {
          id: projectID,
        },
      }
    );
  }

  if (!checkChancelProject) {
    const checkTurn = await db.DirectorAndReviewerApprover.findOne({
      where: {
        projectID: projectID,
        isTurn: { [Op.is]: null },
        status: "pending",
      },
      order: [["sequence", "ASC"]],
    });

    const checkPending = await db.DirectorAndReviewerApprover.findOne({
      where: {
        projectID: projectID,
        status: "pending",
        isTurn: "yes",
      },
      order: [["sequence", "ASC"]],
    });

    if (checkTurn && !checkPending) {
      const checkData = await db.DirectorAndReviewerApprover.findAll({
        where: {
          projectID: projectID,
          type: checkTurn.type,
        },

        order: [["sequence", "ASC"]],
      });

      await db.DirectorAndReviewerApprover.update(
        { isTurn: "yes" },
        {
          where: {
            type: checkTurn.type,
            projectID: checkTurn.projectID,
          },
        }
      );

      var userEmail = [];
      checkData.forEach(async (element) => {
        const user = await db.User.findByPk(element.userID);
        const project = await db.Project.findByPk(element.projectID);

        const name = user.email.split("@");
        userEmail.push(name[0]);
        let user_data = {
          name: name[0],
          email: user.email,
          type: element.type,
          project_name: project.name,
          project_id: project.id,
          department: project.department,
          project_type: project.projectType,
          cost_start_date: moment(project.costStartDate).format(
            "dddd, MMMM Do YYYY"
          ),
          cost_end_date: moment(project.costEndDate).format(
            "dddd, MMMM Do YYYY"
          ),
          selling_start_date: moment(project.sellingStartDate).format(
            "dddd, MMMM Do YYYY"
          ),
          selling_end_date: moment(project.sellingEndDate).format(
            "dddd, MMMM Do YYYY"
          ),
          project_volume: project.projectVolume,
          remark: project.remark,
          url: process.env.WEB_URL,
        };
        SendEmail(user_data, "PROJECT_APPROVAL_REQUEST", 0);
        await db.Project.update(
          { nextActionBy: userEmail.toString() },
          {
            where: {
              id: projectID,
            },
          }
        );
      });
    }
  }
  await UpdateProjectStatus(projectID);
}
async function checkApproverData(sequense, key, projectID) {
  var checkApproved = await db.DirectorAndReviewerApprover.findOne({
    where: {
      projectID: projectID,
      type: sequense[key],
      status: "pending",
    },
  });

  for (let i = parseInt(key) + 1; i <= 9; i++) {
    const check = await db.DirectorAndReviewerApprover.findAll({
      where: { projectID: projectID, type: sequense[i] },
    });

    if (check.length > 0 && !checkApproved) {
      return check;
    }
  }
}

async function UpdateProjectStatus(project_id) {
  const project = await db.Project.findAll({
    where: {
      id: project_id,
    },
  });

  project.forEach(async (element) => {
    if (
      element.runTimeStatus != "Closed by Admin" &&
      element.runTimeStatus != "Cancelled by Owner"
    ) {
      const checkApproved = await checApprovalStatus(element.id);

      const cancel = await db.DirectorAndReviewerApprover.findOne({
        where: {
          projectID: element.id,
          status: { [Op.in]: ["rejected", "cancelled"] },
        },
      });
      const pending = await db.DirectorAndReviewerApprover.findOne({
        where: {
          projectID: element.id,
          status: { [Op.in]: ["approved", "rejected", "cancelled"] },
        },
      });

      if (!pending) {
        // await db.Project.update(
        //   { runTimeStatus: null, ChangeStatus: "pending" },
        //   {
        //     where: { id: element.id, CloserStatus: { [Op.eq]: null } },
        //   }
        // );
      }
      const approvedBy = await db.DirectorAndReviewerApprover.findOne({
        where: {
          projectID: element.id,
          status: "approved",
        },
        order: [["sequence", "DESC"]],
      });

      if (checkApproved) {
        if (
          element.CloserStatus == "pending" ||
          element.CloserStatus == "approved"
        ) {
          await db.Project.update(
            {
              CloserStatus: "approved",
              status: "closed",
              runTimeStatus: "Approved By All Approver",
              final_approved_date: new Date(),
            },
            {
              where: {
                id: checkApproved.projectID,
                CloserStatus: { [Op.ne]: null },
              },
            }
          );
        } else {
          //new project number by sequence
          console.log("hello ovekkuuuuuuu444444444444444444444444444444444");

          const checkProjectNumber = await db.Project.findOne({
            where: {
              projectNumber: {
                [Op.like]: "SG%",
              },
            },
            order: [["projectNumber", "DESC"]],
          });
          // var checkProjectNumber = await db.Project.findOne({
          //   where: {
          //     [Op.and]: Sequelize.where(
          //       Sequelize.fn("YEAR", Sequelize.col("createdAt")),
          //       moment().format("Y")
          //     ),
          //   },
          //   order: [["projectNumber", "DESC"]],
          // });

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

          var projectNumber =
            pad.substring(0, pad.length - string.length) + string;
          projectNumber =
            "SG" + moment(new Date()).format("YY") + projectNumber;
          await db.Project.update(
            {
              runTimeStatus: "Approved By All Approver ",
              status: "approved",
              final_approved_date: new Date(),
            },
            {
              where: {
                id: checkApproved.projectID,
              },
            }
          );

          //sequence
          await db.Project.update(
            { projectNumber: projectNumber },
            {
              where: {
                id: checkApproved.projectID,
                projectNumber: { [Op.is]: null },
              },
            }
          );
          await db.Project.update(
            {
              runTimeStatus: "Approved By All Approver ",
              ChangeStatus: "approved",
              final_approved_date: new Date(),
            },
            {
              where: {
                [Op.or]: [
                  {
                    CloserStatus: { [Op.eq]: null },
                    ChangeStatus: { [Op.ne]: null },
                    id: checkApproved.projectID,
                  },
                  {
                    CloserStatus: { [Op.in]: ["pending", "rejected"] },
                    ChangeStatus: { [Op.ne]: null },
                    id: checkApproved.projectID,
                  },
                ],
              },
            }
          );
        }
      } else if (cancel) {
        // console.log(element.id);

        await db.Project.update(
          {
            runTimeStatus:
              capitalize(cancel.status) + " By " + cancel.role_name,
            //status: cancel.status,
          },
          {
            where: { id: cancel.projectID, CloserStatus: { [Op.eq]: null } },
          }
        );

        await db.Project.update(
          {
            runTimeStatus:
              capitalize(cancel.status) + " By " + cancel.role_name,
          },
          {
            where: { id: cancel.projectID },
          }
        );
      } else if (approvedBy) {
        await db.Project.update(
          {
            runTimeStatus: "Approved By " + approvedBy.role_name,
          },
          {
            where: { id: approvedBy.projectID },
          }
        );
      }
    }
  });
}

async function checApprovalStatus(projectID) {
  const checkPendingData = await db.DirectorAndReviewerApprover.findOne({
    where: {
      projectID: projectID,
      status: { [Op.in]: ["pending", "rejected", "cancelled"] },
    },
  });

  const checkApproved = await db.DirectorAndReviewerApprover.findOne({
    where: {
      projectID: projectID,
      status: "approved",
    },
  });

  if (checkPendingData) {
    return false;
  } else if (checkApproved) {
    return checkApproved;
  }
}
function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}
const changeRequest = async (req, res) => {
  var getProject = await db.Project.findByPk(req.params.id);

  var project = await db.Project.findOne({
    where: {
      id: req.params.id ? req.params.id : 0,
      ChangeStatus: { [Op.ne]: null },
      CloserStatus: { [Op.ne]: null },
    },
  });

  var data = req.body;

  if (req.query.amount) {
    var amount = {
      totalBudget: req.query.amount,
      OldTotalBudget: getProject.totalBudget,
      description: req.query.description,
      crDescription: getProject?.description,
      ChangeStatus: "pending",
      ChangeRequestType: "amount",
      // status: "pending",
    };
    if (project) {
      amount["status"] = "pending";
    }
    if (req.query.amount && req.params.id) {
      await db.Project.update(amount, {
        where: {
          id: req.params.id ? req.params.id : 0,
        },
      });
    }
    await db.ChangeRequest.destroy({
      where: { projectID: req.params.id ? req.params.id : 0 },
    });
    await db.Project.findOne({
      where: { id: req.params.id },
      include: [db.ProjectBrand],
    }).then((data) => {
      data.ProjectBrands.map((r) => {
        var cinsert = {
          projectBrandID: r.id,
          projectID: r.projectID,
          budgetRef: r.budgetRef,
          allocationPercent: r.allocationPercent,
          allocation: r.allocation,
          budgetAmount: r.budgetAmount,
          fy: r.fy,
        };
        //console.log(cinsert);
        db.ChangeRequest.create(cinsert);
      });
    });
    data.forEach(async (element) => {
      var insert = {
        budgetRef: element.budgetRef,
        allocationPercent: element.allocationPercent,
        allocation: element.allocation,
        budgetAmount: element.budgetAmount,
        fy: element.fy,
      };
      await db.ProjectBrand.update(insert, {
        where: {
          projectID: element.projectID,
          brandID: element.brandID,
          skuID: element.skuID,
          catID: element.catID,
          lineExtID: element.lineExtID,
        },
      });
    });
  } else {
    var update = {
      NewCostEndDate: formatDate(getProject.costEndDate),
      NewCostStartDate: formatDate(getProject.costStartDate),
      ChangeEndDate: formatDate(getProject.sellingEndDate),
      ChangeStartDate: formatDate(getProject.sellingStartDate),
      crDescription: getProject?.description,

      costEndDate: formatDate(req.body.costEndDate),
      costStartDate: formatDate(req.body.costStartDate),
      sellingEndDate: formatDate(req.body.sellingEndDate),
      sellingStartDate: formatDate(req.body.sellingStartDate),
      description: req.body.description,
      ChangeStatus: "pending",
      // status: "pending",
      ChangeRequestType: "date",
    };
    if (project) {
      update["status"] = "pending";
    }
    await db.Project.update(update, {
      where: {
        id: req.params.id ? req.params.id : 0,
      },
    });
  }
  var user = await db.User.findByPk(req.query.userID);

  const auditLog = {
    userID: user.id,
    projectID: getProject.id,
    message: "Requested for change request",
    userName: user.email.split("@")[0],
    projectName: getProject.name,
    chnageByadmin: null,
    actionBy: user.email.split("@")[0],
    comment: null,
  };
  Log.Auditlogs(auditLog, false);
  return returnResponse(200, true, "Change request successfully", res, data);
};
function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}
const ChangeRequestList = async (req, res) => {
  await db.Project.findAll({
    where: {
      userID: req.params.id,
      ChangeStatus: { [Op.ne]: null },
    },
    order: [["id", "DESC"]],
  })
    .then((data) => {
      return returnResponse(200, true, "Change Request List", res, data);
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};
const approverProjectList = async (req, res) => {
  const project = await db.DirectorAndReviewerApprover.findAll({
    where: {
      userID: req.params.id,
      status: "pending",
      isTurn: { [Op.ne]: null },
    },
    order: [["id", "DESC"]],
    include: [
      {
        model: db.User,
        as: "delegation",
      },
      {
        model: db.Project,
        where: {
          status: { [Op.ne]: "deleted" },
        },
        required: true,
        include: [
          {
            model: db.ProjectAreaDistrict,
            //include: [
            // {
            //   model: db.Channel,
            // },
            // {
            //   model: db.Aria,
            // },
            // {
            //   model: db.District,
            // },
            // {
            //   model: db.Project,
            // },
            // ],
          },
          {
            model: db.ProjectBrand,
            include: [
              {
                model: db.Project,
              },
              {
                model: db.Brand,
              },
              // {
              //   model: db.Category,
              // },
              // {
              //   model: db.PackType,
              // },
              // {
              //   model: db.SKU,
              // },
            ],
          },

          db.User,
        ],
      },
    ],
  });

  return returnResponse(
    200,
    true,
    "Project Approver Successfully.",
    res,
    project
  );
};
const runTimeApprovalStatus = async (req, res) => {
  console.log("ghjk");
  var project = await db.Project.findByPk(req.params.id);

  const ba = await checkProjectStatus(req.params.id, "ba");
  const checkBa = await db.DirectorAndReviewerApprover.findOne({
    where: {
      projectID: req.params.id,
      type: "ba",
    },
  });
  const genralApproval = await checkProjectStatus(
    req.params.id,
    "genral_maneger"
  );

  const directorApproval = await checkProjectStatus(req.params.id, "director");
  const financeApproval = await checkProjectStatus(
    req.params.id,
    "finance_director"
  );

  const checklevel3 = await db.DirectorAndReviewerApprover.findOne({
    where: {
      projectID: req.params.id,
      type: "level3",
    },
    // include: [
    //   {
    //     model: db.User,
    //     where: { status: "active" },
    //     include: [
    //       {
    //         model: db.role,
    //         as: "roleName",
    //       },
    //     ],
    //   },
    // ],
  });

  const checklevel4 = await db.DirectorAndReviewerApprover.findOne({
    where: {
      projectID: req.params.id,
      type: "level4",
    },
    // include: [
    //   {
    //     model: db.User,
    //     where: { status: "active" },
    //     include: [
    //       {
    //         model: db.role,
    //         as: "roleName",
    //       },
    //     ],
    //   },
    // ],
  });
  const checklevel5 = await db.DirectorAndReviewerApprover.findOne({
    where: {
      projectID: req.params.id,
      type: "level5",
    },
    // include: [
    //   {
    //     model: db.User,
    //     where: { status: "active" },
    //     include: [
    //       {
    //         model: db.role,
    //         as: "roleName",
    //       },
    //     ],
    //   },
    // ],
  });
  const checkreviewer = await db.DirectorAndReviewerApprover.findOne({
    where: {
      projectID: req.params.id,
      type: "reviewer",
    },
  });
  const cost_center = await checkProjectStatus(req.params.id, "cost_center");
  const check_cost_center = await db.DirectorAndReviewerApprover.findOne({
    where: {
      projectID: req.params.id,
      type: "cost_center",
    },
  });
  const check_director = await db.DirectorAndReviewerApprover.findOne({
    where: {
      projectID: req.params.id,
      type: "director",
    },
  });
  const check_finance = await db.DirectorAndReviewerApprover.findOne({
    where: {
      projectID: req.params.id,
      type: "finance_director",
    },
  });
  const check_genral_manager = await db.DirectorAndReviewerApprover.findOne({
    where: {
      projectID: req.params.id,
      type: "genral_maneger",
    },
  });
  const data = [];

  if (checkBa) {
    data.push({
      user: ba,
      role_name: "Business Analyst",
      approverDate: checkBa
        ? moment(checkBa.updatedAt).format("D-MMM-YY H:m")
        : "-",
    });
  }

  if (checkreviewer) {
    const reviewer = await checkProjectStatus(req.params.id, "reviewer");
    // console.log(reviewer);
    data.push({
      user: reviewer,
      role_name: "Reviewer",
      approverDate: moment(checkreviewer.updatedAt).format("D-MMM-YY H:m"),
    });
  }
  if (check_cost_center) {
    data.push({
      user: cost_center,
      role_name: "Cost Center Owner",
      approverDate: moment(check_cost_center.updatedAt).format("D-MMM-YY H:m"),
    });
  }

  if (checklevel5) {
    const level5 = await checkProjectStatus(req.params.id, "level5");
    // const level5 = await db.DirectorAndReviewerApprover.findOne({
    //   where: {
    //     projectID: req.params.id,
    //     type: "level5",
    //     status: { [Op.ne]: "pending" },
    //   },
    //   include: [
    //     {
    //       model: db.User,
    //       where: { status: "active" },
    //       include: [
    //         {
    //           model: db.role,
    //           as: "roleName",
    //         },
    //       ],
    //     },
    //   ],
    // });
    data.push({
      user: level5,
      role_name: checklevel5.role_name,
      approverDate: moment(checklevel5.updatedAt).format("D-MMM-YY H:m"),
    });
  }
  if (checklevel4) {
    const level4 = await checkProjectStatus(req.params.id, "level4");
    // const level4 = await db.DirectorAndReviewerApprover.findOne({
    //   where: {
    //     projectID: req.params.id,
    //     type: "level4",
    //     status: { [Op.ne]: "pending" },
    //   },
    // });
    data.push({
      user: level4,
      role_name: checklevel4.role_name,
      approverDate: moment(checklevel4.updatedAt).format("D-MMM-YY H:m"),
    });
  }
  if (checklevel3) {
    const level3 = await checkProjectStatus(req.params.id, "level3");
    // const level3 = await db.DirectorAndReviewerApprover.findOne({
    //   where: {
    //     projectID: req.params.id,
    //     type: "level3",
    //     status: { [Op.ne]: "pending" },
    //   },
    // });
    data.push({
      user: level3,
      role_name: checklevel3.role_name,
      approverDate: moment(checklevel3.updatedAt).format("D-MMM-YY H:m"),
    });
  }
  if (project.totalBudget > 25000) {
    if (project.CloserStatus) {
    }
    if (check_director) {
      data.push({
        user: directorApproval,
        role_name: check_director.role_name,
        approverDate: moment(check_director.updatedAt).format("D-MMM-YY H:m"),
      });
    }

    const commercial = await checkProjectStatus(
      req.params.id,
      "commercial_controller"
    );
    if (commercial) {
      const check_commercial = await db.DirectorAndReviewerApprover.findOne({
        where: {
          projectID: req.params.id,
          type: "commercial_controller",
        },
      });
      if (check_commercial) {
        data.push({
          user: commercial,
          role_name: "Commercial controller",
          check_commercial: moment(check_commercial.updatedAt).format(
            "D-MMM-YY H:m"
          ),
        });
      }
    }

    if (check_finance) {
      data.push({
        user: financeApproval,
        role_name: "Finance Director",
        approverDate: moment(check_finance.updatedAt).format("D-MMM-YY H:m"),
      });
    }
    if (project.totalBudget > 250000) {
      if (check_genral_manager) {
        data.push({
          user: genralApproval,
          role_name: "General Manager",
          approverDate: moment(check_genral_manager.updatedAt).format(
            "D-MMM-YY H:m"
          ),
        });
      }
    }
  }
  if (project.totalBudget <= 25000) {
    const commercial = await checkProjectStatus(
      req.params.id,
      "commercial_controller"
    );
    if (commercial) {
      const check_commercial = await db.DirectorAndReviewerApprover.findOne({
        where: {
          projectID: req.params.id,
          type: "commercial_controller",
        },
      });
      if (check_commercial) {
        data.push({
          user: commercial,
          role_name: "Commercial controller",
          check_commercial: moment(check_commercial.updatedAt).format(
            "D-MMM-YY H:m"
          ),
        });
      }
    }
  }
  return returnResponse(200, true, "Project Approver Successfully.", res, data);
};
async function checkProjectStatus(projectID, type) {
  const data = await db.DirectorAndReviewerApprover.findOne({
    where: {
      projectID: projectID,
      type: type,
      status: { [Op.ne]: "pending" },
    },
  });
  const pendingData = await db.DirectorAndReviewerApprover.findOne({
    where: {
      projectID: projectID,
      type: type,
      status: "pending",
    },
  });
  const pendingDatas = await db.DirectorAndReviewerApprover.findAll({
    where: {
      projectID: projectID,
      type: type,
    },
    include: [
      {
        model: db.User,
      },
      {
        model: db.User,
        as: "delegation",
      },
    ],
  });
  if (data || pendingData) {
    return pendingData ? pendingDatas : pendingDatas;
  }
  return "pending";
}
const cancelledProjectStatus = async (req, res) => {
  var getProject = await db.Project.findOne({
    where: { id: req.params.id },
  });

  if (getProject) {
    var getProject = await db.Project.update(
      { status: "cancelled", runTimeStatus: "Cancelled by Owner" },
      {
        where: {
          id: req.params.id,
          userID: req.query.userID,
        },
      }
    );
    var user = await db.User.findByPk(req.query.userID);
    var getProject = await db.Project.findByPk(req.params.id);
    const auditLog = {
      userID: req.query.userID,
      projectID: req.params.id,
      message:
        getProject.name +
        " has been cancelled by the Project Owner (" +
        user.email.split("@")[0] +
        ")",
      userName: user.email.split("@")[0],
      projectName: getProject.name,
      actionBy: user.email.split("@")[0],
      comment: null,
    };
    Log.Auditlogs(auditLog, true);
  }

  var data = [];
  return returnResponse(
    200,
    true,
    "Project Rejected Successfully.",
    res,
    getProject
  );
};

const checkApprovalUser = async (req, res) => {
  const nextApprovedUser = await db.DirectorAndReviewerApprover.findAll({
    where: {
      projectID: req.params.id,
      isTurn: "yes",
      status: "pending",
    },
    include: [
      {
        model: db.User,
      },
      {
        model: db.User,
        as: "delegation",
      },
    ],
  });
  return returnResponse(
    200,
    true,
    "Project listing Successfully.",
    res,
    nextApprovedUser
  );
};
const ClosedProjectStatus = async (req, res) => {
  var user = await db.User.findOne({
    where: {
      id: req.body.userID,
      role: { [Op.in]: ["sub_admin", "super_admin", "admin"] },
    },
  });
  var getProject = await db.Project.findOne({
    where: { id: req.params.id },
  });

  if (getProject && user) {
    var getProject = await db.Project.update(
      { status: "closed", runTimeStatus: req.body.comments },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    await db.DirectorAndReviewerApprover.update(
      { isTurn: "no" },
      {
        where: {
          projectID: req.params.id,
        },
      }
    );
    var user = await db.User.findByPk(req.body.userID);
    var getProject = await db.Project.findByPk(req.params.id);
    const auditLog = {
      userID: req.body.userID,
      projectID: getProject.id,
      message: getProject.name + " has been closed by the admin",
      userName: user.email.split("@")[0],
      projectName: getProject.name,
      actionBy: "Admin",
      comment: req.body.comments,
    };
    Log.Auditlogs(auditLog, true);
  }

  //
  var data = [];
  return returnResponse(
    200,
    true,
    "Project Closed Successfully.",
    res,
    getProject
  );
};

const getSequenceNumber = async (req, res) => {
  const sequence = await db.DirectorAndReviewerApprover.findOne({
    where: {
      projectID: req.params.id,
      userID: req.query.userID,
      isTurn: "yes",
      status: "pending",
    },
  });
  return returnResponse(
    200,
    true,
    "Approval Sequence Successfully.",
    res,
    sequence
  );
};
export {
  ClosedProjectStatus,
  checkApprovalUser,
  cancelledProjectStatus,
  runTimeApprovalStatus,
  GetBusinessTpe,
  approverProjectList,
  changeRequest,
  changeAprovalStatus,
  rejectApproveProject,
  projectReStatus,
  approvalProjectList,
  ChangeRequestList,
  getSequenceNumber,
};
