"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/productOptions.ts
const express_1 = require("express");
const productOptionController_1 = require("../controllers/productOptionController");
const router = (0, express_1.Router)();
router.get('/', productOptionController_1.getProductOptions); // Obtener todas las opciones de precio
router.post('/', productOptionController_1.createProductOption); // Crear una nueva opción de precio
router.delete('/:id', productOptionController_1.deleteProductOption); // Eliminar una opción de precio por ID
exports.default = router;
