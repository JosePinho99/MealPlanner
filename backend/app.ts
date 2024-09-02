import express, {Request, Response} from 'express';
import cors from 'cors';
import {GeneratedPlan, PlannedDay} from "../commons/interfaces";
import {generatePlan} from "./core/planner";
import {router as authRouter} from "./src/api/routes/authRoutes";
import {router as ingredientsRouter} from "./src/api/routes/ingredientsRoutes";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());


// Routes
app.use('/auth', authRouter);
app.use('/ingredients', ingredientsRouter);



app.post('/createPlan', (req: Request, res: Response) => {
    const token = req.headers['authorization'];
    if (true) {
        const plan: GeneratedPlan = generatePlan(req.body[0], req.body[1], "hello");
        res.status(200).json(plan);
    } else {
        res.status(401).json("Not Authorized");
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