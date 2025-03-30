
import express from 'express';import path from 'path';
import { Request, Response, Router } from 'express';
import { addImage, updateImage, deleteImage, uploadCarouselImage, getImagesBySection, addImageWithSection,} from '../controllers/carouselController';
import upload from '../middlewares/upload';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();


router.get('/:section',authenticate, getImagesBySection);
router.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
router.post('/upload',authenticate, upload.single('file'), addImageWithSection);


// Actualizar una imagen por ID
router.put('/:id',authenticate, updateImage);

// Eliminar una imagen por ID
router.delete('/:id',authenticate, deleteImage);

export default router;
