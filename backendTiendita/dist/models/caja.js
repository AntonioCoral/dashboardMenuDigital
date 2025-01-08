"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const conecction_1 = __importDefault(require("../db/conecction"));
const company_1 = __importDefault(require("./company")); // Importar el modelo de Company
// Clase Caja extendiendo Sequelize Model
class Caja extends sequelize_1.Model {
}
// Inicialización del modelo
Caja.init({
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
    fecha: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    numeroCaja: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: true,
    },
    totalEfectivo: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: true,
    },
    totalTransferencias: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: true,
    },
    totalRetiros: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: true,
    },
    totalPagosTarjeta: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: true,
    },
    totalPedidoTransito: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: true,
    },
    ventaTotal: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: true,
    },
    recargas: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: true,
    },
}, {
    sequelize: conecction_1.default,
    modelName: 'Caja',
    tableName: 'Cajas',
});
exports.default = Caja;
