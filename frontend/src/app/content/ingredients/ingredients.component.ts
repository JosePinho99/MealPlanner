import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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

  @Output() newIngredientOutput = new EventEmitter;
  @Output() editIngredientOutput = new EventEmitter;

  ingredients: Ingredient[] = [];

  tableColumns: TableColumn[] = [
    {property: 'name', header: 'Name'},
    {property: 'price', header: 'Price'},
    {property: 'calories', header: 'Calories'},
    {property: 'proteins', header: 'Proteins'},
    {property: '', header: 'Actions'},
  ];

  constructor(
    private state: StateService,
    private http: HttpClient) { }

  ngOnInit(): void {
    this.state.ingredients.subscribe(ingredients => {
      this.ingredients = ingredients;
    })
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
