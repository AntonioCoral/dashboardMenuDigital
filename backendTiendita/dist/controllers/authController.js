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
exports.registerCompanyAndUser = exports.register = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const company_1 = __importDefault(require("../models/company"));
const conecction_1 = __importDefault(require("../db/conecction"));
const SECRET_KEY = 'prueba1'; // Usa una clave segura
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield user_1.default.findOne({
            where: { username },
            include: [{ model: company_1.default, as: 'company' }],
        });
        if (!user) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }
        const now = new Date();
        let blockAccess = false;
        let showRenewalNotice = false;
        if (!user.lastPaymentDate) {
            // Nunca ha pagado, evaluar por creación
            const createdAt = user.createdAt;
            const diffInDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
            if (diffInDays > 7) {
                blockAccess = true;
            }
        }
        else {
            // Ya ha pagado, evaluar diferencia en días desde el último pago
            const lastPayment = new Date(user.lastPaymentDate);
            const diffInDays = Math.floor((now.getTime() - lastPayment.getTime()) / (1000 * 60 * 60 * 24));
            if (diffInDays > 30) {
                blockAccess = true;
            }
            else if (diffInDays >= 25) {
                showRenewalNotice = true; // opcional: para mostrar aviso desde 25 días o similar
            }
        }
        if (blockAccess) {
            return res.status(403).json({
                message: 'Tu periodo de uso ha expirado. Realiza tu pago para continuar usando la plataforma.',
            });
        }
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            username: user.username,
            role: user.role,
            companyId: user.companyId,
        }, SECRET_KEY, { expiresIn: '2h' });
        res.json({
            token,
            role: user.role,
            username: user.username,
            isDelivery: user.isDelivery,
            company: user.companyId,
            renewalNotice: showRenewalNotice,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { companyId, username, password, role, isDelivery, isActive } = req.body;
    try {
        // Validar los campos
        if (typeof companyId !== 'number' ||
            typeof username !== 'string' ||
            typeof password !== 'string' ||
            typeof role !== 'string' ||
            !['admin', 'editor', 'repartidor'].includes(role)) {
            return res.status(400).json({ message: 'Todos los campos obligatorios deben completarse con valores válidos' });
        }
        // Encriptar la contraseña
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Crear el usuario
        const user = yield user_1.default.create({
            companyId,
            username,
            password: hashedPassword,
            role: role, // Confirmar que es uno de los valores permitidos
            isDelivery,
            isActive,
        });
        res.status(201).json({ message: 'Usuario creado exitosamente', user });
    }
    catch (error) {
        console.error('Error al crear el usuario:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            const field = (_b = (_a = error.errors) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.path;
            if (field === 'username') {
                return res.status(400).json({ message: 'El nombre de usuario ya está registrado.' });
            }
            return res.status(400).json({ message: 'Error de duplicidad', field });
        }
        res.status(500).json({ message: 'Error al crear el usuario' });
    }
});
exports.register = register;
// POST /api/register-full para crear usuario y compañia en una misma asi mismo para no ingresar alguno antes de validar 
const registerCompanyAndUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const { company, user } = req.body;
    const t = yield conecction_1.default.transaction();
    try {
        // 1. Crear empresa
        const newCompany = yield company_1.default.create({
            name: company.name,
            address: company.address,
            contactEmail: company.contactEmail,
            subdomain: company.subdomain
        }, { transaction: t });
        // 2. Crear usuario
        const hashedPassword = yield bcrypt_1.default.hash(user.password, 10);
        const newUser = yield user_1.default.create({
            companyId: newCompany.id,
            username: user.username,
            password: hashedPassword,
            role: 'admin',
            isDelivery: false,
            isActive: true
        }, { transaction: t });
        yield t.commit();
        return res.status(201).json({ message: 'Registro completo', company: newCompany, user: newUser });
    }
    catch (error) {
        yield t.rollback();
        if (error.name === 'SequelizeUniqueConstraintError') {
            const field = (_d = (_c = error.errors) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.path;
            let message = 'Error de duplicidad';
            if (field === 'subdomain')
                message = 'El subdominio ya está en uso.';
            if (field === 'contactEmail')
                message = 'Ese correo ya está registrado.';
            if (field === 'name')
                message = 'El nombre de empresa ya está registrado.';
            if (field === 'username')
                message = 'El nombre de usuario ya está registrado.';
            return res.status(400).json({ message, field });
        }
        console.error(error);
        return res.status(500).json({ message: 'Error creando empresa y usuario' });
    }
});
exports.registerCompanyAndUser = registerCompanyAndUser;
