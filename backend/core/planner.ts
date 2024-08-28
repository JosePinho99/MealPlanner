import {Error, GeneratedPlan, Ingredient, Meal, NewPlan, PlannedDay, Validator} from "../../commons/interfaces";
import {getValidatorObject, scorePlan, validatePlan} from "../../commons/validation";
import {getStartingPlan} from "../../commons/starting-plan";
import {improvePlan} from "../../commons/improve";

export function generatePlan(planConfig: NewPlan, ingredients: Ingredient[], planName: string): GeneratedPlan {
    const validator: Validator = getValidatorObject(planConfig.dailyRestrictions, planConfig.ingredientRestrictions, ingredients);
    let bestScore = Number.MAX_VALUE;
    let bestPlan: PlannedDay[] = null;
    let finalErrors: Error[] = [];
    for (let i = 0; i < 50; i++) {
        const plan: PlannedDay[] = generatePlanEvolution(planConfig, ingredients, validator, 50);
        const errors: Error[] = validatePlan(plan, validator, ingredients, planConfig.meals);
        const planScore: number = scorePlan(errors);
        if (planScore < bestScore) {
            bestScore = planScore;
            bestPlan = plan;
            finalErrors = errors;
            if (planScore === 0) {
                break;
            }
        }
    }
    return {plannedDays: bestPlan, errors: finalErrors, name: planName};
}

export function generatePlanEvolution(planConfig: NewPlan, ingredients: Ingredient[], validator: Validator, improveAttempts: number) {
    let currentPlan: PlannedDay[] = getStartingPlan(planConfig, ingredients);

    //console.log(validator);
    const meals: Meal[] = planConfig.meals;
    let errors: Error[] = validatePlan(currentPlan, validator, ingredients, meals);
    let bestScore = scorePlan(errors);

    //console.log("Initial: ", errors.length, errors, bestScore);
    let bestPlan = currentPlan;
    while (improveAttempts > 0) {
        //console.log(bestScore);
        if (bestScore === 0) {
            break;
        }
        for (let i = 0; i < 10; i++) {
            let newPlan = JSON.parse(JSON.stringify(currentPlan));
            improvePlan(newPlan, errors, ingredients, meals);
            let newErrors = validatePlan(newPlan, validator, ingredients, meals);
            let score = scorePlan(newErrors);
            if (score < bestScore) {
                bestScore = score;
                bestPlan = newPlan;
            }
        }
        currentPlan = bestPlan;
        improveAttempts -= 1;
    }

    return currentPlan;
}