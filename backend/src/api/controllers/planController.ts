import {Request, Response} from 'express';
import {GeneratedPlan, NewPlan, Operator} from "../../../../commons/interfaces";
import {generatePlan} from "../../../core/planner";


export const createPlan = async (req: Request, res: Response) => {
    try {
        const planConfig: NewPlan = req.body[0];
        //Validate restrictions
        for (let restriction of planConfig.dailyRestrictions) {
            if (restriction.operator === Operator.Between && restriction.value[0] >= restriction.value[1]) {
                return res.status(400).json("Between must have a maximum value bigger than the minimum value for " + restriction.element);
            }
            if (restriction.operator === Operator.Between && (!restriction.value[0] || !restriction.value[1])) {
                return res.status(400).json("Between must have valid values for " + restriction.element);
            }
            if (restriction.operator !== Operator.Between && (!restriction.value[0])) {
                return res.status(400).json("Invalid values for " + restriction.element);
            }
            //complete validations
        }
        const plan: GeneratedPlan = generatePlan(planConfig, req.body[1]);
        return res.status(200).json(plan);
    } catch (error) {
        return res.status(500).json("Unknown error");
    }
};
