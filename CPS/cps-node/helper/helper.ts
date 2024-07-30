import db from "../models";
// create main Model

const Role = db.role;
export function getInitials(str) {
  var matches = str.match(/\b(\w)/g);
  return matches.join("").toUpperCase();
}
export function returnResponse(
  statusCode,
  status,
  message,
  response,
  data = null
): string {
  const responseData = {} as any;
  responseData.message = message;
  responseData.success = status;
  responseData.data = data ? data : {};
  return response.status(statusCode).json(responseData);
}
// program to convert first letter of a string to uppercase
export const capitalizeFirstLetter = (string: string) =>
  string
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
    .join(" ");

export function getRoleName(roleId) {
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

export function uploadImage(the_file, callback) {
  var imageName = Date.now().toString(36) + the_file.name;
  the_file.mv("../cps-node/uploads/" + imageName, function (err, data) {
    if (err) {
      return returnResponse(422, false, "Image Not uploaded. ", err, "");
    } else {
      return callback(imageName);
    }
  });
}

export function getUserId(res, callback) {
  return callback(1);
}

export async function projectFLow(res, callback) {
  const project_id = res.params.id;
  const userId = res.query.userID;
  const project = await db.ProjectAreaDistrict.findOne({
    where: {
      projectID: project_id,
    },
  });
  console.log(project, project_id);
  // return callback(1);
}
