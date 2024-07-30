import db from "../models";
import { Op } from "sequelize";
import { returnResponse, getUserId } from "../helper/helper";

/* Validation Area and district*/
export const projectChannel = async (req: any, res: any, next: any) => {
  try {
    let userId = 0;
    await getUserId(req, function (data) {
      userId = data;
    });
    // open edit case
    if (req.params.id) {
      const getProjectId = await db.ProjectAreaDistrict.findOne({
        where: {
          id: req.params.id,
        },
      });

      const projects = await db.ProjectAreaDistrict.findOne({
        where: {
          ariaID: req.body.ariaID,
          districtID: req.body.districtID,
          channelID: req.body.channelID,
          projectID: getProjectId.projectID,
          id: { [Op.not]: req.params.id },
        },
      });

      if (projects) {
        return returnResponse(
          422,
          false,
          "Area and district Already Exists",
          res,
          ""
        );
      }
      return next();
    }
    // close edit case
    const projectId = await db.Project.findOne({
      where: {
        id: req.query.projectID,
      },
    });

    if (projectId && projectId.id) {
      const project = await db.ProjectAreaDistrict.findOne({
        where: {
          ariaID: req.body.ariaID,
          districtID: req.body.districtID,
          channelID: req.body.channelID,
          projectID: projectId.id,
        },
      });
      if (project) {
        return returnResponse(
          422,
          false,
          "Area and district Already Exists",
          res,
          ""
        );
      }
      return next();
    } else {
      return next();
    }
  } catch (err) {
    console.log("error", err);
  }
};

export const Sku = async (req: any, res: any, next: any) => {
  try {
    let userId = 0;

    if (req.params.id) {
      const projects = await db.SKU.findOne({
        where: {
          name: req.body.name,
          brandID: req.body.brandID,
          lineExtID: req.body.lineExtID,
          id: { [Op.not]: req.params.id },
        },
      });

      if (projects) {
        return returnResponse(422, false, "SKU Name Already Exists", res, "");
      }
      return next();
    } else {
      const projects = await db.SKU.findOne({
        where: {
          name: req.body.name,
          brandID: req.body.brandID,
          lineExtID: req.body.lineExtID,
        },
      });

      if (projects) {
        return returnResponse(422, false, "PackSize Already Exists", res, "");
      }
      return next();
    }
  } catch (err) {
    console.log("error", err);
  }
};

export const Category = async (req: any, res: any, next: any) => {
  try {
    let userId = 0;
    if (req.params.id) {
      const projects = await db.Category.findOne({
        where: {
          name: req.body.name,
          id: { [Op.not]: req.params.id },
        },
      });

      if (projects) {
        return returnResponse(
          422,
          false,
          "Category Name Already Exists",
          res,
          ""
        );
      }
      return next();
    } else {
      const projects = await db.Category.findOne({
        where: {
          name: req.body.name,
        },
      });

      if (projects) {
        return returnResponse(
          422,
          false,
          "Category Name Already Exists",
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
/* End Validation Area and district*/

/* Validation for Brand*/
export const projectBrand = async (req: any, res: any, next: any) => {
  try {
    let userId = 0;
    await getUserId(req, function (data) {
      userId = data;
    });
    // open edit case
    if (req.params.id) {
      const getProjectId = await db.ProjectBrand.findOne({
        where: {
          id: req.params.id,
        },
      });

      const projects = await db.ProjectBrand.findOne({
        where: {
          brandID: req.body.brandID,
          projectID: getProjectId.projectID,
          id: { [Op.not]: req.params.id },
        },
      });

      if (projects) {
        return returnResponse(422, false, "Brand Already Exists", res, "");
      }
      return next();
    }
    // close edit case
    const projectId = await db.Project.findOne({
      where: {
        id: req.query.projectID,
      },
    });

    if (projectId && projectId.id) {
      const project = await db.ProjectBrand.findOne({
        where: {
          brandID: req.body.brandID,
          projectID: projectId.id,
        },
      });
      if (project) {
        return returnResponse(422, false, "Brand Already Exists", res, "");
      }
      return next();
    } else {
      return next();
    }
  } catch (err) {
    console.log("error", err);
  }
};
/* End Validation for Brand*/

// Validation for Choose Brand frontEnd Form
export const ValidationDuplicateItem = async (
  req: any,
  res: any,
  next: any
) => {
  try {
    const item = await db.ProjectBrand.findOne({
      where: {
        projectID: req.query.projectID,
        brandID: req.body.brandID,
        pack_type: req.body.pack_type,
        skuID: req.body.skuID,
        lineExtID: req.body.lineExtID,
      },
    }).then((num) => {
      if (num) {
        return returnResponse(
          422,
          false,
          "This Selected Brand, Line Extension, PackSize and PackType Is Already In List",
          res,
          ""
        );
      } else {
        return next();
      }
    });
  } catch (err) {
    console.log("error", err);
  }
};

//Validate brand line extension while submit copy project

export const ValidationInactiveItem = async (req: any, res: any, next: any) => {
  try {
    const brandId = [];
    const lineExtID = [];

    if (req?.body?.checkInactive !== undefined) {
      req.body.checkInactive.forEach((item) => {
        brandId.push(item.brandID);
        lineExtID.push(item.lineExtID);
      });
    } else {
      console.error("checkInactive array is empty or undefined");
      return next();
    }
    let brandData;
    let lineData;
    if (req.body.checkInactive[0]?.projectID !== undefined) {
      brandData = await db.ProjectBrand.findAll({
        where: {
          projectID: req.body.checkInactive[0].projectID,
        },
        include: [
          {
            model: db.Brand,
            required: true,
            where: {
              id: { [Op.in]: brandId },
              status: "inactive",
            },
          },
        ],
      });

      //lineExtensions
      lineData = await db.ProjectBrand.findAll({
        logging: (sql, queryObject) => {
          console.log(sql);
        },
        where: {
          projectID: req.body.checkInactive[0].projectID,
        },
        include: [
          {
            model: db.lineExtension, // Assuming this model is defined correctly
            required: true,
            where: {
              id: { [Op.in]: lineExtID },
              // status: 'inactive',
            },
          },
        ],
      });
    } else {
      console.error("checkInactive array is empty or undefined for product");
      return next();
    }

    const brandName = [];
    brandData.forEach((itemName) => {
      brandName.push(itemName.Brand.name);
    });
    if (brandName.length) {
      returnResponse(
        422,
        false,
        `${brandName.join(
          ", "
        )} Brand(s) Is/Are Currently Inactive. Please Select Other Brands or Remove Them.`,
        res,
        ""
      );
    } else {
      const lineName = [];
      const wrongName = [];
      lineData.forEach((itemLineName) => {
        if (itemLineName?.lineExtension?.brandID != itemLineName?.brandID) {
          wrongName.push(itemLineName?.lineExtension?.name);
        }
        if (itemLineName?.lineExtension?.status == "inactive") {
          lineName.push(itemLineName?.lineExtension?.name);
        }
      });
      console.log("wrong", wrongName);
      console.log("line", lineName);

      if (lineName.length) {
        // Changed the condition to check for lineName length
        returnResponse(
          422,
          false,
          `${lineName.join(
            ", "
          )} Line Extension(s) Is/Are Currently Inactive. Please Select Other Lines or Remove Them.`,
          res,
          ""
        );
      } else if (wrongName.length) {
        // Changed the condition to check for lineName length
        returnResponse(
          422,
          false,
          `${wrongName.join(
            ", "
          )} Here the line extension is not belong to right brand please check the Project Budget.`,
          res,
          ""
        );
      } else {
        return next();
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
