"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncDatabase = exports.ContactInfo = exports.Orden = exports.User = exports.Company = exports.PedidosTransitos = exports.PagosTarjeta = exports.Retiros = exports.Transferencias = exports.Denominaciones = exports.Caja = void 0;
const conecction_1 = __importDefault(require("../db/conecction"));
const caja_1 = __importDefault(require("../models/caja"));
exports.Caja = caja_1.default;
const denominaciones_1 = __importDefault(require("../models/denominaciones"));
exports.Denominaciones = denominaciones_1.default;
const transferencia_1 = __importDefault(require("../models/transferencia"));
exports.Transferencias = transferencia_1.default;
const retiros_1 = __importDefault(require("../models/retiros"));
exports.Retiros = retiros_1.default;
const pagostarjeta_1 = __importDefault(require("../models/pagostarjeta"));
exports.PagosTarjeta = pagostarjeta_1.default;
const pedidostransito_1 = __importDefault(require("../models/pedidostransito"));
exports.PedidosTransitos = pedidostransito_1.default;
const company_1 = __importDefault(require("../models/company")); // Importar el modelo de Company
exports.Company = company_1.default;
const user_1 = __importDefault(require("../models/user")); // Importar el modelo de User
exports.User = user_1.default;
const orden_1 = __importDefault(require("../models/orden"));
exports.Orden = orden_1.default;
const contactInfo_model_1 = __importDefault(require("../models/contactInfo.model"));
exports.ContactInfo = contactInfo_model_1.default;
// Definir las relaciones entre los modelos
caja_1.default.hasMany(denominaciones_1.default, { as: 'denominaciones', foreignKey: 'cajaId' });
caja_1.default.hasMany(transferencia_1.default, { as: 'transferencias', foreignKey: 'cajaId' });
caja_1.default.hasMany(retiros_1.default, { as: 'retiros', foreignKey: 'cajaId' });
caja_1.default.hasMany(pagostarjeta_1.default, { as: 'pagosTarjeta', foreignKey: 'cajaId' });
caja_1.default.hasMany(pedidostransito_1.default, { as: 'pedidosTransitos', foreignKey: 'cajaId' });
denominaciones_1.default.belongsTo(caja_1.default, { foreignKey: 'cajaId' });
transferencia_1.default.belongsTo(caja_1.default, { foreignKey: 'cajaId' });
retiros_1.default.belongsTo(caja_1.default, { foreignKey: 'cajaId' });
pagostarjeta_1.default.belongsTo(caja_1.default, { foreignKey: 'cajaId' });
pedidostransito_1.default.belongsTo(caja_1.default, { foreignKey: 'cajaId' });
// Definir las relaciones entre Company y User
company_1.default.hasMany(user_1.default, { as: 'users', foreignKey: 'companyId' });
user_1.default.belongsTo(company_1.default, { as: 'company', foreignKey: 'companyId' });
// Relación con Company
company_1.default.hasMany(caja_1.default, { foreignKey: 'companyId', as: 'cajas' });
caja_1.default.belongsTo(company_1.default, { foreignKey: 'companyId', as: 'company' });
company_1.default.hasMany(orden_1.default, { foreignKey: 'companyId', as: 'orders' }); // Relación de uno a muchos
orden_1.default.belongsTo(company_1.default, { foreignKey: 'companyId', as: 'company' }); // Relación de muchos a uno
// Relación con Company
company_1.default.hasMany(contactInfo_model_1.default, { foreignKey: 'companyId', as: 'contact_Info' });
contactInfo_model_1.default.belongsTo(company_1.default, { foreignKey: 'companyId', as: 'company' });
// Sincronizar los modelos con la base de datos
const syncDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield conecction_1.default.sync({ alter: true }); // Cambia a { force: true } si deseas eliminar y volver a crear las tablas
        console.log('Database synchronized successfully.');
    }
    catch (error) {
        console.error('Error synchronizing the database:', error);
    }
});
exports.syncDatabase = syncDatabase;
