import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Ingredient, IngredientType, MealType, NewPlan } from '../../../commons/interfaces';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  newPlan: NewPlan = null;
  newIngredient: Ingredient = null;
  editedIngredients: Ingredient[] = [];

  ingredients: BehaviorSubject<Ingredient[]> = new BehaviorSubject<Ingredient[]>([]);

  constructor() { }

  setIngredients() {
    this.ingredients.next([
      {
        name: "Soja",
        calories: 322.51,
        proteins: 51.9,
        referenceValue: 100,
        quantityMinimum: 25,
        quantityMaximum: 40,
        type: IngredientType.MAIN,
        allowedMeals: [MealType.MAIN],
        price: 0.63
      },
      {
        name: "Arroz",
        calories: 349,
        proteins: 6.9,
        referenceValue: 100,
        quantityMinimum: 60,
        quantityMaximum: 80,
        type: IngredientType.SECONDARY,
        allowedMeals: [MealType.MAIN],
        price: 0.14
      },
      {
        name: "Seitan",
        calories: 179,
        proteins: 21,
        referenceValue: 100,
        quantityMinimum: 125,
        quantityMaximum: 125,
        type: IngredientType.MAIN,
        allowedMeals: [MealType.MAIN],
        price: 0.99
      },
      {
        name: "Batatas fritas",
        calories: 520,
        proteins: 6.5,
        referenceValue: 100,
        quantityMinimum: 53,
        quantityMaximum: 53,
        type: IngredientType.SECONDARY,
        allowedMeals: [MealType.MAIN],
        price: 1.00
      },
      {
        name: "Cogumelos",
        calories: 18,
        proteins: 2.4,
        referenceValue: 100,
        quantityMinimum: 92,
        quantityMaximum: 92,
        type: IngredientType.EXTRA,
        allowedMeals: [MealType.MAIN],
        price: 0.47
      },
      {
        name: "Grão de bico",
        calories: 83,
        proteins: 4.9,
        referenceValue: 100,
        quantityMinimum: 130,
        quantityMaximum: 130,
        type: IngredientType.EXTRA,
        allowedMeals: [MealType.MAIN],
        price: 0.61
      },
      {
        name: "Feijão preto",
        calories: 77,
        proteins: 6,
        referenceValue: 100,
        quantityMinimum: 130,
        quantityMaximum: 130,
        type: IngredientType.EXTRA,
        allowedMeals: [MealType.MAIN],
        price: 0.61
      },
      {
        name: "Massa",
        calories: 359,
        proteins: 13,
        referenceValue: 100,
        quantityMinimum: 100,
        quantityMaximum: 100,
        type: IngredientType.SECONDARY,
        allowedMeals: [MealType.MAIN],
        price: 0.314
      },
      {
        name: "Donuts",
        calories: 244,
        proteins: 3.3,
        referenceValue: 1,
        quantityMinimum: 2,
        quantityMaximum: 2,
        type: IngredientType.MAIN,
        allowedMeals: [MealType.SECONDARY],
        price: 0.75
      },
      {
        name: "Bollycaos",
        calories: 236,
        proteins: 4.8,
        referenceValue: 1,
        quantityMinimum: 2,
        quantityMaximum: 2,
        type: IngredientType.MAIN,
        allowedMeals: [MealType.SECONDARY],
        price: 0.75
      },
      {
        name: "Cereais",
        calories: 383,
        proteins: 6,
        referenceValue: 100,
        quantityMinimum: 75,
        quantityMaximum: 75,
        type: IngredientType.MAIN,
        allowedMeals: [MealType.SECONDARY],
        price: 0.83
      },
      {
        name: "Granola",
        calories: 422,
        proteins: 22.7,
        referenceValue: 100,
        quantityMinimum: 87,
        quantityMaximum: 87,
        type: IngredientType.MAIN,
        allowedMeals: [MealType.SECONDARY],
        price: 1.14
      },
      {
        name: "Leite proteico",
        calories: 57,
        proteins: 5,
        referenceValue: 100,
        quantityMinimum: 375,
        quantityMaximum: 375,
        type: IngredientType.SECONDARY,
        allowedMeals: [MealType.SECONDARY],
        price: 0.39
      },
      {
        name: "Leite aveia",
        calories: 46,
        proteins: 1.4,
        referenceValue: 100,
        quantityMinimum: 333,
        quantityMaximum: 333,
        type: IngredientType.SECONDARY,
        allowedMeals: [MealType.SECONDARY],
        price: 0.1
      },
      {
        name: "Shots proteina",
        calories: 58,
        proteins: 8.3,
        referenceValue: 1,
        quantityMinimum: 1,
        quantityMaximum: 1,
        type: IngredientType.MAIN,
        allowedMeals: [MealType.SNACK],
        price: 0.75
      },
      {
        name: "Almondegas",
        calories: 195,
        proteins: 20.7,
        referenceValue: 100,
        quantityMinimum: 100,
        quantityMaximum: 100,
        type: IngredientType.MAIN,
        allowedMeals: [MealType.MAIN],
        price: 2
      },
      {
        name: "Ervilhas",
        calories: 70,
        proteins: 5.1,
        referenceValue: 100,
        quantityMinimum: 100,
        quantityMaximum: 100,
        type: IngredientType.EXTRA,
        allowedMeals: [MealType.MAIN],
        price: 0.14
      },
      {
        name: "Batatas",
        calories: 86,
        proteins: 1.6,
        referenceValue: 100,
        quantityMinimum: 250,
        quantityMaximum: 250,
        type: IngredientType.SECONDARY,
        allowedMeals: [MealType.MAIN],
        price: 0.16
      },
      {
        name: "Tofu",
        calories: 111,
        proteins: 14.6,
        referenceValue: 100,
        quantityMinimum: 125,
        quantityMaximum: 125,
        type: IngredientType.MAIN,
        allowedMeals: [MealType.MAIN],
        price: 0.78
      },
      {
        name: "Bacon",
        calories: 186,
        proteins: 18,
        referenceValue: 100,
        quantityMinimum: 45,
        quantityMaximum: 45,
        type: IngredientType.EXTRA,
        allowedMeals: [MealType.MAIN],
        price: 2.8
      },
      {
        name: "Compal",
        calories: 36,
        proteins: 0.2,
        referenceValue: 1,
        quantityMinimum: 1,
        quantityMaximum: 1,
        type: IngredientType.SECONDARY,
        allowedMeals: [MealType.SECONDARY],
        price: 0.6
      }
    ])
  }
}
