import { Request, Response } from 'express';
import {verifyToken} from "../../utils/authenticationUtils";
import {Ingredient} from "../../../../commons/interfaces";
import * as IngredientService from '../../services/ingredientsService';

export const getIngredients = async (req: Request, res: Response) => {
    try {
        const token = req.headers['token'];
        const user = verifyToken(token);
        let ingredients = await IngredientService.getIngredientsByUser(user ? user['email'] : null);
        return res.status(200).json(ingredients);
    } catch (error) {
        console.log(error)
        return res.status(500).json("Unknown error");
    }
};

export const createIngredient = async (req: Request, res: Response) => {
    try {
        const token = req.headers['token'];
        const ingredient: Ingredient = req.body;
        const user = verifyToken(token);
        if (!user || !user['email']) {
            return res.status(402).json("Can't execute this action without being logged in");
        }
        if (
            !ingredient.name || !ingredient.calories || !ingredient.price || !ingredient.proteins || !ingredient.referenceValue ||
            !ingredient.quantityMaximum || !ingredient.quantityMinimum || ingredient.quantityMinimum > ingredient.quantityMaximum
        ) {
            return res.status(402).json("Incorrect fields");
        }
        const success = await IngredientService.createIngredient(user['email'], ingredient);
        if (!success) {
            return res.status(500).json("Unknown error");
        }
        return res.status(200).json();
    } catch (error) {
        console.log(error)
        return res.status(500).json("Unknown error");
    }
};


export const editIngredient = async (req: Request, res: Response) => {
    try {
        const token = req.headers['token'];
        const ingredient: Ingredient = req.body;
        const user = verifyToken(token);
        if (!user || !user['email']) {
            return res.status(402).json("Can't execute this action without being logged in");
        }
        if (
            !ingredient.calories || !ingredient.price || !ingredient.referenceValue || !ingredient.proteins ||
            !ingredient.quantityMaximum || !ingredient.quantityMinimum || ingredient.quantityMinimum > ingredient.quantityMaximum
        ) {
            return res.status(402).json("Incorrect fields");
        }
        const success = await IngredientService.updateIngredient(user['email'], ingredient);
        if (!success) {
            return res.status(500).json("Unknown error");
        }
        return res.status(200).json();
    } catch (error) {
        console.log(error)
        return res.status(500).json("Unknown error");
    }
};


export const deleteIngredient = async (req: Request, res: Response) => {
    try {
        const token = req.headers['token'];
        const ingredientName = req.params.name;
        const user = verifyToken(token);
        if (!user || !user['email']) {
            return res.status(402).json("Can't execute this action without being logged in");
        }
        const success = await IngredientService.deleteIngredient(user['email'], ingredientName);
        if (!success) {
            return res.status(500).json("Unknown error");
        }
        return res.status(200).json();
    } catch (error) {
        console.log(error)
        return res.status(500).json("Unknown error");
    }
};
