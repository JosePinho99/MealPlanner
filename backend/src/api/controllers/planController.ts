import {Request, Response} from 'express';
import {GeneratedPlan, NewPlan, Operator} from "../../../../commons/interfaces";
import {generatePlan} from "../../../core/planner";


export const createPlan = async (req: Request, res: Response) => {
    try {
        const planConfig: NewPlan = req.body[0];
        //Validate restrictions
        for (let restriction of planConfig.dailyRestrictions) {
            if (!validateInputs(restriction)) {
                return res.status(400).json("Invalid values for " + restriction.element);
            }
        }
        for (let restriction of planConfig.ingredientRestrictions) {
            if (!validateInputs(restriction)) {
                return res.status(400).json("Invalid values for " + restriction.element);
            }
        }
        const plan: GeneratedPlan = generatePlan(planConfig, req.body[1]);
        return res.status(200).json(plan);
    } catch (error) {
        return res.status(500).json("Unknown error");
    }
};



function validateInputs(restriction) {
    if (restriction.operator === Operator.Between && restriction.value[0] >= restriction.value[1]) {
        return false;
    }
    if (restriction.operator === Operator.Between && (!restriction.value[0] || !restriction.value[1])) {
        return false;
    }
    if (restriction.operator === Operator.Between && (Number(restriction.value[0]) < 1 || Number(restriction.value[1]) < 1)) {
        return false;
    }
    if (
        restriction.operator === Operator.LessThan ||
        restriction.operator === Operator.LessThanWeekly ||
        restriction.operator === Operator.MoreThan ||
        restriction.operator === Operator.MoreThanWeekly
    ) {
        if (!restriction.value[0] || Number(restriction.value[0]) < 1) {
            return false;
        }
    }
    if (
        restriction.operator === Operator.Avoid ||
        restriction.operator === Operator.Prioritize ||
        restriction.operator === Operator.Combine ||
        restriction.operator === Operator.DontCombine
    ) {
        if (!restriction.value[0]) {
            return false;
        }
    }
    return true;
}