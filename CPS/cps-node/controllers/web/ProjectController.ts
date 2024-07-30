import db from "../../models";
import { Op, where, Sequelize, DOUBLE } from "sequelize";
import { returnResponse, projectFLow, uploadImage } from "../../helper/helper";
import fs from "fs";
import { nextTick } from "process";
import { SendEmail } from "../admin/emailController";
import * as project from "./ProjectFilter";
import * as Filter from "./getProjectFilter";
import * as projectCalculation from "../web/ProjectCalculation";
import * as Log from "../../audit-log/auditLog";
import { userInfo } from "os";
import path from "path";

var moment = require("moment");
const basicInformation = async (req, res) => {
  // console.log(formatDate("Sun May 11,2014"));
  req.body.status = req.query.status == "created" ? "draft" : req.query.status;
  let userId = req.query.userID;
  req.body.userID = userId;

  var checkProject = await db.Project.findOne({
    where: {
      [Op.or]: [
        // { userID: userId, status: { [Op.eq]: "created" } },
        { id: req.query.projectID ? req.query.projectID : 0 },
      ],
    },
  });
  req.body.costStartDate = req.body.costStartDate
    ? formatDate(req.body.costStartDate)
    : formatDate(checkProject.costStartDate);

  req.body.costEndDate = req.body.costEndDate
    ? formatDate(req.body.costEndDate)
    : formatDate(checkProject.costEndDate);

  // req.body.costEndDay = req.body.costEndDay
  //   ? formatDate(req.body.costEndDay)
  //   : formatDate(checkProject.costEndDay);

  req.body.sellingEndDate = req.body.sellingEndDate
    ? formatDate(req.body.sellingEndDate)
    : formatDate(checkProject.sellingEndDate);

  req.body.sellingStartDate = req.body.sellingStartDate
    ? formatDate(req.body.sellingStartDate)
    : formatDate(checkProject.sellingStartDate);

  if (checkProject && checkProject.id) {
    if (checkProject) {
      req.body.promotionDiscount = req.body.promotionDiscount
        ? req.body.promotionDiscount.toString()
        : req.body.promotionDiscount;
      if (req.body.businessType) {
        // var getProject = await db.Project.findOne({
        //   where: {
        //     userID: req.query.userID,
        //     status: "created",
        //   },
        // });
        var projectID = req.query.projectID ? req.query.projectID : "";
        if (projectID) {
          await db.ProjectBusinessesType.destroy({
            where: { projectID: projectID },
          });

          req.body.businessType.forEach(async (element) => {
            await db.ProjectBusinessesType.create({
              projectID: projectID,
              businessID: element,
            });
          });
        }

        req.body.businessType = req.body.businessType.toString();
      }

      await db.Project.update(req.body, {
        where: {
          id: req.query.projectID ? req.query.projectID : "",
        },
        individualHooks: true,
      });
    }

    return returnResponse(
      200,
      true,
      "Project Basic Info Updated Successfully",
      res,
      checkProject
    );
  } else {
    // console.log(req.body);
    if (req.body.businessType) {
      req.body.businessType = req.body.businessType.toString();

      req.body.ChangeRequestType = "amount";
      req.body.promotionDiscount = req.body.promotionDiscount
        ? req.body.promotionDiscount.toString()
        : req.body.promotionDiscount;
      req.body.status = "draft";
      req.body.created_by = req.body.userID;
      //new
      /** */
      /** 
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

      checkProject = await db.Project.create(req.body);
      await db.Project.update(
        { projectNumber: projectNumber },
        {
          where: {
            id: checkProject.id,
          },
        }
      );
*/
      checkProject = await db.Project.create(req.body);
      req.body.businessType.split(",").forEach(async (element) => {
        await db.ProjectBusinessesType.create({
          projectID: checkProject.id ? checkProject.id : 0,
          businessID: element,
        });
      });
      var user = await db.User.findByPk(userId);
      const auditLog = {
        userID: userId,
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
      return returnResponse(
        200,
        true,
        "Project and district create Successfully",
        res,
        checkProject
      );
    } else {
      return returnResponse(426, false, "businessType is required!", res, []);
    }
  }
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
const saveDraft = async (req, res) => {
  req.body.status = req.query.status ? req.query.status : "draft";

  if (!Number.isInteger(parseInt(req.params.id))) {
    return returnResponse(
      422,
      "true",
      "Please fill the basic information",
      res,
      ""
    );
  }

  var checkProject = await db.Project.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (checkProject) {
    await db.Project.update(
      { status: req.body.status },
      {
        where: {
          id: req.params.id,
        },
      }
    );
  } else {
    return returnResponse(
      422,
      "true",
      "Please fill the basic information",
      res,
      ""
    );
  }
  return returnResponse(200, true, "Details saved as draft", res, checkProject);
};
const showAreaDistrict = async (req, res) => {
  // console.log(req.params.id);
  const projectArea = await db.ProjectAreaDistrict.findByPk(req.params.id, {
    include: [
      {
        model: db.Channel,
      },
      {
        model: db.Aria,
      },
      {
        model: db.District,
      },
      {
        model: db.Project,
      },
    ],
  });
  return returnResponse(
    200,
    true,
    "Project and district Created Successfully",
    res,
    projectArea
  );
};
const areaDistrict = async (req, res) => {
  var checkProject = await db.Project.findOne({
    where: {
      [Op.or]: [
        // { userID: req.query.userID, status: { [Op.eq]: "created" } },
        { id: req.query.projectID ? req.query.projectID : 0 },
      ],
    },
  });
  // console.log(checkProject);
  if (checkProject && checkProject.id) {
    req.body.projectID = checkProject.id;
  } else {
    // var checkProject = await db.Project.create({
    //   userID: req.query.userID,
    //   status: "created",
    // });
    // req.body.projectID = checkProject.id;
  }
  // console.log(req.body);
  const projectAndDistrict = await db.ProjectAreaDistrict.create(req.body);
  // const projectAndDistrict = await db.ProjectAreaDistrict.create(req.body);
  const projectArea = await db.ProjectAreaDistrict.findAll({
    where: {
      projectID: projectAndDistrict.projectID,
    },
    include: [
      {
        model: db.Channel,
      },
      {
        model: db.Aria,
      },
      {
        model: db.District,
      },
      {
        model: db.Project,
      },
    ],
  });
  return returnResponse(
    200,
    true,
    "Project and district Created Successfully",
    res,
    projectArea
  );
};

const updateAreaDistrict = async (req, res) => {
  const projectAndDistrict = await db.ProjectAreaDistrict.update(req.body, {
    where: { id: req.params.id },
  })
    .then((num) => {
      if (num == 1) {
        const data = db.ProjectAreaDistrict.findAll({
          where: {
            projectID: 1,
          },
          include: [
            {
              model: db.Channel,
            },
            {
              model: db.Aria,
            },
            {
              model: db.District,
            },
            {
              model: db.Project,
            },
          ],
        });
        return returnResponse(
          200,
          true,
          "Project and district Updated Successfully",
          res,
          data
        );
      } else {
        return returnResponse(422, false, "Error", res, "");
      }
    })
    .catch((err) => {
      return returnResponse(422, true, err.message, res, "");
    });
};

const deleteAreaDistrict = async (req, res) => {
  const projectAndDistrict = await db.ProjectAreaDistrict.destroy({
    where: { id: req.params.id },
  })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, true, "Deleted Successfully", res, "");
      } else {
        return returnResponse(
          422,
          "true",
          `Something went wrong!Can't delete Student with id=${req.params.id}.`,
          res,
          ""
        );
      }
    })
    .catch((err) => {
      return returnResponse(422, true, err, res, "");
    });
};

const chooseBrand = async (req, res) => {
  var checkProject = await db.Project.findOne({
    where: {
      [Op.or]: [
        // { userID: req.query.userID, status: { [Op.eq]: "created" } },
        { id: req.query.projectID ? req.query.projectID : "" },
      ],
    },
  });

  if (checkProject && checkProject.id) {
    req.body.projectID = checkProject.id;
  } else {
    // var checkProject = await db.Project.create({
    //   userID: req.query.userID,
    //   status: "created",
    // });
    req.body.projectID = checkProject.id;
  }
  const brand = await db.ProjectBrand.findAll({
    where: {
      projectID: req.body.projectID,
    },
    include: [
      {
        model: db.Project,
      },
      {
        model: db.Brand,
      },
      {
        model: db.Category,
      },
      {
        model: db.PackType,
      },
      {
        model: db.SKU,
      },
      {
        model: db.lineExtension,
      },
    ],
  });

  const ProjectBrands = await db.ProjectBrand.create(req.body)

    .then((num) => {
      return returnResponse(
        200,
        true,
        "Brand Created Successfully",
        res,
        brand
      );
    })
    .catch((err) => {
      return returnResponse(422, true, err.message, res, ProjectBrands);
    });
};

const updateChooseBrand = async (req, res) => {
  const projectAndDistrict = await db.ProjectBrand.update(req.body, {
    where: { id: req.params.id },
  })
    .then((num) => {
      if (num == 1) {
      } else {
        return returnResponse(401, false, "Error", res, "");
      }
    })
    .catch((err) => {
      return returnResponse(422, true, err.message, res, "");
    });
  await db.ProjectExpense.destroy({
    where: { projectID: req.query.projectID },
  });
  const projectBrand = await db.ProjectBrand.findByPk(req.params.id);

  return returnResponse(
    200,
    true,
    "Brand Updated Successfully",
    res,
    projectBrand
  );
};

const deleteChooseBrand = async (req, res) => {
  const projectAndDistrict = await db.ProjectBrand.destroy({
    where: { id: req.params.id },
  })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, true, "Deleted Successfully", res, "");
      } else {
        return returnResponse(
          422,
          "true",
          `Something went wrong!Can't delete Student with id=${req.params.id}.`,
          res,
          ""
        );
      }
    })
    .catch((err) => {
      return returnResponse(422, true, err, res, "");
    });
};
const showChooseBrand = async (req, res) => {
  const brand = await db.ProjectBrand.findByPk(req.params.id, {
    include: [
      {
        model: db.Project,
      },
      {
        model: db.Brand,
      },
      {
        model: db.Category,
      },
      {
        model: db.PackType,
      },
      {
        model: db.SKU,
      },
      {
        model: db.lineExtension,
      },
    ],
  });
  return returnResponse(
    200,
    true,
    "Project and district Created Successfully",
    res,
    brand
  );
};

// const projectFileUploads = async (req, res) => {
//   await uploadImage(req.files.image, function (data) {
//     req.body.file = data;
//     req.body.projectID = req.params.id;

//     const ProjectBrands = db.ProjectFile.create(req.body);
//     return returnResponse(
//       200,
//       true,
//       "File uploaded successfully",
//       res,
//       ProjectBrands
//     );
//   });
// };

const deleteFile = async (req, res) => {
  const ghjkl = await db.ProjectFile.findByPk(req.params.id);
  // console.log(">>>>DDD", req.params.id);
  await db.ProjectFile.destroy({
    where: { id: req.params.id },
  })
    .then((num) => {
      if (num == 1) {
        // var filePath = "../../MulterConfig/uploads/" + ghjkl.file;
        // fs.unlinkSync(filePath);
        return returnResponse(200, true, "Deleted Successfully", res, "");
      } else {
        return returnResponse(
          422,
          "true",
          `File not found id=${req.params.id}.`,
          res,
          ""
        );
      }
    })
    .catch((err) => {
      return returnResponse(422, true, err, res, "");
    });
};

const areaDistrictList = async (req, res) => {
  await db.ProjectAreaDistrict.findAll({
    where: {
      projectID: req.params.id,
    },
    include: [
      {
        model: db.Channel,
      },
      {
        model: db.Aria,
      },
      {
        model: db.District,
      },
      {
        model: db.Project,
      },
    ],
  })
    .then((data) => {
      return returnResponse(
        200,
        true,
        "Project and district List Render Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(422, true, err.message, res, "");
    });
};
const BrandSkuPackTypeList = async (req, res) => {
  let userId = req.query.userID;
  // var checkProject;
  // if (req.params.id === "created") {
  //   checkProject = await db.Project.findOne({
  //     where: {
  //       userID: userId,
  //       status: { [Op.eq]: "created" },
  //     },
  //   });
  // }
  var condition;
  if (Number.isInteger(parseInt(req.params.id))) {
    condition = req.params.id;
  } else {
    condition = 0;
  }

  var project = await db.ProjectBrand.findAll({
    where: {
      projectID: condition,
    },
    include: [
      {
        model: db.Project,
      },
      {
        model: db.Brand,
      },
      {
        model: db.Category,
      },
      {
        model: db.PackType,
      },
      {
        model: db.SKU,
      },
      {
        model: db.lineExtension,
      },
    ],
  });

  var projectEx = await projectCalculation.getBrandSkus(req, project);
  // const projectEx = await db.Project.findByPk(req.params.id, {});
  return returnResponse(
    200,
    true,
    "Project expense show Successfully",
    res,
    projectEx
  );
};

const createProjectExpenses = async (req, res) => {
  var data = {
    brandID: req.body.brandID,
    lineExtID: req.body.lineExtID ? req.body.lineExtID : null,
    costCenterID: req.body.costCenterID ? req.body.costCenterID : null,
    expenseID: req.body.expenseID,
    lastProject: req.body.lastProject ? req.body.lastProject : null,
    budget: req.body.budget,
    projectID: req.body.projectID,
  };

  const projectEx = await db.ProjectExpense.create(data);

  return returnResponse(
    200,
    true,
    "Project Expenses Added Successfully",
    res,
    projectEx
  );
};

const showProjectExpenses = async (req, res) => {
  const projectEx = await db.ProjectExpense.findByPk(req.params.id, {
    include: [
      {
        model: db.Project,
      },
      {
        model: db.Brand,
      },
      {
        model: db.CostCenter,
      },
      {
        model: db.Expense,
      },
      {
        model: db.lineExtension,
      },
    ],
  });
  return returnResponse(
    200,
    true,
    "Project expense show Successfully",
    res,
    projectEx
  );
};

const updateProjectExpenses = async (req, res) => {
  var data = {
    brandID: req.body.brandID,
    lineExtID: req.body.lineExtID ? req.body.lineExtID : null,
    costCenterID: req.body.costCenterID ? req.body.costCenterID : null,
    expenseID: req.body.expenseID,
    lastProject: req.body.lastProject ? req.body.lastProject : null,
    budget: req.body.budget,
    projectID: req.body.projectID,
  };

  const projectAndDistrict = await db.ProjectExpense.update(data, {
    where: { id: req.params.id },
  })
    .then((num) => {
      if (num == 1) {
      } else {
        return returnResponse(401, false, "Error", res, "");
      }
    })
    .catch((err) => {
      return returnResponse(422, true, err.message, res, "");
    });
  const projectDistr = await db.ProjectExpense.findByPk(req.params.id);
  return returnResponse(
    200,
    true,
    "Brand Updated Successfully",
    res,
    projectDistr
  );
};
const projectList = async (req, res) => {
  var condition = {};
  if (Number.isInteger(parseInt(req.params.id))) {
    condition = { id: req.params.id };
  } else {
    condition = { id: 0 };
  }
  const project = await db.Project.findOne({
    where: {
      [Op.or]: [condition],
    },
    include: [
      {
        model: db.ProjectAreaDistrict,
        include: [
          {
            model: db.Channel,
          },
          {
            model: db.Aria,
          },
          {
            model: db.District,
          },
          {
            model: db.Project,
          },
        ],
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
          {
            model: db.Category,
          },
          {
            model: db.PackType,
          },
          {
            model: db.SKU,
          },
        ],
      },
      {
        model: db.ProjectBusinessesType,
        include: [db.BusinessType],
      },
      db.ProjectExpense,
      db.ProjectFile,
      db.User,
    ],
  });
  // var projectEx = await projectCalculation.getCalcutaion(req, project);
  // const projectEx = await db.Project.findByPk(req.params.id, {});
  return returnResponse(
    200,
    true,
    "Project expense show Successfully",
    res,
    project
  );
};

const deleteProjectExpenses = async (req, res) => {
  const projectAndDistrict = await db.ProjectExpense.destroy({
    where: { id: req.params.id },
  })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, true, "Deleted Successfully", res, "");
      } else {
        return returnResponse(
          422,
          "true",
          `Something went wrong!Can't delete project expense with id=${req.params.id}.`,
          res,
          ""
        );
      }
    })
    .catch((err) => {
      return returnResponse(422, true, err, res, "");
    });
};

const fileList = async (req, res) => {
  const file = await db.ProjectFile.findAll({
    where: {
      projectID: req.params.id,
      fileType: req.query.fileType,
    },
    include: [db.Project],
  });
  // console.log(file);
  return returnResponse(
    200,
    true,
    "Project expense show Successfully",
    res,
    file
  );
};

const allProjects = async (req, res) => {
  const filter = await project.getFilter(req);
  const projectExs = await db.Project.findAll({
    where: filter,
    order: [["id", "DESC"]],
    include: [
      // {
      //   model: db.ProjectAreaDistrict,
      //   include: [
      //     {
      //       model: db.Channel,
      //     },
      //     {
      //       model: db.Aria,
      //     },
      //     {
      //       model: db.District,
      //     },
      //     {
      //       model: db.Project,
      //     },
      //   ],
      // },
      // {
      //   model: db.ProjectBrand,
      //   include: [
      //     {
      //       model: db.Project,
      //     },
      //     {
      //       model: db.Brand,
      //     },
      //     {
      //       model: db.Category,
      //     },
      //     {
      //       model: db.PackType,
      //     },
      //     {
      //       model: db.SKU,
      //     },
      //   ],
      // },
      {
        model: db.DirectorAndReviewerApprover,
        as: "approverComment",
        where: {
          comment: { [Op.ne]: null },
        },
        order: [["sequence", "DESC"]],
        limit: 1,
        required: false,
      },
      db.User,
      // db.ProjectExpense,
      db.ProjectFile,
    ],
  });

  return returnResponse(
    200,
    true,
    "Project expense show Successfully",
    res,
    projectExs
  );
};

const allProjectsPending = async (req, res) => {
  var statuses = {};
  var caseUserID = {};
  if (req.query.search) {
    statuses = {};
  }
  caseUserID = req.query.userID
    ? { [Op.eq]: req.query.userID }
    : { [Op.ne]: null };

  const projectExs = await db.Project.findAll({
    // attributes: [[Sequelize.fn("SUM", Sequelize.col("id")), "cfghjkid"]],

    where: {
      [Op.or]: [
        statuses,
        {
          id: { [Op.like]: "%" + req.query.search + "%" },
          status: {
            [Op.in]: ["pending", "completed"],
          },
          userID: caseUserID,
        },
        {
          name: { [Op.like]: "%" + req.query.search + "%" },
          status: {
            [Op.in]: ["pending", "completed"],
          },
          userID: caseUserID,
        },
        {
          department: { [Op.like]: "%" + req.query.search + "%" },
          status: {
            [Op.in]: ["pending", "completed"],
          },
          userID: caseUserID,
        },
      ],
      // userID: req.query.role === "user" ? req.query.userID : "",
    },
    order: [["id", "DESC"]],
    include: [
      {
        model: db.ProjectAreaDistrict,
        include: [
          {
            model: db.Channel,
          },
          {
            model: db.Aria,
          },
          {
            model: db.District,
          },
          {
            model: db.Project,
          },
        ],
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
          {
            model: db.Category,
          },
          {
            model: db.PackType,
          },
          {
            model: db.SKU,
          },
        ],
      },
      db.User,
      db.ProjectExpense,
      db.ProjectFile,
    ],
  });

  return returnResponse(
    200,
    true,
    "Project expense show Successfully",
    res,
    projectExs
  );
};
const BrandExpenseList = async (req, res) => {
  await db.ProjectExpense.findAll({
    where: {
      projectID: req.params.id,
    },
    include: [
      {
        model: db.Project,
      },
      {
        model: db.Brand,
      },
      {
        model: db.CostCenter,
      },
      {
        model: db.lineExtension,
      },
      {
        model: db.Expense,
      },
    ],
  })
    .then((data) => {
      return returnResponse(
        200,
        true,
        "Project Expenses List Render Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(422, true, err.message, res, "");
    });
};
const projectsBudget = async (req, res) => {
  var data = req.body;
  var amount = 0;
  if (req.query.amount && req.query.projectID) {
    await db.Project.update(
      { totalBudget: req.query.amount },
      {
        where: {
          id: req.query.projectID ? req.query.projectID : 0,
        },
      }
    );
  }
  await data.forEach(async (element) => {
    var insert = {
      budgetRef: element.budgetRef,
      allocationPercent: element.allocationPercent,
      allocation: element.allocation,
      budgetAmount: element.budgetAmount,
      fy: element.fy,
    };
    amount = parseFloat(amount + element.allocation);
    const project_id = req.params.id > 0 ? req.params.id : element.projectID;
    await db.Project.update(
      { totoalBudget: amount },
      {
        where: { id: project_id },
      }
    );

    await db.ProjectBrand.update(insert, {
      where: {
        projectID: project_id,
        brandID: element.brandID,
        skuID: element.skuID,
        // catID: element.catID,
        lineExtID: element.lineExtID,
        pack_type: element.pack_type,
      },
    });
  });

  return returnResponse(
    200,
    true,
    "Project Budget Updated Successfully",
    res,
    data
  );
};

const projectsFinancial = async (req, res) => {
  var data = req.body;

  data.forEach(async (element) => {
    var insert = {
      othContributeBudget:
        element.othContributeBudget != undefined
          ? element.othContributeBudget
          : null,
      othContributeLastBudget:
        element.othContributeLastBudget != undefined
          ? element.othContributeLastBudget
          : null,
      contributeBudget:
        element.contributeBudget != undefined ? element.contributeBudget : null,
      contributeLastBudget:
        element.contributeLastBudget != undefined
          ? element.contributeLastBudget
          : null,
      volumeWithBudget:
        element.volumeWithBudget != undefined ? element.volumeWithBudget : null,
      volumeWithLastBudget:
        element.volumeWithLastBudget != undefined
          ? element.volumeWithLastBudget
          : null,
      volumeWithoutBudget:
        element.volumeWithoutBudget != undefined
          ? element.volumeWithoutBudget
          : null,
      volumeWithoutLastBudget: element.volumeWithoutLastBudget
        ? element.volumeWithoutLastBudget
        : null,
      lastProjectVolumeInc:
        element.lastProjectVolumeInc != undefined
          ? element.lastProjectVolumeInc
          : null,
      budgetVolumeIncrease:
        element.budgetVolumeIncrease != undefined
          ? element.budgetVolumeIncrease
          : null,
      lastProjectTotalIncrement:
        element.lastProjectTotalIncrement != undefined
          ? element.lastProjectTotalIncrement
          : null,
      budgetProjectTotalIncrement:
        element.budgetProjectTotalIncrement != undefined
          ? element.budgetProjectTotalIncrement
          : null,
      totalLastOthContribute:
        element.totalLastOthContribute != undefined
          ? element.totalLastOthContribute
          : null,
      totalBudgetOthContribute:
        element.totalBudgetOthContribute != undefined
          ? element.totalBudgetOthContribute
          : null,
    };

    await db.ProjectBrand.update(insert, {
      where: {
        projectID: req.params.id,
        brandID: element.brandID,
        lineExtID: element.lineExtID,
        skuID: element.skuID,
        pack_type: element.pack_type,
      },
    });
  });

  return returnResponse(
    200,
    true,
    "Project Budget financial Successfully",
    res,
    data
  );
};

const projectsReviewers = async (req, res) => {
  var data = req.body.userID;
  var expense = await db.ProjectExpense.findAll({
    where: {
      projectID: req.params.id,
    },
    include: [db.CostCenterUser],
  }).then((project) =>
    project.map((pro, key) =>
      pro.CostCenterUsers
        ? pro.CostCenterUsers[key]
          ? pro.CostCenterUsers[key].userID
          : 0
        : 0
    )
  );
  // var CostCenterUser = expense.then((project) => project.map((pro) => pro));

  const intersection = data.filter((element) => expense.includes(element));
  console.log(expense, data);
  if (intersection.length) {
    var user = await db.User.findOne({
      where: {
        id: { [Op.in]: intersection },
      },
    });
    return returnResponse(
      423,
      false,
      "This " +
        user.email.split("@")[0] +
        " reviewer already in Approval route.!",
      res,
      {}
    );
  }
  const projectAndDistrict = await db.ProjectReviewers.destroy({
    where: { projectID: parseInt(req.params.id) },
  });

  var project = await db.Project.update(
    { status: req.query.status },
    {
      where: { id: req.query.projectID },
    }
  );
  var user = await db.User.findByPk(req.query.userID);
  var project = await db.Project.findByPk(req.query.projectID);
  const auditLog = {
    userID: req.query.userID,
    projectID: project.id,
    message:
      user.email.split("@")[0] +
      " has been submitted " +
      project.name +
      " project",
    userName: user.email.split("@")[0],
    projectName: project.name,
    chnageByadmin: null,
    actionBy: user.email.split("@")[0],
    comment: null,
  };
  Log.Auditlogs(auditLog, false);

  data.forEach(async (element) => {
    var insert = {
      projectID: req.params.id,
      userID: element,
    };

    await db.ProjectReviewers.create(insert);
  });
  return returnResponse(200, true, "Project Reviewers Successfully", res, data);
};
const totalFinancialProjects = async (req, res) => {
  req.body.projectID = req.params.id;
  const project = await db.ProjectTotalProfit.create(req.body);
  return returnResponse(
    200,
    true,
    "Project Reviewers Successfully",
    res,
    project
  );
};
const reviewersList = async (req, res) => {
  // let userId = req.query.userID ? req.query.userID : 2;
  // await projectFLow(req, res);

  const userID = req.query.userID
    ? req.query.userID.split(",")
    : req.query.userId.split(",");

  const Level3UserID = req.query.Level3UserID
    ? req.query.Level3UserID.split(",")
    : req.query.userId.split(",");

  const Level4UserID = req.query.Level4UserID
    ? req.query.Level4UserID.split(",")
    : req.query.userId.split(",");
  const Level5UserID = req.query.Level5UserID
    ? req.query.Level5UserID.split(",")
    : req.query.userId.split(",");
  const costCenterUserID = req.query.costCenterUserID
    ? req.query.costCenterUserID.split(",")
    : req.query.userId.split(",");
  const merged = [
    ...Level3UserID,
    ...Level4UserID,
    ...Level5UserID,
    ...userID,
    ...costCenterUserID,
  ];

  var User = await db.User.findAll({
    where: {
      role: { [Op.notIn]: ["super_admin", "sub_admin"] },
      level: { [Op.notIn]: ["level2", "level1"] },
      id: { [Op.notIn]: merged },
      isBA: { [Op.eq]: null },
      status: { [Op.eq]: "active" },
    },
  });
  return returnResponse(
    200,
    true,
    "Project Reviewers Successfully.",
    res,
    User
  );
};

const EditReviewersList = async (req, res) => {
  // await projectFLow(req, res);
  var User = await db.ProjectReviewers.findAll({
    where: {
      projectID: req.params.id,
    },
    include: [
      {
        model: db.User,
      },
    ],
  });
  return returnResponse(
    200,
    true,
    "Project Reviewers Successfully.",
    res,
    User
  );
};

const SelectedBaList = async (req, res) => {
  var User = await db.DirectorAndReviewerApprover.findAll({
    where: {
      projectID: req.params.id,
      type: "ba",
    },
    include: [
      {
        model: db.User,
        include: [
          {
            model: db.BusinessAnalyst,
          },
        ],
      },
      {
        model: db.User,
        as: "delegation",
        include: [
          {
            model: db.BusinessAnalyst,
          },
        ],
      },
    ],
  });
  return returnResponse(
    200,
    true,
    "Project BA Approver Successfully.",
    res,
    User
  );
};

const approverList = async (req, res) => {
  var User = await db.User.findOne({
    where: {
      id: req.query.userID,
    },
  });
  var getParent = [];
  if (User.level) {
    const getLevelId = User.level.replace("level", "");
    if (getLevelId > 5) {
      getParent = await db.level5And6Mapping.findOne({
        where: {
          roleLevel6: User.dept_roleId,
        },
        include: [
          {
            model: db.level4And5Mapping,
            include: [
              {
                model: db.level3And4Mapping,
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
                    required: false,
                  },
                ],
                required: false,
              },
              {
                model: db.User,
                where: { status: "active" },
                include: [
                  {
                    model: db.role,
                    as: "roleName",
                  },
                ],
                required: false,
              },
            ],
          },
          {
            model: db.User,
            where: { status: "active" },
            include: [
              {
                model: db.role,
                as: "roleName",
              },
            ],
            required: false,
          },
        ],
      });
    } else if (getLevelId > 4) {
      getParent = await db.level4And5Mapping.findOne({
        where: {
          roleLevel5: User.dept_roleId,
        },
        include: [
          {
            model: db.level3And4Mapping,
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
                required: false,
              },
            ],
          },
          {
            model: db.User,
            where: { status: "active" },
            include: [
              {
                model: db.role,
                as: "roleName",
              },
            ],
            required: false,
          },
        ],
      });
    } else if (getLevelId > 3) {
      getParent = await db.level3And4Mapping.findOne({
        where: {
          roleLevel4: User.dept_roleId,
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
            required: false,
          },
        ],
      });
    }
  }

  return returnResponse(
    200,
    true,
    "Project Approver Successfully.",
    res,
    getParent
  );
};
const saveGmDirectorReviewers = async (req, res) => {
  var checkCommercial = 1;
  const ghj = await db.DirectorAndReviewerApprover.destroy({
    where: {
      projectID: { [Op.eq]: req.query.projectID },
    },
  });
  var project = await db.Project.findByPk(req.query.projectID);
  if (project.ChangeRequestType != "date") {
    if (project.totalBudget > 25000) {
      if (req.body.DirectorUserID) {
        const DirectorUserID = req.body.DirectorUserID.split(",");
        DirectorUserID.forEach(async (element) => {
          const DirectorInsert = {
            projectID: req.query.projectID,
            userID: element,
            type: "director",
            status: "pending",
            sequence: "7",
            role_name:
              req.query.department == "marketing"
                ? "Marketing Director"
                : "Sales Director",
          };

          await db.DirectorAndReviewerApprover.create(DirectorInsert);
        });
      }
      if (checkCommercial) {
        const role = await db.role.findOne({
          where: { role: "Commercial Controller" },
          include: [{ model: db.User, where: { status: "active" } }],
        });
        if (role && role.User) {
          const commercial_controller = {
            projectID: req.query.projectID,
            userID: role.User.id,
            type: "commercial_controller",
            status: "pending",
            sequence: "8",
            role_name: "Commercial controller",
          };

          await db.DirectorAndReviewerApprover.create(commercial_controller);
        }
      }
      if (req.body.financeDirector) {
        const financeDirector = {
          projectID: req.query.projectID,
          userID: req.body.financeDirector,
          type: "finance_director",
          status: "pending",
          sequence: "9",
          role_name: "Finance Director",
        };

        await db.DirectorAndReviewerApprover.create(financeDirector);
      }

      if (project.totalBudget > 250000) {
        if (req.body.GmUserID) {
          const general_maneger = {
            projectID: req.query.projectID,
            userID: req.body.GmUserID,
            type: "genral_maneger",
            status: "pending",
            sequence: "10",
            role_name: "General Manager",
          };

          await db.DirectorAndReviewerApprover.create(general_maneger);
        }
      }
    } else {
      const role = await db.role.findOne({
        where: { role: "Commercial Controller" },
        include: [
          {
            model: db.User,
            where: { status: "active" },
          },
        ],
      });
      if (role && role.User) {
        checkCommercial = 0;
        const commercial_controller = {
          projectID: req.query.projectID,
          userID: role.User.id,
          type: "commercial_controller",
          status: "pending",
          sequence: "7",
          role_name: "Commercial controller",
        };

        await db.DirectorAndReviewerApprover.create(commercial_controller);
      }
    }
    if (req.body.userID) {
      req.body.userID.forEach(async (element) => {
        const reviewerInsert = {
          projectID: req.query.projectID,
          userID: element,
          type: "reviewer",
          status: "pending",
          sequence: "2",
          role_name: "Reviewer",
        };

        await db.DirectorAndReviewerApprover.create(reviewerInsert);
      });
    }
  }
  /*start commercial controller */
  if (req.query.requestType && checkCommercial) {
    const role = await db.role.findOne({
      where: { role: "Commercial Controller" },
      include: [
        {
          model: db.User,
          where: { status: "active" },
        },
      ],
    });
    if (role && role.User) {
      const commercial_controller = {
        projectID: req.query.projectID,
        userID: role.User.id,
        type: "commercial_controller",
        status: "pending",
        sequence: "7",
        role_name: "Commercial controller",
      };

      await db.DirectorAndReviewerApprover.create(commercial_controller);
    }
  }
  /* closed commercial controller */

  // Add BA approver
  await db.BusinessAnalyst.findAll({
    where: {
      id: { [Op.in]: req.body.baID },
    },
    raw: true,
    attributes: ["Users.id", "id"],
    include: [
      {
        model: db.User,
        where: {
          status: { [Op.eq]: "active" },
        },
        required: true,
      },
    ],
  }).then(async function (ba) {
    var userEmail = [];
    ba.forEach(async (ele) => {
      const element = ele["Users.id"];
      const reviewerInsert = {
        projectID: req.query.projectID,
        userID: element,
        type: "ba",
        isTurn: "yes",
        status: "pending",
        sequence: "1",
        role_name: "Business Analyst",
      };
      await db.DirectorAndReviewerApprover.create(reviewerInsert);
      const user = await db.User.findOne({
        where: { id: element },
      });

      const name = user.email.split("@");
      userEmail.push(name[0]);
      await db.Project.update(
        { nextActionBy: userEmail.toString() },
        {
          where: {
            id: project.id,
          },
        }
      );
      let user_data = {
        name: name[0],
        email: user.email,
        type: "ba",
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
      };
      const ismsg = await db.DirectorAndReviewerApprover.findOne({
        where: {
          projectID: req.query.projectID,
          isMsg: "yes",
          type: "ba",
        },
      });
      if (!ismsg) {
        SendEmail(user_data, "PROJECT_APPROVAL_REQUEST", 0);
      }
      await db.DirectorAndReviewerApprover.update(
        { isMsg: "yes" },
        {
          where: {
            projectID: req.query.projectID,
            type: "ba",
          },
        }
      );
    });
  });

  if (req.body.Level5UserID) {
    const level5 = req.body.Level5UserID.split(",");
    level5.forEach(async (element) => {
      var checklevel5 = await db.User.findOne({
        where: { id: element },
        include: [
          {
            model: db.role,
            as: "roleName",
          },
        ],
      });
      const fiveLevel = {
        projectID: req.query.projectID,
        userID: element,
        type: "level5",
        status: "pending",
        sequence: "4",
        role_name: checklevel5.roleName.role,
      };

      await db.DirectorAndReviewerApprover.create(fiveLevel);
    });
  }

  if (req.body.Level4UserID) {
    const level4 = req.body.Level4UserID.split(",");
    level4.forEach(async (element) => {
      var checklevel4 = await db.User.findOne({
        where: { id: element },
        include: [
          {
            model: db.role,
            as: "roleName",
          },
        ],
      });
      const fourthLevel = {
        projectID: req.query.projectID,
        userID: element,
        type: "level4",
        status: "pending",
        sequence: "5",
        role_name: checklevel4.roleName.role,
      };

      await db.DirectorAndReviewerApprover.create(fourthLevel);
    });
  }

  if (req.body.Level3UserID) {
    const level3 = req.body.Level3UserID.split(",");
    level3.forEach(async (element) => {
      var checklevel3 = await db.User.findOne({
        where: { id: element },
        include: [
          {
            model: db.role,
            as: "roleName",
          },
        ],
      });
      const threeLevel = {
        projectID: req.query.projectID,
        userID: element,
        type: "level3",
        status: "pending",
        sequence: "6",
        role_name: checklevel3.roleName.role,
      };

      await db.DirectorAndReviewerApprover.create(threeLevel);
    });
  }
  const fghjkl = await db.DirectorAndReviewerApprover.findAll({
    where: {
      projectID: req.query.projectID,
    },
  });
  setTimeout(async () => {
    await UpdateDelegationUser();
  }, 5000);
  return returnResponse(
    200,
    true,
    "Project Approver Successfully.",
    res,
    fghjkl
  );
};

async function UpdateDelegationUser() {
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
}
const runTimeProjectStatus = async (req, res) => {
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
      status: ba,
      role_name: "Business Analyst",
      approverDate: checkBa ? checkBa.actionDate : "-",
    });
  }

  if (checkreviewer) {
    const reviewer = await checkProjectStatus(req.params.id, "reviewer");

    data.push({
      status: reviewer,
      role_name: "Reviewer",
      approverDate: checkreviewer.actionDate,
    });
  }
  if (check_cost_center) {
    data.push({
      status: cost_center,
      role_name: "Cost Center Owner",
      approverDate: check_cost_center.actionDate,
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
      status: level5,
      role_name: checklevel5.role_name,
      approverDate: checklevel5.actionDate,
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
      status: level4,
      role_name: checklevel4.role_name,
      approverDate: checklevel4.actionDate,
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
      status: level3,
      role_name: checklevel3.role_name,
      approverDate: checklevel3.actionDate,
    });
  }
  if (project.totalBudget > 25000) {
    if (project.CloserStatus) {
    }
    if (check_director) {
      data.push({
        status: directorApproval,
        role_name: check_director.role_name,
        approverDate: check_director.actionDate,
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
          status: commercial,
          role_name: "Commercial controller",
          approverDate: check_commercial.actionDate,
        });
      }
    }
    if (check_finance) {
      data.push({
        status: financeApproval,
        role_name: "Finance Director",
        approverDate: check_finance.actionDate,
      });
    }
    if (project.totalBudget > 250000) {
      if (check_genral_manager) {
        data.push({
          status: genralApproval,
          role_name: "General Manager",
          approverDate: check_genral_manager.actionDate,
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
          status: commercial,
          role_name: "Commercial controller",
          approverDate: check_commercial.actionDate,
        });
      }
    }
  }
  return returnResponse(200, true, "Project Approver Successfully.", res, data);
};

async function checkProjectStatus(projectID, type) {
  const pending = await db.DirectorAndReviewerApprover.findOne({
    where: {
      projectID: projectID,
      type: type,
      status: "pending",
    },
  });
  // console.log()
  const cancelledOrRejected = await db.DirectorAndReviewerApprover.findOne({
    where: {
      projectID: projectID,
      type: type,
      status: {
        [Op.and]: [{ [Op.in]: ["cancelled", "rejected"] }],
      },
    },
  });
  if (cancelledOrRejected) {
    return cancelledOrRejected.status;
  } else if (pending) {
    return "pending";
  } else {
    return "approved";
  }
  // const data = await db.DirectorAndReviewerApprover.findOne({
  //   where: {
  //     projectID: projectID,
  //     type: type,
  //     status: { [Op.ne]: "pending" },
  //   },
  // });
  // const pendingData = await db.DirectorAndReviewerApprover.findOne({
  //   where: {
  //     projectID: projectID,
  //     type: type,
  //     status: "pending",
  //     status: { [Op.notIn]: ["cancelled","rejected"] },
  //   },
  // });
  // if (data || pendingData) {
  //   var sssasd= pendingData ? pendingData.status : data.status;
  //   if(type=='ba'){
  //     console.log(sssasd);
  //   }
  //   return pendingData ? pendingData.status : data.status;
  // }
  // return "pending";
}
const saveCostCenterApprovers = async (req, res) => {
  var project = await db.Project.findByPk(req.query.projectID);
  // console.log(project);
  if (project) {
    await db.ProjectRuntimeStatus.update(
      { status: "pending" },
      {
        where: {
          id: req.query.projectID,
        },
      }
    );
    await db.Project.update(
      {
        runTimeStatus: null,
      },
      {
        where: { id: project.id },
      }
    );
    // console.log(req.body.costCenterUserID);
    var check = await db.DirectorAndReviewerApprover.findAll({
      where: {
        [Op.or]: [
          {
            userID: {
              [Op.in]: req.query.costCenterUserID,
            },
            projectID: req.query.projectID,
            type: {
              [Op.in]: ["level3", "level4", "level5"],
            },
          },
        ],
      },
    }).then((pro) => pro.map((acc) => acc.userID));
    let b = new Set(check);
    let difference = [...req.query.costCenterUserID].filter((x) => !b.has(x));
    //console.log(check, req.query.costCenterUserID, difference);
    const projectAndDistrict = await db.DirectorAndReviewerApprover.destroy({
      where: { projectID: req.query.projectID, type: "cost_center" },
    })
      .then((num) => {
        if (num == 1) {
          if (difference.length) {
            difference.forEach(async (element) => {
              const insert = {
                projectID: req.query.projectID,
                userID: element,
                type: "cost_center",
                status: "pending",
                sequence: "3",
                role_name: "Cost Center Owner",
              };

              await db.DirectorAndReviewerApprover.create(insert);
            });
          }
        } else {
          if (difference.length) {
            difference.forEach(async (element) => {
              const insert = {
                projectID: req.query.projectID,
                userID: element,
                type: "cost_center",
                status: "pending",
                sequence: "3",
                role_name: "Cost Center Owner",
              };
              await db.DirectorAndReviewerApprover.create(insert);
            });
          }
        }
      })
      .catch((err) => {
        return returnResponse(422, true, err, res, "");
      });
  }
  setTimeout(async () => {
    await UpdateDelegationUser();
  }, 3000);
  return returnResponse(
    200,
    true,
    "Save Cost center Approver Successfully.",
    res,
    []
  );
};

const AddCloseRequestForm = async (req, res) => {
  req.body.userID = req.query.userID;
  req.body.projectID = req.query.projectID;

  var checkProject = await db.CloserProcess.findOne({
    where: {
      [Op.or]: [{ projectID: req.query.projectID }],
    },
  });
  if (checkProject && checkProject.projectID) {
    if (checkProject) {
      await db.CloserProcess.update(req.body, {
        where: {
          projectID: checkProject.projectID,
        },
      });
    }
    return returnResponse(
      200,
      true,
      "Project Evaluation Info Updated Successfully",
      res,
      checkProject
    );
  } else {
    await db.CloserProcess.create(req.body)
      .then((data) => {
        return returnResponse(
          200,
          true,
          "Project Evaluation reated Successfully",
          res,
          data
        );
      })
      .catch((err) => {
        return returnResponse(422, false, err.message, res, "");
      });
  }
};

const getDataEvaluation = async (req, res) => {
  const id = req.params.id;
  await db.CloserProcess.findOne({
    where: { projectID: id },

    include: [
      {
        model: db.Project,
      },
      {
        model: db.User,
      },
    ],
  })
    .then((data) => {
      if (data) {
        return returnResponse(
          200,
          true,
          "Data Evaluations Render Successfully",
          res,
          data
        );
      } else {
        res.status(404).send({
          message: `Cannot find Evaluations with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};

const updateDataExpenseAnalyst = async (req, res) => {
  var data = req.body;

  data.forEach(async (element) => {
    var insert = {
      actualExpenseBudget: element.actualExpenseBudget,
      varianceBudget: element.varianceBudget,
      expenseRemark: element.expenseRemark,
    };

    await db.ProjectExpense.update(insert, {
      where: {
        projectID: req.params.id,
        brandID: element.brandID,
        lineExtID: element.lineExtID,
      },
    });
  });

  return returnResponse(
    200,
    true,
    "Project Budget financial Successfully !",
    res,
    data
  );
};

const totalRevenueUpdate = async (req, res) => {
  var data = req.body;
  data.forEach(async (element) => {
    var insert = {
      othContributeBudget: element.othContributeBudget,
      othContributeLastBudget: element.othContributeLastBudget,
      contributeBudget: element.contributeBudget,
      contributeLastBudget: element.contributeLastBudget,
      volumeWithBudget: element.volumeWithBudget,
      volumeWithLastBudget: element.volumeWithLastBudget,
      volumeWithoutBudget: element.volumeWithoutBudget,
      volumeWithoutLastBudget: element.volumeWithoutLastBudget,
      lastProjectVolumeInc: element.lastProjectVolumeInc,
      budgetVolumeIncrease: element.budgetVolumeIncrease,
      lastProjectTotalIncrement: element.lastProjectTotalIncrement,
      budgetProjectTotalIncrement: element.budgetProjectTotalIncrement,
      totalLastOthContribute: element.totalLastOthContribute,
      totalBudgetOthContribute: element.totalBudgetOthContribute,
      actualVolumeWithBudget: element.actualVolumeWithBudget,
      varianceVolumeWithBudget: element.varianceVolumeWithBudget,
      remarkVolumeWithBudget: element.remarkVolumeWithBudget,
      actualContributeBudget: element.actualContributeBudget,
      actualProjectVolumeInc: element.actualProjectVolumeInc,
      varianceProjectVolumeInc: element.varianceProjectVolumeInc,
      remarkProjectVolumeInc: element.remarkProjectVolumeInc,
      actualProjectTotalIncrement: element.actualProjectTotalIncrement,
      varianceProjectTotalIncrement: element.varianceProjectTotalIncrement,
      remarkProjectTotalIncrement: element.remarkProjectTotalIncrement,
      othContributeActual: element.othContributeActual,
    };

    await db.ProjectBrand.update(insert, {
      where: {
        projectID: req.params.id,
        brandID: element.brandID,
        lineExtID: element.lineExtID,
        skuID: element.skuID,
      },
    });
  });

  return returnResponse(
    200,
    true,
    "Project Budget financial Successfully!!",
    res,
    data
  );
};

const closerRequest = async (req, res) => {
  let info = {
    CloserStatus: "pending",
    runTimeStatus: null,
  };

  await db.DirectorAndReviewerApprover.update(
    { status: "pending" },
    { where: { projectID: req.params.id } }
  );
  await db.ProjectRuntimeStatus.update(
    { status: "pending" },
    { where: { projectID: req.params.id } }
  );
  var user = await db.User.findByPk(req.query.userID);
  var getProject = await db.Project.findByPk(req.params.id);
  const auditLog = {
    userID: user.id,
    projectID: getProject.id,
    message: "Requested for closure request.",
    userName: user.email.split("@")[0],
    projectName: getProject.name,
    chnageByadmin: null,
    actionBy: user.email.split("@")[0],
    comment: null,
  };
  Log.Auditlogs(auditLog, false);

  await db.Project.update(info, {
    where: { id: req.params.id },
  })
    .then((num) => {
      return returnResponse(200, true, "Successfully Updated !!", res, "");
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};
const projectAuditLog = async (req, res) => {
  //  console.log("2372",req.query.)
  console.log("++++++++++++++", req.query.projectID);
  var whereCal = {};
  console.log("2");
  var f_date = req.query.fromDate;
  console.log(f_date, "ppp");
  var to_date = req.query.toDate;
  console.log("2379====000000>", f_date, to_date);

  var created_at = {};
  if (f_date) {
    f_date = new Date(f_date);
    const year = f_date.getFullYear();
    console.log(year);
    const month = (f_date.getMonth() + 1).toString().padStart(2, "0");
    const day = f_date.getDate().toString().padStart(2, "0");

    f_date = `${year}-${month}-${day}T00:00:00.000Z`;
  }
  console.log("====from>new", f_date);

  if (to_date) {
    to_date = new Date(to_date);
    const year = to_date.getFullYear();
    const month = (to_date.getMonth() + 1).toString().padStart(2, "0");
    const day = to_date.getDate().toString().padStart(2, "0");

    to_date = `${year}-${month}-${day}T23:59:59.000Z`;
  }
  console.log("====totot>new", to_date);

  console.log("====>new", to_date);

  if (f_date && to_date) {
    created_at = {
      createdAt: { [Op.between]: [new Date(f_date), new Date(to_date)] },
    };
  }
  console.log("4");
  if (f_date && !to_date) {
    created_at = { createdAt: { [Op.gte]: new Date(f_date) } };
  }
  if (!f_date && to_date) {
    created_at = { createdAt: { [Op.lte]: new Date(to_date) } };
  }
  console.log("5");
  whereCal = { ...whereCal, ...created_at };
  var condition;
  if (req.query.projectID) {
    condition = {
      projectID: req.query.projectID,
      projectName: { [Op.ne]: null },
      isAuditLog: { [Op.eq]: null },
    };
  } else {
    condition = {
      projectName: { [Op.ne]: null },
      isAuditLog: { [Op.eq]: null },
    };
  }
  const result = await db.AuditLog.findAll({
    include: [
      {
        model: db.User,
      },
      {
        model: db.Project,
      },
    ],
    where: { ...condition, ...whereCal },

    order: [["id", "DESC"]],
  })
    .then((data) => {
      return res.json({
        result: data,
        // page: page,
        // limit: limit,
        // totalRows: totalRows,
        // totalPage: totalPage,
      });
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};

const projectByAuditLog = async (req, res) => {
  await db.AuditLog.findAll({
    where: { projectID: req.params.id, projectName: { [Op.ne]: null } },
    include: [
      {
        model: db.User,
      },
      {
        model: db.Project,
      },
    ],

    order: [["id", "DESC"]],
  })
    .then((data) => {
      return returnResponse(
        200,
        true,
        "Project Audit Log Render Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};
const projectAuditBasedID = async (req, res) => {
  await db.AuditLog.findByPk(req.params.id, {
    include: [
      {
        model: db.User,
      },
      {
        model: db.Project,
      },
    ],
    order: [["id", "DESC"]],
  })
    .then((data) => {
      return returnResponse(
        200,
        true,
        "Project Audit Log Render Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};
const downloadImage = async (req, res) => {
  var action = "../../MulterConfig/uploads/" + req.params.id;
  var filePath = path.join(__dirname, action).split("%20").join(" ");

  fs.exists(filePath, function (exists) {
    var ext = path.extname(action);
    var contentType = "text/plain";
    contentType = "image/" + ext;
    res.writeHead(200, {
      "Content-Type": contentType,
    });
    fs.readFile(filePath, function (err, content) {
      res.end(content);
    });
  });
};
const getLevelProjectList = async (req, res) => {
  var filter = await Filter.getLevelBasedProjectFilter(req);
  //console.log(filter);
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search_query || "";
  const offset = limit * page;
  const totalRows = await db.Project.count({
    where: filter,
    include: [db.User],
  });
  const totalPage = Math.ceil(totalRows / limit);

  var data = await db.Project.findAll({
    where: filter,

    include: [
      // {
      //   model: db.ProjectBrand,
      //   include: [
      //     {
      //       model: db.Brand,
      //     },
      //   ],
      // },
      {
        model: db.DirectorAndReviewerApprover,
        where: {
          status: {
            [Op.or]: ["cancelled", "rejected"],
          },
        },
        required: false,
      },

      db.User,
    ],
    offset: offset,
    limit: limit,
    order: [["id", "DESC"]],
  });
  return res.json({
    result: data,
    page: page,
    limit: limit,
    totalRows: totalRows,
    totalPage: totalPage,
  });
};
const updateProjectNewExpense = async (req, res) => {
  req.body.forEach(async (element) => {
    await db.ProjectExpense.update(
      {
        newBudgetExpenses: element.newBudgetExpenses,
      },
      {
        where: { id: element.id },
      }
    );
  });

  const projectDistr = await db.ProjectExpense.findAll({
    where: { projectID: req.params.id },
  });
  return returnResponse(
    200,
    true,
    "Brand Updated Successfully",
    res,
    projectDistr
  );
};
const getPromoReport = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search_query || "";
  const offset = limit * page;
  var whereCal = {};
  var f_date = req.query.fromDate;
  var to_date = req.query.toDate;
  var created_at = {};
  var filter = await Filter.getFilter(req);
  if (req.query.userID == "1") {
    filter = { status: { [Op.notIn]: ["deleted", "draft"] } };
  }

  var totalRows = await db.Project.count({
    where: filter,
    order: [["id", "DESC"]],
  });

  if (f_date) {
    f_date = new Date(f_date);
    const year = f_date.getFullYear();
    const month = (f_date.getMonth() + 1).toString().padStart(2, "0");
    const day = f_date.getDate().toString().padStart(2, "0");

    f_date = `${year}-${month}-${day}T00:00:00.000Z`;

    console.log("====>new", f_date);
  }

  if (to_date) {
    to_date = new Date(to_date);
    const year = to_date.getFullYear();
    const month = (to_date.getMonth() + 1).toString().padStart(2, "0");
    const day = to_date.getDate().toString().padStart(2, "0");

    to_date = `${year}-${month}-${day}T23:59:59.000Z`;

    console.log("====>new", to_date);
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

  var joinStatus = false;
  var whereCondition1 = {};

  if (req.query.search != undefined) {
    joinStatus = true;
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
  whereCal = { ...whereCal, ...whereCondition1, ...created_at };

  const totalPage = Math.ceil(totalRows / limit);
  var projectExs = await db.Project.findAll({
    where: { ...filter, ...whereCal },
    include: [
      { model: db.User, required: joinStatus },
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
    ],
    limit: limit,
    offset: offset,

    order: [["id", "DESC"]],
  });
  return res.json({
    result: projectExs,
    page: page,
    limit: limit,
    totalRows: totalRows,
    totalPage: totalPage,
  });
};
const OldProjectBudgetList = async (req, res) => {
  var projectID = await db.Project.findOne({
    where: {
      projectNumber: req.params.id,
    },
  });
  var brand = await db.ProjectBrand.findAll({
    where: {
      projectID: req.query.projectID,
    },
    attributes: ["id", "brandID", "skuID", "projectID"],

    raw: true,
  });
  var projectBrandID = [];
  brand.forEach(async (element, key) => {
    // console.log(projectID, element.brandID, element.skuID);
    var getId = await db.ProjectBrand.findOne({
      where: {
        projectID: projectID ? projectID.id : 0,
        brandID: element.brandID,
        skuID: element.skuID,
      },
    });
    // console.log(getId.id, projectID);
    if (getId) {
      projectBrandID.push(getId.id);
    } else {
      //projectBrandID.push(element.id);
    }
  });
  setTimeout(async () => {
    var projectBrand = await db.ProjectBrand.findAll({
      where: {
        id: { [Op.in]: projectBrandID },
      },
      attributes: [
        "actualContributeBudget",
        "actualProjectTotalIncrement",
        "actualProjectVolumeInc",
        "actualVolumeWithBudget",
        "allocation",
        "allocationPercent",
        "brandID",
        "budgetAmount",
        ["budgetProjectTotalIncrement", "lastProjectTotalIncrement"],
        "budgetRef",

        "catID",
        ["contributeBudget", "contributeLastBudget"],
        // ["contributeLastBudget", "contributeBudget"],
        "createdAt",
        "fy",
        "id",
        // "lastProjectTotalIncrement",
        ["budgetVolumeIncrease", "lastProjectVolumeInc"],
        // "lastProjectVolumeInc",
        "lineExtID",
        "othContributeActual",
        ["othContributeBudget", "othContributeLastBudget"],
        // "othContributeLastBudget",
        "pack_type",
        "projectID",
        "remarkProjectTotalIncrement",
        "remarkProjectVolumeInc",
        "remarkVolumeWithBudget",
        "skuID",
        "totalBudgetOthContribute",
        "totalLastOthContribute",
        "updatedAt",
        "varianceProjectTotalIncrement",
        "varianceProjectVolumeInc",
        "varianceVolumeWithBudget",
        ["volumeWithBudget", "volumeWithLastBudget"],
        // "volumeWithLastBudget",
        ["volumeWithoutBudget", "volumeWithoutLastBudget"],
        // ["volumeWithoutLastBudget", "volumeWithoutBudget"],
      ],
      include: [
        {
          model: db.Project,
        },
        {
          model: db.Brand,
        },
        {
          model: db.Category,
        },
        {
          model: db.PackType,
        },
        {
          model: db.SKU,
        },
        {
          model: db.lineExtension,
        },
      ],
    })
      .then((data) => {
        return returnResponse(
          200,
          true,
          "Project and district List Render Successfullydddd.",
          res,
          data
        );
      })
      .catch((err) => {
        return returnResponse(422, true, err.message, res, "");
      });
  }, 2000);
};
const userDelegationAudit = async (req, res) => {
  var whereCal = {};
  var f_date = req.query.fromDate;
  var to_date = req.query.toDate;
  var f_s_date = req.query.fromStartDate;
  var to_s_date = req.query.toStartDate;
  var start_at = {};
  var created_at = {};

  if (f_date) {
    f_date = new Date(f_date);
    const year = f_date.getFullYear();
    const month = (f_date.getMonth() + 1).toString().padStart(2, "0");
    const day = f_date.getDate().toString().padStart(2, "0");

    f_date = `${year}-${month}-${day}T00:00:00.000Z`;

    console.log("====>FFFFFfffnew", f_date);
  }

  if (to_date) {
    to_date = new Date(to_date);
    const year = to_date.getFullYear();
    const month = (to_date.getMonth() + 1).toString().padStart(2, "0");
    const day = to_date.getDate().toString().padStart(2, "0");

    to_date = `${year}-${month}-${day}T23:59:59.000Z`;

    console.log("====>TTTTTTTTTnew", to_date);
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
  if (f_s_date) {
    f_s_date = new Date(f_s_date);
    const year = f_s_date.getFullYear();
    const month = (f_s_date.getMonth() + 1).toString().padStart(2, "0");
    const day = f_s_date.getDate().toString().padStart(2, "0");

    f_s_date = `${year}-${month}-${day}T00:00:00.000Z`;

    console.log("====>SSSSSfromnew", f_s_date);
  }

  if (to_s_date) {
    to_s_date = new Date(to_s_date);
    const year = to_s_date.getFullYear();
    const month = (to_s_date.getMonth() + 1).toString().padStart(2, "0");
    const day = to_s_date.getDate().toString().padStart(2, "0");

    to_s_date = `${year}-${month}-${day}T23:59:59.000Z`;

    console.log("====>SSSSSStoonew", to_s_date);
  }
  if (f_s_date && to_s_date) {
    start_at = {
      startDate: { [Op.between]: [new Date(f_s_date), new Date(to_s_date)] },
    };
  }
  if (f_s_date && !to_s_date) {
    start_at = { startDate: { [Op.gte]: new Date(f_s_date) } };
  }
  if (!f_s_date && to_s_date) {
    start_at = { startDate: { [Op.lte]: new Date(to_s_date) } };
  }

  whereCal = { ...whereCal, ...created_at, ...start_at };
  const data = await db.AuditLog.findAll({
    // logging: (sql, queryObject) => {
    //   console.log(sql)
    // },
    where: { isAuditLog: "true", ...whereCal },
    order: [["id", "DESC"]],
  })
    .then((data) => {
      return res.json({
        data: data,
      });
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};
export {
  OldProjectBudgetList,
  getPromoReport,
  updateProjectNewExpense,
  getLevelProjectList,
  downloadImage,
  runTimeProjectStatus,
  saveCostCenterApprovers,
  saveGmDirectorReviewers,
  EditReviewersList,
  reviewersList,
  totalFinancialProjects,
  projectsReviewers,
  deleteProjectExpenses,
  basicInformation,
  areaDistrict,
  updateAreaDistrict,
  deleteAreaDistrict,
  deleteChooseBrand,
  updateChooseBrand,
  chooseBrand,
  showAreaDistrict,
  showChooseBrand,
  areaDistrictList,
  deleteFile,
  createProjectExpenses,
  showProjectExpenses,
  updateProjectExpenses,
  projectList,
  BrandSkuPackTypeList,
  fileList,
  allProjects,
  BrandExpenseList,
  projectsBudget,
  projectsFinancial,
  saveDraft,
  approverList,
  SelectedBaList,
  allProjectsPending,
  AddCloseRequestForm,
  getDataEvaluation,
  updateDataExpenseAnalyst,
  totalRevenueUpdate,
  closerRequest,
  projectAuditLog,
  projectAuditBasedID,
  projectByAuditLog,
  userDelegationAudit,
};
