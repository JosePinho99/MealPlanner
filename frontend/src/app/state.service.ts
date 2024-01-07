import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Ingredient, NewPlan } from './content/interfaces';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  newPlan: NewPlan = null;
  newIngredient: Ingredient = null;
  ingredients: BehaviorSubject<Ingredient[]> = new BehaviorSubject<Ingredient[]>([]);
  constructor() { }

  setIngredients(ingredients: Ingredient[]) {
    this.ingredients.next(ingredients);
  }
}
