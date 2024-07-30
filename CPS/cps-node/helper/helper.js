"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectFLow = exports.getUserId = exports.uploadImage = exports.getRoleName = exports.capitalizeFirstLetter = exports.returnResponse = exports.getInitials = void 0;
const models_1 = __importDefault(require("../models"));
// create main Model
const Role = models_1.default.role;
function getInitials(str) {
    var matches = str.match(/\b(\w)/g);
    return matches.join("").toUpperCase();
}
exports.getInitials = getInitials;
function returnResponse(statusCode, status, message, response, data = null) {
    const responseData = {};
    responseData.message = message;
    responseData.success = status;
    responseData.data = data ? data : {};
    return response.status(statusCode).json(responseData);
}
exports.returnResponse = returnResponse;
// program to convert first letter of a string to uppercase
const capitalizeFirstLetter = (string) => string
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
    .join(" ");
exports.capitalizeFirstLetter = capitalizeFirstLetter;
function getRoleName(roleId) {
    Role.findByPk(roleId, { attributes: ["role"] })
        .then((data) => {
        if (data) {
            return data;
        }
    })
        .catch((err) => {
        return returnResponse(422, "false", "Role Tagged Successfully", err, "");
    });
}
exports.getRoleName = getRoleName;
function uploadImage(the_file, callback) {
    var imageName = Date.now().toString(36) + the_file.name;
    the_file.mv("../cps-node/uploads/" + imageName, function (err, data) {
        if (err) {
            return returnResponse(422, false, "Image Not uploaded. ", err, "");
        }
        else {
            return callback(imageName);
        }
    });
}
exports.uploadImage = uploadImage;
function getUserId(res, callback) {
    return callback(1);
}
exports.getUserId = getUserId;
function projectFLow(res, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const project_id = res.params.id;
        const userId = res.query.userID;
        const project = yield models_1.default.ProjectAreaDistrict.findOne({
            where: {
                projectID: project_id,
            },
        });
        console.log(project, project_id);
        // return callback(1);
    });
}
exports.projectFLow = projectFLow;
