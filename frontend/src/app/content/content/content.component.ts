import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../../../../../commons/interfaces';

enum Tab {
  INGREDIENTS = 'Ingredients',
  NEW_PLAN = 'New Plan',
  NEW_INGREDIENT = 'New Ingredient',
  EDIT_INGREDIENT = 'Edit Ingredient'
}

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  tabEnum = Tab;
  tabs: Tab[] = [Tab.INGREDIENTS, Tab.NEW_PLAN];
  selectedTab: Tab = Tab.INGREDIENTS;
  contentFullSize: boolean = true;
  ingredientToEdit: Ingredient;

  constructor() { }

  ngOnInit(): void {
  }

  newIngredient() {
    if (!this.tabs.includes(Tab.NEW_INGREDIENT)) {
      this.tabs.push(Tab.NEW_INGREDIENT);
    }
    this.selectedTab = Tab.NEW_INGREDIENT;
  }

  editIngredient(ingredient: Ingredient) {
    this.ingredientToEdit = ingredient;
    if (!this.tabs.includes(Tab.EDIT_INGREDIENT)) {
      this.tabs.push(Tab.EDIT_INGREDIENT);
    }
    this.selectedTab = Tab.EDIT_INGREDIENT;
  }

  newPlan() {
    if (!this.tabs.includes(Tab.NEW_PLAN)) {
      this.tabs.push(Tab.NEW_PLAN);
    }
    this.selectedTab = Tab.NEW_PLAN;
  }

  selectTab(tab: Tab) {
    this.selectedTab = tab;
    if (tab !== Tab.NEW_PLAN) {
      this.contentFullSize = true;
    }
  }

  endedAddingEditingIngredient(action: string) {
    this.selectedTab = Tab.INGREDIENTS;
    let index = 0
    if (action === 'edit') {
      index = this.tabs.indexOf(Tab.EDIT_INGREDIENT);
    } else {
      index = this.tabs.indexOf(Tab.NEW_INGREDIENT);
    }
    this.tabs.splice(index, 1);
  }
}
