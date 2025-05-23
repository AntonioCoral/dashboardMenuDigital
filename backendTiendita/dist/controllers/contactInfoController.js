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
exports.getContactInfoMenu = exports.updateContactInfo = exports.getContactInfo = void 0;
const contactInfo_model_1 = __importDefault(require("../models/contactInfo.model"));
const models_1 = require("../models");
// Obtener la información de contacto
const getContactInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companyId = req.companyId;
        if (!companyId) {
            return res.status(403).json({ message: 'Acceso no autorizado: Compañía no encontrada' });
        }
        const contactInfo = yield contactInfo_model_1.default.findOne({
            where: { companyId },
            order: [['id', 'DESC']],
        });
        res.status(200).json(contactInfo || {});
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener la información de contacto', error });
    }
});
exports.getContactInfo = getContactInfo;
// Actualizar o crear la información de contacto
const updateContactInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companyId = req.companyId;
        if (!companyId) {
            return res.status(403).json({ message: 'Acceso no autorizado: Compañía no encontrada' });
        }
        const { phoneNumber, ubication, openedTime, bankAccount, clabe, bankName, accountHolder } = req.body;
        const [contactInfo] = yield contactInfo_model_1.default.findOrCreate({
            where: { companyId },
            defaults: {
                companyId,
                phoneNumber,
                ubication,
                openedTime,
                bankAccount,
                clabe,
                bankName,
                accountHolder,
            },
        });
        yield contactInfo.update({
            phoneNumber,
            ubication,
            openedTime,
            bankAccount,
            clabe,
            bankName,
            accountHolder,
        });
        res.status(200).json({ message: 'Información de contacto actualizada', contactInfo });
    }
    catch (error) {
        console.error('Error al actualizar la información de contacto:', error);
        res.status(500).json({ message: 'Error al actualizar la información de contacto', error });
    }
});
exports.updateContactInfo = updateContactInfo;
// Obtener la información de contacto desde MENU DIGITAL
const getContactInfoMenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subdomain = req.query.subdomain;
        if (!subdomain) {
            return res.status(400).json({ message: 'Subdominio requerido' });
        }
        const company = yield models_1.Company.findOne({ where: { subdomain } });
        if (!company) {
            return res.status(404).json({ message: 'Empresa no encontrada' });
        }
        const contactInfo = yield contactInfo_model_1.default.findOne({
            where: { companyId: company.id },
            order: [['id', 'DESC']],
        });
        res.status(200).json(contactInfo || {});
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener la información de contacto', error });
    }
});
exports.getContactInfoMenu = getContactInfoMenu;
