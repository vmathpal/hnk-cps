import db from "../models";
import { Op, where, Sequelize } from "sequelize";
var moment = require("moment");
import { SendEmail } from "../controllers/admin/emailController";
import * as Log from "../audit-log/auditLog";
export const RuntimeProjectStatus = async () => {
  const project = await db.Project.findAll({
    where: {
      status: { [Op.notIn]: ["draft", "deleted", "created", "closed"] },
      cronStatus: null,
    },
    limit: 50,
  });
  if (project.length == 0) {
    await db.Project.update(
      { cronStatus: null },
      {
        where: { cronStatus: "1" },
      }
    );
  }

  project.forEach(async (element) => {
    await db.Project.update(
      { cronStatus: "1" },
      {
        where: { id: element.id },
      }
    );
    await runtimeStatus(element.id);
  });
};

async function runtimeStatus(projectID) {
  var project = await db.Project.findByPk(projectID);

  const ba = await checkProjectStatus(projectID, "ba");
  const genralApproval = await checkProjectStatus(projectID, "genral_maneger");

  const directorApproval = await checkProjectStatus(projectID, "director");
  const financeApproval = await checkProjectStatus(
    projectID,
    "finance_director"
  );
  const checklevel3 = await db.DirectorAndReviewerApprover.findOne({
    where: {
      projectID: projectID,
      type: "level3",
    },
    include: [
      {
        model: db.User,
        where: { status: "active" },
        include: [
          {
            model: db.role,
            as: "roleName",
          },
        ],
      },
    ],
  });

  const checklevel4 = await db.DirectorAndReviewerApprover.findOne({
    where: {
      projectID: projectID,
      type: "level4",
    },
    include: [
      {
        model: db.User,
        where: { status: "active" },
        include: [
          {
            model: db.role,
            as: "roleName",
          },
        ],
      },
    ],
  });
  const checklevel5 = await db.DirectorAndReviewerApprover.findOne({
    where: {
      projectID: projectID,
      type: "level5",
    },
    include: [
      {
        model: db.User,
        where: { status: "active" },
        include: [
          {
            model: db.role,
            as: "roleName",
          },
        ],
      },
    ],
  });
  const checkreviewer = await db.DirectorAndReviewerApprover.findOne({
    where: {
      projectID: projectID,
      type: "reviewer",
    },
  });
  const cost_center = await checkProjectStatus(projectID, "cost_center");
  const check_cost_center = await db.DirectorAndReviewerApprover.findOne({
    where: {
      projectID: projectID,
      type: "cost_center",
    },
  });
  const check_director = await db.DirectorAndReviewerApprover.findOne({
    where: {
      projectID: projectID,
      type: "director",
    },
  });
  const check_finance = await db.DirectorAndReviewerApprover.findOne({
    where: {
      projectID: projectID,
      type: "finance_director",
    },
  });
  const check_genral_manager = await db.DirectorAndReviewerApprover.findOne({
    where: {
      projectID: projectID,
      type: "genral_maneger",
    },
  });
  const data = [];
  data.push({
    type: "ba",
    projectID: projectID,
    status: ba,
    role_name: "Business Analyst",
  });

  if (checkreviewer) {
    const reviewer = await checkProjectStatus(projectID, "reviewer");

    data.push({
      type: "reviewer",
      projectID: projectID,
      status: reviewer,
      role_name: "Reviewer",
    });
  }
  if (check_cost_center) {
    data.push({
      type: "cost_center",
      projectID: projectID,
      status: cost_center,
      role_name: "Cost Center Owner",
    });
  }

  if (checklevel5) {
    const level5 = await checkProjectStatus(projectID, "level5");

    data.push({
      type: "level5",
      projectID: projectID,
      status: level5,
      role_name: checklevel5.User.roleName.role,
    });
  }
  if (checklevel4) {
    const level4 = await checkProjectStatus(projectID, "level4");

    data.push({
      type: "level4",
      projectID: projectID,
      status: level4,
      role_name: checklevel4.User.roleName.role,
    });
  }
  if (checklevel3) {
    const level3 = await checkProjectStatus(projectID, "level3");

    data.push({
      type: "level3",
      projectID: projectID,
      status: level3,
      role_name: checklevel3.User.roleName.role,
    });
  }
  if (project.totalBudget > 25000) {
    if (check_director) {
      data.push({
        type: "director",
        projectID: projectID,
        status: directorApproval,
        role_name: "Director",
      });
    }
    if (check_finance) {
      data.push({
        type: "finance_director",
        projectID: projectID,
        status: financeApproval,
        role_name: "Finance Director",
      });
    }

    if (project.totalBudget > 250000) {
      if (check_genral_manager) {
        data.push({
          type: "genral_maneger",
          projectID: projectID,
          status: genralApproval,
          role_name: "General Manager",
        });
      }
    }
  } else {
    // const commercial = await checkProjectStatus(
    //   projectID,
    //   "commercial_controller"
    // );
    // const check_commercial = await db.DirectorAndReviewerApprover.findOne({
    //   where: {
    //     projectID: projectID,
    //     type: "commercial_controller",
    //   },
    // });
    // if (check_commercial) {
    //   data.push({
    //     type: "commercial_controller",
    //     projectID: projectID,
    //     status: commercial,
    //     role_name: "Commercial controller",
    //   });
    // }
  }

  const check_commercial = await db.DirectorAndReviewerApprover.findOne({
    where: {
      projectID: projectID,
      type: "commercial_controller",
    },
  });
  if (check_commercial) {
    const commercial = await checkProjectStatus(
      projectID,
      "commercial_controller"
    );
    data.push({
      type: "commercial_controller",
      projectID: projectID,
      status: commercial,
      role_name: "Commercial controller",
    });
  }
  data.forEach(async (element) => {
    const checkData = await db.ProjectRuntimeStatus.count({
      where: {
        type: element.type,
        projectID: element.projectID,
        status: element.status,
      },
    });
    // var count = await db.ProjectRuntimeStatus.count();

    if (!checkData || checkData > data.length || checkData == 0) {
      await db.ProjectRuntimeStatus.destroy({
        where: { projectID: element.projectID },
      }).then(async (num) => {
        await db.ProjectRuntimeStatus.bulkCreate(data);
      });
    }
  });
  return;
}

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
  if (data || pendingData) {
    return pendingData ? pendingData.status : data.status;
  }
  return "pending";
}

export const UpdateProjectStatus = async () => {
  const project = await db.Project.findAll({
    where: {
      status: { [Op.notIn]: ["draft", "deleted", "created", "closed"] },
      cronUpdateStatus: null,
    },
    limit: 10,
  });
  if (project.length == 0) {
    // console.log(">>>>>>>>", project.length);

    await db.Project.update(
      { cronUpdateStatus: null },
      {
        where: { cronUpdateStatus: "1" },
      }
    );
  }
  //console.log(">>>>>>>>", project.length);
  project.forEach(async (element) => {
    await db.Project.update(
      { cronUpdateStatus: "1" },
      {
        where: { id: element.id },
      }
    );
    if (
      element.runTimeStatus != "Closed by Admin" &&
      element.runTimeStatus != "Cancelled by Owner"
    ) {
      const checkApproved = await checApprovalStatus(element.id);

      const cancel = await db.ProjectRuntimeStatus.findOne({
        where: {
          projectID: element.id,
          status: { [Op.in]: ["rejected", "cancelled"] },
        },
      });
      const pending = await db.ProjectRuntimeStatus.findOne({
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
      const approvedBy = await db.ProjectRuntimeStatus.findOne({
        where: {
          projectID: element.id,
          status: "approved",
        },
        order: [["id", "DESC"]],
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
              runTimeStatus: "Approved By All Approver ",
            },
            {
              where: {
                id: checkApproved.projectID,
                CloserStatus: { [Op.ne]: null },
              },
            }
          );
        } else {
          await db.Project.update(
            {
              runTimeStatus: "Approved By All Approver ",
              status: "approved",
            },
            {
              where: {
                id: checkApproved.projectID,
              },
            }
          );

          await db.Project.update(
            {
              runTimeStatus: "Approved By All Approver ",
              ChangeStatus: "approved",
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
};

async function checApprovalStatus(projectID) {
  const checkPendingData = await db.ProjectRuntimeStatus.findOne({
    where: {
      projectID: projectID,
      status: { [Op.in]: ["pending", "rejected", "cancelled"] },
    },
  });

  const checkApproved = await db.ProjectRuntimeStatus.findOne({
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

export const ReminderEveryThreeDays = async () => {
  var project = await db.DirectorAndReviewerApprover.findAll({
    where: {
      status: "pending",
      isTurn: "yes",
    },
    include: [
      {
        model: db.Project,
        include: [
          {
            model: db.User,
          },
        ],
      },
      {
        model: db.User,
      },
    ],
  });
  // reminderDate
  project.forEach(async (element) => {
    var new_date;

    if (element.reminderDate) {
      new_date = moment(element.reminderDate, "DD-MM-YYYY").format("L");
    } else {
      new_date = moment(element.updatedAt, "DD-MM-YYYY")
        .add(3, "days")
        .format("L");
    }

    var now = moment(new Date(), "DD-MM-YYYY").format("L");

    if (now == new_date) {
      await db.DirectorAndReviewerApprover.update(
        {
          reminderDate: moment(new Date(), "DD-MM-YYYY")
            .add(3, "days")
            .format("L"),
        },
        {
          where: { id: element.id },
        }
      );
      let user_data = {
        name: element.User.name,
        email: element.User.email,
        type: element.type,
        project_name: element.Project.name,
        project_id: element.Project.id,
        department: element.Project.department,
        project_type: element.Project.projectType,
        cost_start_date: moment(element.Project.costStartDate).format(
          "dddd, MMMM Do YYYY"
        ),
        cost_end_date: moment(element.Project.costEndDate).format(
          "dddd, MMMM Do YYYY"
        ),
        selling_start_date: moment(element.Project.sellingStartDate).format(
          "dddd, MMMM Do YYYY"
        ),
        selling_end_date: moment(element.Project.sellingEndDate).format(
          "dddd, MMMM Do YYYY"
        ),
        project_volume: element.Project.projectVolume,
        remark: element.Project.remark,
        url: process.env.WEB_URL,
      };

      // SendEmail(user_data, "PROJECT_APPROVAL_REQUEST");
    }
  });
};

export const checkAssignUSer = async () => {
  const userIDs = await db.User.findAll({
    where: {
      assignUserID: { [Op.ne]: null },
      //assignEndDate: { [Op.lte]: moment().format("D-MMM-YY H:m") },
    },
  });
  userIDs.forEach(async (element) => {
    //console.log(element.id,element.assignUserID);
    const projectIDs = await db.DirectorAndReviewerApprover.update(
      { userID: element.assignUserID },
      {
        where: { status: "pending", userID: element.id },
      }
    );
  });
};

export const reAssignOwner = async () => {
  const userIDs = await db.User.findAll({
    where: {
      assignEndDate: { [Op.lt]: moment().format("D-MMM-YY") },
      delegationUserID: { [Op.ne]: null },
    },
    include: [
      {
        model: db.User,
        as: "delegation",
      },
    ],
  });

  userIDs.forEach(async (element) => {
    await db.DirectorAndReviewerApprover.update(
      {
        delegationUserID: null,
        userID: element.id,
        delegationRoll: null,
      },
      {
        where: {
          delegationUserID: element.id,
          status: "pending",
        },
      }
    );

    await db.User.update(
      {
        delegationUserID: null,
      },
      {
        where: { id: element.id },
      }
    );
    const auditLog = {
      //userID: id,
      message: `Delegation period has been expired.`,
      // userName: user.email.split("@")[0],
      projectName: "N/A",
      actionBy: "Schedular",
      comment: null,
      isAuditLog: "true",
      createdAt: moment().format("YYYY-MM-DD H:m"),
      delegatedUser: element.delegation?.email.split("@")[0],
      user: element.email.split("@")[0],
      startDate: moment(new Date(element.assignStartDate)).format(
        "D-MMM-YY H:m"
      ),
      endDate: moment(new Date(element.assignEndDate)).format("D-MMM-YY H:m"),
    };
    Log.Auditlogs(auditLog, false);
  });
};

export const AssignDelegatedUser = async () => {
  const userIDs = await db.User.findAll({
    where: {
      assignStartDate: { [Op.lte]: moment().format("YYYY-MM-DD") },
      assignEndDate: { [Op.gte]: moment().format("YYYY-MM-DD") },
      delegationUserID: { [Op.ne]: null },
    },
    include: [
      {
        model: db.role,
        as: "roleName",
      },
    ],
  });

  userIDs.forEach(async (element) => {
    await db.DirectorAndReviewerApprover.update(
      {
        delegationUserID: element.id,
        userID: element.delegationUserID,
        delegationRoll: element.roleName?.role,
      },
      {
        where: {
          userID: element.id,
          status: "pending",
        },
      }
    );
  });
  console.log("ok", moment().format("YYYY-MM-DD HH:mm A"));
};
