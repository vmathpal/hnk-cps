import * as userController from "../controllers/admin/userController";
import * as webUserController from "../controllers/web/webUserController";
import * as projectController from "../controllers/web/ProjectController";
import * as projectApprovalController from "../controllers/web/ProjectApprovalController";
import * as rolesController from "../controllers/admin/rolesLevelsController";
import * as formsController from "../controllers/admin/FormController";
import { isAuthenticated, isLoggedIn } from "../middleware/isAuthenticated";
import * as ProjectValidation from "../Validation/ProjectValidation";
import * as StepValidation from "../Validation/FromStepValidation";
import * as StepTwoValidation from "../Validation/FormStep2validation";
import * as ApprovalValidation from "../Validation/ApprovalValidation";
import * as ExcelUploadController from "../controllers/admin/ExcelUploadController";
import * as ProjectUploadController from "../controllers/admin/ProjectUpload";
import * as discussionController from "../controllers/web/discussionController";

import {
  userValidate,
  PasswordValidate,
  isGM,
  scheckAdminPrivilege,
  checkUserId,
  costUserValidate,
  BaUserValidate,
  isCommercialUser,
  checkPendingActionOfUser,
  updateCostCenterApprover,
} from "../Validation/Users";
import { urlValidate } from "../Validation/UrlValidate";
import {
  validateChannel,
  validateBrand,
  validatePackType,
  validateBARole,
  EditPackType,
  EditArea,
  validateArea,
  validateDistrict,
  EditDistrict,
  validateLineExtension,
  validateExpense,
  validateBusinessType,
  validateProjectVolume,
  validateProjectType,
} from "../Validation/FormValidates";
import {
  RuntimeProjectStatus,
  UpdateProjectStatus,
  AssignDelegatedUser,
  reAssignOwner,
} from "../cron/runTimeStatus";
import {
  roleValidate,
  levelValidate,
  tagRoleValidate,
  SubAdminRoleValidate,
  RelationRoleValidate34,
  RelationRoleValidate45,
  RelationRoleValidate56,
  validateCostCenter,
} from "../Validation/Roles";

import { Router } from "express";
let upload = require("../controllers/admin/multer-config");
let uploads = require("../MulterConfig/config-multer");

const router = Router();

const use = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get("/cron", function (req, res, next) {
  AssignDelegatedUser();
});
//Admin Login
router.post("/login", userController.Login);
router.post(
  "/admin-change-password",
  isAuthenticated,
  PasswordValidate,
  userController.AdminChangePassword
);
router.post(
  "/admin-cc-email",
  isAuthenticated,

  userController.AdminCcEmail
);

//Dashboard
router.get("/dashboard", use(userController.getAllCount));
router.get("/get-all-list", use(userController.getAllList));

//UserList
router.get("/allUsers", urlValidate, use(userController.getUsers));
router.get("/user-list", use(userController.getAllUsers));
router.get(
  "/delegation-list",
  isAuthenticated,
  use(userController.getDelegationUsers)
);
router.delete(
  "/delete-delegation/:id",
  isAuthenticated,
  use(userController.deleteDelegation)
);
router.get("/user-list-for-cost", use(userController.getAllUsersForCostCenter));
router.post(
  "/register",
  isAuthenticated,
  userValidate,
  isGM,
  use(userController.addRegister)
);
router.post(
  "/register-commercial-user",
  userValidate,
  isCommercialUser,
  use(userController.RegisterCommercialUser)
);
router.get("/status/:id", isAuthenticated, use(userController.updateStatus));
router.post(
  "/edit-user/:id",
  isAuthenticated,
  checkUserId,
  use(userController.updateUser)
);
router.get("/singleUser/:id", use(userController.getSingleUser));

//router.post("/create-project", isAuthenticated, userController.CreateProject);
router.get("/all-project", isAuthenticated, use(userController.getAllProject));

//Roles Management
router.post(
  "/add-role",
  isAuthenticated,
  roleValidate,
  use(rolesController.createRoles)
);
router.get(
  "/getRoles",
  isAuthenticated,
  urlValidate,
  use(rolesController.getRoles)
);
router.get(
  "/get-department-role",
  isAuthenticated,
  use(rolesController.getDeptRoles)
);
router.get(
  "/discussion-project-list/:id",
  use(discussionController.discussionProjectList)
);
router.get("/delete-chat/:id", use(discussionController.projectDeleteChat));
router.get("/project-chat-list/:id", use(discussionController.projectChatList));
router.post("/project-chat/:id", use(discussionController.projectChat));
router.get("/get-single-chat/:id", use(discussionController.GetSingleMessage));
router.post("/update-single-chat/:id", use(discussionController.UpdateMessage));

router.get("/singleRole/:id", use(rolesController.getSingleRole));
router.post("/edit-role/:id", isAuthenticated, use(rolesController.editRoles));
router.delete(
  "/delete-role/:id",
  isAuthenticated,
  use(rolesController.deleteRole)
);

//Level Management
router.post(
  "/add-level",
  isAuthenticated,
  levelValidate,
  use(rolesController.createLevel)
);
router.get(
  "/get-levels",
  isAuthenticated,
  urlValidate,
  use(rolesController.getLevels)
);
router.get(
  "/single-level/:id",
  isAuthenticated,
  use(rolesController.getSingleLevel)
);
router.post(
  "/tag-role",
  isAuthenticated,
  tagRoleValidate,
  use(rolesController.tagRole)
);
router.get(
  "/tag-management",
  isAuthenticated,
  urlValidate,
  use(rolesController.tagRoleList)
);
router.get("/single-tag-role/:id", use(rolesController.singleTagRole));
router.post(
  "/edit-tag/:id",
  isAuthenticated,
  tagRoleValidate,
  use(rolesController.EditTagRole)
);
router.delete(
  "/delete-tagged-role/:id",
  isAuthenticated,
  use(rolesController.deleteTagRole)
);

//SubAdmin Management
router.post(
  "/add-sub-admin",
  isAuthenticated,
  userValidate,
  use(userController.subAdminCreation)
);
router.get(
  "/get-all-subAdmin",
  isAuthenticated,
  use(userController.getAllSubAdmin)
);
router.delete(
  "/delete-sub-admin/:id",
  isAuthenticated,
  use(userController.deleteSubAdmin)
);
router.get(
  "/single-sub-admin/:id",
  isAuthenticated,
  use(userController.getSingleSubAdmin)
);
router.get(
  "/admin-status/:id",
  checkPendingActionOfUser,
  isAuthenticated,
  use(userController.updateAdminStatus)
);
router.post(
  "/save-role-permission",
  isAuthenticated,
  scheckAdminPrivilege,
  use(userController.subAdminRole)
);
router.get("/all-action-role/:id", userController.adminRoleActionList);
router.get(
  "/single-privilege-role/:id",
  isAuthenticated,
  use(userController.getSinglePrivilege)
);
router.post(
  "/edit-sub-admin/:id",
  isAuthenticated,
  use(userController.UpdateSubAdmin)
);
router.delete(
  "/delete-admin-dashboard-action/:id",
  isAuthenticated,
  use(userController.deleteSubAdminAccessRole)
);
router.post(
  "/edit-privilege/:id",
  isAuthenticated,
  use(userController.UpdatePrivilege)
);
//Relation Mapping APi
router.get("/level-based-role/:id", use(rolesController.getLevelBasedRole));
router.post(
  "/save-relation-mapping",
  isAuthenticated,
  RelationRoleValidate34,
  use(rolesController.SaveRelationMapping34)
);
router.post(
  "/save-relation-mapping45",
  isAuthenticated,
  RelationRoleValidate45,
  use(rolesController.SaveRelationMapping45)
);
router.post(
  "/save-relation-mapping56",
  isAuthenticated,
  RelationRoleValidate56,
  use(rolesController.SaveRelationMapping56)
);
router.get("/role-level34", use(rolesController.getDataRole34));
router.get("/role-level45", use(rolesController.getDataRole45));
router.get("/role-level56", use(rolesController.getDataRole56));
router.get(
  "/single-mapping-level34/:id",
  isAuthenticated,
  use(rolesController.getLevel34SingleRole)
);
router.get(
  "/single-mapping-level45/:id",
  isAuthenticated,
  use(rolesController.getLevel45SingleRole)
);
router.get(
  "/single-mapping-level56/:id",
  isAuthenticated,
  use(rolesController.getLevel56SingleRole)
);
router.post(
  "/edit-level34/:id",
  isAuthenticated,
  RelationRoleValidate34,
  use(rolesController.updateLevel34Mapping)
);
router.post(
  "/edit-level45/:id",
  isAuthenticated,
  RelationRoleValidate45,
  use(rolesController.updateLevel45Mapping)
);
router.post(
  "/edit-level56/:id",
  isAuthenticated,
  RelationRoleValidate56,
  use(rolesController.updateLevel56Mapping)
);
router.delete(
  "/delete-levelRole34/:id",
  isAuthenticated,
  use(rolesController.deleteMapped34LevelRole)
);
router.delete(
  "/delete-levelRole45/:id",
  isAuthenticated,
  use(rolesController.deleteMapped45LevelRole)
);
router.delete(
  "/delete-levelRole56/:id",
  isAuthenticated,
  use(rolesController.deleteMapped56LevelRole)
);

//Email Templates
router.get(
  "/email-templates",
  isAuthenticated,
  urlValidate,
  use(userController.getAllEmailTemplates)
);
router.get(
  "/singleEmail/:id",
  isAuthenticated,
  use(userController.getSingleEmailTemplates)
);
router.post(
  "/edit-email-template/:id",
  isAuthenticated,
  use(userController.updateEmailTemplates)
);

//Cost Center Managemennt
router.get(
  "/cost-center-management",

  urlValidate,
  use(rolesController.getAllCostCenter)
);
router.get(
  "/get-cost-center",
  use(rolesController.getDepartmentBasedCostCenter)
);

router.get(
  "/singleCostCenter/:id",

  rolesController.singleCostCenter
);
router.post(
  "/add-cost-center",
  isAuthenticated,
  validateCostCenter,
  use(rolesController.saveCostCenter)
);
router.delete(
  "/delete-cost-center/:id",
  isAuthenticated,
  use(rolesController.deleteCostCenter)
);
router.post(
  "/update-cost-center/:id",
  isAuthenticated,
  use(rolesController.updateCostCenter)
);
router.get(
  "/cost-center-status/:id",
  use(rolesController.updateStatusCostCenter)
);
router.get(
  "/single-cost-center-user/:id",
  rolesController.singleCostCenterUser
);
router.post(
  "/update-cost-user/:id",
  updateCostCenterApprover,
  use(rolesController.updateCostCenterUser)
);

//BA Management
router.get("/get-ba-department/:id", use(rolesController.getBaDepartment));
router.get(
  "/getBARoles",
  isAuthenticated,
  urlValidate,
  use(rolesController.getAllBARoles)
);
router.get(
  "/getActiveBARoles",
  isAuthenticated,
  urlValidate,
  use(rolesController.getActiveBARoles)
);
router.get(
  "/singleBaRole/:id",
  isAuthenticated,
  use(rolesController.singleBaRole)
);
router.post(
  "/add-ba-role",
  isAuthenticated,
  validateBARole,
  use(rolesController.createBARole)
);
router.delete(
  "/delete-baRole/:id",
  isAuthenticated,
  use(rolesController.deleteBARole)
);
router.post(
  "/edit-Barole/:id",
  isAuthenticated,
  validateBARole,
  use(rolesController.updateBaRole)
);
router.get(
  "/baRole-status/:id",
  isAuthenticated,
  use(rolesController.baRoleStaus)
);

//BA User Management
router.post(
  "/add-ba-user",
  isAuthenticated,
  userValidate,
  BaUserValidate,
  use(userController.createBaUser)
);
router.get(
  "/getbaUsers",
  // isAuthenticated,
  urlValidate,
  use(userController.getAllBAUsers)
);
router.get(
  "/getbaUsers-list",
  // isAuthenticated,
  urlValidate,
  use(userController.getAllBAUsersList)
);
router.get(
  "/singleBaUser/:id",
  isAuthenticated,
  use(userController.singleBaUser)
);
router.delete(
  "/delete-baUser/:id",
  isAuthenticated,
  use(userController.deleteBaUser)
);
router.post(
  "/edit-ba-user/:id",
  isAuthenticated,
  checkUserId,
  use(userController.updateBaUser)
);
router.get(
  "/ba-user-status/:id",
  isAuthenticated,
  checkPendingActionOfUser,
  use(userController.baUserStatus)
);

//Channel Management
router.post(
  "/add-channel",
  isAuthenticated,
  validateChannel,
  use(formsController.CreatChannel)
);
router.get("/get-channels-list", use(formsController.getChannels));
router.get(
  "/singleChannel/:id",

  use(formsController.singleChannel)
);
router.post(
  "/update-channel/:id",
  isAuthenticated,
  validateChannel,
  use(formsController.updateChannel)
);
router.delete(
  "/delete-channel/:id",
  isAuthenticated,
  use(formsController.deleteChannel)
);

//Brand Management
router.post(
  "/add-brand",

  validateBrand,
  use(formsController.CreatBrand)
);
router.get("/get-brands-list", use(formsController.getBrands));
router.get("/singleBrand/:id", use(formsController.singleBrand));
router.post(
  "/update-brand/:id",

  validateBrand,
  use(formsController.updateBrand)
);
router.delete(
  "/delete-brand/:id",

  use(formsController.deleteBrand)
);
router.get(
  "/brand-status/:id",

  use(formsController.updateBrandStatus)
);

//PackType Management

router.post(
  "/add-packtype",
  isAuthenticated,
  validatePackType,
  use(formsController.CreatPackType)
);
router.get(
  "/get-packtypes-list",

  use(formsController.getPackTypes)
);
router.get(
  "/singlePackType/:id",

  use(formsController.singlePackType)
);
router.get(
  "/packtype-lists/:id",

  use(formsController.PackTypeListByID)
);
router.post(
  "/update-packtype/:id",

  EditPackType,
  use(formsController.updatePackType)
);
router.delete(
  "/delete-packtype/:id",
  isAuthenticated,
  use(formsController.deletePackType)
);
router.get(
  "/packtype-status/:id",
  isAuthenticated,
  use(formsController.updatePackTypeStatus)
);
//SKU Management
router.post("/add-sku", ProjectValidation.Sku, use(formsController.CreatSKU));
router.get("/get-skus-list", use(formsController.getSKUs));
router.get("/singleSKU/:id", use(formsController.singleSKU));
router.get("/all-sku-lists/:id", use(formsController.SKUListByID));
router.post(
  "/update-sku/:id",
  ProjectValidation.Sku,
  use(formsController.updateSKU)
);
router.delete("/delete-sku/:id", use(formsController.deleteSKU));
router.get(
  "/sku-status/:id",
  isAuthenticated,
  use(formsController.updateSKUStatus)
);

//Area Management
router.post(
  "/add-area",
  // isAuthenticated,
  validateArea,
  use(formsController.CreatArea)
);
router.get("/get-area-list", use(formsController.getAreas));
router.get("/singleArea/:id", use(formsController.singleArea));
router.post(
  "/update-area/:id",
  // isAuthenticated,
  EditArea,
  formsController.updateArea
);
router.delete(
  "/delete-area/:id",
  isAuthenticated,
  use(formsController.deleteArea)
);
// router.get("/area-status/:id", isAuthenticated, formsController.updateAreaStatus);

//District Management
router.post(
  "/add-district",
  isAuthenticated,
  validateDistrict,
  use(formsController.CreatDistrict)
);
router.get(
  "/get-district-list",

  use(formsController.getDistrictsList)
);
router.get(
  "/singleDistrict/:id",
  isAuthenticated,
  use(formsController.singleDistrict)
);
router.post(
  "/update-district/:id",
  isAuthenticated,
  EditDistrict,
  use(formsController.updateDistrict)
);
router.delete("/delete-district/:id", use(formsController.deleteDistrict));

//Category Management
router.post(
  "/add-category",
  ProjectValidation.Category,
  use(formsController.CreatCategory)
);
router.get(
  "/get-categories-list",

  use(formsController.getCategories)
);
router.get("/singleCategory/:id", use(formsController.singleCategory));
router.post(
  "/update-category/:id",
  ProjectValidation.Category,
  use(formsController.updateCategory)
);
router.delete(
  "/delete-category/:id",
  isAuthenticated,
  use(formsController.deleteCategory)
);

//Cost Center User Management
router.post(
  "/add-cost-owner",
  isAuthenticated,
  costUserValidate,
  use(formsController.createCostCenterOwner)
);
router.get(
  "/cost-user-status/:id",
  isAuthenticated,
  use(formsController.costCenterUserStatus)
);
router.get(
  "/get-cost-center-department/:id",

  use(formsController.costCenterDepartment)
);
// router.get(
//   "/singleCategory/:id",
//   isAuthenticated,
//   formsController.singleCategory
// );
// router.post(
//   "/update-category/:id",
//   isAuthenticated,
//   formsController.updateCategory
// );
// router.delete(
//   "/delete-category/:id",
//   isAuthenticated,
//   formsController.deleteCategory
// );

//FrontEnd Area & Dostrict List
router.get("/getAreaList/:id", use(formsController.areaList));
router.get("/cost-center-user", use(formsController.costCenterList));
router.get(
  "/get-selected-brand-line/:id",
  use(formsController.selectedBrandLine)
);
router.delete(
  "/delete-cost-center-user/:id",
  use(formsController.deleteCostCenterUser)
);
router.get(
  "/getDistrictList/:id",

  use(formsController.districtList)
);
//Web User Login
router.post("/user-login", use(webUserController.LDAPLogin));
router.post(
  "/create-project",
  StepValidation.checkStep,
  ProjectValidation.ValidationInactiveItem,
  use(projectController.basicInformation)
);
router.get("/export-report", use(discussionController.exportReport));
router.get(
  "/export-project-report",
  use(discussionController.exportProjectListReport)
);

router.get(
  "/get-business-type/:id",
  use(projectApprovalController.GetBusinessTpe)
);
// router.get("/cron", projectApprovalController.cron);

router.post(
  "/area-district",
  StepValidation.checkStep,
  ProjectValidation.projectChannel,
  use(projectController.areaDistrict)
);
router.get("/area-district/:id", use(projectController.showAreaDistrict));
router.get("/download-image/:id", use(projectController.downloadImage));
router.get("/area-district-list/:id", use(projectController.areaDistrictList));
router.post(
  "/area-district/:id",

  ProjectValidation.projectChannel,
  use(projectController.updateAreaDistrict)
);
router.delete(
  "/delete-area-district/:id",
  use(projectController.deleteAreaDistrict)
);

router.post(
  "/choose-brand",
  StepValidation.checkStep,
  use(ProjectValidation.ValidationDuplicateItem),
  use(projectController.chooseBrand)
);
router.post(
  "/choose-brand/:id",
  // ProjectValidation.projectBrand,
  use(ProjectValidation.ValidationDuplicateItem),
  use(projectController.updateChooseBrand)
);
router.get("/choose-brand/:id", use(projectController.showChooseBrand));
router.get("/all-brand-sku/:id", use(projectController.BrandSkuPackTypeList));
router.get(
  "/old-project-brand-sku/:id",
  use(projectController.OldProjectBudgetList)
);
router.post(
  "/project-reviewers/:id",
  StepTwoValidation.SecondForm,
  use(projectController.projectsReviewers)
);
router.delete(
  "/delete-choose-brand/:id",
  use(projectController.deleteChooseBrand)
);
router.post(
  "/project-file-upload/:id",
  uploads.single("image"),
  use(ExcelUploadController.projectFileUploads)
);
router.delete("/delete-file/:id", use(projectController.deleteFile));
router.post(
  "/create-project-expense",
  StepTwoValidation.SecondForm,
  use(projectController.createProjectExpenses)
);
router.post(
  "/save-gm-director-reviewers",
  use(projectController.saveGmDirectorReviewers)
);
router.post(
  "/save-costCenter-approvers",
  use(projectController.saveCostCenterApprovers)
);
router.post(
  "/change-aproval-status",
  // ApprovalValidation.statusValidation,
  use(projectApprovalController.changeAprovalStatus)
);
router.post(
  "/change-request/:id",
  use(projectApprovalController.changeRequest)
);
// router.post("/save-ba-approver", projectController.saveBaApprovers);
router.get(
  "/approver-project-list/:id",
  isLoggedIn,
  use(projectApprovalController.approverProjectList)
);
router.get(
  "/check-approval-user/:id",
  use(projectApprovalController.checkApprovalUser)
);
router.get(
  "/get-sequence-number/:id",
  use(projectApprovalController.getSequenceNumber)
);
router.post(
  "/closed-project-status/:id",
  use(projectApprovalController.ClosedProjectStatus)
);
router.get(
  "/run-time-project-status/:id",
  use(projectController.runTimeProjectStatus)
);
router.get(
  "/run-time-approval-users/:id",
  use(projectApprovalController.runTimeApprovalStatus)
);
router.get(
  "/cancel-or-rejected/:id",
  isLoggedIn,
  use(projectApprovalController.rejectApproveProject)
);
router.post(
  "/project-re-status/:id",
  use(projectApprovalController.projectReStatus)
);
router.get(
  "/cancelled-project/:id",
  use(projectApprovalController.cancelledProjectStatus)
);
router.get("/clone-project/:id", use(discussionController.cloneProject));
router.post("/assign-project/:id", use(discussionController.assignProject));
router.post(
  "/assign-all-project/:id",
  use(discussionController.assignAllProject)
);
router.post("/update-delegation/:id", use(discussionController.updateProject));
router.get(
  "/approved-project-list/:id",
  use(projectApprovalController.approvalProjectList)
);

router.get("/get-promo-report", use(projectController.getPromoReport));
router.get(
  "/get-level-project-list",
  isLoggedIn,
  use(projectController.getLevelProjectList)
);
router.get(
  "/show-project-expense/:id",
  use(projectController.showProjectExpenses)
);
router.get("/approver-list/:id", use(projectController.approverList));
router.get("/project-list/:id", use(projectController.projectList));
router.get("/file-list/:id", use(projectController.fileList));
router.get("/get-all-project", isLoggedIn, use(projectController.allProjects));
router.get(
  "/get-all-project-execution",
  use(projectController.allProjectsPending)
);
router.get(
  "/get-admin-project",
  isLoggedIn,
  use(formsController.allAdminProjects)
);
router.get("/all-project-list", use(formsController.projectList));

router.post(
  "/create-project-budget/:id",
  use(StepValidation.checkStep),
  use(projectController.projectsBudget)
);
router.get("/reviewers-list", use(projectController.reviewersList));
router.get(
  "/edit-reviewers-list/:id",
  use(projectController.EditReviewersList)
);
router.get("/selected-ba-list/:id", use(projectController.SelectedBaList));

router.post(
  "/create-project-financial/:id",
  use(projectController.projectsFinancial)
);
router.post("/save-draft/:id", use(projectController.saveDraft));
router.post(
  "/total-project-profite/:id",
  use(projectController.totalFinancialProjects)
);

router.delete(
  "/delete-project-expense/:id",
  use(projectController.deleteProjectExpenses)
);
router.post(
  "/update-project-expens/:id",
  use(projectController.updateProjectExpenses)
);
router.post(
  "/update-project-new-expense/:id",
  use(projectController.updateProjectNewExpense)
);
router.get(
  "/all-project-expenses/:id",
  use(projectController.BrandExpenseList)
);

//Extension Line Management
router.post(
  "/add-line-extension",
  validateLineExtension,
  use(formsController.CreatLineExtension)
);
router.get("/line-extension-lists", use(formsController.getLineExtensions));
router.get(
  "/singleLineExtension/:id",
  use(formsController.singleLineExtension)
);
router.delete(
  "/delete-line-extension/:id",
  use(formsController.deleteLineExtension)
);
router.post(
  "/update-line-extension/:id",
  use(formsController.updateLineExtension)
);
router.get(
  "/brand-based-line-extension/:id",
  use(formsController.LineExtensionBrand)
);
router.get("/line-based-size-list/:id", use(formsController.lineBasedSizeList));
router.get(
  "/size-based-packtype-list/:id",
  use(formsController.sizeBasedPackList)
);
router.get("/line-status/:id", use(formsController.updateLineExtStatus));

router.post(
  "/import-excel",
  upload.single("file"),
  use(ExcelUploadController.uploadFile)
);

router.post(
  "/import-project",
  upload.single("file"),
  //use(ProjectUploadController.MasterFileUpload)
  //ProjectUploadController.importCostCenter
  // ProjectUploadController.BrandUpload
  // ProjectUploadController.projectBudget
  // ProjectUploadController.uploadUsers
  // ProjectUploadController.uploadRole
  // ProjectUploadController.masterUploadBrand
  // ProjectUploadController.uploadFile
  // ProjectUploadController.projectExpense
  //ProjectUploadController.expenseUpload
  //ProjectUploadController.financeDataUpload
  ProjectUploadController.importTotalCalculation
  // ProjectUploadController.ImportAreaDistrict
  // ProjectUploadController.MasterAreaDistrict
);
// router.post(
//   "/import-expence-excel",
//   upload.single("file"),
//   ExcelUploadController.expenceUploadFile
// );
router.post(
  "/import-expence-excel",
  upload.single("file"),
  use(ExcelUploadController.ChannelUploadFile)
);

router.get("/category-status/:id", use(formsController.updateCategoryStatus));

//Expense Management
router.post("/add-expense", validateExpense, use(formsController.AddExpense));
router.get("/get-expense-lists", use(formsController.ExpenseLists));
router.get("/singleExpense/:id", use(formsController.singleExpense));
router.post("/update-expense/:id", use(formsController.updateExpense));
router.get("/expense-status/:id", use(formsController.updateStatusExpense));
router.delete("/delete-expense/:id", use(formsController.deleteExpense));

//Project Volume Management
router.post(
  "/add-project-volume",
  validateProjectVolume,
  use(formsController.AddProjectVolume)
);
router.get("/get-volume-lists", use(formsController.ProjectVolumeLists));
router.get(
  "/singleProjectVolume/:id",
  use(formsController.singleProjectVolume)
);
router.post(
  "/update-project-volume/:id",
  validateProjectVolume,
  use(formsController.updateProjectVolume)
);
router.delete("/delete-volume/:id", use(formsController.deleteProjectVolume));
router.get(
  "/project-volume-status/:id",
  use(formsController.changeStatusVolume)
);

//Project Type Management
router.post(
  "/add-project-type",
  validateProjectType,
  use(formsController.AddProjectType)
);
router.get(
  "/project-type-lists",
  validateProjectType,
  use(formsController.ProjectTypeLists)
);
router.get("/singleProjectType/:id", use(formsController.singleProjectType));
router.post(
  "/update-project-type/:id",
  validateProjectType,
  use(formsController.updateProjectType)
);
router.delete(
  "/delete-project-type/:id",
  use(formsController.deleteProjectType)
);
router.get("/project-type-status/:id", use(formsController.changeStatusType));

//get BA approver
router.get("/get-ba-approver", use(formsController.getBaApprover));
router.get("/get-cost-owners", use(formsController.getCostCenterApprover));
router.get(
  "/get-cost-owners-new",
  use(formsController.getCostCenterApproverNew)
);
router.get("/get-gm-approver", use(formsController.getGmApprover));
router.get("/get-level2-approver", use(formsController.getLevel2Approver));
router.get("/get-user-Level/:id", use(formsController.getUserLevel));
router.get("/get-role-id/", use(formsController.getRoleID));
router.post("/save-total-profit/:id", use(formsController.saveTotalProfit));
router.get("/get-total-profit-data/:id", use(formsController.getTotalProfit));
router.get(
  "/get-change-request-list/:id",
  use(projectApprovalController.ChangeRequestList)
);

//Business Type Management
router.post(
  "/add-businessType",
  validateBusinessType,
  use(formsController.AddBusinessType)
);
router.get("/get-business-type-lists", use(formsController.BusinessTypeList));
router.get("/singleBusinessType/:id", use(formsController.singleBusinessType));
router.post(
  "/update-business-type/:id",
  validateBusinessType,
  use(formsController.updateBusinessType)
);
router.get(
  "/business-type-status/:id",
  use(formsController.updateStatusBusinessType)
);
router.delete("/delete-business/:id", use(formsController.deleteBusinessType));
router.get(
  "/get-brands-list-based-id/",
  use(formsController.BrandListBasedOnId)
);
router.get(
  "/generate-project-number/:id",
  use(formsController.generateProjectNumber)
);

//Close Request
router.post("/data-evaluation", use(projectController.AddCloseRequestForm));
router.get(
  "/get-data-evaluation/:id",
  use(projectController.getDataEvaluation)
);
router.post(
  "/expense-data-analyst/:id",
  use(projectController.updateDataExpenseAnalyst)
);
router.post(
  "/total-revenue-analyst/:id",
  use(projectController.totalRevenueUpdate)
);
router.post("/closer-request/:id", use(projectController.closerRequest));
router.get("/project-audit-log", use(projectController.projectAuditLog));
router.get(
  "/projectby-audit-log/:id",
  use(projectController.projectByAuditLog)
);
router.get(
  "/project-audit-log-check/:id",
  use(projectController.projectAuditBasedID)
);
router.get(
  "/user-delegation-audit-log",
  use(projectController.userDelegationAudit)
);
export default router;
