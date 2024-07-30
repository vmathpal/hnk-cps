import db from "../models";
import { Op } from "sequelize";
import { returnResponse } from "../helper/helper";
import { nextTick } from "process";

export const checkStep = async (req: any, res: any, next: any) => {
  var responseData = {} as any;

  var condition = {};
  if (Number.isInteger(parseInt(req.query.projectID))) {
    condition = { id: req.query.projectID, userID: req.query.userID };
  } else {
    condition = { id: 0, userID: req.query.userID };
  }

  const project = await db.Project.findOne({
    where: condition,
    include: [db.ProjectAreaDistrict, db.ProjectBrand],
  });

  if (project && !req.body.projectType) {
    if (req.body.length) {
      if (req.body[0].allocationPercent) {
        const budget = req.query.amount;

        var percent = 0;
        var total = 0;
        req.body.forEach(async (element) => {
          percent = percent + parseInt(element.allocationPercent);
          total = total + parseFloat(element.allocation);
        });

        if (percent > 100) {
          responseData.message =
            "Project allocation percent should not be greater than 100.";
          responseData.success = false;
          responseData.data = {};

          return res.status(422).json(responseData);
        }
        if (percent < 100) {
          responseData.message =
            "Project allocation percent should not be less than 100.";
          responseData.success = false;
          responseData.data = {};

          return res.status(422).json(responseData);
        }
        if (budget) {
          // console.log("Budget", budget, "Total", total);
          if (Math.round(budget) != Math.round(total)) {
            responseData.message =
              "Please reinitialize allocation(%) for each brand.";
            responseData.success = false;
            responseData.data = {};

            return res.status(422).json(responseData);
          }
        } else {
          responseData.message = "Budget Amount is required.";
          responseData.success = false;
          responseData.data = {};

          return res.status(422).json(responseData);
        }

        return next();
      }
    }
    if (project.ProjectAreaDistricts.length || req.body.channelID) {
      if (req.body.channelID) {
        return next();
      }

      if (project.ProjectBrands.length || req.body.brandID) {
        if (req.body.brandID) {
          return next();
        }
        if (project.ProjectBrands.length) {
          if (!project.ProjectBrands[0].allocationPercent) {
            // console.log(req.body.brandID, project.ProjectBrands);
            responseData.message = "Please fill the Project Budget.";
            responseData.success = false;
            responseData.data = {};

            return res.status(422).json(responseData);
          } else {
            return next();
          }
        }
      } else {
        responseData.message = "Please fill the  Choose brand.";
        responseData.success = false;
        responseData.data = {};

        return res.status(422).json(responseData);
      }
    } else {
      responseData.message = "Please fill the Area And District.";
      responseData.success = false;
      responseData.data = {};

      return res.status(422).json(responseData);
    }
  } else {
    if (req.body.projectType) {
      return next();
    }
    responseData.message = "Please fill the basic information.";
    responseData.success = false;
    responseData.data = {};
    return res.status(422).json(responseData);
  }
};
