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

export const getUserIdByEmail = async (email: string) => {
    let userQuery = 'SELECT id FROM public."Users" WHERE "email" =  $1';
    const userResult = await pool.query(userQuery, [email]);
    if (userResult?.rows?.length !== 1) {
        return null;
    }
    return userResult.rows[0]['id'];
}