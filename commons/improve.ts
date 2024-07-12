import { Error, ErrorType, Ingredient, IngredientType, Meal, PlannedDay, PlannedMeal } from "./interfaces";
import { tryToAddIngredient, tryToAddIngredientForSpecificType, tryToRemoveIngredient, tryToReplaceIngredient } from "./logic-utils";
import { randomFromArray, randomIntFromInterval } from "./object-utils";

export function improvePlan(plan: PlannedDay[],  errors: Error[], ingredients: Ingredient[], meals: Meal[]) {
  if (errors.length === 0) {
    return;
  }
  const error: Error = randomFromArray(errors);
  switch (error.type) {
    case ErrorType.COMBINE:
      improveCombine(error, plan, ingredients, meals);
      break;
    case ErrorType.DONT_COMBINE:
      improveDontCombine(error, plan, ingredients, meals);
      break;
    case ErrorType.AVOID:
      improveAvoid(error, plan, ingredients, meals);
      break;
    case ErrorType.PRIORITIZE:
      improvePrioritize(error, plan, ingredients, meals);
      break;
    case ErrorType.LOW_NUTRIENTS_DAILY:
      improveLowNutrientsDaily(error, plan, ingredients, meals);
      break;
    case ErrorType.HIGH_NUTRIENTS_DAILY:
      improveHighNutrientsDaily(error, plan, ingredients, meals);
      break;
    case ErrorType.LOW_DAILY:
      improveLowDaily(error, plan, ingredients, meals);
      break;
    case ErrorType.HIGH_DAILY:
      improveHighDaily(error, plan, ingredients, meals);
      break;
    case ErrorType.LOW_WEEKLY:
      improveLowWeekly(error, plan, ingredients, meals);
      break;
    case ErrorType.HIGH_WEEKLY:
      improveHighWeekly(error, plan, ingredients, meals);
      break;
  }
}

function improveHighWeekly(error: Error, plan: PlannedDay[], ingredients: Ingredient[], meals: Meal[]) {
  //Trying to add or replace the ingredient to the multiple meals
  const ingredient = ingredients.find(i => i.name === error.ing1);
  for (let plannedDay of plan) {
    for (let meal of plannedDay.meals) {
      let mealConf: Meal = meals.find(m => m.name === meal.name);
      if (tryToRemoveIngredient(ingredient, meal, mealConf) || tryToReplaceIngredient(ingredient, ingredients, meal, mealConf)) {
        error.diff -= 1;
        if (error.diff < 0) {return;}
      }
    }
  }
}


function improveLowWeekly(error: Error, plan: PlannedDay[], ingredients: Ingredient[], meals: Meal[]) {
  //Trying to remove or replace the ingredient to the multiple meals
  const ingredient = ingredients.find(i => i.name === error.ing1);
  for (let plannedDay of plan) {
    for (let meal of plannedDay.meals) {
      let mealConf: Meal = meals.find(m => m.name === meal.name);
    if (tryToRemoveIngredient(ingredient, meal, mealConf) || tryToReplaceIngredient(ingredient, ingredients, meal, mealConf)) {
      error.diff -= 1;
      if (error.diff < 0) {return;}
    }
    }
  }
}


function improveHighDaily(error: Error, plan: PlannedDay[], ingredients: Ingredient[], meals: Meal[]) {
  const plannedDay: PlannedDay = plan.find(p => p.day === error.day);
  const ingredient = ingredients.find(i => i.name === error.ing1);
  //Trying to remove or replace the ingredient to the multiple meals
  for (let meal of plannedDay.meals) {
    let mealConf: Meal = meals.find(m => m.name === meal.name);
    if (tryToRemoveIngredient(ingredient, meal, mealConf) || tryToReplaceIngredient(ingredient, ingredients, meal, mealConf)) {
      error.diff -= 1;
      if (error.diff < 0) {return;}
    }
  }
}


function improveLowDaily(error: Error, plan: PlannedDay[], ingredients: Ingredient[], meals: Meal[]) {
  const plannedDay: PlannedDay = plan.find(p => p.day === error.day);
  const ingredient = ingredients.find(i => i.name === error.ing1);
  //Trying to add or replace the ingredient to the multiple meals
  for (let meal of plannedDay.meals) {
    let mealConf: Meal = meals.find(m => m.name === meal.name);
    if (tryToAddIngredient(ingredient, meal, mealConf)) {
      error.diff -= 1;
      if (error.diff < 0) {return;}
    }
    let ingredientToReplace: Ingredient = meal.ingredients.find(i => i.type === ingredient.type && i.allowedMeals.includes(mealConf.type));
    if (ingredientToReplace) {
      if (tryToReplaceIngredient(ingredientToReplace, ingredients, meal, mealConf, ingredient)) {
        error.diff -= 1;
        if (error.diff < 0) {return;}
      }
    }
  }
}


function improveHighNutrientsDaily(error: Error, plan: PlannedDay[], ingredients: Ingredient[], meals: Meal[]) {
  const plannedDay: PlannedDay = plan.find(p => p.day === error.day);
  //Trying to removing ingredients
  for (let meal of plannedDay.meals) {
    let mealConf: Meal = meals.find(m => m.name === meal.name);
    for (let ingredient of meal.ingredients) {
      if (tryToRemoveIngredient(ingredient, meal, mealConf)) {
        error.diff = error.diff - ingredient[error.nutrient];
        if (error.diff < 0) {return;}
      }
    }
  }
  //If removing dind't work, let's try to remove quantities to the current ones
  for (let meal of plannedDay.meals) {
    for (let ingredient of meal.ingredients) {
      const previousValue = ingredient[error.nutrient];
      const quantitySelected = randomIntFromInterval(ingredient.quantityMinimum, ingredient.quantity);   
      ingredient.price = Math.round((ingredient.price * quantitySelected / ingredient.quantity) * 100) / 100;
      ingredient.calories = Math.round((ingredient.calories * quantitySelected / ingredient.quantity) * 100) / 100;
      ingredient.proteins = Math.round((ingredient.proteins * quantitySelected / ingredient.quantity) * 100) / 100,
      ingredient.quantity = quantitySelected;
      error.diff = error.diff - (previousValue - ingredient[error.nutrient]);
      if (error.diff < 0) {return;}
    }
  }
  //TODO Maybe as next step we should try to replace for less ingredients, for now we dont because its hard :P
}


function improveLowNutrientsDaily(error: Error, plan: PlannedDay[], ingredients: Ingredient[], meals: Meal[]) {
  const plannedDay: PlannedDay = plan.find(p => p.day === error.day);
  //Trying to add ingredients
  for (let meal of plannedDay.meals) {
    let mealConf: Meal = meals.find(m => m.name === meal.name);
    if (tryToAddIngredientForSpecificType(mealConf, meal, ingredients, "mIMax", IngredientType.MAIN)) {
      error.diff = error.diff - meal.ingredients[meal.ingredients.length - 1][error.nutrient];
      if (error.diff < 0) {return;}
    }
    if (tryToAddIngredientForSpecificType(mealConf, meal, ingredients, "sIMax", IngredientType.SECONDARY)) {
      error.diff = error.diff - meal.ingredients[meal.ingredients.length - 1][error.nutrient];
      if (error.diff < 0) {return;}
    }
    if (tryToAddIngredientForSpecificType(mealConf, meal, ingredients, "eIMax", IngredientType.EXTRA)) {
      error.diff = error.diff - meal.ingredients[meal.ingredients.length - 1][error.nutrient];
      if (error.diff < 0) {return;}
    }
  }
  //If adding dind't work, let's try to add quantities to the current ones
  for (let meal of plannedDay.meals) {
    for (let ingredient of meal.ingredients) {
      const previousValue = ingredient[error.nutrient];
      const quantitySelected = randomIntFromInterval(ingredient.quantity, ingredient.quantityMaximum);   
      ingredient.price = Math.round((ingredient.price * quantitySelected / ingredient.quantity) * 100) / 100,
      ingredient.calories = Math.round((ingredient.calories * quantitySelected / ingredient.quantity) * 100) / 100,
      ingredient.proteins = Math.round((ingredient.proteins * quantitySelected / ingredient.quantity) * 100) / 100,
      ingredient.quantity = quantitySelected
      error.diff = error.diff - (ingredient[error.nutrient] - previousValue);
      if (error.diff < 0) {return;}
    }
  }
  //TODO Maybe as next step we should try to replace for more dense ingredients, for now we dont, for now we dont because its hard :P
}



function improveAvoid(error: Error, plan: PlannedDay[], ingredients: Ingredient[], meals: Meal[]) {
  const plannedDay: PlannedDay = plan.find(p => p.day === error.day);
  const meal: PlannedMeal = plannedDay.meals.find(m => m.name === error.meal);
  const mealConf: Meal = meals.find(m => m.name === error.meal);
  const ingredientToAvoid = ingredients.find(i => i.name === error.ing1);
  //Can we simply remove the ingredient?
  if (tryToRemoveIngredient(ingredientToAvoid, meal, mealConf)) {
    return;
  }
  //Let's try to add another to replace the avoided
  let ingredientToReplace: Ingredient = meal.ingredients.find(i => i.type === ingredientToAvoid.type && i.allowedMeals.includes(mealConf.type));
  if (ingredientToReplace) {
    if (tryToReplaceIngredient(ingredientToReplace, ingredients, meal, mealConf)) {
      return;
    }
  }
}

// {type: ErrorType.PRIORITIZE, day: 'SUN', meal: 'dinner', ing1: 'Pasta'};
function improvePrioritize(error: Error, plan: PlannedDay[], ingredients: Ingredient[], meals: Meal[]) {
  const plannedDay: PlannedDay = plan.find(p => p.day === error.day);
  const meal: PlannedMeal = plannedDay.meals.find(m => m.name === error.meal);
  const mealConf: Meal = meals.find(m => m.name === error.meal);
  const ingredientToAdd = ingredients.find(i => i.name === error.ing1);
  //Can we simply remove the ingredient?
  if (tryToAddIngredient(ingredientToAdd, meal, mealConf)) {
    return;
  }
  //Let's try to add the ingredient to add by replacing it by another
  let ingredientToReplace: Ingredient = meal.ingredients.find(i => i.type === ingredientToAdd.type && i.allowedMeals.includes(mealConf.type));
  if (ingredientToReplace) {
    if (tryToReplaceIngredient(ingredientToReplace, ingredients, meal, mealConf, ingredientToAdd)) {
      return;
    }
  }
}


function improveCombine(error: Error, plan: PlannedDay[], ingredients: Ingredient[], meals: Meal[]) {
  const plannedDay: PlannedDay = plan.find(p => p.day === error.day);
  const meal: PlannedMeal = plannedDay.meals.find(m => m.name === error.meal);
  const mealConf: Meal = meals.find(m => m.name === error.meal);
  const ingredientLookingForCombination = ingredients.find(i => i.name === error.ing1);
  const ingredientNotCombined = ingredients.find(i => i.name === error.ing2);
  //Can we simply add the ingredient not combined?
  if (tryToAddIngredient(ingredientNotCombined, meal, mealConf)) {
    return;
  }
  //Can we simply remove the ingredient looking to be combined?
  if (tryToRemoveIngredient(ingredientLookingForCombination, meal, mealConf)) {
    return;
  }
  //Let's try to add the ingredient not combined by replacing it by another
  let ingredientToReplace: Ingredient = meal.ingredients.find(i => i.type === ingredientNotCombined.type && i.allowedMeals.includes(mealConf.type));
  if (ingredientToReplace) {
    if (tryToReplaceIngredient(ingredientToReplace, ingredients, meal, mealConf, ingredientNotCombined)) {
      return;
    }
  }
  //Let's try to remove the ingredient looking to be combined by replacing it by any other of the same type
  if (tryToReplaceIngredient(ingredientLookingForCombination, ingredients, meal, mealConf)) {
    return;
  }
}


function improveDontCombine(error: Error, plan: PlannedDay[], ingredients: Ingredient[], meals: Meal[]) {
  const plannedDay: PlannedDay = plan.find(p => p.day === error.day);
  const meal: PlannedMeal = plannedDay.meals.find(m => m.name === error.meal);
  const mealConf: Meal = meals.find(m => m.name === error.meal);
  const ingredientOne = ingredients.find(i => i.name === error.ing1);
  const ingredientTwo = ingredients.find(i => i.name === error.ing2);
  //Lets try to remove either one of them
  if (tryToRemoveIngredient(ingredientOne, meal, mealConf) || tryToRemoveIngredient(ingredientTwo, meal, mealConf)) {
    return;
  }
  //Lets try replace them for alternative
  if (tryToReplaceIngredient(ingredientOne, ingredients, meal, mealConf) || tryToReplaceIngredient(ingredientTwo, ingredients, meal, mealConf)) {
    return;
  }
}
