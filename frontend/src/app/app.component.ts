import {Component, OnInit} from '@angular/core';
import { StateService } from './state.service';
import {LogCredentials} from "./types/user";
import {LogInService} from "./api/log-in.service";
import {IngredientsService} from "./api/ingredients.service";
import {combineLatest} from "rxjs";
import {PlanService} from "./api/plan.service";
import {GeneratedPlan} from "../../../commons/interfaces";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private state: StateService,
    private logInService: LogInService,
    private planService: PlanService,
    private ingredientsService: IngredientsService
  ) { }

  loadingPage: boolean = false;
  displayLoginModal: boolean = false;
  loggedUser: string = null;
  plans: GeneratedPlan[];

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
    this.loggedUser = null;
    localStorage.removeItem('token');
    this.getUserData();
  }



  getUserData() {
    this.loadingPage = true;
    combineLatest([this.ingredientsService.getIngredients(), this.planService.getPlans()]).subscribe(([ingredients, plans]) => {
      if (ingredients) {
        this.state.setIngredients(ingredients);
        this.loadingPage = false;
      }
      if (plans) {
        this.plans = plans;
      }
      //TODO deal with error other than infinite loading (toastr?)
    })
  }

  //TODO - Work on restriction form
  //TODO - work on meals form
  //TODO - Build plan api
  //TODO - Modal with plan errors
}
