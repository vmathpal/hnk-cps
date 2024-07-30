var stream = require("stream");
import db from "../../models";
const Role = db.Role;
const excel = require("exceljs");
import { Op } from "sequelize";
var moment = require("moment");
import { returnResponse, projectFLow, uploadImage } from "../../helper/helper";
const readXlsxFile = require("read-excel-file/node");
import * as df from "dateformat";
// console.log("__dirname", __dirname);
// function wait(milleseconds) {
//   return new Promise((resolve) => setTimeout(resolve, milleseconds));
// }
const ProjectUpload = async (req, res) => {
  try {
    let filePath = __dirname + "/uploads/" + req.file.filename;
    const schema = {
      "Start Date": {
        // JSON object property name.
        prop: "date",
        type: Date,
      },
      "Created On": {
        // JSON object property name.
        prop: "date",
        type: Date,
      },
      STATUS: {
        prop: "status",
        type: String,
        oneOf: ["SCHEDULED", "STARTED", "FINISHED"],
      },
    };
    var dfghj = await readXlsxFile(filePath, { dateFormat: "mm/dd/yyyy" }).then(
      (rows) => {
        rows.shift();

        (async () => {
          for await (const data of rows) {
            var ref_no = data[0];
            var ProjectOwner = data[1];
            var EmailID = data[2];
            var Department = data[3];
            var ProjectName = data[4];
            var Description = data[5];
            var ProjectCode = data[6];
            var ProjectStatus = data[7];
            var Next_Action_By = data[8];
            var CreatedOn = data[9];
            var StartDate = data[10];
            var EndDate = data[11];
            var FinalApprovedDate = data[12];
            var ProjectType = data[13];
            var Project_Volume = data[14];
            var Budget_Remarks = data[15];
            var BUs = data[16];
            var BizType_Code = data[17];
            var BizType_Desc = data[18];
            var TotalBudget = data[19];
            var BrandPackType = data[20];
            var Region = data[21];
            var District = data[22];
            var salesRegion = data[23];
            var Remarks = data[24];
            var SuccessFactorOne = data[25];
            var SuccessFactorTwo = data[26];
            var SuccessFactorThree = data[27];
            var blank = data[28];
            var SpecificMeasuresOne = data[29];
            var SpecificMeasuresTwo = data[30];
            var SpecificMeasures3 = data[31];
            var LauchCriteriaOne = data[32];
            var LauchCriteriaTwo = data[33];
            var LauchCriteriaThree = data[34];
            var Rationale = data[35];
            var StrategyRetailers = data[36];
            var StrategyConsumers = data[37];
            var ExecutionPlan = data[38];
            var volumeWithoutLastBudget = data[39];
            var volumeWithoutBudget = data[40];
            var volumeWithLastBudget = data[41];
            var volumeWithBudget = data[42];
            var VolwithPromohlActual = data[43];
            var VolwithPromohlVariance = data[44];
            var contributeLastBudget = data[45];
            var ContributionperhlActual = data[46];
            var lastProjectVolumeInc = data[47];
            var budgetVolumeIncrease = data[48];
            var VolIncreasewithPromohlActual = data[49];
            var VolIncreasewithPromohlVariance = data[50];
            var TotalContributionfromPromoLast = data[51];
            var TotalContributionfromPromoCurr = data[52];
            var TotalContributionfromPromoActual = data[53];
            var TotalContributionfromPromoVariance = data[54];
            var TotalExpenseLast = data[55];
            var TotalExpenseCurrent = data[56];
            var TotalExpenseActual = data[57];
            var TotalExpenseVariance = data[58];
            var TotalProfitfromPromoLast = data[59];
            var TotalProfitfromPromoCurr = data[60];
            var TotalProfitfromPromoActual = data[61];
            var TotalProfitfromPromoVariance = data[62];
            var ROILast = data[63];
            var ROICurr = data[64];
            var ROIActual = data[65];
            var NetContributionperhlLast = data[66];
            var NetContributionperhlCurr = data[67];
            var NetContributionperhlActual = data[68];
            var PromotionSpendperhlLast = data[69];
            var PromotionSpendperhlCurr = data[70];
            var PromotionSpendperhlActual = data[71];
            var HasAttachement = data[72];
            var SellingStartDate = data[74];
            var SellingEndDate = data[75];
            // console.log(data[10]);
            var user = await db.User.findOne({
              where: { email: data[2] },
            });

            var InsertProject = {
              name: data[4],
              description: data[5],
              userID: user.id,
              department: data[3],
              projectType: data[13],
              costStartDate: date2ms(data[10]),
              costEndDate: date2ms(data[11]),
              sellingStartDate: moment(data[73]).format("YYYY-MM-DD"),
              sellingEndDate: moment(data[74]).format("YYYY-MM-DD"),
              projectVolume: data[14],
              remark: data[24],
              rational: data[35],
              strategy: data[36],
              forConsumers: data[37],
              executionPlan: data[38],
              specificMeasure: data[29],
              criticalSucess: data[25],
              launchCriteria: data[32],
              businessType: data[17],
              projectNumber: data[6],
              ref_no: data[0],
              status: "approved",
              totalBudget: data[19],
            };
            // if (data[21] && data[22] && data[23]) {
            // console.log(
            //   {
            //     costStartDate: date2ms(data[10]),
            //     costEndDate: date2ms(data[11]),
            //     sellingStartDate: moment(data[73]).format("YYYY-MM-DD"),
            //     sellingEndDate: moment(data[74]).format("YYYY-MM-DD"),
            //   },
            //   {
            //     costStartDate: data[10],
            //     costEndDate: data[11],
            //     sellingStartDate: moment(data[73]).format("YYYY-MM-DD"),
            //     sellingEndDate: moment(data[74]).format("YYYY-MM-DD"),
            //   }
            // );
            // }
            var checkProject = await db.Project.findOne({
              where: {
                ref_no: data[0],
              },
            });
            if (!checkProject) {
              // await db.Project.create(InsertProject);
            } else {
              /*insert Biz*/
              // if (BizType_Desc) {
              //   var bizType = data[18].split(";");
              //   var bzCode = data[17].split(";");
              //   var businessTypes = await db.BusinessType.findAll({
              //     where: { code: { [Op.in]: bzCode } },
              //   }).then((project) => project.map((account) => account.id));

              //   if (parseInt(businessTypes.length) > 0) {
              //     var bizID = businessTypes.toString();
              //     console.log(bizID);
              //     await db.Project.update(
              //       { businessType: bizID, status: data[7] },
              //       {
              //         where: {
              //           ref_no: data[0],
              //         },
              //       }
              //     );
              //   }
              //   // await bizType.forEach(async (element,key) => {
              //   //   if(element){

              //   //     // var businessTypes= await db.BusinessType.findOne({
              //   //     //   where:{ code: { [Op.in]:bzCode },}

              //   //     // });

              //   //     if(!businessTypes){

              //   //       // await db.BusinessType.create( {
              //   //       //   name:element,
              //   //       //   bizBaseDisc:element,
              //   //       //   code: bzCode[key],
              //   //       //   status: 'active',
              //   //       // });
              //   //     }else{
              //   //       // await db.Project.update(InsertProject,{where:{
              //   //       //   ref_no: data[0]
              //   //       // }})
              //   //     }
              //   //   }

              //   // });
              // }

              await db.Project.update(
                { userID: user.id, department: "trade_marketing" },
                {
                  where: {
                    ref_no: data[0],
                  },
                }
              );
            }

            // await db.ProjectAreaDistrict.create(req.body);
          }
        })();
      }
    );
  } catch (error) {
    const result = {
      status: "fail",
      filename: req.file.originalname,
      message: "Upload Error! message = " + error.message,
    };
    return res.json(result);
  } finally {
    return res.json([]);
  }
};
function date2ms(d) {
  let date = new Date(Math.round((d - 25569) * 864e5));
  // return date;
  return moment(date).format("YYYY-MM-DD");
}
const BrandUpload = async (req, res) => {
  try {
    let filePath = __dirname + "/uploads/" + req.file.filename;
    const schema = {
      "Start Date": {
        // JSON object property name.
        prop: "date",
        type: Date,
      },
      "Created On": {
        // JSON object property name.
        prop: "date",
        type: Date,
      },
      STATUS: {
        prop: "status",
        type: String,
        oneOf: ["SCHEDULED", "STARTED", "FINISHED"],
      },
    };
    var dfghj = await readXlsxFile(filePath, { dateFormat: "mm/dd/yyyy" }).then(
      (rows) => {
        rows.shift();

        (async () => {
          for await (const data of rows) {
            // console.log(data[0]);
            var projectID = await db.Project.findOne({
              where: { ref_no: data[0] },
            });

            if (projectID) {
              var brand = await db.Brand.findOne({
                where: { name: data[1] },
              });
              if (brand) {
                // console.log('brand',brand.name)
                var SKU = await db.SKU.findOne({
                  where: {
                    name: data[3],
                    brandID: brand.id,
                  },
                });

                var packType = await db.PackType.findOne({
                  where: {
                    // sizeID: SKU.id,
                    name: data[4],
                    //  brandID: brand.id,
                  },
                });

                await db.ProjectBrand.create({
                  projectID: projectID.id,
                  brandID: brand.id,
                  pack_type: packType ? packType.id : null,
                  skuID: SKU ? SKU.id : null,
                  catID: "1",
                });

                /*
                var lineExtension = await db.lineExtension.findOne({
                  where: { name: data[1], brandID: brand.id },
                });
                if (lineExtension) {
                  console.log(lineExtension.id, data[2]);
                  var SKU = await db.SKU.findOne({
                    where: {
                      name: data[4],
                      brandID: brand.id,
                      lineExtID: lineExtension.id,
                    },
                  });
                  if (SKU) {
                    console.log(SKU);
                    var PackType = await db.PackType.findOne({
                      where: {
                        sizeID: SKU.id,
                        name: data[3],
                        brandID: brand.id,
                        lineExtID: lineExtension.id,
                      },
                    });
                    if (PackType) {
                      // await db.ProjectBrand.create({
                      //   projectID: projectID.id,
                      //   brandID: brand.id,
                      //   pack_type: PackType.id,
                      //   skuID: SKU.id,
                      //   lineExtID: lineExtension.id,
                      //   catID: "1",
                      // });
                    }
                  }
                } */
              }
            }
            // var InsertProject = {
            //   name: data[4],
            //   description: data[5],
            //   userID: 28,
            //   department: data[3],
            //   projectType: data[13],
            //   costStartDate: date2ms(data[10]),
            //   costEndDate: date2ms(data[11]),
            //   sellingStartDate: date2ms(data[75]),
            //   sellingEndDate: date2ms(data[74]),
            //   projectVolume: data[14],
            //   remark: data[24],
            //   rational: data[35],
            //   strategy: data[36],
            //   forConsumers: data[37],
            //   executionPlan: data[38],
            //   specificMeasure: data[29],
            //   criticalSucess: data[25],
            //   launchCriteria: data[32],
            //   businessType: data[17],
            //   projectNumber: data[6],
            // };
            // await db.Project.create(InsertProject);
          }
        })();
      }
    );
  } catch (error) {
    const result = {
      status: "fail",
      filename: req.file.originalname,
      message: "Upload Error! message = " + error.message,
    };
    return res.json(result);
  } finally {
    return res.json([]);
  }
};
const projectBudget = async (req, res) => {
  try {
    let filePath = __dirname + "/uploads/" + req.file.filename;
    const schema = {
      "Start Date": {
        // JSON object property name.
        prop: "date",
        type: Date,
      },
      "Created On": {
        // JSON object property name.
        prop: "date",
        type: Date,
      },
      STATUS: {
        prop: "status",
        type: String,
        oneOf: ["SCHEDULED", "STARTED", "FINISHED"],
      },
    };
    var dfghj = await readXlsxFile(filePath, { dateFormat: "mm/dd/yyyy" }).then(
      (rows) => {
        rows.shift();

        (async () => {
          for await (const data of rows) {
            // console.log(data[0]);
            var projectID = await db.Project.findOne({
              where: { ref_no: data[1] },
            });
            if (projectID) {
              var brand = await db.Brand.findOne({
                where: { name: data[2] },
              });

              if (brand) {
                var projectBrand = await db.ProjectBrand.findOne({
                  where: {
                    projectID: projectID.id,
                    brandID: brand.id,
                  },
                });
                if (projectBrand) {
                  // var fghj = {
                  //   // budgetRef: element.budgetRef,
                  //   allocationPercent: data[3],
                  //   allocation: data[4],
                  //   budgetAmount: data[4],
                  //   fy: data[8],
                  // };
                  // console.log({
                  //   allocationPercent: data[3],
                  //   allocation: data[4] ? data[4] : 0,
                  //   budgetAmount: data[4],
                  //   fy: data[8],
                  // });
                  // console.log(projectBudget);
                  await db.ProjectBrand.update(
                    {
                      allocationPercent: data[3],
                      allocation: data[4] ? data[4] : 0,
                      budgetAmount: data[4],
                      fy: data[8],
                    },
                    {
                      where: {
                        projectID: projectID.id,
                        brandID: projectBrand.brandID,
                        lineExtID: projectBrand.lineExtID,
                      },
                    }
                  );
                }
              }

              // console.log();
              // await db.ProjectBrand.update(insert, {
              //   where: {
              //     projectID: projectID.id,
              //     brandID: projectBrand.brandID,
              //     lineExtID: projectBrand.lineExtID,
              //   },
              // });
            }
          }
        })();
      }
    );
  } catch (error) {
    const result = {
      status: "fail",
      filename: req.file.originalname,
      message: "Upload Error! message = " + error.message,
    };
    return res.json(result);
  } finally {
    return res.json([]);
  }
};

const projectExpense = async (req, res) => {
  try {
    let filePath = __dirname + "/uploads/" + req.file.filename;
    const schema = {
      "Start Date": {
        // JSON object property name.
        prop: "date",
        type: Date,
      },
      "Created On": {
        // JSON object property name.
        prop: "date",
        type: Date,
      },
      STATUS: {
        prop: "status",
        type: String,
        oneOf: ["SCHEDULED", "STARTED", "FINISHED"],
      },
    };
    var dfghj = await readXlsxFile(filePath, { dateFormat: "mm/dd/yyyy" }).then(
      (rows) => {
        rows.shift();

        (async () => {
          for await (const data of rows) {
            var projectID = await db.Project.findOne({
              where: { ref_no: data[0] },
            });

            if (projectID && data[3]) {
              var brand = await db.Brand.findOne({
                where: { name: data[3] },
              });

              if (brand) {
                var projectBrand = await db.ProjectBrand.findOne({
                  where: {
                    projectID: projectID.id,
                    brandID: brand.id,
                  },
                });
                // console.log(data[6]);
                if (projectBrand && data[4]) {
                  // var costCenter = await db.CostCenter.findOne({
                  //   where: { centerCode: data[4].toString() },
                  //  });
                  //  console.log(costCenter.id);
                  // if (costCenter) {
                  var expense = await db.Expense.findOne({
                    where: { name: data[6] },
                  });
                  // console.log(data[6]);
                  if (expense) {
                    var projectExpense = {
                      brandID: brand.id,
                      lineExtID: projectBrand.lineExtID,
                      costCenterID: 1,
                      expenseID: expense.id,
                      lastProject: data[7],
                      budget: data[8],
                      projectID: projectID.id,
                    };
                    console.log(projectExpense);
                    await db.ProjectExpense.create(projectExpense);
                  }
                  // }
                }
              }
            }
          }
        })();
      }
    );
  } catch (error) {
    const result = {
      status: "fail",
      filename: req.file.originalname,
      message: "Upload Error! message = " + error.message,
    };
    return res.json(result);
  } finally {
    return res.json([]);
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
          var roles = await db.role.findOne({
            where: { role: role[2] },
          });
          const insertData = {
            // email: role[1],
            //  department: role[4],
            level: role[3],
            // status: "active",
            //   role: "user",
            //  isBA: null,
            name: role[0],
            // dept_roleId: roles.id,
          } as any;
          const checkUser = await db.User.findOne({
            where: {
              email: role[1],
            },
          });
          if (!checkUser) {
            //  await db.User.create(insertData);
          } else {
            // console.log(insertData)
            await db.User.update(insertData, { where: { email: role[1] } });
          }
        }
      })();

      // expenseXl.FINISHED();
    });
  } catch (error) {
    const result = {
      status: "fail",
      filename: req.file.originalname,
      message: "Upload Error! message = " + error.message,
    };
    return res.json(result);
  } finally {
    return res.json([]);
  }
};

const masterUploadBrand = async (req, res) => {
  try {
    let filePath = __dirname + "/uploads/" + req.file.filename;
    const schema = {
      "Start Date": {
        // JSON object property name.
        prop: "date",
        type: Date,
      },
      "Created On": {
        // JSON object property name.
        prop: "date",
        type: Date,
      },
      STATUS: {
        prop: "status",
        type: String,
        oneOf: ["SCHEDULED", "STARTED", "FINISHED"],
      },
    };
    var dfghj = await readXlsxFile(filePath, { dateFormat: "mm/dd/yyyy" }).then(
      (rows) => {
        rows.shift();

        (async () => {
          for await (const data of rows) {
            const insertData = {
              name: data[1],
              brandCode: data[1],
              status: "active",
            } as any;

            var insertLine = {
              name: data[1],
              lineExtCode: data[1],
              status: "active",
            } as any;

            var insertSize = {
              name: data[4],
              status: "active",
            } as any;

            var packType = {
              name: data[3],
              status: "active",
            } as any;

            var checkBrand = await db.Brand.findOne({
              where: {
                name: data[1],
              },
            });
            if (!checkBrand) {
              //   console.log({
              //   name: data[1],
              //   brandCode: data[1],
              //   status: "active",
              // });
              console.log(">>>>>>>>>>>>", data[1]);
              await db.Brand.create({
                name: data[1],
                brandCode: data[1],
                status: "active",
              });
            }
            /*
            var lineExtension = await db.lineExtension.findOne({
              where: {
                brandID: checkBrand.id,
                name: data[1],
              },
            });
            if (!lineExtension) {
              await db.lineExtension.create({
                name: data[1],
                brandID: checkBrand.id,
                status: "active",
              });

              console.log("_________________________");
            } else {
              var sku = await db.SKU.findOne({
                where: {
                  name: data[4],
                  brandID: checkBrand.id,
                  lineExtID: lineExtension.id,
                },
              });

              if (!sku) {
                console.log("SSSSSSSSSSSSSSSSSSSSSSSSS");
                var insertSku = {
                  name: data[4],
                  brandID: checkBrand.id,
                  lineExtID: lineExtension.id,
                };
                await db.SKU.create(insertSku);
              } else {
                var pack = await db.PackType.findOne({
                  where: {
                    name: data[3],
                    brandID: checkBrand.id,
                    sizeID: sku.id,
                    lineExtID: lineExtension.id,
                  },
                });
                if (!pack) {
                  var insert = {
                    name: data[3],
                    brandID: checkBrand.id,
                    status: "active",
                    sizeID: sku.id,
                    lineExtID: lineExtension.id,
                  };
                  console.log(insert);
                  await db.PackType.create(insert);
                }
              }
            } */

            /*   const checkBrand = await db.Brand.findOne({
              where: {
                name: data[1],
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
                name: data[1],
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
            }*/

            /*END LINE EXTEsion*/
            /*start pack size*/
            /* 
             const checkBrand = await db.Brand.findOne({
              where: {
                name: data[1],
              },
            });
           const lineExtension = await db.lineExtension.findOne({
              where: {
                name: data[1],
              },
            });
            //console.log(lineExtension);

            const sku = await db.SKU.findOne({
              where: {
                name: data[4],
                  brandID: checkBrand.id,
                  lineExtID: lineExtension.id,
              },
            });

            if (sku) {
              packType.brandID = checkBrand.id;
              packType.lineExtID = sku.lineExtID;
              packType.sizeID = sku.id;
              var insertSku = {
                name: data[4],
                brandID: checkBrand.id,
                lineExtID: lineExtension.id,
              };

              const sku2 = await db.SKU.update(insertSku, {
                where: { name: data[4] },
              });
            } else {
              var insertSku = {
                name: data[4],
                brandID: checkBrand.id,
                lineExtID: lineExtension.id,
              };
              const sku2 = await db.SKU.create(insertSku);
             
            }
            */
            /*END pack size*/
            /* 
            const checkBrand = await db.Brand.findOne({
              where: {
                name: data[1],
              },
            });
            const lineExtension = await db.lineExtension.findOne({
              where: {
                name: data[1],
              },
            });
             const sku = await db.SKU.findOne({
              where: {
                name: data[4],
              },
            });
             // console.log(sku);
             if(sku){

               const pack = await db.PackType.findOne({
                where: {
                  name: data[3],
                  brandID: checkBrand.id,
                  sizeID: sku.id,
                 lineExtID: lineExtension.id,
                },
              });

               if(!pack){
               var insert= {
                name: data[3],
                brandID: checkBrand.id,
                status: 'active',
                sizeID: sku.id,
                lineExtID:sku.lineExtID,
                };
                console.log(insert);
                await db.PackType.create(insert);
               }
             } 
             */
            // packType.brandID = insertLine.brandID;

            // await db.PackType.create(packType);
          }
        })();
      }
    );
  } catch (error) {
    // const result = {
    //   status: "fail",
    //   filename: req.file.originalname,
    //   message: "Upload Error! message = " + error.message,
    // };
    // return res.json(result);
  } finally {
    return res.json([]);
  }
};

const financeDataUpload = async (req, res) => {
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
            volumeWithoutLastBudget: null,
            volumeWithoutBudget: null,
            volumeWithLastBudget: null,
            volumeWithBudget: null,
            othContributeLastBudget: null,
            othContributeBudget: null,
            contributeLastBudget: null,
            contributeBudget: null,
            budgetVolumeIncrease: null,
            lastProjectVolumeInc: null,
            budgetProjectTotalIncrement: null,
            lastProjectTotalIncrement: null,
          } as any;
          const checkProject = await db.Project.findOne({
            where: {
              ref_no: role[0],
            },
          });

          if (checkProject) {
            await db.ProjectBrand.update(insertData, {
              where: {
                projectID: checkProject.id,
                // brandID: checkProject.ProjectBrands[0].brandID,
                // lineExtID: checkProject.ProjectBrands[0].lineExtID,
                // skuID: checkProject.ProjectBrands[0].skuID,
              },
            });
          }
        }
      })();
      // expenseXl.FINISHED();
    });
  } catch (error) {
    const result = {
      status: "fail",
      filename: req.file.originalname,
      message: "Upload Error! message = " + error.message,
    };
    return res.json(result);
  } finally {
    return res.json([]);
  }
};

const expenseUpload = async (req, res) => {
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
          if (role[6] != "Expense") {
            const expense = await db.Expense.findOne({
              where: {
                description: role[6],
              },
            });
            if (!expense) {
              var insert = {
                name: role[6],
                expenseCode: role[6],
                description: role[6],
                status: "active",
              };
              console.log(insert);
              await db.Expense.create(insert);
            }
          }
        }
      })();
      // expenseXl.FINISHED();
    });
  } catch (error) {
  } finally {
    return res.json([]);
  }
};

const importTotalCalculation = async (req, res) => {
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
          const checkproject = await db.Project.findOne({
            where: {
              ref_no: role[0],
            },
          });
          if (checkproject) {
            var insert = {
              lastProjectTotalProfit: null,
              currentProjectTotalProfit: role[1]?.toFixed(2),
              // actualTotalProfit: role[3],
              // varianceTotalProfit: role[4],
              lastProjectRoi: null,
              currentProjectRoi: role[2]?.toFixed(2),
              // actualRoi: role[7],
              LastProjectNetContribution: null,
              currentProjectNetContribution: role[3]?.toFixed(2),
              // actualNetContribution: role[10],
              LastProjectPromotionSpend: null,
              currentProjectPromotionSpend: role[4]?.toFixed(2),
              // actualPromotionSpend: role[13],

              showCalculation: "yes",
              projectID: checkproject.id,
            };
            await db.ProjectTotalProfit.update(insert, {
              where: {
                projectID: checkproject.id,
              },
            });
          }
        }
      })();
      // expenseXl.FINISHED();
    });
  } catch (error) {
  } finally {
    return res.json([]);
  }
};

const ImportAreaDistrict = async (req, res) => {
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
          const checkproject = await db.Project.findOne({
            where: {
              ref_no: role[0],
            },
          });
          if (checkproject) {
            const region = await db.Channel.findOne({
              where: {
                name: role[1],
              },
            });
            if (region) {
              const salesRegion = await db.Aria.findOne({
                where: {
                  name: role[3],
                  channelID: region.id,
                },
              });
              if (salesRegion) {
                //   console.log(salesRegion);
                const district = await db.District.findOne({
                  where: {
                    name: role[2],
                    areaID: salesRegion.id,
                  },
                });
                if (district) {
                  // console.log(district.id);
                  var insert = {
                    channelID: region.id,
                    districtID: district.id,
                    ariaID: salesRegion.id,
                    projectID: checkproject.id,
                  };
                  // console.log(insert);
                  await db.ProjectAreaDistrict.create(insert);
                }
              }
            }
          }
        }
      })();
      // expenseXl.FINISHED();
    });
  } catch (error) {
  } finally {
    return res.json([]);
  }
};

const uploadRole = async (req, res) => {
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
        for await (const data of rows) {
          var roles = await db.role.findOne({
            where: { role: data[2] },
          });
          if (!roles) {
            var insert = {
              role: data[2],
              department: data[4],
              status: "active",
            };
            await db.role.create(insert);
          }
        }
      })();
      // expenseXl.FINISHED();
    });
  } catch (error) {
  } finally {
    return res.json([]);
  }
};
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
const MasterAreaDistrict = async (req, res) => {
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
          const region = await db.Channel.findOne({
            where: {
              name: role[1],
            },
          });
          if (!region) {
            console.log(">>>>>");
          } else {
            const salesRegion = await db.Aria.findOne({
              where: {
                name: role[3],
                channelID: region.id,
              },
            });
            if (!salesRegion) {
              console.log(">>>>>");
              await db.Aria.create({
                name: role[3],
                channelID: region.id,
                status: "active",
              });
            } else {
              const district = await db.District.findOne({
                where: {
                  name: role[2],
                  areaID: salesRegion.id,
                },
              });
              if (!district) {
                console.log(">>>>>");
                await db.District.create({
                  name: role[2],
                  areaID: salesRegion.id,
                  status: "active",
                });
              }
            }
          }
          //   const salesRegion = await db.Aria.findOne({
          //   where: {
          //   name: role[3],
          //   channelID:region.id
          //   },
          // });
          // if(salesRegion){
          //   //   console.log(salesRegion);
          //   const district = await db.District.findOne({
          //     where: {
          //     name: role[2],
          //     areaID:salesRegion.id
          //     },
          //   });
          //   if(district){
          //     // console.log(district.id);
          //     var insert = {
          //       channelID: region.id,
          //       districtID: district.id,
          //       ariaID: salesRegion.id,
          //       projectID: checkproject.id,
          //     };
          //     // console.log(insert);
          //     // await db.ProjectAreaDistrict.create(insert);
          //   }
          // }
        }
      })();
      // expenseXl.FINISHED();
    });
  } catch (error) {
  } finally {
    return res.json([]);
  }
};

const importCostCenter = async (req, res) => {
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
          const costCenter = await db.CostCenter.findOne({
            where: {
              name: role[1],
            },
          });
          const user = await db.User.findOne({
            where: {
              email: role[4],
            },
          });

          if (costCenter && user) {
            var insert = {
              centerID: costCenter.id,
              userID: user.id,
              status: "active",
              department: costCenter.department,
            };

            await db.CostCenterUser.create(insert);
          }
        }
      })();
      // expenseXl.FINISHED();
    });
  } catch (error) {
  } finally {
    return res.json([]);
  }
};

const MasterFileUpload = async (req, res) => {
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
          const checkproject = await db.Project.findOne({
            where: {
              ref_no: role[1],
            },
          });
          if (checkproject) {
            var insert = {
              file: role[1] + "_" + role[2],
              description: role[3],
              actualTotalProfit: role[3],
              fileType: "new-request",
              projectID: checkproject.id,
            };
            await db.ProjectFile.create(insert);
          }
        }
      })();
      // expenseXl.FINISHED();
    });
  } catch (error) {
  } finally {
    return res.json([]);
  }
};

export {
  MasterAreaDistrict,
  uploadFile,
  ProjectUpload,
  BrandUpload,
  projectBudget,
  projectExpense,
  uploadUsers,
  masterUploadBrand,
  expenseUpload,
  financeDataUpload,
  importTotalCalculation,
  ImportAreaDistrict,
  uploadRole,
  importCostCenter,
  MasterFileUpload,
};
