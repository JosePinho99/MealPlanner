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
    this.http.get('http://127.0.0.1:8000/getIngredients/').subscribe((ingredients: Ingredient[]) => {
      this.state.setIngredients(ingredients);
    });
  }
}
