import { Router } from 'express';
import {login, verifySession, register, recoverPassword} from '../controllers/authController';

export const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/verifySession', verifySession);
