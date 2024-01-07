import { Component, OnInit } from '@angular/core';
import { StateService } from './state.service';
import { HttpClient } from '@angular/common/http';
import { Ingredient } from './content/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private state: StateService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.http.get('http://127.0.0.1:8000/getIngredients/').subscribe((ingredients: any[]) => {
      let tempIngredients: Ingredient[] = [];
      for (let ing of ingredients) {
        tempIngredients.push(
          {
            name: ing.name, calories: ing.calories, proteins: ing.proteins, price: ing.price,
            measure: ing.measure, referenceValue: ing.referenceValue, type: ing.type, allowedMeals: ing.allowedMeals,
            quantityMaximum: ing.quantityMaximum, quantityMinimum: ing.quantityMinimum
        }
        )
      }
      this.state.setIngredients(tempIngredients);

    });
  }
}
