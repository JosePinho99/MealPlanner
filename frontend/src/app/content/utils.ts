
import { Ingredient, Meal, MealType, NewPlan, Operator, PlannedDay, Validator, Error } from "../../../../commons/interfaces";
import { getStartingPlan } from "../../../../commons/starting-plan";
import { getValidatorObject, scorePlan, validatePlan } from "../../../../commons/validation";
import { improvePlan } from "../../../../commons/improve";

export function defaultNewPlan() {
  //TODOS (avoid repetition)
  //TODOS (condition applied to all ingridients)
  //TODOS (multi attempts on plan)

  let newPlan: NewPlan = {
    dailyRestrictions: [
      {element: 'calories', operator: Operator.LessThan, value: ['1800']},
      {element: 'price', operator: Operator.LessThan, value: ['12']},
      {element: 'proteins', operator: Operator.MoreThan, value: ['75']}
    ],
    ingredientRestrictions: [
      {element: 'Granola', operator: Operator.Combine, value: ['Leite aveia']},
      {element: 'Massa', operator: Operator.DontCombine, value: ['Grão de bico']},
      {element: 'Massa', operator: Operator.DontCombine, value: ['Feijão preto']},
      {element: 'Massa', operator: Operator.DontCombine, value: ['Grão de bico']},
      {element: 'Compal', operator: Operator.DontCombine, value: ['Cereais']},
      {element: 'Batatas fritas', operator: Operator.LessThanWeekly, value: ['3']},
      {element: 'Bacon', operator: Operator.MoreThanWeekly, value: ['0']},
      {element: 'Compal', operator: Operator.MoreThanWeekly, value: ['0']},
      {element: 'Shots proteina', operator: Operator.LessThanWeekly, value: ['4']},
    ],
    meals: [
        {name: 'lunch', type: MealType.MAIN, mIMin: 1, mIMax: 1, sIMin: 1, sIMax: 1, eIMin: 1, eIMax: 1},
        {name: 'dinner', type: MealType.MAIN, mIMin: 1, mIMax: 1, sIMin: 1, sIMax: 1, eIMin: 1, eIMax: 1},
        {name: 'lanche', type: MealType.SECONDARY, mIMin: 1, mIMax: 1, sIMin: 1, sIMax: 1, eIMin: 0, eIMax: 0},
        {name: 'snack', type: MealType.SNACK, mIMin: 0, mIMax: 1, sIMin: 0, sIMax: 0, eIMin: 0, eIMax: 0}
    ]
  }
  return newPlan;
}


export function generatePlan(planConfig: NewPlan, ingredients: Ingredient[]) {
  let currentPlan: PlannedDay[] = getStartingPlan(planConfig, ingredients);
  const validator: Validator = getValidatorObject(planConfig.dailyRestrictions, planConfig.ingredientRestrictions, ingredients);
  const meals: Meal[] = planConfig.meals;
  let errors: Error[] = validatePlan(currentPlan, validator);
  let best_score = scorePlan(errors);

  let tryImprove = 100;
  console.log("Initial: ", errors.length, errors, best_score);
  let best_plan = currentPlan;
  while (tryImprove > 0) {
    console.log(best_score);
    if (best_score === 0) {
      break;
    }
    for (let i = 0; i < 10; i++) {
      let newPlan = JSON.parse(JSON.stringify(currentPlan));
      improvePlan(newPlan, errors, ingredients, meals);
      let newErrors = validatePlan(newPlan, validator);
      let score = scorePlan(newErrors);
      if (score < best_score) {
        best_score = score;
        best_plan = newPlan;
      }
    }
    currentPlan = best_plan;
    tryImprove -= 1;
  }

  console.log(currentPlan.map(plan => plan.meals.map(m => m.ingredients)));
  console.log(validatePlan(currentPlan, validator), scorePlan(validatePlan(currentPlan, validator)));
}









