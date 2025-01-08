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



// Sincronizar los modelos con la base de datos
const syncDatabase = async () => {
  try {
    await db.sync({ alter: true }); // Cambia a { force: true } si deseas eliminar y volver a crear las tablas
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing the database:', error);
  }
};

export { Caja, Denominaciones, Transferencias, Retiros, PagosTarjeta, PedidosTransitos, Company, User, Orden,ContactInfo, syncDatabase };
