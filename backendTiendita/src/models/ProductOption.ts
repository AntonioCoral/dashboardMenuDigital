import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/conecction';  // Asegúrate de que esta importación es correcta
import db from '../db/conecction';
import { ProductOptionAttributes } from '../interfaces/interfaces';

class ProductOption extends Model<ProductOptionAttributes> implements ProductOptionAttributes{
  public id!: number;
  public productId!: number;
  public price!: number;
  public description!: string;


}

ProductOption.init({
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true,
    
},
  productId: {
  type: DataTypes.INTEGER,
  allowNull: false,
  references: {
    model: 'Products',
    key: 'id',
  },
},
  price: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false
 },
  description: { 
    type: DataTypes.STRING }
}, {
  sequelize: db,
  modelName: 'ProductOption'
});

export default ProductOption;
