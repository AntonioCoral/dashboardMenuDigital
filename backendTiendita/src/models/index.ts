import db from '../db/conecction';
import Caja from '../models/caja';
import Denominaciones from '../models/denominaciones';
import Transferencias from '../models/transferencia';
import Retiros from '../models/retiros';
import PagosTarjeta from '../models/pagostarjeta';
import PedidosTransitos from '../models/pedidostransito';
import Company from '../models/company'; // Importar el modelo de Company
import User from '../models/user'; // Importar el modelo de User
import Orden from '../models/orden';
import ContactInfo from '../models/contactInfo.model';
import CarouselImage from './carouselImage.model';
import Product from './Producto';
import ProductOption from './ProductOption';
import Category from './Categoria';

// Definir las relaciones entre los modelos
Caja.hasMany(Denominaciones, { as: 'denominaciones', foreignKey: 'cajaId' });
Caja.hasMany(Transferencias, { as: 'transferencias', foreignKey: 'cajaId' });
Caja.hasMany(Retiros, { as: 'retiros', foreignKey: 'cajaId' });
Caja.hasMany(PagosTarjeta, { as: 'pagosTarjeta', foreignKey: 'cajaId' });
Caja.hasMany(PedidosTransitos, { as: 'pedidosTransitos', foreignKey: 'cajaId' });

Denominaciones.belongsTo(Caja, { foreignKey: 'cajaId' });
Transferencias.belongsTo(Caja, { foreignKey: 'cajaId' });
Retiros.belongsTo(Caja, { foreignKey: 'cajaId' });
PagosTarjeta.belongsTo(Caja, { foreignKey: 'cajaId' });
PedidosTransitos.belongsTo(Caja, { foreignKey: 'cajaId' });

// Definir las relaciones entre Company y User
Company.hasMany(User, { as: 'users', foreignKey: 'companyId' });
User.belongsTo(Company, { as: 'company', foreignKey: 'companyId' });

// Relación con Company
Company.hasMany(Caja, { foreignKey: 'companyId', as: 'cajas' });
Caja.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

Company.hasMany(Orden, { foreignKey: 'companyId', as: 'orders' }); // Relación de uno a muchos
Orden.belongsTo(Company, { foreignKey: 'companyId', as: 'company' }); // Relación de muchos a uno

// Relación con Company
Company.hasMany(ContactInfo, { foreignKey: 'companyId', as: 'contact_Info' });
ContactInfo.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

// Relación con Company
Company.hasMany(Product, { foreignKey: 'companyId', as: 'products' });
Product.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

// Relación entre Company y CarouselImage
Company.hasMany(CarouselImage, { foreignKey: 'companyId', as: 'carouselImages' });
CarouselImage.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

// Relación de Company con Category
Company.hasMany(Category, { foreignKey: 'companyId', as: 'categories' });
Category.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

Product.hasMany(ProductOption, { foreignKey: 'productId', as: 'options' }); // Cambié 'options' por 'productOptions'
ProductOption.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
// Sincronizar los modelos con la base de datos
const syncDatabase = async () => {
  try {
    await db.sync({ alter: true }); // Cambia a { force: true } si deseas eliminar y volver a crear las tablas
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing the database:', error);
  }
};

export { Caja, Denominaciones, Transferencias, Retiros, PagosTarjeta, PedidosTransitos, Company, User, Orden,ContactInfo, Product, ProductOption, syncDatabase };
