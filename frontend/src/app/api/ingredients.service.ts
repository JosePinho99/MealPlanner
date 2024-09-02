import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError, map, of} from "rxjs";
import {Ingredient} from "../../../../commons/interfaces";

@Injectable({
  providedIn: 'root'
})
export class IngredientsService {

  constructor(private http: HttpClient) {
  }

  //TODO - migrate default ingredients
  //       develop toastr for errors
  //       cancel buttons on create and edit
  //       create and edit (when not logged)
  //       create and edit (when logged)


  getIngredients() {
    return this.http.get<Ingredient[]>("http://localhost:3000/ingredients", {headers: {'token': localStorage.getItem('token') ?? 'none'}}).pipe(
      catchError(_ => of(null))
    );
  }
}
