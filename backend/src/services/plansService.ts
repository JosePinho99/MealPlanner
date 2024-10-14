import {pool} from "../config/database";

export const getPlansForUser = async (userId: number) => {
    let planQuery = 'SELECT * FROM public."Plans" WHERE "user" = $1';
    const result = await pool.query(planQuery, [userId]);
    return result.rows;
};


export const addPlanToUser = async (plan, userId: number) => {
    let planQuery = 'INSERT INTO public."Plans" ("user", "plan") VALUES ($1, $2)';
    const result = await pool.query(planQuery, [userId, plan]);
    return result.rowCount !== 0;
};