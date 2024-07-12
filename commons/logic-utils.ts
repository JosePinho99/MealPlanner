import { Ingredient, IngredientType, Meal, PlannedMeal } from "./interfaces";
import { randomFromArray, randomIntFromInterval } from "./object-utils";

export function tryToAddIngredient(ingredient: Ingredient, meal: PlannedMeal, mealConf: Meal) {
  const ingredientType = ingredient.type;
  const maxOfIngredientType = mealConf[convertIngredientTypeToProperty(ingredientType, true)];
  const currentOfIngredientType = meal.ingredients.filter(ing => ing.type === ingredientType).length;
  if (currentOfIngredientType < maxOfIngredientType && ingredient.allowedMeals.includes(mealConf.type)) {
    addIngredient(meal, ingredient);
    return true;
  }
  return false;
}



export function tryToRemoveIngredient(ingredient: Ingredient, meal: PlannedMeal, mealConf: Meal) {
  const ingredientType = ingredient.type;
  const maxOfIngredientType = mealConf[convertIngredientTypeToProperty(ingredientType, false)];
  const currentOfIngredientType = meal.ingredients.filter(ing => ing.type === ingredientType).length;
  if (currentOfIngredientType > maxOfIngredientType) {
    if (removeIngredient(meal, ingredient)) {
      return true;
    };
  }
  return false;
}

// @ts-ignore
export function tryToReplaceIngredient(ingredientToBeReplaced: Ingredient, ingredients: Ingredient[], meal: PlannedMeal, mealConf: Meal, ingredientToReplace: Ingredient = null) {
  //We want to replace one ingredient for another known, and not for one random that fits
  if (!ingredientToReplace) {
    const validReplacements: Ingredient[] = ingredients.filter(i => i.name !== ingredientToBeReplaced.name && i.allowedMeals.includes(mealConf.type) && i.type === ingredientToBeReplaced.type);
    if (validReplacements.length === 0) {
      return false;
    }
    ingredientToReplace = randomFromArray(validReplacements);
  }
  if (removeIngredient(meal, ingredientToBeReplaced)) {
    addIngredient(meal, ingredientToReplace);
    return true;
  };
  return false;
}


export function tryToAddIngredientForSpecificType(mealConf: Meal, meal: PlannedMeal, ingredients: Ingredient[], property: string, type: IngredientType) {
  const maxOfIngredientType = mealConf[property];
  const currentOfIngredientType = meal.ingredients.filter(ing => ing.type === type).length;
  if (currentOfIngredientType < maxOfIngredientType) {
    const validIngredients = ingredients.filter(ing => !meal.ingredients.find(i => i.name === ing.name) && ing.type === type && ing.allowedMeals.includes(mealConf.type));
    if (validIngredients.length > 0) {
      const chosen: Ingredient = randomFromArray(validIngredients);
      addIngredient(meal, chosen);
      return true;
    }
  }
  return false;
}


export function convertIngredientTypeToProperty(ingredientType: IngredientType, max: boolean) {
  switch (ingredientType) {
    case IngredientType.MAIN:
      return max ? "mIMax" : "mIMin";
    case IngredientType.EXTRA:
      return max ? "eIMax" : "eIMin";
    case IngredientType.SECONDARY:
      return max ? "sIMax" : "sIMin";
  }
}

//Adds an ingredient, takes into consideration the interval for min and max quantities
export function addIngredient(meal: PlannedMeal, ingredient: Ingredient) {
  // @ts-ignore
  const quantitySelected = randomIntFromInterval(ingredient.quantityMinimum, ingredient.quantityMaximum);   
  meal.ingredients.push({
    ...ingredient, 
    // @ts-ignore
    price: Math.round((ingredient.price * quantitySelected / ingredient.referenceValue) * 100) / 100,
    // @ts-ignore
    calories: Math.round((ingredient.calories * quantitySelected / ingredient.referenceValue) * 100) / 100,
    // @ts-ignore
    proteins: Math.round((ingredient.proteins * quantitySelected / ingredient.referenceValue) * 100) / 100,
    quantity: quantitySelected
  });
}

export function removeIngredient(meal: PlannedMeal, ingredient: Ingredient) {
  // @ts-ignore
  const index: number = meal.ingredients.indexOf(meal.ingredients.find(i => i.name === ingredient.name));
  if (index !== -1) {
    meal.ingredients.splice(index, 1);
    return true;
  } 
  return false;
}
