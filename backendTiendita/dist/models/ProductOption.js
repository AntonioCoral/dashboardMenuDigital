"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const conecction_1 = __importDefault(require("../db/conecction"));
class ProductOption extends sequelize_1.Model {
}
ProductOption.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    productId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Products',
            key: 'id',
        },
    },
    price: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    description: {
        type: sequelize_1.DataTypes.STRING
    }
}, {
    sequelize: conecction_1.default,
    modelName: 'ProductOption'
});
exports.default = ProductOption;
