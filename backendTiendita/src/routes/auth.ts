import express from 'express';
import { login, register, registerCompanyAndUser } from '../controllers/authController';

const router = express.Router();

router.post('/login', login);
router.post('/register', registerCompanyAndUser);



export default router;
