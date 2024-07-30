import React from "react";
import { Route, Routes } from "react-router-dom";
import SignIn from "../components/Auth/SignIn";
import Dashboard from "../components/layouts/Dashboard";
import FullLayout from "../components/layouts/FullLayout";
import NotFound from "../components/NotFound";
import AddRoles from "../components/Roles/AddRoles";
import AddUser from "../components/Users/AddUser";
import CreateProject from "../components/Projects/CreateProject";
import PrivateRoutes from "./PrivateRoutes";
import UserList from "../components/Users/UserList";
import RoleList from "../components/Roles/RoleList";
import EditRole from "../components/Roles/EditRole";
import LevelList from "../components/Level/LevelList";
import AddLevel from "../components/Level/AddLevel";
import EditLevel from "../components/Level/EditLevel";
import TagRoleList from "../components/Level/TagRoleList";
import TagRole from "../components/Level/TagRole";
import EditTagLevel from "../components/Level/EditTagLevel";
import SubAdminCreation from "../components/SubAdmin/SubAdminCreation";
import SubAdminList from "../components/SubAdmin/SubAdminList";
import EditSubAdmin from "../components/SubAdmin/EditSubAdmin";
import AssignRole from "../components/SubAdmin/AssignRole";
import ActionRoleList from "../components/SubAdmin/ActionRoleList";
import EditPrivilege from "../components/SubAdmin/EditPrivilege";
import RelationMapping from "../components/RelationMapping/RelationMapping";
import LevelMapping3And4 from "../components/RelationMapping/LevelMapping3And4";
import LevelMapping4And5 from "../components/RelationMapping/LevelMapping4And5";
import LevelMapping3And4Listing from "../components/RelationMapping/LevelMapping3And4Listing";
import LevelMapping4And5Listing from "../components/RelationMapping/LevelMapping4And5Listing";
import EditLevelMapping3And4 from "../components/RelationMapping/EditLevelMapping3And4";
import EditLevelMapping4And5 from "../components/RelationMapping/EditLevelMapping4And5";
import AdminChangePassword from "../components/AdminSettings/AdminChangePassword";
import EditUser from "../components/Users/EditUser";
import AddGM from "../components/Users/AddGM";
import EditGM from "../components/Users/EditGM";
import EmailTemplateList from "../components/EmailTemplate/EmailTemplateList";
import EditEmailTemplate from "../components/EmailTemplate/EditEmailTemplate";
import UserManagement from "../components/Users/UserManagement";
import UserDelegation from "../components/Users/UserDelegation";
import CostCenterManagement from "../components/CostCenterManagement/CostCenterManagement";
import ViewCostCenter from "../components/CostCenterManagement/ViewCostCenter";
import AddCostCenter from "../components/CostCenterManagement/AddCostCenter";
import ChannelManegement from "../components/FormContent/ChannelManement/ChannelManegement";
import AddChannel from "../components/FormContent/ChannelManement/AddChannel";
import EditChannel from "../components/FormContent/ChannelManement/EditChannel";
import BrandManagemet from "../components/FormContent/BrandManagement/BrandManagemet";
import CreateBrand from "../components/FormContent/BrandManagement/CreateBrand";
import EditBrand from "../components/FormContent/BrandManagement/EditBrand";
import PacktypeManagement from "../components/FormContent/PackTypeManagement/PacktypeManagement";
import AddPacktype from "../components/FormContent/PackTypeManagement/AddPacktype";
import EditPackType from "../components/FormContent/PackTypeManagement/EditPackType";
import SkuManagement from "../components/FormContent/SkuManagement/SkuManagement";
import AddSKU from "../components/FormContent/SkuManagement/AddSKU";
import EditSKU from "../components/FormContent/SkuManagement/EditSKU";
import LevelMapping5And6 from "../components/RelationMapping/LevelMapping5And6";
import LevelMapping5And6Listing from "../components/RelationMapping/LevelMapping5And6Listing";
import EditLevelMapping5And6 from "../components/RelationMapping/EditLevelMapping5And6";
import BaManagement from "../components/BaManagemt/BaManagement";
import AddBA from "../components/BaManagemt/AddBA";
import EditBaRole from "../components/BaManagemt/EditBaRole";
import BusinessAnalystManagement from "../components/BusinessAnalyst/BusinessAnalystManagement";
import AddBAUser from "../components/BusinessAnalyst/AddBAUser";
import EditBaUser from "../components/BusinessAnalyst/EditBaUser";
import CategoryManagement from "../components/FormContent/CategoryManagement/CategoryManagement";
import AddCategory from "../components/FormContent/CategoryManagement/AddCategory";
import EditCategory from "../components/FormContent/CategoryManagement/EditCategory";
import AreaManagement from "../components/FormContent/AreaManagement/AreaManagement";
import AddArea from "../components/FormContent/AreaManagement/AddArea";
import EditArea from "../components/FormContent/AreaManagement/EditArea";
import AddDistrict from "../components/FormContent/DistrictManagement/AddDistrict";
import DistrictManagement from "../components/FormContent/DistrictManagement/DistrictManagement";
import EditDistrict from "../components/FormContent/DistrictManagement/EditDistrict";
import AddCostCenterOwner from "../components/CostCenterManagement/AddCostCenterOwner";
import CostCenterOnwerManagement from "../components/CostCenterManagement/CostCenterOnwerManagement";
import ProjectList from "../components/ProjectManagement/ProjectList";
import BasicInformation from "../components/ProjectManagement/BasicInformation";
import AreaDistrict from "../components/ProjectManagement/AreaDistrict";
import FinancialDetails from "../components/ProjectManagement/FinancialDetails";
import LineExtensionManagement from "../components/FormContent/LineExtension/LineExtensionManagement";
import AddLineExtension from "../components/FormContent/LineExtension/AddLineExtension";
import EditLineExtension from "../components/FormContent/LineExtension/EditLineExtension";
import ExpenseManagement from "../components/FormContent/ExpenseManagement/ExpenseManagement";
import AddExpense from "../components/FormContent/ExpenseManagement/AddExpense";
import EditExpense from "../components/FormContent/ExpenseManagement/EditExpense";
import AddProjectVolume from "../components/FormContent/ProjectVolume/AddProjectVolume";
import ProjectVolumeManagement from "../components/FormContent/ProjectVolume/ProjectVolumeManagement";
import EditProjectVolume from "../components/FormContent/ProjectVolume/EditProjectVolume";
import ProjectTypeManagement from "../components/FormContent/ProjectType/ProjectTypeManagement";
import AddProjectType from "../components/FormContent/ProjectType/AddProjectType";
import EditProjectType from "../components/FormContent/ProjectType/EditProjectType";
import ApprovalStatus from "../components/ProjectManagement/ApprovalStatus";
import AddCommercialUser from "../components/Users/AddCommercialUser";
import EditCostCenterOwner from "../components/CostCenterManagement/EditCostCenterOwner";
import BusinessTypeManagement from "../components/FormContent/BusinessTypeManagement/BusinessTypeManagement.jsx";
import AddBusinessType from "../components/FormContent/BusinessTypeManagement/AddBusinessType";
import EditBusinessType from "../components/FormContent/BusinessTypeManagement/EditBusinessType";
import AuditLog from "../components/AuditLog/AuditLog";
import AddFinanceDirector from "../components/Users/AddFinanceDirector";

import ChangeDataAudit from "../components/AuditLog/ChangeDataAudit";
import ProjectReportTab from "../components/ProjectManagement/ProjectReportTab";
import AddProjectAction from "../components/ProjectManagement/AddProjectAction";
import ProjectBaseAudit from "../components/AuditLog/ProjectBaseAudit";
import DelegationAudit from "../components/AuditLog/DelegationAudit";
import ProjectOverview from "../components/ProjectOverview";
export default function AllRoutes() {
  console.log(localStorage.getItem("user_role"));
  return (
    <div>
      <Routes>
        <Route path="/" element={<PrivateRoutes />}>
          <Route path="/" element={<FullLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route
              path={
                localStorage.getItem("user_role") === "super_admin"
                  ? "user-management"
                  : "user-management/:action"
              }
              element={<UserManagement />}
            />
            <Route
              path={
                localStorage.getItem("user_role") === "super_admin"
                  ? "user-delegation"
                  : "user-delegation/:action"
              }
              element={<UserDelegation />}
            />
            <Route path="add-user" element={<AddUser />} />
            <Route path="add-gm-user" element={<AddGM />} />
            <Route path="user-management/edit-user/:UserId" element={<EditUser />} />
            <Route path="user-management/edit-gm-user" element={<EditGM />} />
            <Route path="add-role" element={<AddRoles />} />
            <Route
              path={
                localStorage.getItem("user_role") === "super_admin"
                  ? "role-management"
                  : "role-management/:action"
              }
              element={<RoleList />}
            />
            <Route path="role-management/edit-role/:id" element={<EditRole />} />
            <Route
              path={
                localStorage.getItem("user_role") === "super_admin"
                  ? "level-management"
                  : "level-management/:action"
              }
              element={<LevelList />}
            />
            <Route path="level-management/edit-level" element={<EditLevel />} />
            <Route path="add-level" element={<AddLevel />} />
            <Route
              path={
                localStorage.getItem("user_role") === "super_admin"
                  ? "tag-management"
                  : "tag-management/:action"
              }
              element={<TagRoleList />}
            />
            <Route
              path="tag-management/edit-tag-role/:id"
              element={<EditTagLevel />}
            />
            <Route path="tag-role" element={<TagRole />} />
            <Route path="create-project" element={<CreateProject />} />
            <Route path="users" element={<UserList />} />
            <Route path="add-subAdmin" element={<SubAdminCreation />} />
            <Route path="sub-admin-list" element={<SubAdminList />} />
            <Route
              path="sub-admin-list/edit-sub-admin/:id"
              element={<EditSubAdmin />}
            />
            <Route
              path="sub-admin-list/assign-admin-role"
              element={<AssignRole />}
            />
            <Route
              path="sub-admin-list/privilege-management"
              element={<ActionRoleList />}
            />
            <Route
              path="sub-admin-list/edit-privilege"
              element={<EditPrivilege />}
            />
            <Route
              path={
                localStorage.getItem("user_role") === "super_admin"
                  ? "relation-mapping"
                  : "relation-mapping/:action"
              }
              element={<RelationMapping />}
            />
            <Route
              path="relation-mapping/role-mapping34"
              element={<LevelMapping3And4 />}
            />
            <Route
              path="relation-mapping/role-mapping45"
              element={<LevelMapping4And5 />}
            />
            <Route
              path="relation-mapping/role-mapping56"
              element={<LevelMapping5And6 />}
            />
            <Route
              path="relation-mapping/role-mapping34-listing"
              element={<LevelMapping3And4Listing />}
            />
            <Route
              path="relation-mapping/role-mapping45-listing"
              element={<LevelMapping4And5Listing />}
            />
            <Route
              path="relation-mapping/role-mapping56-listing"
              element={<LevelMapping5And6Listing />}
            />
            <Route
              path="relation-mapping/edit-role-mapping34"
              element={<EditLevelMapping3And4 />}
            />
            <Route
              path="relation-mapping/edit-role-mapping45"
              element={<EditLevelMapping4And5 />}
            />
            <Route
              path="relation-mapping/edit-role-mapping56"
              element={<EditLevelMapping5And6 />}
            />
            <Route path="admin-change-pass" element={<AdminChangePassword />} />
            <Route
              path={
                localStorage.getItem("user_role") === "super_admin"
                  ? "email-templates"
                  : "email-templates/:action"
              }
              element={<EmailTemplateList />}
            />
            <Route
              path={
                localStorage.getItem("user_role") === "super_admin"
                  ? "cost-center-management"
                  : "cost-center-management/:action"
              }
              element={<CostCenterManagement />}
            />
            <Route
              path="email-templates/edit-email-templates/:id"
              element={<EditEmailTemplate />}
            />
            <Route
              path="cost-center-management/edit-cost-center/:id"
              element={<ViewCostCenter />}
            />
            <Route
              path="cost-center-management/add-cost-center"
              element={<AddCostCenter />}
            />
            <Route path="cost-center-owner" element={<AddCostCenterOwner />} />
            <Route
              path="cost-owner-management/add-cost-owner"
              element={<AddCostCenterOwner />}
            />
            <Route
              path={
                localStorage.getItem("user_role") === "super_admin"
                  ? "cost-owner-management"
                  : "cost-owner-management/:action"
              }
              element={<CostCenterOnwerManagement />}
            />
            <Route
              path={
                localStorage.getItem("user_role") === "super_admin"
                  ? "ba-management"
                  : "ba-management/:action"
              }
              element={<BaManagement />}
            />
            <Route path="ba-management/add-ba-role" element={<AddBA />} />
            <Route path="ba-management/edit-Barole/:id" element={<EditBaRole />} />
            <Route
              path={
                localStorage.getItem("user_role") === "super_admin"
                  ? "business-analyst-management"
                  : "business-analyst-management/:action"
              }
              element={<BusinessAnalystManagement />}
            />
            <Route
              path="business-analyst-management/add-ba-user"
              element={<AddBAUser />}
            />
            <Route
              path="business-analyst-management/edit-ba-user/:id"
              element={<EditBaUser />}
            />
            <Route
              path={
                localStorage.getItem("user_role") === "super_admin"
                  ? "channel-management"
                  : "channel-management/:action"
              }
              element={<ChannelManegement />}
            />
            <Route
              path="channel-management/add-channel"
              element={<AddChannel />}
            />
            <Route
              path="channel-management/edit-channel/:id"
              element={<EditChannel />}
            />
            <Route
              path={
                localStorage.getItem("user_role") === "super_admin"
                  ? "category-management"
                  : "category-management/:action"
              }
              element={<CategoryManagement />}
            />
            <Route
              path="category-management/add-category"
              element={<AddCategory />}
            />
            <Route
              path="category-management/edit-category/:id"
              element={<EditCategory />}
            />
            <Route
              path={
                localStorage.getItem("user_role") === "super_admin"
                  ? "brand-management"
                  : "brand-management/:action"
              }
              element={<BrandManagemet />}
            />
            <Route
              path="brand-management/add-brand"
              element={<CreateBrand />}
            />
            <Route path="brand-management/edit-brand/:id" element={<EditBrand />} />
            <Route
              path={
                localStorage.getItem("user_role") === "super_admin"
                  ? "packtype-management"
                  : "packtype-management/:action"
              }
              element={<PacktypeManagement />}
            />
            <Route
              path="packtype-management/add-packtype"
              element={<AddPacktype />}
            />
            <Route
              path="packtype-management/edit-packtype/:id"
              element={<EditPackType />}
            />
            <Route
              path={
                localStorage.getItem("user_role") === "super_admin"
                  ? "sku-management"
                  : "sku-management/:action"
              }
              element={<SkuManagement />}
            />
            <Route path="sku-management/add-sku" element={<AddSKU />} />
            <Route path="sku-management/edit-sku/:id" element={<EditSKU />} />
            <Route
              path={
                localStorage.getItem("user_role") === "super_admin"
                  ? "area-management"
                  : "area-management/:action"
              }
              element={<AreaManagement />}
            />
            <Route path="area-management/add-area" element={<AddArea />} />
            <Route path="area-management/edit-area/:id" element={<EditArea />} />
            <Route
              path={
                localStorage.getItem("user_role") === "super_admin"
                  ? "district-management"
                  : "district-management/:action"
              }
              element={<DistrictManagement />}
            />
            <Route
              path="district-management/add-district"
              element={<AddDistrict />}
            />
            <Route
              path="district-management/edit-district/:id"
              element={<EditDistrict />}
            />
            {/* Project Management */}
            <Route
              path={
                localStorage.getItem("user_role") === "super_admin"
                  ? "project-management"
                  : "project-management/:action"
              }
              element={<ProjectList />}
            />
            <Route
              path={
                localStorage.getItem("user_role") === "super_admin"
                  ? "project-management/take-approval-action"
                  : "project-management/take-approval-action/:action"
              }
              element={<AddProjectAction />}
            />
            <Route
              path="project-management/edit-basic-info/:productID/:userID"
              element={<BasicInformation />}
            />
            <Route
              path="project-management/edit-districts"
              element={<AreaDistrict />}
            />
            <Route
              path="project-management/edit-financial"
              element={<FinancialDetails />}
            />
            <Route
              path={
                localStorage.getItem("user_role") === "super_admin"
                  ? "line-extension-management"
                  : "line-extension-management/:action"
              }
              element={<LineExtensionManagement />}
            />
            <Route
              path="line-extension-management/add-line-extension"
              element={<AddLineExtension />}
            />
            <Route
              path="line-extension-management/edit-line-extension/:id"
              element={<EditLineExtension />}
            />
            <Route
              path={
                localStorage.getItem("user_role") === "super_admin"
                  ? "expense-management"
                  : "expense-management/:action"
              }
              element={<ExpenseManagement />}
            />
            <Route
              path="expense-management/add-expense"
              element={<AddExpense />}
            />
            <Route
              path="expense-management/edit-expense/:id"
              element={<EditExpense />}
            />
            <Route
              path={
                localStorage.getItem("user_role") === "super_admin"
                  ? "project-volume-management"
                  : "project-volume-management/:action"
              }
              element={<ProjectVolumeManagement />}
            />
            <Route
              path="project-volume-management/add-project-volume"
              element={<AddProjectVolume />}
            />
            <Route
              path="project-volume-management/edit-project-volume/:id"
              element={<EditProjectVolume />}
            />
            <Route
              path={
                localStorage.getItem("user_role") === "super_admin"
                  ? "project-type-management"
                  : "project-type-management/:action"
              }
              element={<ProjectTypeManagement />}
            />
            <Route
              path="project-type-management/add-project-type"
              element={<AddProjectType />}
            />
            <Route
              path="project-type-management/edit-project-type/:id"
              element={<EditProjectType />}
            />
            <Route
              path="project-management/approval-status"
              element={<ApprovalStatus />}
            />
            <Route
              path="cost-owner-management/edit-cost-owner/:id"
              element={<EditCostCenterOwner />}
            />
            <Route path="add-commercial-user" element={<AddCommercialUser />} />
            <Route path="add-finance-user" element={<AddFinanceDirector />} />
            <Route
              path={
                localStorage.getItem("user_role") === "super_admin"
                  ? "business-type-management"
                  : "business-type-management/:action"
              }
              element={<BusinessTypeManagement />}
            />
            <Route
              path="business-type-management/add-business-type"
              element={<AddBusinessType />}
            />
            <Route
              path="business-type-management/edit-business-type/:id"
              element={<EditBusinessType />}
            />

            <Route
              path={
                localStorage.getItem("user_role") === "super_admin"
                  ? "project-audit-log"
                  : "project-audit-log/:action"
              }
              element={<AuditLog />}
            />
            <Route
              path={
                localStorage.getItem("user_role") === "super_admin"
                  ? "project-list-report"
                  : "project-list-report/:action"
              }
              element={<ProjectReportTab />}
            />
            <Route
              path="project-audit-log/project-audit-log-check"
              element={<ChangeDataAudit />}
            />
            <Route
              path="/project-based-audit-log/:action"
              element={<ProjectBaseAudit />}
            />
            <Route path="/user-list-new/" element={<UserList />} />
            
            <Route
              path={
                localStorage.getItem("user_role") === "super_admin"
                  ? "user-delegation-log/"
                  : "user-delegation-log/:action"
              }
              element={<DelegationAudit />}
            />
          </Route>
          <Route
          path="/overview/project-overview"
              element={<ProjectOverview />}
            />
        </Route>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
