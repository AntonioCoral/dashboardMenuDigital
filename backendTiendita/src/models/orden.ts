import { DataTypes, Model, Optional } from 'sequelize';
import db from '../db/conecction';
import Company from './company'; // Importar el modelo de Company

// Definición de atributos de Orden
interface OrdenAttributes {
  id: number;
  companyId: number;
  numerOrden?: number;
  numeroCaja?: number;
  nameClient?: string;
  direction?: string;
  efectivo?: number;
  montoCompra?: number;
  transferenciaPay?: number;
  nameDelivery?: string;
  recharge?: string; // Servicio como recarga o retiro efectivo
  montoServicio?: number;
  itemOrder?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Atributos opcionales para la creación
interface OrdenCreationAttributes extends Optional<OrdenAttributes, 'id'> {}

// Clase Orden extendiendo Sequelize Model
class Orden extends Model<OrdenAttributes, OrdenCreationAttributes> implements OrdenAttributes {
  public id!: number;
  public companyId!: number;
  public numerOrden?: number;
  public numeroCaja?: number;
  public nameClient?: string;
  public direction?: string;
  public efectivo?: number;
  public montoCompra?: number;
  public transferenciaPay?: number;
  public nameDelivery?: string;
  public recharge?: string;
  public montoServicio?: number;
  public itemOrder?: string;
  public status?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Inicialización del modelo
Orden.init(
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
    numerOrden: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    numeroCaja: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    nameClient: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    direction: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    efectivo: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    montoCompra: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    transferenciaPay: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    nameDelivery: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    recharge: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    montoServicio: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    itemOrder: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: db,
    modelName: 'Orden',
    tableName: 'Ordenes',
  }
);


export default Orden;
