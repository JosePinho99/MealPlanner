import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError, map, of} from "rxjs";
import {Ingredient, NewPlan} from "../../../../commons/interfaces";

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  constructor(private http: HttpClient) {
  }


  generatePlan(plan: NewPlan, ingredients: Ingredient[]) {
    return this.http.post<string>('http://localhost:3000/plans', [plan, ingredients]).pipe(
      map(response => ({success: true, plan: response})),
      catchError(msg => of({success: false, error: msg.error}))
    );
  }
}
