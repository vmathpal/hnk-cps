import db from "../../models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { response } from "express";
import { Op, where } from "sequelize";
import { sendUserCreatedMail, sendAdminCreatedMail } from "./emailController";
import { returnResponse } from "../../helper/helper";
import * as Log from "../../audit-log/auditLog";
import moment from "moment";
// Initialize
var ActiveDirectory = require("activedirectory");
const { authenticate } = require("ldap-authentication");
var ldap = require("ldapjs");

const jwtkey = "abcdefg";

// create main Model
const User = db.User;
const Role = db.role;
const Token = db.token;
const Project = db.Project;
const Level = db.Level;
const Permission = db.permission;
const PermissionAdmin = db.permission_admin;

// main work

const addRegister = async (req, res) => {
  // console.log(req.body);
  // return;
  if (req.body.role !== "") {
    const salt = await bcrypt.genSalt(10);
    // let pass = req.body.password.toString();
    let isGm = req.body.isGM === "yes" ? req.body.isGM : "no";
    let info = {
      name: req.body.name.trim(),
      email: req.body.email.trim(),
      role: "user",
      department: req.body.dept,
      // mobile: req.body.phone,
      dept_roleId: req.body.role,
      status: "active",
      level: req.body.level,
      isGM: isGm,
      // password: await bcrypt.hash(pass, parseInt(salt)),
    };
    let user_data = {
      userId: req.body.name,
      email: req.body.email,
      url: process.env.WEB_URL,
    };
    User.create(info)
      .then((data) => {
        sendUserCreatedMail(user_data);
        return returnResponse(
          200,
          "true",
          "User Created Successfully",
          res,
          ""
        );
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Error occurred while creating the Student.",
        });
      });
  } else {
    return returnResponse(423, "true", "Role is required", res, "");
  }
};

const RegisterCommercialUser = async (req, res) => {
  let info = {
    name: req.body.name.trim(),
    email: req.body.email.trim(),
    role: "user",
    dept_roleId: req.body.dept_roleId,
    status: "active",
    level: req.body.level,
  };
  User.create(info)
    .then((data) => {
      return returnResponse(200, true, "User Created Successfully", res, data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error occurred while creating the Student.",
      });
    });
};
const Login = (req, res) => {
  // console.log('aya>>>>>>>>');
  User.findOne({
    where: {
      email: req.body.email,
      role: {
        [Op.in]: ["super_admin", "sub_admin"],
      },
      status: {
        [Op.ne]: "deleted",
      },
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(422).send({ message: "User Not found." });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(422).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }
      if (user.status === "deactive") {
        return returnResponse(
          422,
          "false",
          "Your account is deactivated, please contact your Admin.",
          res,
          ""
        );
      }
      var token = jwt.sign({ id: user.id, email: user.email }, jwtkey, {
        //expiresIn: 86400, // 24 hours
      });

      Token.findOne({ where: { userId: user.id } }).then((response) => {
        //console.log('<<<<<<<<<<<<<<<<<<',response);
        if (response) {
          return Token.update({ token: token }, { where: { userId: user.id } });
        }
        // insert
        return Token.create({ token: token, userId: user.id });
      });

      res.status(200).send({
        id: user.id,
        username: user.name,
        email: user.email,
        accessToken: token,
        status: user.status,
        role: user.role,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

//Get All USer
const getAllUsers = async (req, res) => {
  await User.findAll({
    where: {
      status: { [Op.ne]: "deleted" },
      isBA: { [Op.eq]: null },
      role: { [Op.eq]: "user" },
    },

    include: [
      {
        model: Role,
        as: "roleName",
      },
    ],
    order: [["id", "DESC"]],
  })
    .then((data) => {
      return returnResponse(
        200,
        "true",
        "Users Render Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(422, "true", err.message, res, "");
    });
};
const getDelegationUsers = async (req, res) => {
  await User.findAll({
    where: {
      status: { [Op.ne]: "deleted" },
      delegationUserID: { [Op.ne]: null },
    },

    include: [
      {
        model: User,
        as: "delegation",
      },
    ],
    order: [["id", "DESC"]],
  })
    .then((data) => {
      return returnResponse(
        200,
        "true",
        "Users Render Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(422, "true", err.message, res, "");
    });
};
const getAllUsersForCostCenter = async (req, res) => {
  await User.findAll({
    where: {
      status: { [Op.eq]: "active" },
      isBA: { [Op.eq]: null },
      level: { [Op.notIn]: ["level1", "level2"] },

      role: { [Op.eq]: "user" },
    },

    include: [
      {
        model: Role,
        as: "roleName",
      },
    ],
    order: [["id", "DESC"]],
  })
    .then((data) => {
      return returnResponse(
        200,
        "true",
        "Users Render Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(422, "true", err.message, res, "");
    });
};
const updateStatus = async (req, res) => {
  try {
    let id = req.params.id;
    console.log("param id>>>", req.params.id);
    const user = await User.findOne({ where: { id: id } });
    console.log(user.status);
    if (user.status === "active") {
      User.update({ status: "inactive" }, { where: { id: req.params.id } });
    } else {
      User.update({ status: "active" }, { where: { id: req.params.id } });
    }
    return returnResponse(200, "true", "Status Update Successfully", res, "");
  } catch (err) {
    console.log("status error>>", err);
  }
};

const getOneUser = async (req, res) => {
  let id = req.params.id;
  const user = await User.findOne({ where: { id: id } });
  return res.status(200).send(user);
};
const deleteUser = async (req, res) => {
  let id = req.params.id;
  await User.destroy({ where: { id: id } });
  return res.status(200).send("User is deleted !");
};

const CreateProject = async (req, res) => {
  try {
    let info = {
      name: req.body.project,
      userId: req.body.userID,
    };

    const project = await Project.create(info);
    res.status(200).send(project);
  } catch (err) {
    console.log(err);
  }
  //console.log('all data',user)
};
const getAllProject = async (req, res) => {
  let data = await User.findAll({ include: [Project] });
  return res.status(200).send(data);
  //console.log('>>><<<<<<<<<',data);
};
const getUsers = async (req, res) => {
  //console.log(req);
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search_query || "";
  const offset = limit * page;
  const totalRows = await User.count({
    where: {
      [Op.or]: [
        {
          name: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          email: {
            [Op.like]: "%" + search + "%",
          },
        },
      ],
      role: "user",
    },
  });
  const totalPage = Math.ceil(totalRows / limit);
  const result = await User.findAll({
    where: {
      [Op.or]: [
        {
          name: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          email: {
            [Op.like]: "%" + search + "%",
          },
        },
      ],
      role: "user",
      status: {
        [Op.ne]: "deleted",
      },
    },
    include: [
      {
        model: Role,
        as: "roleName",
      },
    ],
    offset: offset,
    limit: limit,
    order: [["id", "DESC"]],
  });
  return res.json({
    result: result,
    page: page,
    limit: limit,
    totalRows: totalRows,
    totalPage: totalPage,
  });
};
const getAllCount = async (req, res) => {
  try {
    let userCount = await User.count({
      where: { role: "user", status: "active" },
    });
    let roleCount = await Role.count({ where: { status: "active" } });
    let centerCount = await db.CostCenter.count({
      where: { status: "active" },
    });
    let levelCount = await Level.count({});
    return res.send({
      userCount,
      roleCount,
      levelCount,
      centerCount,
    });
  } catch (err) {
    return returnResponse(422, "true", err, res, "");
  }
};
const subAdminCreation = async (req, res) => {
  const salt = await bcrypt.genSalt(10);

  let info = {
    name: req.body.name,
    email: req.body.email,
    role: "sub_admin",
    mobile: req.body.phone,
    status: "active",
    isGM: req.body.isGM,
    password: await bcrypt.hash(req.body.password, salt),
  };
  let user_data = {
    name: req.body.name,
    email: req.body.email,
    pass: req.body.password,
    url: process.env.ADMIN_URL,
  };

  User.create(info)
    .then((data) => {
      sendAdminCreatedMail(user_data);
      return returnResponse(200, "true", "User Created Successfully", res, "");
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error occurred while creating the Student.",
      });
    });
};
//Get All USer
const getAllSubAdmin = async (req, res) => {
  await User.findAll({
    where: { role: "sub_admin", status: { [Op.ne]: "deleted" } },
    order: [["id", "DESC"]],
  })
    .then((data) => {
      return returnResponse(
        200,
        "true",
        "Admin Render Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(422, "true", err.message, res, "");
    });
};
const deleteSubAdmin = async (req, res) => {
  const id = req.params.id;
  await Token.update({ token: null }, { where: { id: req.params.id } });
  await User.update(
    { status: "deleted" },
    {
      where: { id: id },
    }
  )
    .then(async (num) => {
      if (num == 1) {
        await db.CostCenterUser.destroy({
          where: { userID: req.params.id },
        });
        return returnResponse(200, "true", "Cancelled Successfully", res, "");
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
const deleteDelegation = async (req, res) => {
  const id = req.params.id;
  let user = await User.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: db.User,
        as: "delegation",
      },
    ],
  });

  await User.update(
    {
      assignStartDate: null,
      assignEndDate: null,
      delegationUserID: null,
    },
    {
      where: { id: id },
    }
  )
    .then(async (num) => {
      if (num == 1) {
        await db.DirectorAndReviewerApprover.update(
          {
            delegationUserID: null,
            userID: id,
            delegationRoll: null,
          },
          {
            where: {
              delegationUserID: id,
              status: "pending",
            },
          }
        );

        const auditLog = {
          userID: id,
          message: `Admin has canceled the delegation before it expires.`,
          userName: user.email.split("@")[0],
          projectName: "N/A",
          actionBy: "Admin",
          comment: null,
          isAuditLog: "true",
          createdAt: moment().format("YYYY-MM-DD H:m"),
          delegatedUser: user.delegation?.email.split("@")[0],
          user: user.email.split("@")[0],
          startDate: moment(new Date(user.assignStartDate)).format(
            "D-MMM-YY H:m"
          ),
          endDate: moment(new Date(user.assignEndDate)).format("D-MMM-YY H:m"),
        };

        Log.Auditlogs(auditLog, false);
        return returnResponse(200, "true", "Cancelled Successfully", res, "");
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
const getSingleSubAdmin = async (req, res) => {
  const id = req.params.id;
  await User.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Sub admin role with id=${id}.`,
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

const getAllList = async (req, res) => {
  if (req.query.userRole === "super_admin") {
    await Permission.findAll({ order: [["sequence", "ASC"]] })
      .then((data) => {
        return returnResponse(
          200,
          true,
          "Admin Dashboard List Render Successfully",
          res,
          data
        );
      })
      .catch((err) => {
        return returnResponse(401, "true", err.message, res, "");
      });
  } else {
    await PermissionAdmin.findAll({
      where: { adminID: req.query.userID },
      include: {
        model: Permission,
        where: {
          status: "active",
        },
      },
    })
      .then((data) => {
        if (data) {
          return returnResponse(
            200,
            "true",
            "Dashboard List Render Successfully",
            res,
            data
          );
        } else {
          res.status(404).send({
            message: `Cannot find Admin ID with id`,
          });
        }
      })
      .catch((err) => {
        console.log(err.message);
        res.status(500).send({
          message: "Error retrieving Level with id=",
        });
      });
  }
};
const updateAdminStatus = async (req, res) => {
  try {
    let id = req.params.id;
    const user = await User.findOne({ where: { id: id } });
    let status = null;
    if (user.status === "active") {
      status = "deactive";
      await Token.update({ token: null }, { where: { id: req.params.id } });
    } else status = "active";
    await User.update({ status: status }, { where: { id: req.params.id } });
    return returnResponse(200, "true", "Status Update Successfully", res, "");
  } catch (err) {
    console.log("status error>>", err);
  }
};
const subAdminRole = async (req, res) => {
  let info: any;
  let data: any;
  try {
    req.body.permissionId.forEach((element) => {
      info = {
        actions: req.body.actions,
        adminId: req.body.adminId,
        permissionId: element,
      };
      data = PermissionAdmin.create(info);
    });
    if (data) {
      return returnResponse(
        200,
        "true",
        "Role Action Tagged Successfully",
        res,
        ""
      );
    } else {
      return returnResponse(
        422,
        "true",
        `Something went wrong!Can't delete Student`,
        res,
        ""
      );
    }
  } catch (err) {
    console.log("status error>>", err);
  }
};
const adminRoleActionList = async (req, res) => {
  const id = req.params.id;
  await PermissionAdmin.findAll({
    where: { adminId: id },
    include: [Permission],
  })
    .then((data) => {
      return returnResponse(
        200,
        "true",
        "Admin Role Render Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(401, "true", err, res, "");
    });
};
const getSinglePrivilege = async (req, res) => {
  const id = req.params.id;
  await PermissionAdmin.findByPk(id, { include: [Permission] })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find privilege role with id=${id}.`,
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
const UpdateSubAdmin = async (req, res) => {
  const id = req.params.id;
  User.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        return returnResponse(
          200,
          "true",
          "Successfully Updated Sub Admin",
          res,
          ""
        );
      } else {
        return returnResponse(401, "true", "Successfully Sub Admin", res, "");
      }
    })
    .catch((err) => {
      return returnResponse(422, "true", err.message, res, "");
    });
};
const deleteSubAdminAccessRole = async (req, res) => {
  const id = req.params.id;
  await PermissionAdmin.destroy({
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
const AdminChangePassword = async (req, res) => {
  const id = req.query.UserId;
  const salt = await bcrypt.genSalt(10);
  let pass = req.body.password.toString();
  let info = {
    password: await bcrypt.hash(pass, parseInt(salt)),
  };
  User.update(info, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        return returnResponse(
          200,
          true,
          "Password Update Successfully",
          res,
          ""
        );
      } else {
        return returnResponse(401, false, "Error", res, "");
      }
    })
    .catch((err) => {
      return returnResponse(422, "true", err.message, res, "");
    });
};
const AdminCcEmail = async (req, res) => {
  const id = req.query.UserId;

  let info = {
    ccEmail: req.body.ccEmail,
  };
  User.update(info, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        return returnResponse(
          200,
          true,
          "Password Update Successfully",
          res,
          ""
        );
      } else {
        return returnResponse(401, false, "Error", res, "");
      }
    })
    .catch((err) => {
      return returnResponse(422, "true", err.message, res, "");
    });
};

const getSingleUser = async (req, res, next: any) => {
  const id = req.params.id ? req.params.id : 0;

  const Data = await User.findByPk(id, {});
  if (Data) {
    if (Data.isBA === "true") {
      await User.findByPk(id, {
        include: [
          {
            model: db.BusinessAnalyst,
          },
        ],
      })
        .then((data) => {
          if (data) {
            res.send(data);
          } else {
            res.status(404).send({
              message: `Cannot find User with id=${id}.`,
            });
          }
        })
        .catch((err) => {
          console.log(err.message);
          res.status(500).send({
            message: "Error retrieving BA User with id=" + id,
          });
        });
    } else {
      await User.findByPk(id, {
        include: [
          {
            model: Role,
            as: "roleName",
          },
        ],
      })
        .then((data) => {
          if (data) {
            res.send(data);
          } else {
            res.status(404).send({
              message: `Cannot find User with id=${id}.`,
            });
          }
        })
        .catch((err) => {
          console.log(err.message);
          res.status(500).send({
            message: "Error retrieving User with id=" + id,
          });
        });
    }
  } else {
    return next();
  }
};
const updateUser = async (req, res) => {
  const id = req.params.id;
  Role.findOne({
    where: {
      id: req.body.role,
    },
    attributes: ["department"],
  })
    .then((data) => {
      if (req.body.department !== data.department) {
        return returnResponse(423, false, "Please Select Role", res, "");
      } else {
        let info = {
          name: req.body.name.trim(),
          email: req.body.email.trim(),
          department: req.body.department,
          mobile: req.body.phone,
          dept_roleId: req.body.role,
          level: req.body.level,
        };
        User.update(info, {
          where: { id: id },
        })
          .then((num) => {
            if (num == 1) {
              return returnResponse(
                200,
                true,
                "User Update Successfully",
                res,
                ""
              );
            } else {
              return returnResponse(401, false, "Error", res, "");
            }
          })
          .catch((err) => {
            return returnResponse(422, "true", err.message, res, "");
          });
      }
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};
const getAllEmailTemplates = async (req, res) => {
  await db.email_templates
    .findAll({})
    .then((data) => {
      return returnResponse(
        200,
        "true",
        "Email Templates Render Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(401, "true", err.message, res, "");
    });
};

const getSingleEmailTemplates = async (req, res) => {
  const id = req.params.id;
  await db.email_templates
    .findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Email with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({
        message: "Error retrieving Email with id=" + id,
      });
    });
};
const updateEmailTemplates = async (req, res) => {
  const id = req.params.id;
  db.email_templates
    .update(req.body, {
      where: { id: id },
    })
    .then((num) => {
      if (num == 1) {
        return returnResponse(
          200,
          "true",
          "Successfully Updated Email Template",
          res,
          ""
        );
      } else {
        return returnResponse(401, "true", "Error", res, "");
      }
    })
    .catch((err) => {
      return returnResponse(422, "true", err.message, res, "");
    });
};
const UpdatePrivilege = async (req, res) => {
  const id = req.params.id;
  await PermissionAdmin.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        return returnResponse(200, true, "Successfully Updated", res, "");
      } else {
        return returnResponse(401, false, "Error Updated", res, "");
      }
    })
    .catch((err) => {
      return returnResponse(422, false, err, res, "");
    });
};
const createBaUser = async (req, res) => {
  let info = {
    name: req.body.name.trim(),
    department: req.body.department,
    email: req.body.email.trim(),
    baID: req.body.baID,
    role: "user",
    status: "active",
    level: "level1",
    isBA: "true",
  };
  let user_data = {
    userId: req.body.name,
    email: req.body.email.trim(),
    url: process.env.WEB_URL,
  };
  User.create(info)
    .then((data) => {
      sendUserCreatedMail(user_data);
      return returnResponse(200, true, "User Created Successfully", res, "");
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error occurred while creating the Student.",
      });
    });
};
const getAllBAUsers = async (req, res) => {
  await db.BusinessAnalyst.findAll({
    where: {
      status: "active",
      // department: { [Op.ne]: "" },
    },
    include: [{ model: db.User, required: true }],
    order: [["id", "DESC"]],
  })
    .then((data) => {
      return returnResponse(
        200,
        true,
        "BA Users Render Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};
const baUserStatus = async (req, res) => {
  let id = req.params.id;
  let status = null;
  await db.User.findOne({ where: { id: id } })
    .then((data) => {
      if (data.status == "active") {
        status = "deactive";
      } else {
        status = "active";
      }
      db.User.update({ status: status }, { where: { id: id } })
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
const deleteBaUser = async (req, res) => {
  const id = req.params.id;
  await Token.update({ token: null }, { where: { id: req.params.id } });
  await User.update(
    { status: "deleted" },
    {
      where: { id: id },
    }
  )
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
      return returnResponse(422, false, err.message, res, "");
    });
};

const singleBaUser = async (req, res) => {
  const id = req.params.id;
  await User.findByPk(id, {
    include: [
      {
        model: db.BusinessAnalyst,
      },
    ],
  })
    .then((data) => {
      if (data) {
        return returnResponse(200, true, "Data render Successfully", res, data);
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
const updateBaUser = async (req, res) => {
  const id = req.params.id;
  let info = {
    name: req.body.name.trim(),
    baID: req.body.baID,
  };
  await db.User.update(info, {
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
const getAllBAUsersList = async (req, res) => {
  await User.findAll({
    where: {
      role: "user",
      status: { [Op.ne]: "deleted" },
      isBA: { [Op.eq]: "true" },
    },
    include: [
      {
        model: db.BusinessAnalyst,
      },
    ],
    order: [["id", "DESC"]],
  })
    .then((data) => {
      return returnResponse(
        200,
        true,
        "BA Users Render Successfully",
        res,
        data
      );
    })
    .catch((err) => {
      return returnResponse(422, false, err.message, res, "");
    });
};
export {
  deleteDelegation,
  AdminCcEmail,
  deleteUser,
  getAllUsers,
  addRegister,
  Login,
  updateStatus,
  CreateProject,
  getAllProject,
  getUsers,
  getAllCount,
  subAdminCreation,
  getAllSubAdmin,
  deleteSubAdmin,
  getSingleSubAdmin,
  getAllList,
  updateAdminStatus,
  subAdminRole,
  adminRoleActionList,
  getSinglePrivilege,
  UpdateSubAdmin,
  deleteSubAdminAccessRole,
  AdminChangePassword,
  getSingleUser,
  updateUser,
  getAllEmailTemplates,
  getSingleEmailTemplates,
  updateEmailTemplates,
  UpdatePrivilege,
  createBaUser,
  getAllBAUsers,
  baUserStatus,
  deleteBaUser,
  singleBaUser,
  updateBaUser,
  RegisterCommercialUser,
  getAllUsersForCostCenter,
  getAllBAUsersList,
  getDelegationUsers,
};
