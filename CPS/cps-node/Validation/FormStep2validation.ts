import db from "../models";
import { Op } from "sequelize";
import { returnResponse } from "../helper/helper";

export const SecondForm = async (req: any, res: any, next: any) => {
  var responseData = {} as any;
  try {
    const project = await db.Project.findOne({
      where: {
        id: req.params.id ? req.params.id : req.body.projectID,
      },
      include: [db.ProjectExpense, db.ProjectFile],
    });
    // if (req.body.userID) {
    //   if (req.body.userID.length == 0) {
    //     responseData.message = "Reviewer is required.";
    //     responseData.success = false;
    //     responseData.data = {};
    //     responseData.code = 423;

    //     return res.status(423).json(responseData);
    //   }
    // }

    if (project.ProjectExpenses.length || req.body.expenseID) {
      return next();
    } else {
      responseData.message = "Please fill Project Expense section first.";
      responseData.success = false;
      responseData.data = {};

      return res.status(422).json(responseData);
    }
  } catch (err) {
    console.log("error", err);
  }
};
