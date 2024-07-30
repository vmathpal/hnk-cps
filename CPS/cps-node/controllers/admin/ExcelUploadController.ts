var stream = require("stream");
import db from "../../models";
const Role = db.Role;
const excel = require("exceljs");
import { Op } from "sequelize";
import { returnResponse, projectFLow, uploadImage } from "../../helper/helper";
const readXlsxFile = require("read-excel-file/node");
// console.log("__dirname", __dirname);
// function wait(milleseconds) {
//   return new Promise((resolve) => setTimeout(resolve, milleseconds));
// }
const uploadFile = async (req, res) => {
  try {
    let filePath = __dirname + "/uploads/" + req.file.filename;
    const schema = {
      STATUS: {
        prop: "status",
        type: String,
        oneOf: ["SCHEDULED", "STARTED", "FINISHED"],
      },
    };
    var dfghj = await readXlsxFile(filePath, schema).then((rows) => {
      rows.shift();

      (async () => {
        for await (const role of rows) {
          const insertData = {
            name: role[0],
            brandCode: role[5],
            status: "active",
          } as any;

          var insertLine = {
            name: role[1],
            lineExtCode: role[6],
            status: "active",
          } as any;

          var insertSize = {
            name: role[2],
            status: "active",
          } as any;

          var packType = {
            name: role[3],
            status: "active",
          } as any;

          const checkBrand = await db.Brand.findOne({
            where: {
              name: role[0],
            },
          });
          // console.log(">>>>dya", checkBrand, role[0]);
          // return;

          if (checkBrand) {
            insertLine.brandID = checkBrand.id;
            // console.log("Aaya>>>", checkBrand);
          } else {
            const checkBrand = await db.Brand.create(insertData);
            insertLine.brandID = checkBrand.id;
            // console.log("Else Aaya>>>", checkBrand);
          }
          const lineExtension = await db.lineExtension.findOne({
            where: {
              name: role[1],
            },
          });

          if (lineExtension) {
            insertSize.lineExtID = lineExtension.id;
            insertSize.brandID = lineExtension.brandID;
            // console.log("if", insertSize);
          } else {
            const lineExtension2 = await db.lineExtension.create(insertLine);
            insertSize.lineExtID = lineExtension2.id;
            insertSize.brandID = lineExtension2.brandID;
            // console.log("else", insertSize);
          }

          const sku = await db.SKU.findOne({
            where: {
              name: role[2],
              brandID: insertLine.brandID,
              lineExtID: insertSize.lineExtID,
            },
          });

          if (sku) {
            packType.brandID = sku.brandID;
            packType.lineExtID = sku.lineExtID;
            packType.sizeID = sku.id;
          } else {
            const sku2 = await db.SKU.create(insertSize);
            packType.brandID = sku2.brandID;
            packType.lineExtID = sku2.lineExtID;
            packType.sizeID = sku2.id;
          }
          // const sku2 =  db.SKU.create(insertSize);
          packType.brandID = insertLine.brandID;
          // packType.lineExtID = await sku2.lineExtID;
          // packType.sizeID = await sku2.id;

          // const pack = await db.PackType.findOne({
          //   where: {
          //     name: role[5],
          //   },
          // });
          // if (!pack) {
          //   await db.PackType.create(packType);
          // }

          await db.PackType.create(packType);

          // await wait(1000);
        }
      })();

      // dfghj.FINISHED();
    });
  } catch (error) {
    const result = {
      status: "fail",
      filename: req.file.originalname,
      message: "Upload Error! message = " + error.message,
    };
    return res.json(result);
  }
};

const projectFileUploads = async (req, res) => {
  req.body.file = req.file.filename;
  req.body.projectID = req.params.id;
  req.body.fileType = req.query.fileType;

  const ProjectBrands = db.ProjectFile.create(req.body);
  return returnResponse(
    200,
    true,
    "File uploaded successfully",
    res,
    ProjectBrands
  );
};

const expenceUploadFile = async (req, res) => {
  try {
    let filePath = __dirname + "/uploads/" + req.file.filename;
    const schema = {
      STATUS: {
        prop: "status",
        type: String,
        oneOf: ["SCHEDULED", "STARTED", "FINISHED"],
      },
    };
    var expenseXl = await readXlsxFile(filePath, schema).then((rows) => {
      rows.shift();

      (async () => {
        for await (const role of rows) {
          const insertData = {
            name: role[0],
            expenseCode: role[1],
            description: role[2],
            status: "active",
          } as any;
          const checkExpense = await db.Expense.findOne({
            where: {
              name: role[0],
            },
          });
          if (!checkExpense) {
            await db.Expense.create(insertData);
          }
        }
      })();

      expenseXl.FINISHED();
    });
  } catch (error) {
    const result = {
      status: "fail",
      filename: req.file.originalname,
      message: "Upload Error! message = " + error.message,
    };
    return res.json(result);
  }
};

const ChannelUploadFile = async (req, res) => {
  try {
    let filePath = __dirname + "/uploads/" + req.file.filename;
    const schema = {
      STATUS: {
        prop: "status",
        type: String,
        oneOf: ["SCHEDULED", "STARTED", "FINISHED"],
      },
    };
    var expenseXl = await readXlsxFile(filePath, schema).then((rows) => {
      rows.shift();

      (async () => {
        for await (const role of rows) {
          const channel = {
            name: role[0],
            status: "active",
          } as any;

          var aria = {
            name: role[1],
            status: "active",
          } as any;
          var district = {
            name: role[2],
            status: "active",
          } as any;

          const checkChannel = await db.Channel.findOne({
            where: {
              name: role[0],
            },
          });

          if (!checkChannel) {
            const channels = await db.Channel.create(channel);
            aria.channelID = await channels.id;
          } else {
            aria.channelID = await checkChannel.id;
          }
          const checkAria = await db.Aria.findOne({
            where: {
              name: role[1],
              channelID: aria.channelID,
            },
          });

          if (!checkAria) {
            const checkAria = await db.Aria.create(aria);
            district.areaID = checkAria.id;
          } else {
            district.areaID = checkAria.id;
          }

          const checkDistrict = await db.District.findOne({
            where: {
              name: role[2],
              areaID: district.areaID,
            },
          });
          if (!checkDistrict) {
            const checkAria = await db.District.create(district);
          }
        }
      })();

      expenseXl.FINISHED();
    });
  } catch (error) {
    const result = {
      status: "fail",
      filename: req.file.originalname,
      message: "Upload Error! message = " + error.message,
    };
    return res.json(result);
  }
};

const uploadUsers = async (req, res) => {
  try {
    let filePath = __dirname + "/uploads/" + req.file.filename;
    const schema = {
      STATUS: {
        prop: "status",
        type: String,
        oneOf: ["SCHEDULED", "STARTED", "FINISHED"],
      },
    };
    var expenseXl = await readXlsxFile(filePath, schema).then((rows) => {
      rows.shift();

      (async () => {
        for await (const role of rows) {
          const insertData = {
            name: role[0],
            expenseCode: role[1],
            description: role[2],
            status: "active",
          } as any;
          const checkExpense = await db.Expense.findOne({
            where: {
              name: role[0],
            },
          });
          if (!checkExpense) {
            await db.Expense.create(insertData);
          }
        }
      })();

      expenseXl.FINISHED();
    });
  } catch (error) {
    const result = {
      status: "fail",
      filename: req.file.originalname,
      message: "Upload Error! message = " + error.message,
    };
    return res.json(result);
  }
};
export { uploadFile, projectFileUploads, expenceUploadFile, ChannelUploadFile };
