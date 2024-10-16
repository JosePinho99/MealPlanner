import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Ingredient} from '../../../../../commons/interfaces';
import {STRING_SORT_FUNCTION, TableColumn} from 'src/app/components/table/table.component';
import { StateService } from 'src/app/state.service';
import {IngredientsService} from "../../api/ingredients.service";

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.scss']
})
export class IngredientsComponent implements OnInit {

  @Input() loggedIn: boolean = false;
  @Input() loading: boolean = false;
  @Output() newIngredientOutput = new EventEmitter;
  @Output() editIngredientOutput = new EventEmitter;
  @Output() update = new EventEmitter;

  ingredients: Ingredient[] = [];
  filteredIngredients: Ingredient[] = [];

  gridTemplateColumns: string;
  tableColumns: TableColumn[] = [];
  selectedDeleteIngredient: Ingredient = null;

  constructor(
    private state: StateService,
    private ingredientsService: IngredientsService
  ) { }

  ngOnInit(): void {
    this.state.ingredients.subscribe(ingredients => {
      this.ingredients = ingredients;
      this.filter("");
    })
    this.tableColumns = [{property: 'name', header: 'Name', sort: STRING_SORT_FUNCTION},
      {property: 'type', header: 'Type', sort: STRING_SORT_FUNCTION},
      {property: 'allowedMeals', header: 'Allowed meals', value: (row: Ingredient) => row.allowedMeals.join(' , '), sort: STRING_SORT_FUNCTION},
      {property: '', header: 'Actions'}
    ];
    if (!this.loggedIn) {
      this.tableColumns.pop();
    }
    this.gridTemplateColumns = this.loggedIn ? 'auto calc(33% - 60px) calc(33% - 60px)  120px' : 'auto calc(33%) calc(33%)';
  }

  newIngredient() {
    this.newIngredientOutput.emit();
  }

  editIngredient(ingredient: Ingredient) {
    this.editIngredientOutput.emit(ingredient);
  }

  deleteIngredient() {
    this.ingredientsService.deleteIngredient(this.selectedDeleteIngredient.name).subscribe(response => {
      this.update.emit();
      this.selectedDeleteIngredient = null;
    });
  }

  filter(filterString: string) {
    this.filteredIngredients = this.ingredients.filter(ing => ing.name.toUpperCase().includes(filterString.toUpperCase()));
  }
}
