import { Router } from 'express';
import { createCategory, deleteCategory, getCategories, getProductsByCategory, getProductsByCategoryP } from '../controllers/categoryController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.post('/',authenticate, createCategory); // Crear una nueva categoría
router.get('/',authenticate, getCategories); // Obtener todas las categorías
router.get('/byCategory/:categoryName',authenticate, getProductsByCategory);
router.get('/category/:categoryId',authenticate, getProductsByCategoryP); // Obtener productos por categoría con paginacion
router.delete('/:id',authenticate, deleteCategory);

export default router;
