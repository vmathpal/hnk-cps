import db from "../../models";
import { Op, where, Sequelize } from "sequelize";

export const getFilter = async (req) => {
  var user = await db.User.findByPk(req.query.userID);

  //for admin role show all project
  var filterByStatus;
  var checkAdmin = false;
  if (
    req.query.level == "level1" ||
    req.query.level == "level2" ||
    req.query.level == "level3"
  ) {
    checkAdmin = true;
  }

  if (checkAdmin) {
    if (req.query.search && req.query.status) {
      return (filterByStatus = {
        department: req.query.search,
        status: req.query.status,
      });
    }
    if (req.query.search) {
      return (filterByStatus = {
        department: req.query.search,
      });
    }

    if (req.query.status) {
      return (filterByStatus = {
        status: req.query.status,
      });
    }

    //for onload admin
    return (filterByStatus = {
      status: { [Op.notIn]: ["draft", "created", "deleted"] },
    });
  } else {
    //show user approver project
    var projectIds = await db.DirectorAndReviewerApprover.findAll({
      where: {
        userID: req.query.userID,
      },
    }).then((project) => project.map((account) => account.projectID));

    if (req.query.status) {
      return {
        [Op.or]: [
          {
            department: req.query.department,
            status: req.query.status,
          },
          {
            userID: req.query.userID,
            status: req.query.status,
          },
          {
            id: projectIds,
            status: req.query.status,
          },
        ],
      };
    }
    return {
      [Op.or]: [
        {
          department: req.query.department,
          status: { [Op.notIn]: ["draft", "created", "deleted"] },
        },
        {
          userID: req.query.userID,
          status: { [Op.notIn]: ["draft", "created", "deleted"] },
        },
        {
          id: projectIds,
        },
      ],
    };
  }
};

export const getLevelBasedProjectFilter = async (req) => {
  var user = await db.User.findByPk(req.query.userID);

  //for admin role show all project
  var checkAdmin = false;
  if (
    req.query.level == "level1" ||
    req.query.level == "level2" ||
    req.query.level == "level3"
  ) {
    checkAdmin = true;
  }

  if (checkAdmin) {
    return {
      [Op.or]: [
        {
          id: { [Op.like]: "%" + req.query.search + "%" },
          status: { [Op.notIn]: ["draft", "created", "deleted"] },
        },

        {
          name: { [Op.like]: "%" + req.query.search + "%" },
          status: { [Op.notIn]: ["draft", "created", "deleted"] },
        },

        {
          projectNumber: { [Op.like]: "%" + req.query.search + "%" },
          status: { [Op.notIn]: ["draft", "created", "deleted"] },
        },
        {
          department: { [Op.like]: "%" + req.query.search + "%" },
          status: { [Op.notIn]: ["draft", "created", "deleted"] },
        },
      ],
    };
  } else {
    if (req.query.search) {
      return {
        [Op.or]: [
          {
            id: { [Op.like]: "%" + req.query.search + "%" },
            status: { [Op.notIn]: ["draft", "created", "deleted"] },
            department: req.query.department,
          },

          {
            name: { [Op.like]: "%" + req.query.search + "%" },
            status: { [Op.notIn]: ["draft", "created", "deleted"] },
            department: req.query.department,
          },
          {
            projectNumber: { [Op.like]: "%" + req.query.search + "%" },
            status: { [Op.notIn]: ["draft", "created", "deleted"] },
            department: req.query.department,
          },
          {
            "$User.email$": { [Op.like]: "%" + req.query.search.trim() + "%" },
            status: { [Op.notIn]: ["draft", "created", "deleted"] },
          },
        ],
      };
    }

    var projectIds = await db.DirectorAndReviewerApprover.findAll({
      where: {
        userID: req.query.userID,
      },
    }).then((project) => project.map((account) => account.projectID));
    return {
      [Op.or]: [
        {
          id: { [Op.like]: "%" + req.query.search + "%" },
          status: { [Op.notIn]: ["draft", "created", "deleted"] },
          department: req.query.department,
        },

        {
          name: { [Op.like]: "%" + req.query.search + "%" },
          status: { [Op.notIn]: ["draft", "created", "deleted"] },
          department: req.query.department,
        },
        {
          projectNumber: { [Op.like]: "%" + req.query.search + "%" },
          status: { [Op.notIn]: ["draft", "created", "deleted"] },
          department: req.query.department,
        },
        {
          userID: req.query.userID,
          status: { [Op.notIn]: ["draft", "created", "deleted"] },
        },
        {
          id: projectIds,
        },
      ],
    };
  }
};
