import { Router } from 'express';
import {createPlan} from "../controllers/planController";

export const router = Router();

router.post('/', createPlan);