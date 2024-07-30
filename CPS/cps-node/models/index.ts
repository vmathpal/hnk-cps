"use strict";
// import { LocalStorage } from "node-localstorage";
// global.localStorage = new LocalStorage("./scratch");

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.ts")[env];
const { isEqual, isEmpty } = require("lodash");
const db: any = {};
import mod from "../models";
var moment = require("moment");
import * as jsdiff from "diff";
let sequelize: any;
const hooks = [
  { name: "afterCreate", event: "create" },
  { name: "afterDestroy", event: "destroy" },
  { name: "afterUpdate", event: "update" },
];
const exclude = ["updatedAt"];
const ExcludeModel = [
  "Project",
  "ProjectAreaDistrict",
  "CloserProcess",
  "ProjectBrand",
  "discussion",
  "CloserProcess",
  "ProjectFile",
  "ProjectExpense",
  "ProjectReviewers",
  "ProjectTotalProfit",
  "DirectorAndReviewerApprover",
];
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file: string) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".ts"
    );
  })
  .forEach((file: string) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });
// var User_id;

Object.keys(db).forEach(async (modelName) => {
  var projectID = 0;

  // hooks.forEach(async (hook) => {
  //   db[modelName].addHook(hook.name, async (instance, options) => {
  //     if (ExcludeModel.indexOf(modelName) !== -1) {
  //       try {
  //         // if (typeof options.where !== "undefined") {
  //         //   const symbolKey = Reflect.ownKeys(options.where).find(
  //         //     (key) => key.toString() === "Symbol(or)"
  //         //   );

  //         //   User_id = localStorage.getItem("authID")
  //         //     ? localStorage.getItem("authID")
  //         //     : options.where[symbolKey][0].userID;
  //         // }

  //         if (modelName !== "Project") {
  //           projectID = instance.dataValues["projectID"];
  //         } else {
  //           projectID = instance.dataValues["id"];
  //         }

  //         delete instance.dataValues["updatedAt"];
  //         delete instance._previousDataValues["updatedAt"];
  //         Object.keys(instance.dataValues).forEach(async (key) => {
  //           if (exclude.indexOf(key) === -1) {
  //             if (
  //               isEqual(
  //                 instance.dataValues[key],
  //                 instance._previousDataValues[key]
  //               )
  //             ) {
  //               if (hook.event !== "destroy") {
  //                 delete instance.dataValues[key];
  //                 delete instance._previousDataValues[key];
  //               }
  //             } else {
  //               var valid = new Date(instance.dataValues[key]).getTime() > 0;

  //               if (valid) {
  //                 var oldDate = moment(
  //                   instance._previousDataValues[key]
  //                 ).format("YYYY-MM-DD");
  //                 var newDate = instance.dataValues[key];

  //                 if (oldDate === newDate) {
  //                   delete instance.dataValues[key];
  //                   delete instance._previousDataValues[key];
  //                 }
  //               } else {
  //                 if (
  //                   parseInt(instance.dataValues[key]) ===
  //                   instance._previousDataValues[key]
  //                 ) {
  //                   delete instance.dataValues[key];
  //                   delete instance._previousDataValues[key];
  //                 }
  //               }
  //             }
  //           }
  //         });

  //         if (!isEmpty(instance.dataValues)) {
  //           var insert = {
  //             userID: localStorage.getItem("authID")
  //               ? localStorage.getItem("authID")
  //               : 0,
  //             action: hook.event,
  //             projectID: projectID,
  //             newValue: hook.event === "destroy" ? {} : instance.dataValues,
  //             oldValue:
  //               hook.event == "create" ? {} : instance._previousDataValues,
  //             modal: modelName,
  //           };

  //           // await mod.AuditLog.create(insert);
  //         }
  //       } catch (error) {
  //         console.log("ERRRORRRR", error);
  //       }
  //     }
  //   });
  // });
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
