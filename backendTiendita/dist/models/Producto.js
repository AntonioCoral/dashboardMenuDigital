"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const conecction_1 = __importDefault(require("../db/conecction"));
const company_1 = __importDefault(require("./company"));
const Categoria_1 = __importDefault(require("./Categoria"));
// Definimos la clase Product con Sequelize
class Product extends sequelize_1.Model {
}
// Inicialización del modelo
Product.init({
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
    categoryId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Categoria_1.default, // Relación con Category
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    productId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'ProductOptions', // Asegúrate de que esto coincide con el nombre de la tabla en la base de datos
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    cost: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: false,
    },
    price: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: false,
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    barcode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize: conecction_1.default,
    modelName: 'Product',
    tableName: 'products',
});
exports.default = Product;
