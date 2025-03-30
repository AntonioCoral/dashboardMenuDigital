"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const conecction_1 = __importDefault(require("../db/conecction"));
const company_1 = __importDefault(require("./company"));
class Category extends sequelize_1.Model {
}
Category.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    companyId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: company_1.default, // Relación con Company
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
}, {
    sequelize: conecction_1.default,
    modelName: 'Category',
    tableName: 'categories',
});
exports.default = Category;
