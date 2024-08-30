import {Component, OnInit} from '@angular/core';
import { StateService } from './state.service';
import {LogCredentials} from "./types/user";
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
  displayLoginModal: boolean = false;
  loggedUser: string;

  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.loadingPage = true;
      this.logInService.verifyToken(localStorage.getItem('token')).subscribe(response =>  {
        if (response.success) {
          this.loggedUser = response['username'];
        }
        this.loadingPage = false;
      });
    }
    this.state.setIngredients();
  }



  login(credentials: LogCredentials) {
    //TODO Recover password
    //TODO Backend for above things
    console.log(credentials);
    localStorage.setItem('token', credentials.token);
    this.displayLoginModal = false;
    this.loggedUser = credentials.username;
  }


  getUserData() {
    this.loadingPage = true;
    setTimeout(() => {
      this.loadingPage = false
    }, 500);
  }

  logOut() {
    this.loggedUser = '';
    localStorage.removeItem('token');
  }
}
