import { Router } from 'express';
import { getContactInfo, updateContactInfo } from '../controllers/contactInfoController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.get('/',authenticate, getContactInfo);
router.post('/',authenticate, updateContactInfo);

export default router;
