import db from "../../models";
import { Op, where, Sequelize } from "sequelize";

export const getFilter = async (req) => {
  if (req.query.status && req.query.search) {
    return await statusWithFilter(req, false);
  } else if (req.query.status) {
    return await filter(req, false);
  } else if (req.query.search) {
    return await search(req, false);
  } else {
    return await commonFilter(req, false);
  }
};

export const getAdminFilter = async (req) => {
  var filters = await AdminDepartmentSearching(req);
  if (req.query.status && req.query.search) {
    return await statusWithFilter(req, filters);
  } else if (req.query.status) {
    return await filter(req, filters);
  } else if (req.query.search) {
    return await search(req, filters);
  } else {
    return await commonFilter(req, filters);
  }
};

export const filter = async (req, checkAdmin) => {
  var filterByStatus;
  const report =
    req.query.type == "report" ? { [Op.ne]: 0 } : { [Op.ne]: req.query.userID };
  if (checkAdmin) {
    if (req.query.status == "pending") {
      filterByStatus = {
        department: checkAdmin,
        status: { [Op.in]: ["completed", req.query.status] },
        userID: report,
      };
    } else {
      filterByStatus = {
        status: req.query.status,
        department: checkAdmin,
        userID: report,
      };
    }
  } else {
    if (req.query.status == "pending") {
      filterByStatus = {
        status: { [Op.in]: ["completed", req.query.status] },
        userID: req.query.userID,
      };
    } else {
      filterByStatus = { status: req.query.status, userID: req.query.userID };
    }
  }
  return filterByStatus;
};

export const search = async (req, checkAdmin) => {
  if (checkAdmin) {
    const report =
      req.query.type == "report"
        ? { [Op.ne]: 0 }
        : { [Op.ne]: req.query.userID };
    return {
      status: { [Op.notIn]: ["created", "deleted"] },
      [Op.or]: [
        {
          id: { [Op.like]: "%" + req.query.search + "%" },
          department: checkAdmin,
          userID: report,
        },
        {
          status: { [Op.like]: "%" + req.query.search + "%" },
          department: checkAdmin,
          userID: report,
        },
        {
          name: { [Op.like]: "%" + req.query.search + "%" },
          department: checkAdmin,
          userID: report,
        },
        {
          department: { [Op.like]: "%" + req.query.search + "%" },
          // status: { [Op.notIn]: ["created", "deleted"] },
          userID: report,
        },
        {
          projectNumber: { [Op.like]: "%" + req.query.search + "%" },
          // status: { [Op.notIn]: ["created", "deleted"] },
          userID: report,
        },
        {
          "$User.email$": { [Op.like]: "%" + req.query.search.trim() + "%" },
          status: { [Op.notIn]: ["created", "deleted"] },
        },
      ],
    };
  }
  return {
    [Op.or]: [
      {
        id: { [Op.like]: "%" + req.query.search + "%" },
        status: {
          [Op.notIn]: ["created", "deleted"],
        },
        userID: req.query.userID,
      },
      {
        name: { [Op.like]: "%" + req.query.search + "%" },
        status: {
          [Op.notIn]: ["created", "deleted"],
        },
        userID: req.query.userID,
      },
      {
        department: { [Op.like]: "%" + req.query.search + "%" },
        status: {
          [Op.notIn]: ["created", "deleted"],
        },
        userID: req.query.userID,
      },
      {
        projectNumber: { [Op.like]: "%" + req.query.search + "%" },
        status: {
          [Op.notIn]: ["created", "deleted"],
        },
        userID: req.query.userID,
      },
    ],
  };
};

export const commonFilter = async (req, checkAdmin) => {
  if (checkAdmin) {
    const report =
      req.query.type == "report"
        ? { [Op.eq]: req.query.userID }
        : { [Op.ne]: req.query.userID };
    return {
      [Op.or]: [
        {
          status: {
            [Op.notIn]: ["created", "deleted"],
          },
          userID: { [Op.ne]: 0 },
          department: checkAdmin,
        },
        {
          status: {
            [Op.notIn]: ["created", "deleted"],
          },
          userID: req.query.userID,
          // department: checkAdmin,
        },
      ],
    };
  }
  return {
    status: {
      [Op.notIn]: ["created", "deleted", "cancelled"],
    },
    userID: req.query.userID,
  };
};

export const statusWithFilter = async (req, checkAdmin) => {
  var filterByStatus;
  if (checkAdmin) {
    const report =
      req.query.type == "report"
        ? { [Op.ne]: 0 }
        : { [Op.ne]: req.query.userID };
    if (req.query.status == "pending") {
      filterByStatus = {
        status: { [Op.in]: ["completed", req.query.status] },
        userID: report,
        department: { [Op.like]: "%" + req.query.search + "%" },
      };
    } else {
      filterByStatus = {
        status: req.query.status,

        department: { [Op.like]: "%" + req.query.search + "%" },
      };
    }
  } else {
    if (req.query.status == "pending") {
      filterByStatus = {
        status: { [Op.in]: ["completed", req.query.status] },
        userID: req.query.userID,
        department: { [Op.like]: "%" + req.query.search + "%" },
      };
    } else {
      filterByStatus = {
        status: req.query.status,
        userID: req.query.userID,
        department: { [Op.like]: "%" + req.query.search + "%" },
      };
    }
  }
  return filterByStatus;
};

export const AdminDepartmentSearching = async (req) => {
  if (
    req.query.level == "level3" ||
    req.query.level == "level4" ||
    req.query.level == "level5" ||
    req.query.level == "level6"
  ) {
    return req.query.department;
  } else {
    return { [Op.ne]: null };
  }
};

export const getLevelProject = async (req, projectID) => {
  if (req.query.status) {
    return {
      [Op.or]: [
        {
          status: req.query.status,
          department: req.query.department,
          userID: req.query.userID,
        },
        {
          id: {
            [Op.in]: projectID,
          },
        },
      ],
    };
  } else {
    return {
      [Op.or]: [
        {
          status: {
            [Op.notIn]: ["created", "deleted", "draft"],
          },
          userID: { [Op.ne]: 0 },
          department: req.query.department,
        },
        {
          status: {
            [Op.notIn]: ["created", "deleted", "draft"],
          },
          userID: req.query.userID,
        },
        {
          status: {
            [Op.notIn]: ["created", "deleted", "draft"],
          },
          id: {
            [Op.in]: projectID,
          },
        },
      ],
    };
  }
};
