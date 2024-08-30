import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, map, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LogInService {

  constructor(private http: HttpClient) { }

  verifyToken(token: string) {
    return this.http.post<string>("http://localhost:3000/auth/verifySession", {token}).pipe(
      map(username => ({success: true, username})),
      catchError(msg => of({success: false, error: msg.error}))
    );
  }

  logIn(email: string, password: string) {
    return this.http.post<string>("http://localhost:3000/auth/login", {email, password}).pipe(
      map(response => ({success: true, token: response['token'], username: response['username']})),
      catchError(msg => of({success: false, error: msg.error}))
    );
  }

  register(email: string, username: string, password: string) {
    return this.http.post<string>("http://localhost:3000/auth/register", {email, username, password}).pipe(
      map(token => ({success: true, token})),
      catchError(msg => of({success: false, error: msg.error}))
    );
  }

  sendRecoveryMail(email: string) {
    return this.http.post<string>("http://localhost:3000/auth/recoveryMail", {email}).pipe(
      map(token => ({success: true, token})),
      catchError(msg => of({success: false, error: msg.error}))
    );
  }

  changePassword(email: string, password: string) {
    return this.http.post<string>("http://localhost:3000/auth/changePassword", {email, password}).pipe(
      map(response => ({success: true, token: response['token'], username: response['username']})),
      catchError(msg => of({success: false, error: msg.error}))
    );
  }
}
