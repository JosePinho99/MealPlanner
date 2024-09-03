import {Component, Input, OnInit} from '@angular/core';
import {GeneratedPlan, Ingredient} from '../../../../../commons/interfaces';
import {StateService} from "../../state.service";
import {IngredientsService} from "../../api/ingredients.service";

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

  loadingIngredients: boolean = false;
  TabType = TabType;
  tabs: Tab[] = [
    {name: 'Ingredients', type: TabType.INGREDIENTS},
    {name: 'New Plan', type: TabType.NEW_PLAN},
  ];
  selectedTab: Tab = this.tabs[0];
  currentIngredients: Ingredient[];

  constructor(
    private state: StateService,
    private ingredientsService: IngredientsService
  ) { }

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
    const index = this.tabs.indexOf(this.selectedTab);
    this.tabs.splice(index, 1);
    this.selectedTab = this.tabs[0];
    if (action !== "cancel") {
      this.updateIngredients();
    }
  }

  updateIngredients() {
    this.loadingIngredients = true;
    this.ingredientsService.getIngredients().subscribe(ingredients => {
      if (ingredients) {
        this.state.setIngredients(ingredients);
        this.loadingIngredients = false;
      }
      //TODO deal with error other than infinite loading (toastr?)
    });
  }

  generatedPlan(plan: GeneratedPlan) {
    const planTab = {name: plan.name, type: TabType.GENERATED_PLAN, data: plan};
    this.tabs.push(planTab);
    this.selectedTab = planTab;
  }
}
