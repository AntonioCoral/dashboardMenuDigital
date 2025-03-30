import { DataTypes, Model, Optional } from 'sequelize';
import db from '../db/conecction';
import Company from './company';
import Category from './Categoria';

// Definir los atributos del modelo
interface ProductAttributes {
  id: number;
  companyId: number;
  categoryId: number;
  productId: number
  name: string;
  cost: number;
  price: number;
  stock: number;
  image?: string;
  barcode?: string;
}

// Atributos opcionales al crear un producto
interface ProductCreationAttributes extends Optional<ProductAttributes, 'id'> {}

// Definimos la clase Product con Sequelize
class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: number;
  public companyId!: number;
  public categoryId!: number;
  public productId!: number;
  public name!: string;
  public cost!: number;
  public price!: number;
  public stock!: number;
  public image?: string;
  public barcode?: string;
}

// Inicialización del modelo
Product.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
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
    categoryId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Category, // Relación con Category
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    productId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'ProductOptions', // Asegúrate de que esto coincide con el nombre de la tabla en la base de datos
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cost: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    stock: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    barcode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    modelName: 'Product',
    tableName: 'products',
  }
);

export default Product;


