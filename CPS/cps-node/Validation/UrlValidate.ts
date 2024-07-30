import db from "../models";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { returnResponse } from "../helper/helper";
const Role = db.role;
const PermissionAdmin = db.permission_admin;
const Permission = db.permission;

export const urlValidate = async (req: any, res: any, next: any) => {
  if (req.query.role === "sub_admin") {
    await PermissionAdmin.findAll({
      where: { adminID: req.query.userID },
      include: {
        model: Permission,
        where: {
          route: {
            [Op.eq]: req.query.url,
          },
        },
      },
    })
      .then(function (data) {
        // console.log(data);
        if (!data.length) {
          return returnResponse(423, false, "Permission Denied", res, "");
        }
        return next();
      })
      .catch(function (err) {
        console.log("Oops! something went wrong, : ", err);
      });
  } else {
    return next();
  }
};
