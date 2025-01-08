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
exports.getSubdomain = exports.validateSubdomain = void 0;
const company_1 = __importDefault(require("../models/company"));
const validateSubdomain = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const host = req.headers.host; // Ejemplo: "subdominio1.connectivity.com"
    const subdomain = host === null || host === void 0 ? void 0 : host.split('.')[0]; // Extraer el subdominio
    if (!subdomain) {
        return res.status(400).json({ message: 'Subdomain is required' });
    }
    try {
        const company = yield company_1.default.findOne({ where: { subdomain } });
        if (!company) {
            return res.status(404).json({ message: 'Invalid subdomain' });
        }
        // Guardar la empresa en `req` para usarla en los controladores
        req.company = company;
        next();
    }
    catch (error) {
        console.error('Error validating subdomain:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.validateSubdomain = validateSubdomain;
const getSubdomain = (req) => {
    const host = req.headers.host || '';
    // En desarrollo local, usa 'localhost'
    if (host.startsWith('localhost')) {
        return 'localhost';
    }
    return host.split('.')[0]; // Asume que el subdominio está antes del dominio principal
};
exports.getSubdomain = getSubdomain;
