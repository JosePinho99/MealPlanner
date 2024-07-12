import { Ingredient, IngredientType, Meal, NewPlan, PlannedDay, PlannedMeal } from "./interfaces";
import { addIngredient } from "./logic-utils";
import { shuffleArray } from "./object-utils";

const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

//Return a random plan that will act as the initial plan with some congifurations asserted
export function getStartingPlan(planConfig: NewPlan, ingredients: Ingredient[]) {
  const mealsConfig: Meal[] = planConfig.meals;
  let plan: PlannedDay[] = getEmptyPlan();
  plan.forEach((dailyPlan, index) => {
    mealsConfig.forEach(meal => {
      const plannedMeal: PlannedMeal = fillMeal(meal, ingredients)  
      dailyPlan.meals.push(plannedMeal);
      dailyPlan.day = weekDays[index];
    });
  });
  return plan;
}


function fillMeal(mealConfig: Meal, ingredients: Ingredient[]): PlannedMeal {
  let meal: PlannedMeal = {name: mealConfig.name, ingredients: []};
  const remainIngTypes = new Map<IngredientType, number>([
    [IngredientType.MAIN, mealConfig.mIMin],
    [IngredientType.SECONDARY, mealConfig.sIMin],
    [IngredientType.EXTRA, mealConfig.eIMin],
  ]);
  let mealType = mealConfig.type;
  shuffleArray(ingredients);
  for (let ing of ingredients) {
    // @ts-ignore
    if (ing.allowedMeals.includes(mealType) && remainIngTypes.get(ing.type) > 0) {
      addIngredient(meal, ing);
      // @ts-ignore
      remainIngTypes.set(ing.type, remainIngTypes.get(ing.type) - 1);
    }
    if (
      remainIngTypes.get(IngredientType.MAIN) === 0 && 
      remainIngTypes.get(IngredientType.SECONDARY) === 0 && 
      remainIngTypes.get(IngredientType.EXTRA) == 0
    ) {
      return meal;
    }
  }
  console.error(mealConfig.name, remainIngTypes);
  // @ts-ignore
  return null;
  //ERROR, NOT ENOUGH INGREDIENTS TO FULLFILL MINIMUM MEAL QUANTITIES REQUIREMENTS
}

function getEmptyPlan(): PlannedDay[] {
  return [
    {day: "MON", meals: []}, 
    {day: "TUE", meals: []}, 
    {day: "WED", meals: []}, 
    {day: "THU", meals: []}, 
    {day: "FRI", meals: []}, 
    {day: "SAT", meals: []}, 
    {day: "SUN", meals: []}
  ];
}