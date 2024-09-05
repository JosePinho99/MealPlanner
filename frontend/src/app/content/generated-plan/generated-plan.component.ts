import {Component, Input, OnInit} from '@angular/core';
import {GeneratedPlan, PlannedMeal} from "../../../../../commons/interfaces";

@Component({
  selector: 'app-generated-plan',
  templateUrl: './generated-plan.component.html',
  styleUrls: ['./generated-plan.component.scss']
})
export class GeneratedPlanComponent implements OnInit {

  @Input() plan: GeneratedPlan;
  searchValue: string = "";
  weekCost: number;

  mealList: string[];
  loading: boolean = false;
  constructor() { }

  ngOnInit(): void {
    this.mealList = this.plan.plannedDays[0].meals.map(m => m.name);
    this.weekCost = 0;
    for (let day of this.plan.plannedDays) {
      for (let meal of day.meals) {
        for (let ingredient of meal.ingredients) {
          this.weekCost += ingredient.price;
        }
      }
    }
  }

  getNutrientsByDay(day: string, nutrient: string, round: number) {
    const plannedDayMeals: PlannedMeal[] = this.plan.plannedDays.find(p => p.day === day).meals;
    let total = 0;
    for (let meal of plannedDayMeals) {
      for (let ing of meal.ingredients) {
        total += ing[nutrient];
      }
    }
    return total.toFixed(round);
  }

  getIngredientsForDayAndMeal(day: string, meal: string) {
    return this.plan.plannedDays.find(p => p.day === day).meals.find(m => m.name === meal).ingredients;
  }

  getIngColor(name: string) {
    return this.searchValue.length > 2 && name.toUpperCase().includes(this.searchValue.toUpperCase()) ? '#0595ff' : 'unset';
  }

  getIngFontWeight(name: string) {
    return this.searchValue.length > 2 && name.toUpperCase().includes(this.searchValue.toUpperCase()) ? 'bold' : 'unset';
  }

  save() {

  }

  discard() {

  }
}
