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
exports.getProductsByCategoryMenu = exports.getCategoriesMenu = exports.deleteCategory = exports.getProductsByCategoryP = exports.getProductsByCategory = exports.getCategories = exports.createCategory = void 0;
const Categoria_1 = __importDefault(require("../models/Categoria"));
const Producto_1 = __importDefault(require("../models/Producto"));
const ProductOption_1 = __importDefault(require("../models/ProductOption"));
const models_1 = require("../models");
// Crear una nueva categoría
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        const companyId = req.companyId; // Obtener `companyId` desde el token
        if (!companyId) {
            return res.status(403).json({ message: 'Acceso no autorizado' });
        }
        const category = yield Categoria_1.default.create({ name, companyId });
        res.status(201).json(category);
    }
    catch (error) {
        res.status(500).json({ msg: 'Error creando categoría', error });
    }
});
exports.createCategory = createCategory;
// Obtener todas las categorías
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companyId = req.companyId;
        if (!companyId) {
            return res.status(403).json({ message: 'Acceso no autorizado' });
        }
        const categories = yield Categoria_1.default.findAll({ where: { companyId } });
        res.status(200).json(categories);
    }
    catch (error) {
        res.status(500).send('Error en el servidor');
    }
});
exports.getCategories = getCategories;
/////////////////////////////////// CONTROLADORES PARA APP MOVIL ////////////////////////////////////////////
//Obtener productos de cada categoria
const getProductsByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryName } = req.params;
        // Primero encuentra la categoría por nombre para obtener su ID
        const category = yield Categoria_1.default.findOne({ where: { name: categoryName } });
        if (!category) {
            res.status(404).json({ message: "Category not found" });
            return;
        }
        // Luego encuentra los productos que pertenecen a esa categoría e incluye las opciones relacionadas
        const products = yield Producto_1.default.findAll({
            where: { categoryId: category.id }, // Usa el ID de la categoría para filtrar productos
            include: [{ model: ProductOption_1.default, as: 'options' }] // Incluye las opciones asociadas
        });
        res.json(products);
    }
    catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({ msg: 'Error fetching products by category', error });
    }
});
exports.getProductsByCategory = getProductsByCategory;
// Obtener productos por categoría con paginación
// Obtener productos por categoría (por nombre o ID)
const getProductsByCategoryP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        let category;
        // Verificar si categoryId es un número o una cadena (nombre de categoría)
        if (isNaN(Number(categoryId))) {
            // Si no es un número, buscamos por nombre
            category = yield Categoria_1.default.findOne({ where: { name: categoryId } });
        }
        else {
            // Si es un número, buscamos por ID
            category = yield Categoria_1.default.findByPk(categoryId);
        }
        if (!category) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        const offset = (Number(page) - 1) * Number(limit);
        // Obtener los productos de la categoría
        const { count: totalItems, rows: products } = yield Producto_1.default.findAndCountAll({
            where: { categoryId: category.id },
            include: [{
                    model: ProductOption_1.default,
                    as: 'options'
                }],
            limit: Number(limit),
            offset: Number(offset),
        });
        const totalPages = Math.ceil(totalItems / Number(limit));
        res.json({
            products,
            totalItems,
            totalPages,
            currentPage: Number(page),
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos', error });
    }
});
exports.getProductsByCategoryP = getProductsByCategoryP;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const category = yield Categoria_1.default.findByPk(id);
        if (!category) {
            return res.status(404).json({ msg: 'Categoria no encontrada' });
        }
        yield category.destroy();
        res.json({ msg: 'Categoria eliminada con éxito!!' });
    }
    catch (error) {
        res.status(500).json({ msg: 'Categoria no encontrada' });
    }
});
exports.deleteCategory = deleteCategory;
const getCategoriesMenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subdomain = req.query.subdomain;
        console.log('Subdominio recibido:', subdomain);
        if (!subdomain) {
            return res.status(400).json({ message: 'El subdominio es requerido' });
        }
        const company = yield models_1.Company.findOne({ where: { subdomain } });
        if (!company) {
            return res.status(404).json({ message: 'Empresa no encontrada' });
        }
        const categories = yield Categoria_1.default.findAll({
            where: { companyId: company.id }
        });
        res.json(categories);
    }
    catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Error al obtener categorías', error });
    }
});
exports.getCategoriesMenu = getCategoriesMenu;
// 🔹 Obtener productos por categoría usando el subdominio y el nombre de la categoría
const getProductsByCategoryMenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryName } = req.params;
        const subdomain = req.query.subdomain;
        if (!subdomain) {
            return res.status(400).json({ message: 'Subdominio requerido' });
        }
        const company = yield models_1.Company.findOne({ where: { subdomain } });
        if (!company) {
            return res.status(404).json({ message: 'Empresa no encontrada' });
        }
        // Buscar categoría por nombre y companyId
        const category = yield Categoria_1.default.findOne({
            where: {
                name: categoryName,
                companyId: company.id,
            }
        });
        if (!category) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const offset = (page - 1) * limit;
        const { count, rows: products } = yield Producto_1.default.findAndCountAll({
            where: {
                categoryId: category.id,
                companyId: company.id
            },
            include: [{ model: ProductOption_1.default, as: 'options' }],
            limit,
            offset,
            order: [['id', 'DESC']],
        });
        res.status(200).json({
            products,
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    }
    catch (error) {
        console.error('Error al obtener productos por categoría:', error);
        res.status(500).json({ message: 'Error al obtener productos por categoría', error });
    }
});
exports.getProductsByCategoryMenu = getProductsByCategoryMenu;
