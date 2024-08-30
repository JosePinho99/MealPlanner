import {pool} from "../config/database";

export const getUserByEmail = async (email: string) => {
    const queryText = 'SELECT * FROM public."Users" WHERE "email" = $1';
    const result = await pool.query(queryText, [email]);
    return result.rows.length > 0 ? result.rows[0] : null;
};


export const registerUser = async (email: string, username: string, password: string) => {
    const queryText = 'INSERT INTO public."Users" (email, name, password) VALUES ($1, $2, $3)';
    const result = await pool.query(queryText, [email, username, password]);
    return result.rowCount !== 0;
};