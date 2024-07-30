import db from "../../models";
import {
  getInitials,
  returnResponse,
  capitalizeFirstLetter,
  getRoleName,
} from "../../helper/helper";

// create main Model
const Role = db.role;
const Level = db.Level;
const TagRole = db.TagRole;
const level3And4Mapping = db.level3And4Mapping;
const level4And5Mapping = db.level4And5Mapping;
const CostCenter = db.CostCenter;

import { Op } from "sequelize";
const createRoles = async (req, res) => {
  let info = {
    role: req.body.role.trim(),
    department: req.body.dept.trim(),
    status: "active",
  };
  if (
    req.body.role.trim() === "General Manager" ||
    req.body.role.trim() === "general manager"
  ) {
    return returnResponse(
      422,
      "true",
      "Can't Add General Manager Role ",
      res,
      ""
    );
  }
  Role.create(info)
    .then((data) => {
      return returnResponse(200, "true", "User Created Successfully", res, "");
    })
    .catch((err) => {
      return returnResponse(401, "true", err.message, res, "");
    });
};
const getRoles = async (req, res) => {
  await Role.findAll({})
    .then((data) => {
      return returnResponse(200, true, "Roles Render Successfully", res, data);
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};
const getDeptRoles = async (req, res) => {
  await Role.findAll({
    where: {
      department: {
        [Op.ne]: "other",
      },
    },
  })
    .then((data) => {
      return returnResponse(
        200,
        "true",
        "Roles Render Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(401, "true", err.message, res, "");
    });
};
const editRoles = async (req, res) => {
  const id = req.params.id;
  Role.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, true, "Successfully Updated Role", res, "");
      } else {
        return returnResponse(422, false, "Successfully Updated Role", res, "");
      }
    })
    .catch((err) => {
      return returnResponse(422, "true", err.message, res, "");
    });
};

//search a single student with an id
const getSingleRole = (req, res) => {
  const id = req.params.id;
  Role.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Student with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Student with id=" + id,
      });
    });
};
// remove a student with the given id
const deleteRole = (req, res) => {
  const id = req.params.id;
  Role.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, "true", "Deleted Successfully", res, "");
      } else {
        return returnResponse(
          422,
          "true",
          `Something went wrong!Can't delete Student with id=${id}.`,
          res,
          ""
        );
      }
    })
    .catch((err) => {
      return returnResponse(422, "true", err.message, res, "");
    });
};
const createLevel = (req, res) => {
  let info = {
    name: req.body.level,
  };
  Level.create(info)
    .then((data) => {
      return returnResponse(200, "true", "Level Created Successfully", res, "");
    })
    .catch((err) => {
      return returnResponse(401, "true", err.message, res, "");
    });
};
const getLevels = async (req, res) => {
  await Level.findAll({})
    .then((data) => {
      return returnResponse(
        200,
        "true",
        "Levels Render Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(401, "true", err.message, res, "");
    });
};
const getSingleLevel = async (req, res) => {
  const id = req.params.id;
  await Level.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Level with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Level with id=" + id,
      });
    });
};

const tagRole = async (req, res) => {
  let info: any;
  let data: any;
  req.body.roleId.forEach((element) => {
    info = {
      levelId: req.body.level,
      roleId: element,
    };
    data = TagRole.create(info);
  });
  if (data) {
    return returnResponse(200, "true", "Role Tagged Successfully", res, "");
  }
};

const tagRoleList = async (req, res) => {
  await TagRole.findAll({ include: [Level, Role] })
    .then((data) => {
      return returnResponse(
        200,
        "true",
        "Tag Role Render Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(401, "true", err, res, "");
    });
};
const singleTagRole = async (req, res) => {
  const id = req.params.id;
  await TagRole.findByPk(id, { include: [Level, Role] })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Tag role with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({
        message: "Error retrieving Level with id=" + id,
      });
    });
};
const EditTagRole = (req, res) => {
  const id = req.params.id;
  // console.log('>>id',id,'<><>',req.body);
  TagRole.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, "true", "Successfully Updated", res, "");
      } else {
        return returnResponse(401, "true", "Error Updated", res, "");
      }
    })
    .catch((err) => {
      return returnResponse(422, "true", err, res, "");
    });
};
const deleteTagRole = (req, res) => {
  const id = req.params.id;
  TagRole.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, "true", "Deleted Successfully", res, "");
      } else {
        return returnResponse(
          422,
          "true",
          `Something went wrong!Can't delete Student with id=${id}.`,
          res,
          ""
        );
      }
    })
    .catch((err) => {
      return returnResponse(422, "true", err, res, "");
    });
};
const getLevelBasedRole = async (req, res) => {
  var sale_id = req.params.id;
  let level2 = await TagRole.findAll({
    where: { levelId: 2 },

    include: {
      model: Role,

      where: {
        department: {
          [Op.eq]: sale_id,
        },
      },
    },
  });
  let level3 = await TagRole.findAll({
    where: { levelId: 3 },

    include: {
      model: Role,

      where: {
        department: {
          [Op.eq]: sale_id,
        },
      },
    },
  });
  let level4 = await TagRole.findAll({
    where: { levelId: 4 },
    include: {
      model: Role,

      where: {
        department: {
          [Op.eq]: sale_id,
        },
      },
    },
  });
  let level5 = await TagRole.findAll({
    where: { levelId: 5 },
    include: {
      model: Role,

      where: {
        department: {
          [Op.eq]: sale_id,
        },
      },
    },
  });
  let level6 = await TagRole.findAll({
    where: { levelId: 6 },
    include: {
      model: Role,

      where: {
        department: {
          [Op.eq]: sale_id,
        },
      },
    },
  });
  return res.send({
    level2,
    level3,
    level4,
    level5,
    level6,
  });
};
const SaveRelationMapping34 = async (req, res) => {
  // console.log(req.body);
  let info = {
    roleLevel3: req.body.roleLevel3,
    roleLevel4: req.body.roleLevel4,
    department: req.query.department,
  };

  await level3And4Mapping
    .create(info)
    .then((data) => {
      return returnResponse(200, "true", "Level Mapped Successfully", res, "");
    })
    .catch((err) => {
      return returnResponse(401, "true", err.message, res, "");
    });
};

const SaveRelationMapping45 = async (req, res) => {
  // console.log(req.body);
  let info = {
    roleLevel4: req.body.roleLevel4,
    roleLevel5: req.body.roleLevel5,
    department: req.query.department,
  };

  await level4And5Mapping
    .create(info)
    .then((data) => {
      return returnResponse(200, "true", "Level Mapped Successfully", res, "");
    })
    .catch((err) => {
      return returnResponse(401, "true", err.message, res, "");
    });
};
const SaveRelationMapping56 = async (req, res) => {
  // console.log(req.body);
  let info = {
    roleLevel5: req.body.roleLevel5,
    roleLevel6: req.body.roleLevel6,
    department: req.query.department,
    status: "active",
  };

  await db.level5And6Mapping
    .create(info)
    .then((data) => {
      return returnResponse(200, true, "Level Mapped Successfully", res, "");
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};

const getDataRole34 = async (req, res) => {
  await level3And4Mapping
    .findAll({
      include: [
        {
          model: Role,
          as: "first",
        },
        {
          model: Role,
          as: "second",
        },
      ],
    })
    .then((data) => {
      return returnResponse(
        200,
        "true",
        "Tag Roles Render Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(401, "true", err, res, "");
    });
};

const getDataRole45 = async (req, res) => {
  await level4And5Mapping
    .findAll({
      include: [
        {
          model: Role,
          as: "first",
        },
        {
          model: Role,
          as: "second",
        },
      ],
    })
    .then((data) => {
      return returnResponse(
        200,
        "true",
        "Tag Roles Render Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(401, "true", err, res, "");
    });
};
const getDataRole56 = async (req, res) => {
  await db.level5And6Mapping
    .findAll({
      include: [
        {
          model: Role,
          as: "first",
        },
        {
          model: Role,
          as: "second",
        },
      ],
    })
    .then((data) => {
      return returnResponse(
        200,
        true,
        "Tag Roles Render Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};
const getLevel34SingleRole = async (req, res) => {
  var id = req.params.id;
  await level3And4Mapping
    .findByPk(id, {
      include: [
        {
          model: Role,
          as: "first",
        },
        {
          model: Role,
          as: "second",
        },
      ],
    })
    .then((data) => {
      return returnResponse(
        200,
        "true",
        "Mapped Roles Render Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(401, "true", err, res, "");
    });
};
const getLevel45SingleRole = async (req, res) => {
  var id = req.params.id;
  await level4And5Mapping
    .findByPk(id, {
      include: [
        {
          model: Role,
          as: "first",
        },
        {
          model: Role,
          as: "second",
        },
      ],
    })
    .then((data) => {
      return returnResponse(
        200,
        "true",
        "Mapped Roles Render Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(401, "true", err, res, "");
    });
};
const getLevel56SingleRole = async (req, res) => {
  var id = req.params.id;
  await db.level5And6Mapping
    .findByPk(id, {
      include: [
        {
          model: Role,
          as: "first",
        },
        {
          model: Role,
          as: "second",
        },
      ],
    })
    .then((data) => {
      return returnResponse(
        200,
        true,
        "Mapped Roles Render Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};
const updateLevel34Mapping = async (req, res) => {
  const id = req.params.id;
  //console.log('>>id',id,'<><>',req.body);
  let info = {
    roleLevel3: req.body.roleLevel3,
    roleLevel4: req.body.roleLevel4,
  };
  await level3And4Mapping
    .update(info, {
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, true, "Successfully Updated", res, "");
      } else {
        return returnResponse(422, false, "Error Updated", res, "");
      }
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};
const updateLevel45Mapping = async (req, res) => {
  const id = req.params.id;
  // console.log(">>id", id, "<><>", req.body);
  let info = {
    roleLevel4: req.body.roleLevel4,
    roleLevel5: req.body.roleLevel5,
  };
  await level4And5Mapping
    .update(info, {
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, true, "Successfully Updated", res, "");
      } else {
        return returnResponse(422, false, "Error Updated", res, "");
      }
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};
const updateLevel56Mapping = async (req, res) => {
  const id = req.params.id;

  let info = {
    roleLevel5: req.body.roleLevel5,
    roleLevel6: req.body.roleLevel6,
  };
  await db.level5And6Mapping
    .update(info, {
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, true, "Successfully Updated", res, "");
      } else {
        return returnResponse(422, false, "Error Updated", res, "");
      }
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};
const deleteMapped34LevelRole = async (req, res) => {
  const id = req.params.id;
  await level3And4Mapping
    .destroy({
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, true, "Deleted Successfully", res, "");
      } else {
        return returnResponse(
          422,
          false,
          `Something went wrong!Can't delete Student with id=${id}.`,
          res,
          ""
        );
      }
    })
    .catch((err) => {
      return returnResponse(422, "true", err, res, "");
    });
};
const deleteMapped45LevelRole = async (req, res) => {
  const id = req.params.id;
  await level4And5Mapping
    .destroy({
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, "true", "Deleted Successfully", res, "");
      } else {
        return returnResponse(
          422,
          "true",
          `Something went wrong!Can't delete Student with id=${id}.`,
          res,
          ""
        );
      }
    })
    .catch((err) => {
      return returnResponse(422, "true", err, res, "");
    });
};
const deleteMapped56LevelRole = async (req, res) => {
  const id = req.params.id;
  await db.level5And6Mapping
    .destroy({
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, true, "Deleted Successfully", res, "");
      } else {
        return returnResponse(
          422,
          false,
          `Something went wrong!Can't delete Student with id=${id}.`,
          res,
          ""
        );
      }
    })
    .catch((err) => {
      return returnResponse(422, "true", err, res, "");
    });
};
const getAllCostCenter = async (req, res) => {
  if (req.query.role === "user") {
    await CostCenter.findAll({ where: { status: "active" } })
      .then((data) => {
        return returnResponse(
          200,
          true,
          "Cost Center Render Successfully",
          res,
          data
        );
      })
      .catch((err) => {
        return returnResponse(401, "true", err.message, res, "");
      });
  } else {
    await CostCenter.findAll({ where: {} })
      .then((data) => {
        return returnResponse(
          200,
          true,
          "Cost Center Render Successfully",
          res,
          data
        );
      })
      .catch((err) => {
        return returnResponse(401, "true", err.message, res, "");
      });
  }
};

const getDepartmentBasedCostCenter = async (req, res) => {
  await db.CostCenterUser.findAll({
    where: { status: "active", department: req.query.department },
    include: [
      {
        model: CostCenter,
        where: { status: "active" },
      },
    ],
  })
    .then((data) => {
      return returnResponse(
        200,
        true,
        "Cost Center Render Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(401, "true", err.message, res, "");
    });
};

const singleCostCenter = async (req, res) => {
  var id = req.params.id;
  await CostCenter.findByPk(id)
    .then((data) => {
      return returnResponse(
        200,
        true,
        "Cost Center Render Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(401, "true", err, res, "");
    });
};
const saveCostCenter = async (req, res) => {
  let info = {
    name: req.body.role,
    centerCode: req.body.centerCode,
    department: req.body.dept,
    status: "active",
  };
  await CostCenter.create(info)
    .then((data) => {
      return returnResponse(
        200,
        true,
        "Cost Center Created Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};
const deleteCostCenter = async (req, res) => {
  const id = req.params.id;
  await CostCenter.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, "true", "Deleted Successfully", res, "");
      } else {
        return returnResponse(
          422,
          "true",
          `Something went wrong!Can't delete Student with id=${id}.`,
          res,
          ""
        );
      }
    })
    .catch((err) => {
      return returnResponse(422, "true", err, res, "");
    });
};
const updateCostCenter = async (req, res) => {
  const id = req.params.id;
  let info = {
    name: req.body.role,
    centerCode: req.body.centerCode,
    department: req.body.department,
  };
  await CostCenter.update(info, {
    where: { id: id },
  })
    .then(async (num) => {
      if (num == 1) {
        await db.CostCenterUser.update(
          { department: req.body.department },
          {
            where: { centerID: id },
          }
        );
        return returnResponse(200, true, "Successfully Updated", res, "");
      } else {
        return returnResponse(422, false, "Error Updated", res, "");
      }
    })
    .catch((err) => {
      return returnResponse(422, "true", err, res, "");
    });
};
const createBARole = async (req, res) => {
  let info = {
    name: req.body.role.trim(),
    // department: req.body.department,
    status: "active",
  };
  await db.BusinessAnalyst.create(info)
    .then((data) => {
      return returnResponse(
        200,
        true,
        "BA Role Created Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};

const getAllBARoles = async (req, res) => {
  await db.BusinessAnalyst.findAll({ where: {} })
    .then((data) => {
      return returnResponse(200, true, "BA Render Successfully", res, data);
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};
const getActiveBARoles = async (req, res) => {
  await db.BusinessAnalyst.findAll({ where: { status: "active" } })
    .then((data) => {
      return returnResponse(
        200,
        true,
        "BA Role Render Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};
const singleBaRole = async (req, res) => {
  var id = req.params.id;
  await db.BusinessAnalyst.findByPk(id)
    .then((data) => {
      return returnResponse(200, true, "BA Render Successfully", res, data);
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};
const updateBaRole = async (req, res) => {
  const id = req.params.id;
  let info = {
    name: req.body.role.trim(),
    // department: req.body.department,
  };
  await db.BusinessAnalyst.update(info, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, true, "Successfully Updated", res, "");
      } else {
        return returnResponse(422, false, "Error Updated", res, "");
      }
    })
    .catch((err) => {
      return returnResponse(422, "true", err, res, "");
    });
};
const deleteBARole = async (req, res) => {
  const id = req.params.id;
  await db.BusinessAnalyst.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, true, "Deleted Successfully", res, "");
      } else {
        return returnResponse(
          422,
          false,
          `Something went wrong!Can't delete Student with id=${id}.`,
          res,
          ""
        );
      }
    })
    .catch((err) => {
      return returnResponse(422, "true", err, res, "");
    });
};
const baRoleStaus = async (req, res) => {
  let id = req.params.id;
  let status = null;
  await db.BusinessAnalyst.findOne({ where: { id: id } })
    .then((data) => {
      if (data.status == "active") {
        status = "inactive";
      } else {
        status = "active";
      }
      db.BusinessAnalyst.update({ status: status }, { where: { id: id } })
        .then((num) => {
          if (num == 1) {
            return returnResponse(200, true, "Successfully Updated", res, "");
          } else {
            return returnResponse(422, false, "Error Updated", res, "");
          }
        })
        .catch((err) => {
          return returnResponse(422, false, err, res, "");
        });
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};
const updateStatusCostCenter = async (req, res) => {
  let id = req.params.id;
  let status = null;
  await db.CostCenter.findOne({ where: { id: id } })
    .then((data) => {
      if (data.status == "active") {
        status = "inactive";
      } else {
        status = "active";
      }
      db.CostCenter.update({ status: status }, { where: { id: id } })
        .then((num) => {
          if (num == 1) {
            return returnResponse(200, true, "Successfully Updated", res, "");
          } else {
            return returnResponse(422, false, "Error Updated", res, "");
          }
        })
        .catch((err) => {
          return returnResponse(422, false, err, res, "");
        });
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};
const getBaDepartment = async (req, res) => {
  var id = req.params.id;
  await db.BusinessAnalyst.findByPk(id)
    .then((data) => {
      return returnResponse(200, true, "BA Render Successfully", res, data);
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};
const singleCostCenterUser = async (req, res) => {
  const id = req.params.id;
  await db.CostCenterUser.findByPk(id, {
    include: [
      {
        model: db.CostCenter,
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
          "Cost Center User render Successfully",
          res,
          data
        );
      } else {
        res.status(404).send({
          message: `Cannot find User with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      console.log(err.message);
      return returnResponse(422, false, err.message, res, "");
    });
};

const updateCostCenterUser = async (req, res) => {
  const id = req.params.id;
  await db.CostCenterUser.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, true, "Successfully Updated", res, "");
      } else {
        return returnResponse(422, false, "Error Updated", res, "");
      }
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};
export {
  createRoles,
  getRoles,
  editRoles,
  getSingleRole,
  deleteRole,
  createLevel,
  getLevels,
  getSingleLevel,
  tagRole,
  tagRoleList,
  singleTagRole,
  EditTagRole,
  deleteTagRole,
  getLevelBasedRole,
  SaveRelationMapping34,
  SaveRelationMapping45,
  getDataRole34,
  getDataRole45,
  getLevel34SingleRole,
  updateLevel34Mapping,
  deleteMapped34LevelRole,
  deleteMapped45LevelRole,
  getLevel45SingleRole,
  updateLevel45Mapping,
  getDeptRoles,
  getAllCostCenter,
  singleCostCenter,
  saveCostCenter,
  deleteCostCenter,
  updateCostCenter,
  SaveRelationMapping56,
  getDataRole56,
  deleteMapped56LevelRole,
  getLevel56SingleRole,
  updateLevel56Mapping,
  createBARole,
  getAllBARoles,
  singleBaRole,
  updateBaRole,
  deleteBARole,
  baRoleStaus,
  updateStatusCostCenter,
  getBaDepartment,
  getDepartmentBasedCostCenter,
  singleCostCenterUser,
  updateCostCenterUser,
  getActiveBARoles,
};
