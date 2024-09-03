import { Router } from 'express';
import {createIngredient, deleteIngredient, editIngredient, getIngredients} from "../controllers/ingredientsController";

export const router = Router();

router.get('/', getIngredients);
router.post('/', createIngredient);
router.put('/', editIngredient);
router.delete('/:name', deleteIngredient);