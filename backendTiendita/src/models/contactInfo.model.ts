import { DataTypes, Model, Optional } from 'sequelize';
import db from '../db/conecction'
import Company from './company'; // Importar el modelo de Company

interface ContactInfoAttributes {
  id: number;
  companyId: number;
  phoneNumber: string;
  ubication: string;
  openedTime: string;
  bankAccount: string;
  clabe: string;
  bankName: string;
  accountHolder: string;
}

interface ContactInfoCreationAttributes extends Optional<ContactInfoAttributes, 'id'> {}

class ContactInfo extends Model<ContactInfoAttributes, ContactInfoCreationAttributes> implements ContactInfoAttributes {
  public id!: number;
  public companyId!: number;
  public phoneNumber!: string;
  public ubication!: string;
  public openedTime!: string;
  public bankAccount!: string;
  public clabe!: string;
  public bankName!: string;
  public accountHolder!: string;
}

ContactInfo.init(
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
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ubication: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    openedTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bankAccount: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    clabe: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bankName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    accountHolder: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    modelName: 'ContactInfo',
    tableName: 'Contact_info',
  }
);

export default ContactInfo;
