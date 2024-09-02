import { Request, Response } from 'express';
import {getIngredientsByUser} from "../../services/ingredientsService";
import {verifyToken} from "../../utils/authenticationUtils";

export const getIngredients = async (req: Request, res: Response) => {
    try {
        const token = req.headers['token'];
        const user = verifyToken(token);
        let ingredients = await getIngredientsByUser(user ? user['email'] : null);
        ingredients = ingredients.map(i => ({...i, allowedMeals: i['allowedMeals'].split(",")}))
        return res.status(200).json(ingredients);
    } catch (error) {
        console.log(error)
        return res.status(500).json("Unknown error");
    }
};