import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Meal, NewPlan, Restriction } from '../interfaces';
import { defaultNewPlan } from '../utils';
import { StateService } from 'src/app/state.service';
import { HttpClient } from '@angular/common/http';

enum SubTab {
  GLOBAL,
  DAILY
}

@Component({
  selector: 'app-new-plan',
  templateUrl: './new-plan.component.html',
  styleUrls: ['./new-plan.component.scss']
})
export class NewPlanComponent implements OnInit {
  subTabs = SubTab;
  displayDays = false;
  selectedSubTab = SubTab.GLOBAL;

  operators = ['between', 'more than', 'less than', 'mix with', 'do not mix with', 'prohibit', 'force', 'allow consecutive'];
  selectedMeal: Meal;
  ingredientTypes = ['Main ingredients', 'Secondary ingredients', 'Extra ingredients']

  newPlan = {} as NewPlan;
  selectedDay = 'All';
  confirmedDay = 'All';
  days = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  disableAllDays = false;

  dailyRestrictions: Restriction[] = [];
  dailyMeals: Meal[] = [];

  @Output() contentFullSize = new EventEmitter<boolean>();


  constructor(private state: StateService,
    private http: HttpClient) { }

  ngOnInit(): void {
    if (!this.state.newPlan) {
      this.state.newPlan = defaultNewPlan();
    }
    this.newPlan = this.state.newPlan;
    this.getDailyRestrictionsAndMeals();
  }

  changeSubTab(subTab: SubTab) {
    this.selectedSubTab = subTab;
    this.displayDays = false;
    this.contentFullSize.emit(true);
  }

  openDailyChange() {
    this.displayDays = true;
    this.contentFullSize.emit(false);
  }

  addIngredientRestriction() {
    this.newPlan.ingredientRestrictions.push(
      {element: 'rice', operator: 'more than', value: ['2']}
    );
  }

  deleteIngredientRestriction(index: number) {
    this.newPlan.ingredientRestrictions.splice(index, 1);
  }

  selectDay(day: string) {
    this.selectedDay = day;
  }

  confirmDay() {
    if (this.selectedDay !== 'All' && !this.disableAllDays) {
      this.disableAllDays = true;
      for (let day of this.days) {
        if (day !== 'All') {
          let clonedRestrictions = JSON.parse(JSON.stringify(this.newPlan.days.find(d => d.day === 'Monday').dailyRestrictions));
          let clonedMeals = JSON.parse(JSON.stringify(this.newPlan.days.find(d => d.day === 'Monday').meals));
          this.newPlan.days.find(d => d.day === day).dailyRestrictions = clonedRestrictions;
          this.newPlan.days.find(d => d.day === day).meals = clonedMeals;
        }
      }
    }
    this.confirmedDay = this.selectedDay;
    this.displayDays = false;
    this.getDailyRestrictionsAndMeals();
    this.contentFullSize.emit(true);
  }

  getDailyRestrictionsAndMeals() {
    let dayToSearch = this.confirmedDay;

    //Since every day is equal in this scenary, we pick the first one because it doesn't matter which one to pick
    if (this.confirmedDay === 'All') {
      dayToSearch = 'Monday'
    }
    this.dailyRestrictions = this.newPlan.days.find(day => day.day === dayToSearch).dailyRestrictions;
    this.dailyMeals = this.newPlan.days.find(day => day.day === dayToSearch).meals;
    this.selectedMeal = this.dailyMeals[0];
  }

  addDailyRestriction() {
    this.dailyRestrictions.push(
      {element: 'Calories', operator: 'between', value: ['2000', '2500']}
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
    this.http.post('http://127.0.0.1:8000/newPlan/', this.newPlan).subscribe(_ => console.log(_));
  }
}
