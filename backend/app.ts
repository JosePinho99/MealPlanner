import express, {Request, Response} from 'express';
import cors from 'cors';
import {GeneratedPlan, PlannedDay} from "../commons/interfaces";
import {generatePlan} from "./core/planner";
import {router as authRouter} from "./src/api/routes/authRoutes";
import {router as ingredientsRouter} from "./src/api/routes/ingredientsRoutes";
import {router as plansRouter} from "./src/api/routes/planRoutes";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());


// Routes
app.use('/auth', authRouter);
app.use('/ingredients', ingredientsRouter);
app.use('/plans', plansRouter);


app.listen(port, async () => {
    // const password = await hashPassword("Kaxinas99!!");
    //
    //
    // const queryText = 'INSERT INTO public."Users" (name, password) VALUES ($1, $2)';
    // await pool.query(queryText, ["ze", password]);
    console.log(`App listening at http://localhost:${port}`);
});