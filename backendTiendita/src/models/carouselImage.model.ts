import { DataTypes, Model, Optional } from 'sequelize';
import db from '../db/conecction';
import Company from './company'; // Importar el modelo de Company

// Definición de atributos de CarouselImage
interface CarouselImageAttributes {
  id: number;
  companyId: number;
  title: string;
  description?: string;
  imageUrl: string;
  isActive: boolean;
  section: 'carousel' | 'home';
  createdAt?: Date;
  updatedAt?: Date;
}

// Atributos opcionales para la creación
interface CarouselImageCreationAttributes extends Optional<CarouselImageAttributes, 'id'> {}

// Clase CarouselImage extendiendo Sequelize Model
class CarouselImage
  extends Model<CarouselImageAttributes, CarouselImageCreationAttributes>
  implements CarouselImageAttributes {
  public id!: number;
  public companyId!: number;
  public title!: string;
  public description?: string;
  public imageUrl!: string;
  public isActive!: boolean;
  public section!: 'carousel' | 'home';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Inicialización del modelo
CarouselImage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    companyId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Company, // Relación con Company
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    section: {
      type: DataTypes.ENUM('carousel', 'home'),
      allowNull: false,
      defaultValue: 'carousel',
    },
  },
  {
    sequelize: db,
    modelName: 'CarouselImage',
    tableName: 'carousel_images',
    timestamps: true, // Agrega columnas createdAt y updatedAt automáticamente
  }
);

// Exportar modelo
export default CarouselImage;
