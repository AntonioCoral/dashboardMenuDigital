import { Router } from 'express';
import { getContactInfo, getContactInfoMenu, updateContactInfo } from '../controllers/contactInfoController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.get('/',authenticate, getContactInfo);
router.post('/',authenticate, updateContactInfo);
/////////////////RUTA PARA MENU DIGITAL/////////////////
router.get('/menu', getContactInfoMenu);

export default router;
