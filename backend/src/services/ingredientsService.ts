import {pool} from "../config/database";
import {Ingredient} from "../../../commons/interfaces";

export const getIngredientsByUser = async (email: string) => {
    if (!email) {
        let queryText = 'SELECT * FROM public."Ingredients" WHERE "user" IS NULL';
        let result = await pool.query(queryText);
        let defaultIngredients = result.rows;
        return defaultIngredients.map(i => ({...i, allowedMeals: i['allowedMeals'].split(",")}));
    }

    const queryText = 'SELECT * FROM public."Ingredients" WHERE "user" = $1';
    const result = await pool.query(queryText, [email]);
    let userIngredients = result.rows;
    return userIngredients.map(i => ({...i, allowedMeals: i['allowedMeals'].split(",")}));
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


export const updateIngredient = async (email: string, ingredient: Ingredient) => {
    let queryText = 'UPDATE public."Ingredients" SET "type" = $1, "price" = $2, "calories" = $3, "proteins" = $4, "referenceValue" = $5, "quantityMaximum" = $6, "quantityMinimum" = $7, "allowedMeals" = $8 WHERE "name" = $9 AND "user" = $10';
    const params = [
        ingredient.type,
        ingredient.price,
        ingredient.calories,
        ingredient.proteins,
        ingredient.referenceValue,
        ingredient.quantityMaximum,
        ingredient.quantityMinimum,
        ingredient.allowedMeals.join(" , "),
        ingredient.name,
        email
    ];
    const result = await pool.query(queryText, params);
    return result.rowCount !== 0;
};

export const deleteIngredient = async (email: string, ingredientName: string) => {
    const queryText = 'DELETE FROM public."Ingredients" WHERE "name" = $1  AND "user" = $2';
    const result = await pool.query(queryText, [ingredientName, email]);
    return result.rowCount !== 0;
};



export const fillDefaultIngredients = async (email: string) => {
    const queryText = `INSERT INTO "public"."Ingredients" ("name", "referenceValue", "quantityMinimum", "quantityMaximum", "type", "allowedMeals", "price", "calories", "proteins", "user") VALUES ('Soy', '100', '40', '25', 'Main', 'Main meal', '0.63', '322.51', '51.9', $1), ('Rice', '100', '60', '80', 'Secondary', 'Main meal', '0.14', '349', '6.9', $1), ('Seitan', '100', '125', '125', 'Main', 'Main meal', '0.99', '179', '21', $1), ('Chips', '100', '53', '53', 'Secondary', 'Main meal', '1', '520', '6.5', $1), ('Mushrooms', '100', '92', '92', 'Extra', 'Main meal', '0.47', '18', '2.4', $1), ('Chickpeas', '100', '130', '130', 'Extra', 'Main meal', '0.61', '83', '4.9', $1), ('Black beans', '100', '130', '130', 'Extra', 'Main meal', '0.61', '77', '6', $1), ('Pasta', '100', '100', '100', 'Secondary', 'Main meal', '0.314', '359', '13', $1), ('Meatballs', '100', '100', '100', 'Main', 'Main meal', '2', '195', '20.7', $1), ('Peas', '100', '100', '100', 'Extra', 'Main meal', '0.14', '70', '5.1', $1), ('Potatoes', '100', '250', '250', 'Secondary', 'Main meal', '0.16', '86', '1.6', $1), ('Tofu', '100', '125', '125', 'Main', 'Main meal', '0.78', '111', '14.6', $1), ('Bacon', '100', '45', '45', 'Extra', 'Main meal', '2.8', '186', '18', $1)`;
    await pool.query(queryText, [email]);
    return;
}

