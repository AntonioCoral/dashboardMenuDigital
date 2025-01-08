import { DataTypes, Model, Optional } from 'sequelize';
import db from '../db/conecction';

interface UserAttributes {
  id: number;
  companyId: number;
  username: string;
  password: string;
  role: 'admin' | 'editor' | 'repartidor';
  isActive: boolean;
  isDelivery: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public companyId!: number;
  public username!: string;
  public password!: string;
  public role!: 'admin' | 'editor' | 'repartidor';
  public isActive!: boolean;
  public isDelivery!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    companyId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'editor', 'repartidor'),
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isDelivery: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize: db,
    modelName: 'User',
    tableName: 'users',
  }
);

export default User;
