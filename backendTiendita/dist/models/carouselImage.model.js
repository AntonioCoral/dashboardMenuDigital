"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const conecction_1 = __importDefault(require("../db/conecction"));
const company_1 = __importDefault(require("./company")); // Importar el modelo de Company
// Clase CarouselImage extendiendo Sequelize Model
class CarouselImage extends sequelize_1.Model {
}
// Inicialización del modelo
CarouselImage.init({
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
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    imageUrl: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
    section: {
        type: sequelize_1.DataTypes.ENUM('carousel', 'home'),
        allowNull: false,
        defaultValue: 'carousel',
    },
}, {
    sequelize: conecction_1.default,
    modelName: 'CarouselImage',
    tableName: 'carousel_images',
    timestamps: true, // Agrega columnas createdAt y updatedAt automáticamente
});
// Exportar modelo
exports.default = CarouselImage;
