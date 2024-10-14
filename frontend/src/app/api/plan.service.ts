import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError, map, of} from "rxjs";
import {GeneratedPlan, Ingredient, NewPlan} from "../../../../commons/interfaces";

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  constructor(private http: HttpClient) {}

  getPlans() {
    return this.http.get<GeneratedPlan[]>('http://localhost:3000/plans', {headers: {'token': localStorage.getItem('token') ?? 'none'}}).pipe(
      map(plans => plans.map(p => p['plan'])),
      catchError(msg => of(null))
    );
  }

  generatePlan(plan: NewPlan, ingredients: Ingredient[]) {
    return this.http.post<string>('http://localhost:3000/plans', [plan, ingredients]).pipe(
      map(response => ({success: true, plan: response})),
      catchError(msg => of({success: false, error: msg.error}))
    );
  }

  savePlan(plan: GeneratedPlan, planName: string) {
    return this.http.post<string>('http://localhost:3000/plans/save', {...plan, name: planName}, {headers: {'token': localStorage.getItem('token') ?? 'none'}}).pipe(
      map(response => ({success: true})),
      catchError(msg => of({success: false, error: msg.error}))
    );
  }
}
