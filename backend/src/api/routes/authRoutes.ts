import { Router } from 'express';
import {login, verifySession, register} from '../controllers/authController';

export const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/verifySession', verifySession);
