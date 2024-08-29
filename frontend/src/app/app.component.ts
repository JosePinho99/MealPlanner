import { Component, OnInit } from '@angular/core';
import { StateService } from './state.service';
import {LogInService} from "./api/log-in.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private state: StateService,
    private logInService: LogInService
  ) { }

  loadingPage: boolean = false;

  loggedUser: string;
  displayLoginModal: boolean = false;
  loadingLogIn: boolean = false;
  username: string = '';
  password: string = '';
  logInError: string = '';

  ngOnInit() {
    this.state.setIngredients();
    // this.http.get('http://127.0.0.1:3000/getIngredients/').subscribe((ingredients: Ingredient[]) => {
    //   this.state.setIngredients(ingredients);
    // });
  }

  closeModal() {
    this.displayLoginModal = false;
  }

  logIn() {
    this.loadingLogIn = true;
    this.logInService.logIn(this.username, this.password).subscribe(response => {
      if (response === "Success") {
        this.displayLoginModal = false;
        this.logInError = '';
        this.username = '';
        this.password = '';
        this.getUserData();
      } else {
        this.logInError = response;
      }
      this.loadingLogIn = false;
    });
  }

  getUserData() {
    this.loadingPage = true;
    setTimeout(() => {
      this.loggedUser = 'Jose Pinho';
      this.loadingPage = false
    }, 500);
  }
}
