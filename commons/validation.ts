import { ErrorType, Operator, PlannedDay, Restriction, Validator, ValidatorLimits, Error, PlannedMeal, MealType, Ingredient } from "./interfaces";


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
    if (restriction.element === "All") {
      for (let ingredient of ingredients) {
        
      }
    } 

    let limits: ValidatorLimits = {max: Number.MAX_VALUE, min: 0};
    fillValidatorObject(limits, restriction, Operator.MoreThanDaily, Operator.LessThanDaily, Operator.BetweenDaily);
    validatorObject.ingDaily.push({...limits, ing: restriction.element});

    limits = {max: Number.MAX_VALUE, min: 0};
    fillValidatorObject(limits, restriction, Operator.MoreThanWeekly, Operator.LessThanWeekly, Operator.BetweenWeekly);
    if (limits) { validatorObject.ingWeekly.push({...limits, ing: restriction.element}); }

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
      validatorObject.dontRepeats.push(restriction.element);
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
export function validatePlan(plan: PlannedDay[], validator: Validator) {
  const errors: Error[] = [];
  let weeklyIngredients: string[] = [];
  let lastMealIngredients = new Map<MealType, string[]>();
  plan.forEach(plannedDay=> {
    let dailyCals = 0;
    let dailyPrice = 0;
    let dailyProteins = 0;
    let dailyIngredients: string[] = [];
    plannedDay.meals.forEach(plannedMeal => {
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