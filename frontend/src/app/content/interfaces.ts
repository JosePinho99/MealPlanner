export interface Ingredient {
  name: string,
  calories: string,
  price: string,
  measure: string,
  referenceValue: string,
  quantityMinimum: string,
  quantityMaximum: string,
  proteins: string,
  type: string,
  allowedMeals: string[]
}

export interface NewPlan {
  ingredientRestrictions:Restriction[],
  days: Day[]
}


export interface Restriction {
  element: string,
  operator: string,
  value: string[]
}

export interface Day {
  day: string,
  dailyRestrictions: Restriction[],
  meals: Meal[]
}

export interface Meal {
  name: string
  type: string,
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



