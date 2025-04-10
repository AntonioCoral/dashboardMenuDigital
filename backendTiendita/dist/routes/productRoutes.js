"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const upload_1 = __importDefault(require("../middlewares/upload"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.post('/', authMiddleware_1.authenticate, upload_1.default.single('image'), productController_1.createProduct); // Crear un nuevo producto con imagen
router.get('/', authMiddleware_1.authenticate, productController_1.getProducts); // Obtener todos los productos
router.post('/bulk', productController_1.createProductsBulk); // Crear múltiples productos
router.get('/category/:categoryId', authMiddleware_1.authenticate, productController_1.getProductsByCategory); // Obtener productos por categoría
router.put('/:id', upload_1.default.single('image'), authMiddleware_1.authenticate, productController_1.updateProduct); // Actualizar un producto específico
router.get('/search', authMiddleware_1.authenticate, productController_1.getProductsBySearch);
///////Menu digital///////////
router.get('/Menu', productController_1.getProducts); // Obtener todos los productos
router.get('/categoryMenu/:categoryId', productController_1.getProductsByCategory); // Obtener productos por categoría
router.get('/searchMenu', productController_1.getProductsBySearchMenu);
exports.default = router;
