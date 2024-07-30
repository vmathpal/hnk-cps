import db from "../models";
import jwt from "jsonwebtoken";
const Token = db.token;
const User = db.User;
import { returnResponse } from "../helper/helper";

export const isAuthenticated = async (req: any, res: any, next: any) => {
  const token =
    (await req.body.token) || req.query.token || req.headers["authorization"];
  const token2 = (await token) ? await token.split(" ") : "";
  //console.log('>>>>>>token2>>>', token2);
  const checkToken = await Token.findOne({ where: { token: token2[1] } });
  // console.log('token1>>>',token,'checktoken',checkToken.userId);
  if (!token) {
    return returnResponse(401, "false", "Unauthorized Access", res, "");
  } else if (!checkToken) {
    // console.log('TOKEN2>>>>>>>>',checkToken);
    return returnResponse(
      401,
      "false",
      "Invalid Token Unauthorized Access",
      res,
      ""
    );
  }
  if (checkToken) {
    User.findOne({ where: { id: checkToken.userId } }).then((response) => {
      if (response.status === "deactive" || response.status === "deleted") {
        return returnResponse(401, "true", "Unauthorized User", res, "");
      } else {
        return next();
      }
    });
  } else {
    return next();
  }

  try {
    const decoded = await jwt.verify(token2[1], "abcdefg");
    req.user = decoded;
  } catch (err) {
    return returnResponse(401, true, "Unauthorized User", res, "");
  }
  // return next();
};

export const isLoggedIn = async (req: any, res: any, next: any) => {
  if (!req.query.userID) {
    return returnResponse(401, true, "Unauthorized User", res, "");
  } else {
    return next();
  }
};
