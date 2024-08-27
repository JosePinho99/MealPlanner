import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { Ingredient, IngredientType } from '../../../../../commons/interfaces';
import { StateService } from 'src/app/state.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-new-ingredient',
  templateUrl: './new-ingredient.component.html',
  styleUrls: ['./new-ingredient.component.scss']
})
export class NewIngredientComponent implements OnInit, OnChanges {
  @Input() ingredient: Ingredient;
  currentIngredients: Ingredient[];
  IngredientType = IngredientType;
  @Input() edit: boolean = false;
  @Output() processFinalized = new EventEmitter();

  constructor(
    private state: StateService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.state.ingredients.subscribe(ingredients => {
      this.currentIngredients = ingredients;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.ingredient || changes.edit) {
      if (!this.edit) {
        if (!this.state.newIngredient) {
          this.state.newIngredient = {
            name: 'New Ingredient',
            measure: 'Grams',
            referenceValue: 100,
            quantityMinimum: 50,
            quantityMaximum: 150,
            type: IngredientType.MAIN,
            allowedMeals: ['Main meal'],
            price: null,
            calories: null,
            proteins: null,
          }
        }
        this.ingredient = this.state.newIngredient;
      } else {
        let cachedEdition = this.state.editedIngredients.find(i => i.name === this.ingredient.name);
        if (!cachedEdition) {
          cachedEdition = JSON.parse(JSON.stringify(this.ingredient));
          this.state.editedIngredients.push(cachedEdition);
        }
        this.ingredient = cachedEdition;
      }
    }
  }

  save() {
    if (!this.edit) {
      this.currentIngredients.push(this.ingredient);
    }
    this.http.post('http://127.0.0.1:8000/updateIngredients/', this.currentIngredients).subscribe(_ => {
      this.state.newIngredient = null;
      this.processFinalized.emit(this.edit ? 'edit' : 'new');
    });
  }

}
