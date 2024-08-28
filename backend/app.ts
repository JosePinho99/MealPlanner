import express, { Request, Response } from 'express';
import cors from 'cors';
import {GeneratedPlan, PlannedDay} from "../commons/interfaces";
import {generatePlan} from "./core/planner";

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;


app.post('/createPlan', (req: Request, res: Response) => {
    const plan: GeneratedPlan = generatePlan(req.body[0], req.body[1], "hello");
    res.status(200).json(plan);
});


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});