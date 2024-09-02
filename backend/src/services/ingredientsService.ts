import {pool} from "../config/database";

export const getIngredientsByUser = async (email: string) => {
    if (!email) {
        const queryText = 'SELECT * FROM public."Ingredients" WHERE "user" IS NULL';
        const result = await pool.query(queryText);
        return result.rows;
    } else {
        const queryText = 'SELECT * FROM public."Ingredients" WHERE "user" = $1';
        const result = await pool.query(queryText, [email]);
        return result.rows;
    }
};