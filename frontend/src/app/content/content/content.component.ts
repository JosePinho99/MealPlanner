import {Component, Input, OnInit} from '@angular/core';
import {GeneratedPlan, Ingredient} from '../../../../../commons/interfaces';
import {StateService} from "../../state.service";

interface Tab {
  name: string,
  type: TabType,
  data ?: any
}

enum TabType {
  INGREDIENTS = 'Ingredients',
  NEW_PLAN = 'New Plan',
  NEW_INGREDIENT = 'New Ingredient',
  EDIT_INGREDIENT = 'Edit Ingredient',
  GENERATED_PLAN = 'Generated Plan'
}

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  @Input() loggedIn: boolean = false;

  TabType = TabType;
  tabs: Tab[] = [
    {name: 'Ingredients', type: TabType.INGREDIENTS},
    {name: 'New Plan', type: TabType.NEW_PLAN},
  ];
  selectedTab: Tab = this.tabs[0];
  currentIngredients: Ingredient[];

  constructor(private state: StateService,) { }

  ngOnInit(): void {
    this.state.ingredients.subscribe(ingredients => {
      this.currentIngredients = ingredients;
    });
  }

  newIngredient() {
    let newIngredientTab = this.tabs.find(t => t.type === TabType.NEW_INGREDIENT);
    if (!newIngredientTab) {
      newIngredientTab = {name: 'New Ingredient', type: TabType.NEW_INGREDIENT};
      this.tabs.push(newIngredientTab);
    }
    this.selectedTab = newIngredientTab;
  }

  editIngredient(ingredient: Ingredient) {
    let editIngredientTab = this.tabs.find(t => t.type === TabType.EDIT_INGREDIENT && t.name === ingredient.name);
    if (!editIngredientTab) {
      editIngredientTab = {name: ingredient.name, type: TabType.EDIT_INGREDIENT, data: ingredient}
      this.tabs.push(editIngredientTab);
    }
    this.selectedTab = editIngredientTab;
  }

  newPlan() {
    let newPlanTab = this.tabs.find(t => t.type === TabType.NEW_PLAN);
    if (!newPlanTab) {
      newPlanTab = {name: 'New Plan', type: TabType.NEW_PLAN};
      this.tabs.push(newPlanTab);
    }
    this.selectedTab = newPlanTab;
  }

  selectTab(tab: Tab) {
    this.selectedTab = tab;
  }

  endedAddingEditingIngredient(action: string) {
    //   this.selectedTab = {name: 'Ingredients', type: TabType.INGREDIENTS};
    //   let index = 0
    //   if (action === 'edit') {
    //     index = this.tabs.indexOf({Tab.EDIT_INGREDIENT});
    //   } else {
    //     index = this.tabs.indexOf(Tab.NEW_INGREDIENT);
    //   }
    //   this.tabs.splice(index, 1);
    // }
  }

  generatedPlan(plan: GeneratedPlan) {
    const planTab = {name: plan.name, type: TabType.GENERATED_PLAN, data: plan};
    this.tabs.push(planTab);
    this.selectedTab = planTab;
  }
}
