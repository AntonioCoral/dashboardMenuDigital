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
exports.uploadCarouselImage = exports.addImageWithSection = exports.deleteImage = exports.updateImage = exports.addImage = exports.getImagesBySection = void 0;
const carouselImage_model_1 = __importDefault(require("./../models/carouselImage.model"));
// Obtener imágenes por sección y compañía
const getImagesBySection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companyId = req.companyId; // 🔹 Obtener la empresa desde el token
        if (!companyId) {
            return res.status(403).json({ message: 'Acceso no autorizado' });
        }
        const { section } = req.params;
        if (!['carousel', 'home'].includes(section)) {
            return res.status(400).json({ message: 'Sección inválida' });
        }
        const images = yield carouselImage_model_1.default.findAll({
            where: { section, companyId },
        });
        // 🔹 Modificamos la URL de la imagen para que pueda ser accedida
        const modifiedImages = images.map(image => (Object.assign(Object.assign({}, image.toJSON()), { imageUrl: `${req.protocol}://${req.get('host')}/api/carousel/uploads/${image.imageUrl}` })));
        res.status(200).json(modifiedImages);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener imágenes', error });
    }
});
exports.getImagesBySection = getImagesBySection;
// Agregar una imagen con compañía
const addImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companyId = req.companyId;
        if (!companyId) {
            return res.status(403).json({ message: 'Acceso no autorizado' });
        }
        const { title, description, section } = req.body;
        const imageUrl = req.file ? req.file.filename : '';
        const newImage = yield carouselImage_model_1.default.create({
            companyId,
            title,
            description,
            imageUrl,
            section,
            isActive: false
        });
        res.status(201).json({ message: 'Imagen agregada correctamente', newImage });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al agregar la imagen', error });
    }
});
exports.addImage = addImage;
// Actualizar una imagen del carrusel
const updateImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companyId = req.companyId;
        if (!companyId) {
            return res.status(403).json({ message: 'Acceso no autorizado' });
        }
        const { id } = req.params;
        const { title, description, imageUrl, isActive } = req.body;
        const image = yield carouselImage_model_1.default.findOne({ where: { id, companyId } });
        if (!image) {
            return res.status(404).json({ message: 'Imagen no encontrada o no pertenece a la empresa' });
        }
        yield image.update({ title, description, imageUrl, isActive });
        res.status(200).json({ message: 'Imagen actualizada correctamente' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al actualizar la imagen', error });
    }
});
exports.updateImage = updateImage;
// Eliminar una imagen del carrusel
const deleteImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companyId = req.companyId;
        if (!companyId) {
            return res.status(403).json({ message: 'Acceso no autorizado' });
        }
        const { id } = req.params;
        const image = yield carouselImage_model_1.default.findOne({ where: { id, companyId } });
        if (!image) {
            return res.status(404).json({ message: 'Imagen no encontrada o no pertenece a la empresa' });
        }
        yield image.destroy();
        res.status(200).json({ message: 'Imagen eliminada correctamente' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al eliminar la imagen', error });
    }
});
exports.deleteImage = deleteImage;
const addImageWithSection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companyId = req.companyId;
        if (!companyId) {
            res.status(403).json({ message: 'Acceso no autorizado' });
            return;
        }
        const { title, description, section } = req.body;
        const imageUrl = req.file ? req.file.filename : '';
        const newImage = yield carouselImage_model_1.default.create({
            companyId,
            title,
            description,
            imageUrl,
            section,
            isActive: false
        });
        res.status(201).json({ message: 'Imagen agregada correctamente', newImage });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al agregar la imagen', error });
    }
});
exports.addImageWithSection = addImageWithSection;
const uploadCarouselImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        res.status(400).json({ message: 'No se proporcionó ninguna imagen.' });
        return;
    }
    try {
        const companyId = req.companyId;
        if (!companyId) {
            res.status(403).json({ message: 'Acceso no autorizado' });
            return;
        }
        // Ruta relativa de la imagen (URL para acceder desde el cliente)
        const imageUrl = req.file ? req.file.filename : '';
        // Opcional: Guarda la URL en la base de datos asociada a la empresa
        const newImage = yield carouselImage_model_1.default.create({
            companyId,
            title: req.body.title || 'Sin título', // Campo opcional para un título
            description: req.body.description || 'Sin descripción', // Campo opcional para una descripción
            imageUrl,
            section: 'carousel',
            isActive: false
        });
        res.status(200).json({
            message: 'Imagen subida con éxito.',
            data: newImage, // Retorna la imagen subida con los detalles
        });
    }
    catch (error) {
        console.error('Error al guardar la imagen en la base de datos:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});
exports.uploadCarouselImage = uploadCarouselImage;
