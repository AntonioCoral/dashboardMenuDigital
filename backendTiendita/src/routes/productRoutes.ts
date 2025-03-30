import { Router } from 'express';
import { createProduct, createProductsBulk, getProducts, getProductsByCategory, getProductsBySearch, updateProduct } from '../controllers/productController';
import upload from '../middlewares/upload';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authenticate, upload.single('image'), createProduct); // Crear un nuevo producto con imagen
router.get('/', authenticate, getProducts); // Obtener todos los productos
router.post('/bulk', createProductsBulk); // Crear múltiples productos
router.get('/category/:categoryId',authenticate, getProductsByCategory); // Obtener productos por categoría
router.put('/:id', upload.single('image'),authenticate, updateProduct); // Actualizar un producto específico
router.get('/search',authenticate, getProductsBySearch);

export default router;
