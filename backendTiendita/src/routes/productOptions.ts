// src/routes/productOptions.ts
import { Router } from 'express';
import { getProductOptions, createProductOption, deleteProductOption } from '../controllers/productOptionController';

const router = Router();

router.get('/', getProductOptions); // Obtener todas las opciones de precio
router.post('/', createProductOption); // Crear una nueva opción de precio
router.delete('/:id', deleteProductOption); // Eliminar una opción de precio por ID

export default router;
