import express, {Request, Response} from 'express';
import cors from 'cors';
import {GeneratedPlan, PlannedDay} from "../commons/interfaces";
import {generatePlan} from "./core/planner";
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import {hashPassword, verifyPassword} from "./logIn";

dotenv.config();
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
    connectionString,
});

const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;



app.post('/createPlan', (req: Request, res: Response) => {
    const plan: GeneratedPlan = generatePlan(req.body[0], req.body[1], "hello");
    res.status(200).json(plan);
});

app.get('/logIn', async (req: Request, res: Response) => {
    try {
        const queryText = 'SELECT "password" FROM public."Users" WHERE "name" = $1';
        const result = await pool.query(queryText, [req.query.username]);
        if (result.rows.length === 1) {
            const hashedPassword = result.rows[0].password;
            const isPasswordCorrect = await verifyPassword(req.query.password, hashedPassword);
            if (isPasswordCorrect) {
                res.status(200).json("Success");
            } else {
                res.status(200).json("Incorrect password");
            }
        } else {
            res.status(200).json("User not found");
        }
    } catch (error) {
        res.status(200).json("Unknown error");
    }
});


app.listen(port, async () => {
    // const password = await hashPassword("Kaxinas99!!");
    //
    //
    // const queryText = 'INSERT INTO public."Users" (name, password) VALUES ($1, $2)';
    // await pool.query(queryText, ["ze", password]);
    console.log(`App listening at http://localhost:${port}`);
});