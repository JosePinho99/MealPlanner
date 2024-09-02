import {Component, OnInit} from '@angular/core';
import { StateService } from './state.service';
import {LogCredentials} from "./types/user";
import {LogInService} from "./api/log-in.service";
import {IngredientsService} from "./api/ingredients.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private state: StateService,
    private logInService: LogInService,
    private ingredientsService: IngredientsService
  ) { }

  loadingPage: boolean = false;
  displayLoginModal: boolean = false;
  loggedUser: string;

  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.loadingPage = true;
      this.logInService.verifyToken(localStorage.getItem('token')).subscribe(response =>  {
        if (response.success) {
          this.loggedUser = response['username'];
        }
        this.getUserData();
      });
    } else {
      this.getUserData();
    }
  }

  login(credentials: LogCredentials) {
    localStorage.setItem('token', credentials.token);
    this.displayLoginModal = false;
    this.loggedUser = credentials.username;
    this.getUserData();
  }

  logOut() {
    this.loggedUser = '';
    localStorage.removeItem('token');
    this.getUserData();
  }



  getUserData() {
    this.loadingPage = true;
    this.ingredientsService.getIngredients().subscribe(ingredients => {
      if (ingredients) {
        this.state.setIngredients(ingredients);
        this.loadingPage = false;
      }
      //TODO deal with error other than infinite loading (toastr?)
    });
  }
}
