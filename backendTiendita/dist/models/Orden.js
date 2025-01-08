"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const conecction_1 = __importDefault(require("../db/conecction"));
const company_1 = __importDefault(require("./company")); // Importar el modelo de Company
// Clase Orden extendiendo Sequelize Model
class Orden extends sequelize_1.Model {
}
// Inicialización del modelo
Orden.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
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
    numerOrden: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: true,
    },
    numeroCaja: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: true,
    },
    nameClient: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    direction: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    efectivo: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: true,
    },
    montoCompra: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: true,
    },
    transferenciaPay: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: true,
    },
    nameDelivery: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    recharge: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    montoServicio: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: true,
    },
    itemOrder: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: conecction_1.default,
    modelName: 'Orden',
    tableName: 'Ordenes',
});
exports.default = Orden;
