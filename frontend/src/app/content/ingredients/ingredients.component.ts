import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Ingredient} from '../../../../../commons/interfaces';
import { TableColumn } from 'src/app/components/table/table.component';
import { StateService } from 'src/app/state.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.scss']
})
export class IngredientsComponent implements OnInit {

  @Input() loggedIn: boolean = false;
  @Output() newIngredientOutput = new EventEmitter;
  @Output() editIngredientOutput = new EventEmitter;

  ingredients: Ingredient[] = [];

  gridTemplateColumns: string;
  tableColumns: TableColumn[] = [];

  constructor(
    private state: StateService,
    private http: HttpClient) { }

  ngOnInit(): void {
    this.state.ingredients.subscribe(ingredients => {
      this.ingredients = ingredients;
    })

    this.tableColumns = [{property: 'name', header: 'Name'},
      {property: 'type', header: 'Type'},
      {property: 'allowedMeals', header: 'Allowed meals', value: (row: Ingredient) => row.allowedMeals.join(' , ')},
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

  deleteIngredient(ingredient: Ingredient) {
    let index = this.ingredients.indexOf(ingredient);
    this.ingredients.splice(index, 1);
    this.http.post('http://127.0.0.1:8000/updateIngredients/', this.ingredients).subscribe(_ => {
      this.state.newIngredient = null;
    });
  }
}
