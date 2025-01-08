"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const company_1 = require("../controllers/company");
const router = (0, express_1.Router)();
// Crear una nueva empresa
router.post('/', company_1.createCompany);
// Obtener todas las empresas
router.get('/', company_1.getCompanies);
// Obtener una empresa por ID
router.get('/:id', company_1.getCompanyById);
// Actualizar una empresa
router.put('/:id', company_1.updateCompany);
// Obtener una empresa por subdominio
router.get('/subdomain/:subdomain', company_1.getCompanyBySubdomain); // Nueva ruta
// Eliminar una empresa
router.delete('/:id', company_1.deleteCompany);
exports.default = router;
