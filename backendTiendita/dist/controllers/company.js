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
exports.deleteCompany = exports.updateCompany = exports.getCompanyById = exports.getCompanyBySubdomain = exports.getCompanies = exports.createCompany = void 0;
const company_1 = __importDefault(require("../models/company"));
const user_1 = __importDefault(require("../models/user"));
// Crear una nueva empresa
const createCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, address, contactEmail, subdomain } = req.body;
        const company = yield company_1.default.create({ name, address, contactEmail, subdomain });
        res.status(201).json({ message: 'Company created successfully', company });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating company', error });
    }
});
exports.createCompany = createCompany;
// Obtener todas las empresas
const getCompanies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companies = yield company_1.default.findAll({
            include: [{ model: user_1.default, as: 'users' }],
        });
        res.status(200).json(companies);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching companies', error });
    }
});
exports.getCompanies = getCompanies;
const getCompanyBySubdomain = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { subdomain } = req.params;
        const company = yield company_1.default.findOne({ where: { subdomain } });
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.status(200).json(company);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching company', error });
    }
});
exports.getCompanyBySubdomain = getCompanyBySubdomain;
// Obtener una empresa por ID
const getCompanyById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const company = yield company_1.default.findByPk(id, {
            include: [{ model: user_1.default, as: 'users' }],
        });
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.status(200).json(company);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching company', error });
    }
});
exports.getCompanyById = getCompanyById;
// Actualizar una empresa
const updateCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, address, contactEmail } = req.body;
        const company = yield company_1.default.findByPk(id);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        yield company.update({ name, address, contactEmail });
        res.status(200).json({ message: 'Company updated successfully', company });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating company', error });
    }
});
exports.updateCompany = updateCompany;
// Eliminar una empresa
const deleteCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const company = yield company_1.default.findByPk(id);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        yield company.destroy();
        res.status(200).json({ message: 'Company deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting company', error });
    }
});
exports.deleteCompany = deleteCompany;
