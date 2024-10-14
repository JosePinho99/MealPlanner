import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { Ingredient, IngredientType } from '../../../../../commons/interfaces';
import { StateService } from 'src/app/state.service';
import {Validator, validatorPositive, validatorRequired} from "../../components/input/input.types";
import {IngredientsService} from "../../api/ingredients.service";

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

  vRequired = validatorRequired;
  vPositive = validatorPositive;
  vNameExists: Validator = {errorMessage: 'Name already exists', validationFunction: (value) => !this.currentIngredients.find(i => i.name === value)};
  loading: boolean = false;
  formError: string;
  formActivated: boolean = false;

  constructor(
    private state: StateService,
    private ingredientsService: IngredientsService
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
    this.formActivated = true;
    if (!this.edit && this.currentIngredients.find(i => i.name === this.ingredient.name)) {
      this.formError = "Incorrect fields";
      return;
    }

    const request = this.edit ?
      this.ingredientsService.editIngredient(this.ingredient) :
      this.ingredientsService.createIngredient(this.ingredient);

    this.loading = true;
    request.subscribe(response => {
      if (response.success) {
        if (this.edit) {
          let cachedIngredient = this.state.editedIngredients.find(i => i.name === this.ingredient.name);
          this.state.editedIngredients.splice(this.state.editedIngredients.indexOf(cachedIngredient), 1);
        } else {
          this.state.newIngredient = null;
        }
        this.processFinalized.emit(this.edit ? 'edit' : 'new');
      } else {
        this.formError = response['error'];
      }
      this.loading = false;
    });
  }

  cancel() {
    this.processFinalized.emit('cancel');
  }

  validateQuantities() {
    return Number(this.ingredient.quantityMinimum) > Number(this.ingredient.quantityMaximum);
  }
}
