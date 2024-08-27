export interface Ingredient {
  name: string,
  calories: number,
  price: number,
  measure?: string,
  referenceValue?: number,
  quantityMinimum?: number
  quantityMaximum?: number,
  proteins: number,
  type: IngredientType,
  allowedMeals: (string | MealType)[],
  quantity?: number
}

export interface NewPlan {
  ingredientRestrictions: Restriction[],
  dailyRestrictions: Restriction[],
  meals: Meal[],
}

export interface Restriction {
  element: string,
  operator: Operator,
  value?: string[]
}

export enum Operator {
  MoreThan = "more than",
  LessThan = "less than",
  Between = "between",
  MoreThanWeekly = "more than (weekly)",
  LessThanWeekly = "less than (weekly)",
  BetweenWeekly = "between (weekly)",
  MoreThanDaily = "more than (daily)",
  LessThanDaily = "less than (daily)",
  BetweenDaily = "between (daily)",
  Prioritize = "prioritize",
  Avoid = "avoid",
  Combine = "combine with",
  DontCombine = "don't combine with",
  DontRepeatInARow = "don't repeat in a row"
}

export interface Meal {
  name: string
  type: string | MealType,
  mIMin: number,
  mIMax: number,
  sIMin: number,
  sIMax: number,
  eIMin: number,
  eIMax: number,
}

export enum IngredientType {
  MAIN = 'Main',
  SECONDARY = 'Secondary',
  EXTRA = 'Extra'
}

export enum MealType {
  MAIN = 'Main meal',
  SECONDARY = 'Secondary meal',
  SNACK = 'Extra meal'
}

//For the backend generated plan
export interface PlannedDay {
  day: string,
  meals: PlannedMeal[]
}

export interface PlannedMeal {
  name: string,
  ingredients: Ingredient[]
}


export interface Validator {
  calories: ValidatorLimits,
  price: ValidatorLimits,
  proteins: ValidatorLimits,
  ingWeekly: ValidatorLimits[],
  ingDaily: ValidatorLimits[],
  prioritizes: ValidatorPrioritizes[],
  avoids: ValidatorPrioritizes[],
  combines: ValidatorCombines[],
  dontCombines: ValidatorCombines[]
  dontRepeats: string[];
}

export interface ValidatorLimits {
  min: number,
  max: number,
  ing?: string
}

export interface ValidatorPrioritizes {
  ing: string,
  day: string,
  mealName: string
}

export interface ValidatorCombines {
  ing1: string,
  ing2: string,
}

export interface ValidationError {
  type: string
}


export interface Error {
  type: ErrorType;
  day?: string,
  meal?: string,
  ing1?: string,
  ing2?: string,
  nutrient?: string,
  diff?: number
}


export enum ErrorType {
  AVOID="avoid",
  PRIORITIZE="prioritize",
  LOW_NUTRIENTS_DAILY="low_nutrients_daily", 
  HIGH_NUTRIENTS_DAILY="high_nutrients_daily", 
  LOW_DAILY="lowDaily",
  HIGH_DAILY="highDaily",
  LOW_WEEKLY="lowWeekly",
  HIGH_WEEKLY="highWeekly",
  COMBINE="combine",
  DONT_COMBINE="dontCombine",
  DONT_REPEAT="dontRepeat"
}