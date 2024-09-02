import {pool} from "../config/database";
import {Ingredient} from "../../../commons/interfaces";

export const getIngredientsByUser = async (email: string) => {
    //If there is no use logged we return the default ones, else we return the default ones plus the ones the user has
    //If the user edited one of the default ones then we don't return that default one but instead the updated

    let queryText = 'SELECT * FROM public."Ingredients" WHERE "user" IS NULL';
    let result = await pool.query(queryText);
    let defaultIngredients = result.rows;
    if (!email) {
        return defaultIngredients.map(i => ({...i, allowedMeals: i['allowedMeals'].split(",")}));
    }

    queryText = 'SELECT * FROM public."Ingredients" WHERE "user" = $1';
    result = await pool.query(queryText, [email]);
    let userIngredients = result.rows;
    let defaultIngredientsNotOverwritten = [];
    for (let defaultIng of defaultIngredients) {
        if (!userIngredients.find(i => i['name'] === defaultIng.name)) {
            defaultIngredientsNotOverwritten.push(defaultIng);
        }
    }
    return userIngredients.concat(defaultIngredientsNotOverwritten).map(i => ({...i, allowedMeals: i['allowedMeals'].split(",")}));
};


export const createIngredient = async (email: string, ingredient: Ingredient) => {
    let queryText = 'INSERT INTO public."Ingredients" ("name", "type", "price", "calories", "proteins", "user", "referenceValue", "quantityMaximum", "quantityMinimum", "allowedMeals") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
    const params = [
        ingredient.name,
        ingredient.type,
        ingredient.price,
        ingredient.calories,
        ingredient.proteins,
        email,
        ingredient.referenceValue,
        ingredient.quantityMaximum,
        ingredient.quantityMinimum,
        ingredient.allowedMeals.join(" , ")
    ];
    const result = await pool.query(queryText, params);
    return result.rowCount !== 0;
};
