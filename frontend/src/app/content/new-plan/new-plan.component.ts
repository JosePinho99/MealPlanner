import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {GeneratedPlan, Ingredient, Meal, NewPlan, Operator, Restriction} from '../../../../../commons/interfaces';
import { defaultNewPlan } from '../utils';
import { StateService } from 'src/app/state.service';
import { HttpClient } from '@angular/common/http';

enum SubTab {
  GENERAL,
  MEAL
}

@Component({
  selector: 'app-new-plan',
  templateUrl: './new-plan.component.html',
  styleUrls: ['./new-plan.component.scss']
})
export class NewPlanComponent implements OnInit {
  subTabs = SubTab;
  selectedSubTab = SubTab.GENERAL;
  selectedMeal: Meal;
  ingredientTypes = ['Main ingredients', 'Secondary ingredients', 'Extra ingredients']
  newPlan = {} as NewPlan;
  dailyRestrictions: Restriction[] = [];
  dailyMeals: Meal[] = [];
  ingredients: Ingredient[] = [];
  planName: string = 'New plan';

  @Output() generatedPlan = new EventEmitter<GeneratedPlan>();

  constructor(private state: StateService,
    private http: HttpClient) { }

  ngOnInit(): void {
    this.state.ingredients.subscribe(ingredients => {
      this.ingredients = ingredients;
    });
    if (!this.state.newPlan) {
      this.state.newPlan = defaultNewPlan();
    }
    this.newPlan = this.state.newPlan;
    this.getDailyRestrictionsAndMeals();
  }

  changeSubTab(subTab: SubTab) {
    this.selectedSubTab = subTab;
  }


  addIngredientRestriction() {
    this.newPlan.ingredientRestrictions.push(
      {element: 'rice', operator: Operator.MoreThan, value: ['2']}
    );
  }

  deleteIngredientRestriction(index: number) {
    this.newPlan.ingredientRestrictions.splice(index, 1);
  }


  getDailyRestrictionsAndMeals() {
    this.dailyRestrictions = this.newPlan.dailyRestrictions;
    this.dailyMeals = this.newPlan.meals;
    this.selectedMeal = this.dailyMeals[0];
  }

  addDailyRestriction() {
    this.dailyRestrictions.push(
      {element: 'Calories', operator: Operator.Between, value: ['2000', '2500']}
    );
  }

  deleteDailyRestriction(index: number) {
    this.dailyRestrictions.splice(index, 1);
  }

  addMeal(index: number) {
    let newMeal = {name: 'new meal', type: 'Main meal', mIMin: 1, mIMax: 2, sIMin: 2, sIMax: 6, eIMin: 0, eIMax: 3};
    this.dailyMeals.splice(index + 1, 0, newMeal);
    this.selectedMeal = newMeal;
  }

  deleteMeal(index: number) {
    if (this.dailyMeals[index].name === this.selectedMeal.name) {
      this.dailyMeals.splice(index, 1);
      this.selectedMeal = this.dailyMeals[0];
    } else {
      this.dailyMeals.splice(index, 1);
    }
  }

  ingredientTypeRestriction(ingredientType: string, suffix: string) {
    let prefix = ingredientType === 'Main ingredients' ? 'mI' : ingredientType === 'Secondary ingredients' ? 'sI' : 'eI';
    return this.dailyMeals.find(dailyMeal => dailyMeal.name === this.selectedMeal.name)[prefix + suffix];
  }

  changeIngredientTypeRestriction(value: number, ingredientType: string, suffix: string) {
    let prefix = ingredientType === 'Main ingredients' ? 'mI' : ingredientType === 'Secondary ingredients' ? 'sI' : 'eI';
    this.dailyMeals.find(dailyMeal => dailyMeal.name === this.selectedMeal.name)[prefix + suffix] = value ;
  }


  save() {
    this.http.post('http://localhost:3000/createPlan', [this.newPlan, this.ingredients]).subscribe((plan: GeneratedPlan) => {
      console.log(plan);
      this.generatedPlan.emit(plan);
    });
  }
}
