"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const conecction_1 = __importDefault(require("../db/conecction"));
const company_1 = __importDefault(require("./company")); // Importar el modelo de Company
class ContactInfo extends sequelize_1.Model {
}
ContactInfo.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
    phoneNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    ubication: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    openedTime: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    bankAccount: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    clabe: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    bankName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    accountHolder: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize: conecction_1.default,
    modelName: 'ContactInfo',
    tableName: 'Contact_info',
});
exports.default = ContactInfo;
