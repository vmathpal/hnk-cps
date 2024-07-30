import db from "../models";
import { Op } from "sequelize";
import { returnResponse } from "../helper/helper";

export const validateChannel = async (req: any, res: any, next: any) => {
  try {
    //     console.log(req.body);
    if (req.body.hidden_value !== req.body.name.trim()) {
      db.Channel.count({
        where: {
          name: req.body.name.trim(),
        },
      }).then((response) => {
        if (response) {
          return returnResponse(422, false, "Channel Already Exists", res, "");
        } else {
          return next();
        }
      });
    } else {
      return next();
    }
  } catch (err) {
    console.log("error", err);
  }
};
export const validateBrand = async (req: any, res: any, next: any) => {
  try {
    if (req.body.hidden_value !== req.body.name.trim()) {
      db.Brand.count({
        where: {
          [Op.or]: [
            { brandCode: req.body.brandCode.trim() },
            { name: req.body.name.trim() },
          ],
        },
      }).then((response) => {
        if (response) {
          return returnResponse(
            422,
            false,
            "Brand Or BrandCode Already Exists",
            res,
            ""
          );
        } else {
          return next();
        }
      });
    } else {
      return next();
    }
  } catch (err) {
    console.log("error", err);
  }
};

export const validatePackType = async (req: any, res: any, next: any) => {
  // try {
  //   if (req.body.hidden_value !== req.body.name.trim()) {
  //     db.PackType.count({
  //       where: {
  //         name: req.body.name.trim(),
  //         brandID: req.body.brandID,
  //       },
  //     }).then((response) => {
  //       if (response) {
  //         return returnResponse(422, false, "PackType Already Exists", res, "");
  //       } else {
  //         return next();
  //       }
  //     });
  //   } else {
  //     return next();
  //   }
  // } catch (err) {
  //   console.log("error", err);
  // }

  try {
    let userId = 0;

    if (req.params.id) {
      const projects = await db.PackType.findOne({
        where: {
          name: req.body.name,
          brandID: req.body.brandID,
          lineExtID: req.body.lineExtID,
          sizeID: req.body.sizeID,
          id: { [Op.not]: req.params.id },
        },
      });

      if (projects) {
        return returnResponse(
          422,
          false,
          "PackType Name Already Exists",
          res,
          ""
        );
      }
      return next();
    } else {
      const projects = await db.PackType.findOne({
        where: {
          name: req.body.name,
          brandID: req.body.brandID,
          lineExtID: req.body.lineExtID,
          sizeID: req.body.sizeID,
        },
      });

      if (projects) {
        return returnResponse(
          422,
          false,
          "PackType Name Already Exists",
          res,
          ""
        );
      }
      return next();
    }
  } catch (err) {
    console.log("error", err);
  }
};

export const validateArea = async (req: any, res: any, next: any) => {
  try {
    if (req.body.hidden_value !== req.body.name.trim()) {
      db.Aria.count({
        where: {
          name: req.body.name.trim(),
          channelID: req.body.channelID,
        },
      }).then((response) => {
        if (response) {
          return returnResponse(
            422,
            false,
            "Area Already Exists For This Channel",
            res,
            ""
          );
        } else {
          return next();
        }
      });
    } else {
      return next();
    }
  } catch (err) {
    console.log("error", err);
  }
};
export const EditPackType = async (req: any, res: any, next: any) => {
  try {
    if (req.body.hidden_value !== req.body.name.trim()) {
      db.PackType.count({
        where: {
          name: req.body.name.trim(),
          brandID: req.body.brandID,
        },
      }).then((response) => {
        if (response) {
          return returnResponse(
            422,
            false,
            "PackType Already Exists For This Brand",
            res,
            ""
          );
        } else {
          return next();
        }
      });
    } else {
      return next();
    }
  } catch (err) {
    console.log("error", err);
  }
};

export const EditArea = async (req: any, res: any, next: any) => {
  try {
    if (req.body.hidden_value !== req.body.name.trim()) {
      db.Aria.count({
        where: {
          name: req.body.name.trim(),
          channelID: req.body.channelID,
        },
      }).then((response) => {
        if (response) {
          return returnResponse(
            422,
            false,
            "Area Already Exists For This Channel",
            res,
            ""
          );
        } else {
          return next();
        }
      });
    } else {
      return next();
    }
  } catch (err) {
    console.log("error", err);
  }
};
export const validateBARole = async (req: any, res: any, next: any) => {
  try {
    if (req.body.hidden_value !== req.body.role.trim()) {
      db.BusinessAnalyst.count({
        where: {
          name: req.body.role.trim(),
        },
      }).then((response) => {
        if (response) {
          return returnResponse(422, false, "Role Already Exists", res, "");
        } else {
          return next();
        }
      });
    } else {
      return next();
    }
  } catch (err) {
    console.log("error", err);
  }
};

export const validateDistrict = async (req: any, res: any, next: any) => {
  try {
    if (req.body.hidden_value !== req.body.name) {
      db.District.count({
        where: {
          name: req.body.name.trim(),
          areaID: req.body.areaID,
        },
      }).then((response) => {
        if (response) {
          return returnResponse(
            422,
            false,
            "District Already Exists For This Area",
            res,
            ""
          );
        } else {
          return next();
        }
      });
    } else {
      return next();
    }
  } catch (err) {
    console.log("error", err);
  }
};
export const EditDistrict = async (req: any, res: any, next: any) => {
  try {
    if (req.body.hidden_value !== req.body.name) {
      db.District.count({
        where: {
          name: req.body.name.trim(),
          areaID: req.body.areaID,
        },
      }).then((response) => {
        if (response) {
          return returnResponse(
            422,
            false,
            "District Already Exists For This Area",
            res,
            ""
          );
        } else {
          return next();
        }
      });
    } else {
      return next();
    }
  } catch (err) {
    console.log("error", err);
  }
};
export const validateLineExtension = async (req: any, res: any, next: any) => {
  try {
    if (req.body.hidden_value !== req.body.name) {
      db.lineExtension
        .count({
          where: {
            name: req.body.name.trim(),
            brandID: req.body.brandID,
          },
        })
        .then((response) => {
          if (response) {
            return returnResponse(
              422,
              false,
              "Line Extension Already Exists",
              res,
              ""
            );
          } else {
            return next();
          }
        });
    } else {
      return next();
    }
  } catch (err) {
    console.log("error", err);
  }
};

export const validateExpense = async (req: any, res: any, next: any) => {
  try {
    if (req.body.hidden_value !== req.body.name.trim()) {
      db.Expense.count({
        where: {
          [Op.or]: [
            { expenseCode: req.body.expenseCode },
            { name: req.body.name },
          ],
        },
      }).then((response) => {
        if (response) {
          return returnResponse(
            422,
            false,
            "Expense name or Code is already exist.",
            res,
            ""
          );
        } else {
          return next();
        }
      });
    } else {
      return next();
    }
  } catch (err) {
    console.log("error", err);
  }
};

export const validateBusinessType = async (req: any, res: any, next: any) => {
  try {
    if (req.body.hidden_value !== req.body.name.trim()) {
      db.BusinessType.count({
        where: {
          [Op.or]: [{ name: req.body.name }],
        },
      }).then((response) => {
        if (response) {
          return returnResponse(
            422,
            false,
            "Biz Type Name is already exist.",
            res,
            ""
          );
        } else {
          return next();
        }
      });
    } else {
      return next();
    }
  } catch (err) {
    console.log("error", err);
  }
};

export const validateProjectVolume = async (req: any, res: any, next: any) => {
  try {
    if (req.body.hidden_value !== req.body.name) {
      db.projectVolume
        .count({
          where: {
            name: req.body.name.trim(),
          },
        })
        .then((response) => {
          if (response) {
            return returnResponse(
              422,
              false,
              "Project Volume Already Exist",
              res,
              ""
            );
          } else {
            return next();
          }
        });
    } else {
      return next();
    }
  } catch (err) {
    console.log("error", err);
  }
};

export const validateProjectType = async (req: any, res: any, next: any) => {
  try {
    if (req.body.hidden_value !== req.body.name) {
      db.ProjectType.count({
        where: {
          name: req.body.name.trim(),
        },
      }).then((response) => {
        if (response) {
          return returnResponse(
            422,
            false,
            "Project Type Already Exist",
            res,
            ""
          );
        } else {
          return next();
        }
      });
    } else {
      return next();
    }
  } catch (err) {
    console.log("error", err);
  }
};
