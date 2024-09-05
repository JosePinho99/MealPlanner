import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {GeneratedPlan, Meal, PlannedDay, PlannedMeal} from "../../../../../commons/interfaces";

@Component({
  selector: 'app-generated-plan',
  templateUrl: './generated-plan.component.html',
  styleUrls: ['./generated-plan.component.scss']
})
export class GeneratedPlanComponent implements OnInit, OnChanges {

  @Input() plan: GeneratedPlan;


  teste: string;

  mealList: string[];
  constructor() { }

  ngOnInit(): void {
    this.mealList = this.plan.plannedDays[0].meals.map(m => m.name);
  }

  ngOnChanges() {
    console.log(this.plan);
    this.teste = JSON.stringify(this.plan);
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
}
