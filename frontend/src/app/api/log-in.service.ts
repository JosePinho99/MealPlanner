import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LogInService {

  constructor(private http: HttpClient) { }

  logIn(username: string, password: string) {
    return this.http.get<string>("http://localhost:3000/logIn", {params: {username, password}});
  }
}
