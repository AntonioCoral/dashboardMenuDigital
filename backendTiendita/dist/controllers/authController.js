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
exports.register = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const company_1 = __importDefault(require("../models/company"));
const SECRET_KEY = 'prueba1'; // Usa una clave segura
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield user_1.default.findOne({
            where: { username, isActive: true },
            include: [{ model: company_1.default, as: 'company' }], // Incluir la empresa asociada
        });
        if (!user) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username, role: user.role, companyId: user.companyId }, SECRET_KEY, { expiresIn: '2h' });
        res.json({
            token,
            role: user.role,
            username: user.username,
            isDelivery: user.isDelivery,
            company: user.companyId, // Información de la empresa
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        res.status(500).json({ message: 'Error al crear el usuario' });
    }
});
exports.register = register;
