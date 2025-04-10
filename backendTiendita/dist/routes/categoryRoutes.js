"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryController_1 = require("../controllers/categoryController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.post('/', authMiddleware_1.authenticate, categoryController_1.createCategory); // Crear una nueva categoría
router.get('/', authMiddleware_1.authenticate, categoryController_1.getCategories); // Obtener todas las categorías
router.get('/byCategory/:categoryName', authMiddleware_1.authenticate, categoryController_1.getProductsByCategory);
router.get('/category/:categoryId', authMiddleware_1.authenticate, categoryController_1.getProductsByCategoryP); // Obtener productos por categoría con paginacion
///////////////MENU DIGITAL////////////////
router.get('/categoryy', categoryController_1.getCategoriesMenu); // Obtener todas las categorías
router.get('/byCategoryMenu/:categoryName', categoryController_1.getProductsByCategoryMenu);
router.get('/categoryyy/:categoryId', categoryController_1.getProductsByCategoryP); // Obtener productos por categoría con paginacion
router.delete('/:id', authMiddleware_1.authenticate, categoryController_1.deleteCategory);
exports.default = router;
