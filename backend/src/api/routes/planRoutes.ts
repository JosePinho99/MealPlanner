import { Router } from 'express';
import {createPlan, getPlans, savePlan} from "../controllers/planController";

export const router = Router();


router.get('/', getPlans);
router.post('/', createPlan);
router.post('/save', savePlan);