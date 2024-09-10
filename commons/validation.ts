import {
  ErrorType,
  Operator,
  PlannedDay,
  Restriction,
  Validator,
  ValidatorLimits,
  Error,
  PlannedMeal,
  MealType,
  Ingredient,
  Meal
} from "./interfaces";


//Here we prepare the data structures necessary to validate one meal plan in a more direct way
//Having these will make it that for each validation, only one iteration of the plan will be needed
export function getValidatorObject(dailyRestrictions: Restriction[], ingredientRestrictions: Restriction[], ingredients: Ingredient[]) {
  const validatorObject: Validator = {
    calories: {min: 0, max: Number.MAX_VALUE},
    price: {min: 0, max: Number.MAX_VALUE},
    proteins: {min: 0, max: Number.MAX_VALUE},
    ingDaily: [],
    ingWeekly: [],
    prioritizes: [],
    avoids: [],
    combines: [],
    dontCombines: [],
    dontRepeats: []
  }
  dailyRestrictions.forEach(restriction => {
    fillValidatorObject(validatorObject[restriction.element], restriction, Operator.MoreThan, Operator.LessThan, Operator.Between);
  });

  ingredientRestrictions.forEach(restriction => {
    if (restriction.operator === Operator.LessThanDaily || restriction.operator === Operator.BetweenDaily || restriction.operator === Operator.MoreThanDaily) {
      let ingredientList = restriction.element === "All" ? ingredients.map(i => i.name) : [restriction.element];
      for (let ingredient of ingredientList) {
        const ingredientLimits = validatorObject.ingDaily.find(vo => vo.ing === ingredient);
        let limits: ValidatorLimits = {max: ingredientLimits?.max ?? Number.MAX_VALUE, min: ingredientLimits?.min ?? 0};
        fillValidatorObject(limits, restriction, Operator.MoreThanDaily, Operator.LessThanDaily, Operator.BetweenDaily);
        if (!ingredientLimits) {
          validatorObject.ingDaily.push({...limits, ing: ingredient});
        } else {
          ingredientLimits.min = limits.min;
          ingredientLimits.max = limits.max;
        }
      }
    }

    if (restriction.operator === Operator.LessThanWeekly || restriction.operator === Operator.BetweenWeekly || restriction.operator === Operator.MoreThanWeekly) {
      let ingredientList = restriction.element === "All" ? ingredients.map(i => i.name) : [restriction.element];
      for (let ingredient of ingredientList) {
        const ingredientLimits = validatorObject.ingWeekly.find(vo => vo.ing === ingredient);
        let limits: ValidatorLimits = {max: ingredientLimits?.max ?? Number.MAX_VALUE, min: ingredientLimits?.min ?? 0};
        fillValidatorObject(limits, restriction, Operator.MoreThanWeekly, Operator.LessThanWeekly, Operator.BetweenWeekly);
        if (!ingredientLimits) {
          validatorObject.ingWeekly.push({...limits, ing: ingredient});
        } else {
          ingredientLimits.min = limits.min;
          ingredientLimits.max = limits.max;
        }
      }
    }

    if (restriction.operator === Operator.Prioritize) {
      validatorObject.prioritizes.push({day: restriction.value[0].split(" ")[0], mealName: restriction.value[0].split(" ")[1], ing: restriction.element}); 
    }
    if (restriction.operator === Operator.Avoid) {
      validatorObject.avoids.push({day: restriction.value[0].split(" ")[0], mealName: restriction.value[0].split(" ")[1], ing: restriction.element}); 
    }
    if (restriction.operator === Operator.Combine) {
      validatorObject.combines.push({ing1: restriction.element, ing2: restriction.value[0]}); 
    }
    if (restriction.operator === Operator.DontCombine) {
      validatorObject.dontCombines.push({ing1: restriction.element, ing2: restriction.value[0]}); 
    }
    if (restriction.operator === Operator.DontRepeatInARow) {
      let ingredientList = restriction.element === "All" ? ingredients.map(i => i.name) : [restriction.element];
      for (let ingredient of ingredientList) {
        validatorObject.dontRepeats.push(ingredient);
      }
    }
  });
  return validatorObject;
}


function fillValidatorObject(limits: ValidatorLimits, restriction: Restriction, moreOperator: Operator, lessOperator: Operator, betweenOperator: Operator) {
  if (restriction.operator === moreOperator) {
    limits.min = Number(restriction.value[0]) + 1;
  } else if (restriction.operator === lessOperator) {
    limits.max = Number(restriction.value[0]) - 1;
  } else if (restriction.operator === betweenOperator) {
    limits.min = Number(restriction.value[0]);
    limits.max = Number(restriction.value[1]);
  }
}



//Validate the plan, returning a list of errors
//Done so that if a plan can't fullfill all criteria, it still is able to return suggestions close to the requested
export function validatePlan(plan: PlannedDay[], validator: Validator, ingredients: Ingredient[], meals: Meal[]) {
  const errors: Error[] = [];
  let weeklyIngredients: string[] = [];
  let lastMealIngredients: string[] = [];
  plan.forEach(plannedDay=> {
    let dailyCals = 0;
    let dailyPrice = 0;
    let dailyProteins = 0;
    let dailyIngredients: string[] = [];
    plannedDay.meals.forEach(plannedMeal => {
      lastMealIngredients = validateDontRepeats(validator, plannedDay, plannedMeal, lastMealIngredients, errors, ingredients, meals);
      plannedMeal.ingredients.forEach(ing => {
        dailyIngredients.push(ing.name);
        weeklyIngredients.push(ing.name);
        dailyCals += ing.calories;
        dailyPrice += ing.price;
        dailyProteins += ing.proteins;
      });
      validateAvoids(validator, plannedMeal, plannedDay, errors);
      validatePrioritizes(validator, plannedMeal, plannedDay, errors);
      validateCombines(validator, plannedMeal, plannedDay, errors);
      validateDontCombines(validator, plannedMeal, plannedDay, errors);
    });

    validateNutrients(validator, plannedDay, errors, "calories", dailyCals);
    validateNutrients(validator, plannedDay, errors, "price", dailyPrice);
    validateNutrients(validator, plannedDay, errors, "proteins", dailyProteins);
    validateDailyIngredients(validator, plannedDay, errors, dailyIngredients);
  });
  validateWeeklyIngredients(validator, errors, weeklyIngredients);
  return errors;
}

function validateDontRepeats(validator: Validator, plannedDay: PlannedDay, plannedMeal: PlannedMeal, lastMealIngredients: string[], errors: Error[], ingredients: Ingredient[], meals: Meal[]) {
  let currentMealIngredients = plannedMeal.ingredients.map(i => i.name);
  const mealType = meals.find(m => m.name === plannedMeal.name).type;
  for (let ingName of validator.dontRepeats) {
    const ing = ingredients.find(i => i.name === ingName);
    if (currentMealIngredients.includes(ingName) && lastMealIngredients.includes(ingName)) {
      errors.push({type: ErrorType.DONT_REPEAT, day: plannedDay.day, meal: plannedMeal.name, ing1: ingName});
    }
    //An ingredient could be used on this meal, but it wasn't, so we can remove it from last meal.
    //We need to have this type of logic to deal with ingredients that can only be used for lunch and dinner for example
    //Without it, if they were not in the afternoon snack they wouldn't count as repeating even though they would be in both lunch and dinner
    if (ing.allowedMeals.includes(mealType) && !currentMealIngredients.includes(ingName) && lastMealIngredients.includes(ingName)) {
      lastMealIngredients.splice(lastMealIngredients.indexOf(ingName), 1);
    }
  }
  for (let ing of currentMealIngredients) {
    if (!lastMealIngredients.includes(ing)) {
      lastMealIngredients.push(ing);
    }
  }
  return lastMealIngredients;
}


function validateAvoids(validator: Validator, plannedMeal: PlannedMeal, plannedDay: PlannedDay, errors: Error[]) {
  for (let avoid of validator.avoids) {
    if (avoid.day === plannedDay.day && avoid.mealName === plannedMeal.name && plannedMeal.ingredients.find(ing => ing.name === avoid.ing)) {
      errors.push({type: ErrorType.AVOID, day: avoid.day, meal: avoid.mealName, ing1: avoid.ing});
    }
  }
}

function validatePrioritizes(validator: Validator, plannedMeal: PlannedMeal, plannedDay: PlannedDay, errors: Error[]) {
  for (let prioritize of validator.prioritizes) {
    if (prioritize.day === plannedDay.day && prioritize.mealName === plannedMeal.name && !plannedMeal.ingredients.find(ing => ing.name === prioritize.ing)) {
      errors.push({type: ErrorType.PRIORITIZE, day: prioritize.day, meal: prioritize.mealName, ing1: prioritize.ing});
    }
  }
}

function validateCombines(validator: Validator, plannedMeal: PlannedMeal, plannedDay: PlannedDay, errors: Error[]) {
  for (let combine of validator.combines) {
    if (plannedMeal.ingredients.find(i => i.name === combine.ing1) && !plannedMeal.ingredients.find(i => i.name === combine.ing2)) {
      errors.push({type: ErrorType.COMBINE, day: plannedDay.day, meal: plannedMeal.name, ing1: combine.ing1, ing2: combine.ing2});
    }
  }
}

function validateDontCombines(validator: Validator, plannedMeal: PlannedMeal, plannedDay: PlannedDay, errors: Error[]) {
  for (let dontCombine of validator.dontCombines) {
    if (plannedMeal.ingredients.find(i => i.name === dontCombine.ing1) && plannedMeal.ingredients.find(i => i.name === dontCombine.ing2)) {
      errors.push({type: ErrorType.DONT_COMBINE, day: plannedDay.day, meal: plannedMeal.name, ing1: dontCombine.ing1, ing2: dontCombine.ing2});
    }
  }
}

function validateNutrients(validator: Validator, plannedDay: PlannedDay, errors: Error[], property: string, value: number) {
  if (value < validator[property].min) {
    errors.push({type: ErrorType.LOW_NUTRIENTS_DAILY, day: plannedDay.day, nutrient: property, diff: validator[property].min - value});
  }
  if (value > validator[property].max) {
    errors.push({type: ErrorType.HIGH_NUTRIENTS_DAILY, day: plannedDay.day, nutrient: property, diff: value - validator[property].max});
  }
}

function validateDailyIngredients(validator: Validator, plannedDay: PlannedDay, errors: Error[], dailyIngredients: string[]) {
  for (let ingDaily of validator.ingDaily) {
    let repetitions = dailyIngredients.filter(ing => ing === ingDaily.ing).length;
    if (repetitions > ingDaily.max) {errors.push({type: ErrorType.HIGH_DAILY, day: plannedDay.day, ing1: ingDaily.ing, diff: repetitions - ingDaily.max});}
    if (repetitions < ingDaily.min) {errors.push({type: ErrorType.LOW_DAILY, day: plannedDay.day, ing1: ingDaily.ing, diff: ingDaily.min - repetitions});}
  }
}

function validateWeeklyIngredients(validator: Validator, errors: Error[], weeklyIngredients: string[]) {
  for (let ingWeekly of validator.ingWeekly) {
    let repetitions = weeklyIngredients.filter(ing => ing === ingWeekly.ing).length;
    if (repetitions > ingWeekly.max) {errors.push({type: ErrorType.HIGH_WEEKLY, ing1: ingWeekly.ing, diff: repetitions - ingWeekly.max});}
    if (repetitions < ingWeekly.min) {errors.push({type: ErrorType.LOW_WEEKLY, ing1: ingWeekly.ing, diff: ingWeekly.min - repetitions});}
  }
}


//Scores the plan, instead of using errors length, it is weighted by how much different it is from the requisites
//Example: having 6 times rice in a week when max is 5 is better than having 3000 calories when max is 1500
export function scorePlan(errors: Error[]) {
  let score = 0;
  for (let error of errors) {
    switch (error.type) {
      case ErrorType.COMBINE:
        score += 1;
        break;
      case ErrorType.DONT_COMBINE:
      case ErrorType.AVOID:
      case ErrorType.DONT_REPEAT:
      case ErrorType.PRIORITIZE:
        score += 2;
        break;
      case ErrorType.LOW_NUTRIENTS_DAILY:
      case ErrorType.HIGH_NUTRIENTS_DAILY:
        score += scoreNutrients(error.nutrient, error.diff);
        break;
      case ErrorType.LOW_DAILY:
      case ErrorType.HIGH_DAILY:
        score += error.diff * 3;
        break;
      case ErrorType.LOW_WEEKLY:
      case ErrorType.HIGH_WEEKLY:
        score += error.diff;
        break;
    }
  }
  return score;
}

function scoreNutrients(type: string, diff: number) {
  switch (type) {
    case "proteins":
      return diff / 3;
    case "price":
      return diff / 0.6;
    case "calories":
      return diff / 50;
  }
  return 1;
}