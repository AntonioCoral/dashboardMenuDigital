import { Router } from 'express';
import { createProduct, createProductsBulk, getProducts, getProductsByCategory, getProductsBySearch, getProductsBySearchMenu, updateProduct } from '../controllers/productController';
import upload from '../middlewares/upload';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authenticate, upload.single('image'), createProduct); // Crear un nuevo producto con imagen
router.get('/', authenticate, getProducts); // Obtener todos los productos
router.post('/bulk', createProductsBulk); // Crear múltiples productos
router.get('/category/:categoryId',authenticate, getProductsByCategory); // Obtener productos por categoría
router.put('/:id', upload.single('image'),authenticate, updateProduct); // Actualizar un producto específico
router.get('/search',authenticate, getProductsBySearch);

///////Menu digital///////////
router.get('/Menu', getProducts); // Obtener todos los productos
router.get('/categoryMenu/:categoryId', getProductsByCategory); // Obtener productos por categoría
router.get('/searchMenu', getProductsBySearchMenu);
export default router;
