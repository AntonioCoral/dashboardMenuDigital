import { DataTypes, Model, Optional } from 'sequelize';
import db from '../db/conecction';
import Company from './company'; // Importar el modelo de Company

// Definición de atributos de Caja
interface CajaAttributes {
  id: number;
  companyId: number;
  fecha?: Date;
  nombre?: string;
  numeroCaja?: number;
  totalEfectivo?: number;
  totalTransferencias?: number;
  totalRetiros?: number;
  totalPagosTarjeta?: number;
  totalPedidoTransito?: number;
  ventaTotal?: number;
  recargas?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Atributos opcionales para la creación
interface CajaCreationAttributes extends Optional<CajaAttributes, 'id'> {}

// Clase Caja extendiendo Sequelize Model
class Caja extends Model<CajaAttributes, CajaCreationAttributes> implements CajaAttributes {
  public id!: number;
  public companyId!: number;
  public fecha?: Date;
  public nombre?: string;
  public numeroCaja?: number;
  public totalEfectivo?: number;
  public totalTransferencias?: number;
  public totalRetiros?: number;
  public totalPagosTarjeta?: number;
  public totalPedidoTransito?: number;
  public ventaTotal?: number;
  public recargas?: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Inicialización del modelo
Caja.init(
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
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    numeroCaja: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    totalEfectivo: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    totalTransferencias: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    totalRetiros: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    totalPagosTarjeta: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    totalPedidoTransito: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    ventaTotal: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    recargas: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    modelName: 'Caja',
    tableName: 'Cajas',
  }
);

export default Caja;
