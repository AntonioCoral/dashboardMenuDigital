import { DataTypes, Model, Optional } from 'sequelize';
import db from '../db/conecction';
import Company from './company';

interface CategoryAttributes {
  id: number;
  name: string;
  companyId: number;
}

interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id'> {}

class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
  public id!: number;
  public name!: string;
  public companyId!: number;
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
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
  },
  {
    sequelize: db,
    modelName: 'Category',
    tableName: 'categories',
  }
);

export default Category;
