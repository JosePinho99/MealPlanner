import { Component, Input, OnInit } from '@angular/core';
import { NewPlan, Operator, Restriction } from '../../../../../../commons/interfaces';
import { StateService } from 'src/app/state.service';



@Component({
  selector: 'app-restriction-line',
  templateUrl: './restriction-line.component.html',
  styleUrls: ['./restriction-line.component.scss']
})
export class RestrictionLineComponent implements OnInit {
  @Input() isIngredient: boolean = false;
  @Input() restriction: Restriction = {element: 'none', operator: Operator.Avoid, value: ['none']};
  @Input() newPlan = {} as NewPlan;

  operators = [];
  values = [];
  days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  subSelections: string[][] = [];

  constructor(
    private state: StateService) { }


  ngOnInit(): void {
    for (let day of this.days) {
      let subSelection = [];
      for (let meal of this.newPlan.meals) {
        subSelection.push(day.substring(0,3).toUpperCase() + " " + meal.name);
      }
      this.subSelections.push(subSelection);
    }

    if (this.isIngredient) {
      this.state.ingredients.subscribe(ingredients => {
        this.values = ["All"].concat(ingredients.map(ing => ing.name));
      })
      this.setOperatorsForSelection(this.restriction.element);
    } else {
      this.values = ['calories', 'proteins', 'price']
      this.operators = [Operator.MoreThan, Operator.LessThan, Operator.Between];
    }
  }

  updateNumericInput(value: number, index: number) {
      this.restriction.value[index] = value.toString();
  }

  changeOperator(operator: Operator) {
    this.restriction.operator = operator;
    this.restriction.value = [];
  }

  changeElement(value) {
    this.restriction.element = value;
    this.setOperatorsForSelection(value);
  }

  setOperatorsForSelection(value) {
    if (value === "All") {
      this.operators = [Operator.MoreThan, Operator.LessThan, Operator.Between, Operator.DontRepeatInARow];
    } else {
      this.operators = [Operator.MoreThan, Operator.LessThan, Operator.Between, Operator.Prioritize, Operator.Avoid, Operator.Combine, Operator.DontCombine, Operator.DontRepeatInARow];
    }
  }
}
