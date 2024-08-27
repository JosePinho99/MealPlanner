
import {
  Ingredient,
  Meal,
  MealType,
  NewPlan,
  Operator,
  PlannedDay,
  Validator,
  Error,
  GeneratedPlan
} from "../../../../commons/interfaces";
import { getStartingPlan } from "../../../../commons/starting-plan";
import { getValidatorObject, scorePlan, validatePlan } from "../../../../commons/validation";
import { improvePlan } from "../../../../commons/improve";

export function defaultNewPlan() {
  let newPlan: NewPlan = {
    dailyRestrictions: [
      {element: 'calories', operator: Operator.LessThan, value: ['1800']},
      {element: 'price', operator: Operator.LessThan, value: ['12']},
      {element: 'proteins', operator: Operator.MoreThan, value: ['75']}
    ],
    ingredientRestrictions: [
      {element: 'Granola', operator: Operator.Combine, value: ['Leite aveia']},
      {element: 'Massa', operator: Operator.LessThanDaily, value: ['4']},
      {element: 'Massa', operator: Operator.DontCombine, value: ['Grão de bico']},
      {element: 'Massa', operator: Operator.DontCombine, value: ['Feijão preto']},
      {element: 'Compal', operator: Operator.DontCombine, value: ['Cereais']},
      {element: 'Batatas fritas', operator: Operator.LessThanWeekly, value: ['3']},
      {element: 'Bacon', operator: Operator.MoreThanWeekly, value: ['0']},
      {element: 'Compal', operator: Operator.MoreThanWeekly, value: ['0']},
      {element: 'Shots proteina', operator: Operator.LessThanWeekly, value: ['4']},
      {element: 'All', operator: Operator.LessThanDaily, value: ['6']},
      {element: 'All', operator: Operator.DontRepeatInARow}
    ],
    meals: [
        {name: 'lunch', type: MealType.MAIN, mIMin: 1, mIMax: 1, sIMin: 1, sIMax: 1, eIMin: 1, eIMax: 1},
        {name: 'lanche', type: MealType.SECONDARY, mIMin: 1, mIMax: 1, sIMin: 1, sIMax: 1, eIMin: 0, eIMax: 0},
        {name: 'dinner', type: MealType.MAIN, mIMin: 1, mIMax: 1, sIMin: 1, sIMax: 1, eIMin: 1, eIMax: 1},
        {name: 'snack', type: MealType.SNACK, mIMin: 0, mIMax: 1, sIMin: 0, sIMax: 0, eIMin: 0, eIMax: 0}
    ]
  }
  return newPlan;
}


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









