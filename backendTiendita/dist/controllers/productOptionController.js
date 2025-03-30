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
exports.deleteProductOption = exports.createProductOption = exports.getProductOptions = void 0;
const ProductOption_1 = __importDefault(require("../models/ProductOption"));
// Obtener todas las opciones de precios
const getProductOptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const options = yield ProductOption_1.default.findAll();
        res.json(options);
    }
    catch (error) {
        res.status(500).json({ msg: 'Error fetching product options', error });
    }
});
exports.getProductOptions = getProductOptions;
// Crear una nueva opción de precio
const createProductOption = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, price, description } = req.body;
    try {
        const newOption = yield ProductOption_1.default.create({ productId, price, description });
        res.status(201).json(newOption);
    }
    catch (error) {
        res.status(500).json({ msg: 'Error creating product option', error });
    }
});
exports.createProductOption = createProductOption;
// Eliminar una opción de precio
const deleteProductOption = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const option = yield ProductOption_1.default.findByPk(id);
        if (!option) {
            return res.status(404).json({ msg: 'Product option not found' });
        }
        yield option.destroy();
        res.json({ msg: 'Product option deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ msg: 'Error deleting product option', error });
    }
});
exports.deleteProductOption = deleteProductOption;
