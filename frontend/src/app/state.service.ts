import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {GeneratedPlan, Ingredient, IngredientType, MealType, NewPlan} from '../../../commons/interfaces';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  newPlan: NewPlan = null;
  newIngredient: Ingredient = null;
  editedIngredients: Ingredient[] = [];

  ingredients: BehaviorSubject<Ingredient[]> = new BehaviorSubject<Ingredient[]>([]);

  constructor() { }

  setIngredients(ingredients: Ingredient[]) {
    this.ingredients.next(ingredients);
  }
}
