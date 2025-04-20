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
exports.deleteProduct = exports.getProductsBySearchMenu = exports.getProductsBySearch = exports.getProductsByCategory = exports.getProducts = exports.updateProduct = exports.createProductsBulk = exports.createProduct = void 0;
const Producto_1 = __importDefault(require("../models/Producto"));
const sequelize_1 = require("sequelize"); // Importar directamente desde 'sequelize'
const sequelize_2 = __importDefault(require("sequelize"));
const ProductOption_1 = __importDefault(require("../models/ProductOption"));
const company_1 = __importDefault(require("../models/company"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, cost, price, barcode, categoryId, productId } = req.body;
    const image = req.file ? req.file.filename : '';
    const companyId = req.companyId; // 🔹 Obtener companyId del middleware
    if (!companyId) {
        return res.status(403).json({ message: 'Acceso no autorizado: Compañía no encontrada' });
    }
    try {
        const newProduct = yield Producto_1.default.create({
            name,
            cost,
            price,
            barcode,
            image,
            categoryId,
            productId,
            companyId, // 🔹 Asociar el producto a la empresa
        });
        res.status(201).json(newProduct);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al crear el producto', error });
    }
});
exports.createProduct = createProduct;
// Crear múltiples productos (importación masiva)
const createProductsBulk = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = req.body; // Se espera un array de productos
    try {
        const newProducts = yield Producto_1.default.bulkCreate(products);
        res.status(201).json(newProducts);
    }
    catch (error) {
        console.error('Error creating products:', error);
        res.status(500).json({ msg: 'Error creating products', error });
    }
});
exports.createProductsBulk = createProductsBulk;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, cost, price, barcode, categoryId } = req.body;
    const companyId = req.companyId; // 🔹 Obtener companyId
    if (!companyId) {
        return res.status(403).json({ message: 'Acceso no autorizado: Compañía no encontrada' });
    }
    let options = req.body.options;
    if (typeof options === 'string') {
        try {
            options = JSON.parse(options);
        }
        catch (error) {
            return res.status(400).json({ message: 'Error al procesar las opciones' });
        }
    }
    const image = req.file ? req.file.filename : undefined;
    try {
        const product = yield Producto_1.default.findOne({
            where: { id, companyId }, // 🔹 Filtrar por empresa
        });
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        const updatedProduct = yield product.update({
            name,
            cost,
            price,
            barcode,
            image,
            categoryId,
        });
        if (Array.isArray(options)) {
            const existingOptions = yield ProductOption_1.default.findAll({ where: { productId: id } });
            for (const option of options) {
                const existingOption = existingOptions.find(opt => opt.description === option.description);
                if (existingOption) {
                    yield existingOption.update({
                        description: option.description,
                        price: option.price,
                    });
                }
                else {
                    yield ProductOption_1.default.create({
                        description: option.description,
                        price: option.price,
                        productId: Number(id),
                    });
                }
            }
            const optionDescriptions = options.map(opt => opt.description);
            const optionsToDelete = existingOptions.filter(opt => !optionDescriptions.includes(opt.description));
            for (const option of optionsToDelete) {
                yield option.destroy();
            }
        }
        res.json(updatedProduct);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al actualizar el producto', error });
    }
});
exports.updateProduct = updateProduct;
// Obtener todos los productos
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companyId = req.companyId; // 🔹 Obtenemos el companyId desde el middleware
        if (!companyId) {
            return res.status(403).json({ message: 'Acceso no autorizado: Compañía no encontrada' });
        }
        const products = yield Producto_1.default.findAll({
            where: { companyId }, // 🔹 Filtramos por companyId
            include: [{ model: ProductOption_1.default, as: 'options' }],
            order: [['id', 'DESC']],
        });
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos', error });
    }
});
exports.getProducts = getProducts;
// Obtener productos por categoría con paginación
const getProductsByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companyId = req.companyId;
        const { categoryId } = req.params;
        if (!companyId) {
            return res.status(403).json({ message: 'Acceso no autorizado: Compañía no encontrada' });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const offset = (page - 1) * limit;
        const { count, rows: products } = yield Producto_1.default.findAndCountAll({
            where: { categoryId, companyId },
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
        res.status(500).json({ message: 'Error al obtener productos por categoría', error });
    }
});
exports.getProductsByCategory = getProductsByCategory;
const getProductsBySearch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const companyId = req.companyId;
    const query = req.query.query;
    if (!companyId) {
        return res.status(403).json({ message: 'Acceso no autorizado: Compañía no encontrada' });
    }
    if (typeof query !== 'string' || !query) {
        return res.status(400).json({ message: 'El parámetro de búsqueda es requerido y debe ser una cadena.' });
    }
    try {
        const products = yield Producto_1.default.findAll({
            where: {
                companyId, // 🔹 Filtrar por empresa
                [sequelize_1.Op.or]: [
                    sequelize_2.default.where(sequelize_2.default.fn('LOWER', sequelize_2.default.col('name')), {
                        [sequelize_1.Op.like]: `%${query.toLowerCase()}%`,
                    }),
                    { barcode: { [sequelize_1.Op.like]: `%${query}%` } },
                ],
            },
            include: [{ model: ProductOption_1.default, as: 'options' }],
            order: [['id', 'DESC']],
        });
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al buscar productos', error });
    }
});
exports.getProductsBySearch = getProductsBySearch;
// Obtener productos desde el ecommerce móvil usando subdominio
const getProductsBySearchMenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.query;
    const subdomain = req.query.subdomain;
    if (!subdomain) {
        return res.status(400).json({ message: 'Subdominio requerido' });
    }
    if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: 'El parámetro de búsqueda es requerido y debe ser una cadena.' });
    }
    try {
        // Buscar la empresa por subdominio
        const company = yield company_1.default.findOne({ where: { subdomain } });
        if (!company) {
            return res.status(404).json({ message: 'Empresa no encontrada' });
        }
        const products = yield Producto_1.default.findAll({
            where: {
                companyId: company.id,
                [sequelize_1.Op.or]: [
                    sequelize_2.default.where(sequelize_2.default.fn('LOWER', sequelize_2.default.col('name')), {
                        [sequelize_1.Op.like]: `%${query.toLowerCase()}%`,
                    }),
                    { barcode: { [sequelize_1.Op.like]: `%${query}%` } },
                ],
            },
            include: [{ model: ProductOption_1.default, as: 'options' }],
            order: [['id', 'DESC']],
        });
        res.status(200).json(products);
    }
    catch (error) {
        console.error('Error al buscar productos por subdominio:', error);
        res.status(500).json({ message: 'Error al buscar productos', error });
    }
});
exports.getProductsBySearchMenu = getProductsBySearchMenu;
// Eliminar un producto incluyendo la imagen asegurando que sea de la empresa autenticada
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.id;
    const companyId = req.companyId;
    try {
        const product = yield Producto_1.default.findOne({
            where: { id: productId, companyId }
        });
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        // Eliminar la imagen del sistema de archivos
        if (product.image) {
            const imagePath = path_1.default.join(__dirname, '../../uploads', product.image);
            if (fs_1.default.existsSync(imagePath)) {
                fs_1.default.unlinkSync(imagePath);
                console.log('Imagen eliminada:', imagePath);
            }
            else {
                console.log('La imagen no existe en el servidor:', imagePath);
            }
        }
        yield product.destroy();
        res.status(200).json({ message: 'Producto eliminado correctamente' });
    }
    catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ message: 'Error al eliminar el producto', error });
    }
});
exports.deleteProduct = deleteProduct;
