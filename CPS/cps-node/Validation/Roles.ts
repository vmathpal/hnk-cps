import db from '../models';
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { getInitials, returnResponse,capitalizeFirstLetter } from "../helper/helper"
const Role = db.role;
const Level = db.Level;
const TagRole = db.TagRole;
const permission_admin = db.permission_admin;
const level3And4Mapping=db.level3And4Mapping;
const level4And5Mapping=db.level4And5Mapping;
const CostCenter=db.CostCenter;

export const roleValidate = async (req: any, res: any,next:any) => {
    try {

        Role.count({ where: { role: capitalizeFirstLetter(req.body.role.trim()),department:(req.body.dept.trim()) } }).then(response => {
            if (response) {
               return returnResponse(422,'true','Role Already Exists',res,'');
            }
            else{
                return next();
            }
        });
        
    }
    catch (err) {
        console.log('error',err);
    }

};
export const levelValidate = async (req: any, res: any,next:any) => {
    try {

        Level.count({ where: { name:req.body.level} }).then(response => {
            if (response) {
               return returnResponse(422,'true','Level Already Exists',res,'');
            }
            else{
                return next();
            }
        });
        
    }
    catch (err) {
        console.log('error',err);
    }

};

export const tagRoleValidate = async (req: any, res: any,next:any) => {
    try {
    //     console.log(req.body);
      if(req.body.hidden_value!==req.body.roleId){
        TagRole.count({ where: { roleId:req.body.roleId} }).then(response => {
            if (response) {
               return returnResponse(422,'true','Role already occupied',res,'');
            }
            else{
                return next();
            }
        });
        
    }
    else{
        return next();
    }
}
    catch (err) {
        console.log('error',err);
    }
   
};

export const SubAdminRoleValidate = async (req: any, res: any,next:any) => {
    try {

        permission_admin.count({ where: { permissionId:req.body.permissionId} }).then(response => {
            if (response) {
               return returnResponse(422,'true','Role Dashboard Already Exists',res,'');
            }
            else{
                return next();
            }
        });
        
    }
    catch (err) {
        console.log('error',err);
    }

};
export const RelationRoleValidate34 = async (req: any, res: any,next:any) => {
  
    try {
        if(req.body.hiddenValue!==req.body.roleLevel4){
        level3And4Mapping.count({ where: { roleLevel4:req.body.roleLevel4} }).then(response => {
            if (response) {
               return returnResponse(422,false,'This Level4\'s Role is Already Mapped.Please Delete First for Remapping',res,'');
            }
            else{
                return next();
            }
        });
        
    }
    else{
        return next();
    }
}
    catch (err) {
        console.log('error',err);
    }

};
export const RelationRoleValidate45 = async (req: any, res: any,next:any) => {
    // console.log(req.body);
    try {
        if(req.body.hiddenValue!==req.body.roleLevel5){
            level4And5Mapping.count({ where: { roleLevel5:req.body.roleLevel5} }).then(response => {
            if (response) {
               return returnResponse(422,false,'This Level5\'s Role is Already Mapped.Please Delete First for Remapping',res,'');
            }
            else{
                return next();
            }
        });
        
    }
    else{
        return next();
    }
}
    catch (err) {
        console.log('error',err);
    }

};

export const RelationRoleValidate56 = async (req: any, res: any,next:any) => {
    // console.log(req.body);
    try {
        if(req.body.hiddenValue!==req.body.roleLevel6){
            await db.level5And6Mapping.count({ where: { roleLevel6:req.body.roleLevel6} }).then(response => {
            if (response) {
               return returnResponse(422,false,'This Level6\'s Role is Already Mapped.Please Delete First for Remapping',res,'');
            }
            else{
                return next();
            }
        });
        
    }
    else{
        return next();
    }
}
    catch (err) {
        console.log('error',err);
    }

};

export const validateCostCenter = async (req: any, res: any,next:any) => {
    try {
    //     console.log(req.body);
      if(req.body.hidden_value!==req.body.role){
        CostCenter.count({ where: { 
            [Op.or]: {
                name: {
                  [Op.eq]: req.body.role,
                },
                centerCode: {
                  [Op.eq]: req.body.centerCode,
                },
              }
        } 

        }).then(response => {
            if (response) {
               return returnResponse(422,'true','Name Or Code Already Exists',res,'');
            }
            else{
                return next();
            }
        });
        
    }
    else{
        return next();
    }
}
    catch (err) {
        console.log('error',err);
    }
   
};

