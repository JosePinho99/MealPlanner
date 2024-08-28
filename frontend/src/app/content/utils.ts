
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








