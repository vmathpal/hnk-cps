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
module.exports = {
    up: (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
        return queryInterface.bulkInsert("permissions", [
            {
                name: "Brand Management",
                key: "brand-management",
                parentMenuId: "",
                route: "brand-management",
                icon: "view_agenda",
                status: "active",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Line Extension",
                key: "line-extension-management",
                parentMenuId: "",
                route: "line-extension-management",
                icon: "view_agenda",
                status: "active",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "PackSize Management",
                key: "sku-management",
                parentMenuId: "",
                route: "sku-management",
                icon: "view_agenda",
                status: "active",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "PackType Management",
                key: "packtype-management",
                parentMenuId: "",
                route: "packtype-management",
                icon: "view_agenda",
                status: "active",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Category Management",
                key: "category-management",
                parentMenuId: "",
                route: "category-management",
                icon: "view_agenda",
                status: "active",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Expense Management",
                key: "expense-management",
                parentMenuId: "",
                route: "expense-management",
                icon: "view_agenda",
                status: "active",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Project Volume Management",
                key: "project-volume-management",
                parentMenuId: "",
                route: "project-volume-management",
                icon: "view_agenda",
                status: "active",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Project Type Management",
                key: "project-type-management",
                parentMenuId: "",
                route: "project-type-management",
                icon: "view_agenda",
                status: "active",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Business Type Management",
                key: "business-type-management",
                parentMenuId: "",
                route: "business-type-management",
                icon: "view_agenda",
                status: "active",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Region Management",
                key: "channel-management",
                parentMenuId: "",
                route: "channel-management",
                icon: "view_agenda",
                status: "active",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "District Management",
                key: "area-management",
                parentMenuId: "",
                route: "area-management",
                icon: "view_agenda",
                status: "active",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Sales Region Management",
                key: "district-management",
                parentMenuId: "",
                route: "district-management",
                icon: "view_agenda",
                status: "active",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ], {});
    }),
    down(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryInterface.bulkDelete("permissions", null, {});
        });
    },
};
