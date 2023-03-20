export interface Ingredient {
  id?: number,
  name: string,
  type: IngredientType,
  mealTypes: MealType[],
  calories: number,
  protein: number,
  price: number,
}

export enum MealType {
  BREAKFAST = 'Breakfast',
  LUNCH = 'Lunch',
  DINNER = 'Dinner',
  SNACK = 'Snack'
}

export enum IngredientType {
  PRIMARY = 'Primary',
  SECONDARY = 'Secondary',
  EXTRA = 'Extra'
}