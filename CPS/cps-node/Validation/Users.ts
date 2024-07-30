import db from "../models";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { returnResponse } from "../helper/helper";
const User = db.User;
const permission_admin = db.permission_admin;

import { Op } from "sequelize";

export const userValidate = async (req: any, res: any, next: any) => {
  const checkEmail = await User.findOne({
    where: {
      [Op.or]: [{ email: req.body.email }, { name: req.body.name }],
      status: { [Op.ne]: "deleted" },
    },
  });
  if (checkEmail) {
    return res.status(422).send({
      status: false,
      message: "Email Or UserId Already Exist",
      status_code: 422,
    });
  }
  return next();
};

export const PasswordValidate = async (req: any, res: any, next: any) => {
  User.findOne({
    where: {
      id: req.query.UserId,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(422).send({ message: "User Not found." });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.oldpassword,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(422).send({
          status: false,
          message: "Old Password Not Match",
          status_code: 422,
        });
      } else {
        return next();
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

export const isGM = async (req: any, res: any, next: any) => {
  if (req.body.isGM === "yes") {
    await User.count({ where: { isGM: "yes", status: { [Op.ne]: "deleted" } } })
      .then((count) => {
        console.log("count", count);
        if (count >= 1) {
          return res.status(422).send({
            status: false,
            message: "GM Already Exist",
            status_code: 422,
          });
        } else {
          return next();
        }
      })
      .catch((err) => {
        res.status(422).send({ message: err.message });
      });
  } else {
    return next();
  }
};
export const isCommercialUser = async (req: any, res: any, next: any) => {
  await User.count({
    where: {
      dept_roleId: req.body.dept_roleId,
      status: { [Op.notIn]: ["deleted", "deactive"] },
    },
  })
    .then((count) => {
      // console.log("count", count);
      if (count >= 1) {
        return res.status(422).send({
          status: false,
          message: "This Role's User Already Exist",
          status_code: 422,
        });
      } else {
        return next();
      }
    })
    .catch((err) => {
      res.status(422).send({ message: err.message });
    });
};

export const scheckAdminPrivilege = async (req: any, res: any, next: any) => {
  // console.log(req.body);
  // return;
  permission_admin
    .count({
      where: { permissionId: req.body.permissionId, adminId: req.body.adminId },
    })
    .then((response) => {
      if (response) {
        return returnResponse(
          422,
          "true",
          "Permission Already Assigned",
          res,
          ""
        );
      } else {
        return next();
      }
    });
};

export const checkUserId = async (req: any, res: any, next: any) => {
  if (req.body.name.trim() !== req.body.hiddenValue) {
    await User.count({
      where: { name: req.body.name, status: { [Op.ne]: "deleted" } },
    })
      .then((count) => {
        if (count >= 1) {
          return res.status(422).send({
            status: false,
            message: "UserId Already Exists",
            status_code: 422,
          });
        } else {
          return next();
        }
      })
      .catch((err) => {
        res.status(422).send({ message: err.message });
      });
  }
  if (req.body.role != req.body.oldRole) {
    var filter;
    if (req.query.userType == "NotBA") {
      filter = {
        dept_roleId: req.body.role,
        status: { [Op.notIn]: ["deleted", "deactive"] },
      };
    } else {
      filter = {
        baID: req.body.baID,
        status: { [Op.notIn]: ["deleted", "deactive"] },
      };
    }

    db.User.findAll({
      where: filter,
    })
      .then(async (data) => {
        if (data.length == 1) {
          if (data[0].dataValues.delegationUserID) {
            return res.status(422).send({
              status: false,
              message:
                "The previous user of this role holds delegation, first remove the delegation and then update the role.",
              status_code: 422,
            });
          }

          await db.DirectorAndReviewerApprover.update(
            { userID: req.body.currentUserID },
            {
              where: { status: "pending", userID: data[0].dataValues.id }, // Updated where condition
            }
          )
            .then((num) => {
              if (num) {
                return next();
              } else {
                return returnResponse(422, false, "Error", res, "");
              }
            })
            .catch((err) => {
              return returnResponse(422, "true", err.message, res, "");
            });
        } else {
          return next();
        }
      })
      .catch((err) => {
        return res.status(500).send({
          message: "Error retrieving User",
        });
      });
  } else {
    return next();
  }
};
export const costUserValidate = async (req: any, res: any, next: any) => {
  const checkUser = await db.CostCenterUser.findOne({
    where: {
      centerID: req.body.centerID,
    },
  });
  if (checkUser) {
    return res.status(422).send({
      status: false,
      message: "User already exists for this cost center",
      status_code: 422,
    });
  }
  return next();
};

export const BaUserValidate = async (req: any, res: any, next: any) => {
  const checkUser = await db.User.findOne({
    where: {
      baID: req.body.baID,
      status: "active",
    },
  });
  if (checkUser) {
    return res.status(422).send({
      status: false,
      message: "This BA Role Already Occupied",
      status_code: 422,
    });
  }
  return next();
};

export const checkPendingActionOfUser = async (
  req: any,
  res: any,
  next: any
) => {
  if (req.query.status == "active") {
    const checkUser = await db.DirectorAndReviewerApprover.findOne({
      where: {
        userID: req.params.id ? req.params.id : 0,
        status: "pending",
      },
    });
    if (checkUser) {
      return res.status(422).send({
        code: false,
        message: "This user have pending approval action , Can't inactive",
        status: 422,
      });
    }
    return next();
  } else {
    return next();
  }
};

export const updateCostCenterApprover = async (
  req: any,
  res: any,
  next: any
) => {
  if (
    req.body.centerID != req.body.oldCostCenterID ||
    req.body.userID != req.body.oldUserID
  ) {
    if (
      req.body.userID != req.body.oldUserID &&
      req.body.centerID == req.body.oldCostCenterID
    ) {
      let data = await db.DirectorAndReviewerApprover.update(
        { userID: req.body.userID },
        {
          where: {
            status: "pending",
            userID: req.body.oldUserID,
            type: "cost_center",
          }, // Updated where condition
        }
      );
      if (data) {
        return next();
      }
    }
    if (
      req.body.centerID != req.body.oldCostCenterID &&
      req.body.userID == req.body.oldUserID
    ) {
      const checkUser = await db.CostCenterUser.findAll({
        where: {
          centerID: req.body.centerID ? req.body.centerID : 0,
          status: "active",
        },
      });
      if (checkUser.length == 1) {
        await db.DirectorAndReviewerApprover.update(
          { userID: req.body.userID },
          {
            where: {
              status: "pending",
              type: "cost_center",
              userID: checkUser[0].dataValues.userID,
            },
          }
        )
          .then((num) => {
            if (num) {
              return next();
            } else {
              return returnResponse(422, false, "Error", res, "");
            }
          })
          .catch((err) => {
            return returnResponse(422, "true", err.message, res, "");
          });
      } else {
        return next();
      }
    }
    if (
      req.body.centerID != req.body.oldCostCenterID &&
      req.body.userID != req.body.oldUserID
    ) {
      const checkUser = await db.CostCenterUser.findAll({
        where: {
          centerID: req.body.centerID ? req.body.centerID : 0,
          status: "active",
        },
      });
      if (checkUser.length == 1) {
        await db.DirectorAndReviewerApprover.update(
          { userID: req.body.userID },
          {
            where: {
              status: "pending",
              type: "cost_center",
              userID: checkUser[0].dataValues.userID,
            },
          }
        )
          .then((num) => {
            if (num) {
              return next();
            } else {
              return returnResponse(422, false, "Error", res, "");
            }
          })
          .catch((err) => {
            return returnResponse(422, "true", err.message, res, "");
          });
      } else {
        return next();
      }
    }
  } else {
    return next();
  }
};
