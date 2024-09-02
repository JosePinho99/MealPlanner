import { Router } from 'express';
import {createIngredient, getIngredients} from "../controllers/ingredientsController";

export const router = Router();

router.get('/', getIngredients);
router.post('/', createIngredient);
