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

  //TODO -
  //       develop toastr for errors
  //       cancel buttons on create and edit
  //       create and edit (when not logged)
  //       create and edit (when logged)
  //       sort
  //       search


  getIngredients() {
    return this.http.get<Ingredient[]>("http://localhost:3000/ingredients", {headers: {'token': localStorage.getItem('token') ?? 'none'}}).pipe(
      catchError(_ => of(null))
    );
  }

  createIngredient(ingredient: Ingredient) {
    return this.http.post("http://localhost:3000/ingredients", ingredient,{headers: {'token': localStorage.getItem('token') ?? 'none'}}).pipe(
      map(_ => ({success: true})),
      catchError(msg => of({success: false, error: msg.error}))
    );
  }

  editIngredient(ingredient: Ingredient) {
    return this.http.put("http://localhost:3000/ingredients", ingredient,{headers: {'token': localStorage.getItem('token') ?? 'none'}}).pipe(
      map(_ => ({success: true})),
      catchError(msg => of({success: false, error: msg.error}))
    );
  }

  deleteIngredient(name: string) {
    return this.http.delete("http://localhost:3000/ingredients/" + name, {headers: {'token': localStorage.getItem('token') ?? 'none'}}).pipe(
      map(_ => ({success: true})),
      catchError(msg => of({success: false, error: msg.error}))
    );
  }
}
