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
exports.updateContactInfo = exports.getContactInfo = void 0;
const contactInfo_model_1 = __importDefault(require("../models/contactInfo.model"));
// Obtener la información de contacto
const getContactInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contactInfo = yield contactInfo_model_1.default.findOne({ where: {}, order: [['id', 'DESC']] });
        res.status(200).json(contactInfo || {});
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener la información de contacto', error });
    }
});
exports.getContactInfo = getContactInfo;
// Actualizar o crear la información de contacto
const updateContactInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const companyId = (_a = req.company) === null || _a === void 0 ? void 0 : _a.id;
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
