import { Router } from 'express';
import {getIngredients} from "../controllers/ingredientsController";

export const router = Router();

router.get('/', getIngredients);
