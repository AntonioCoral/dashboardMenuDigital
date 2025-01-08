import { DataTypes, Model, Optional } from 'sequelize';
import db from '../db/conecction';

interface CompanyAttributes {
  id: number;
  name: string;
  address?: string;
  contactEmail?: string;
  subdomain: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CompanyCreationAttributes extends Optional<CompanyAttributes, 'id'> {}

class Company extends Model<CompanyAttributes, CompanyCreationAttributes> implements CompanyAttributes {
  public id!: number;
  public name!: string;
  public address?: string;
  public contactEmail?: string;
  public subdomain!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Company.init(
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
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contactEmail: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    subdomain: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Garantiza que no haya subdominios duplicados
      validate: {
        is: /^[a-z0-9-]+$/, // Validar formato de subdominio (letras, números y guiones)
      },
    },
  },
  
  
  {
    sequelize: db,
    modelName: 'Company',
    tableName: 'companies',
  }
);

export default Company;
