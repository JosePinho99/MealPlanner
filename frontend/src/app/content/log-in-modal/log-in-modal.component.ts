import {Component, EventEmitter, HostListener, Output} from '@angular/core';
import {ButtonModule} from "../../components/button/button.module";
import {InputModule} from "../../components/input/input.module";
import {NgIf, NgStyle} from "@angular/common";
import {LogCredentials} from "../../types/user";
import {LogInService} from "../../api/log-in.service";
import {Validator, validatorEmail, validatorRequired} from "../../components/input/input.types";

enum SignInMode {
  LOG_IN,
  REGISTER
}

@Component({
  selector: 'app-log-in-modal',
  standalone: true,
  imports: [ButtonModule, InputModule, NgIf, NgStyle],
  templateUrl: './log-in-modal.component.html',
  styleUrl: './log-in-modal.component.scss'
})
export class LogInModalComponent {
  SignInMode = SignInMode;
  selectedMode: SignInMode = SignInMode.LOG_IN;

  logInForm = {email: '', password: '', valid: false};
  registerForm = {email: '', username: '', password: '', confirmPassword: '', valid: false};
  vRequired = validatorRequired;
  vEmail = validatorEmail;
  vPassword: Validator = {errorMessage: 'Needs to have more than 7 characters', validationFunction: (value) => value.length > 7};
  errorMessage: string = '';
  loadingSignIn: boolean = false;

  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() login: EventEmitter<LogCredentials> = new EventEmitter();

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.close.emit();
    } else if (event.key === 'Enter') {
      switch (this.selectedMode) {
        case SignInMode.LOG_IN:
          return this.logIn();
        case SignInMode.REGISTER:
          return this.register();
      }
    }
  }

  constructor(private logInService: LogInService) {}

  logIn() {
    this.loadingSignIn = true;
    this.logInService.logIn(this.logInForm.email, this.logInForm.password).subscribe(response => {
      if (response.success) {
        this.login.emit({username: response['username'], token: response['token']});
      } else {
        this.errorMessage = response['error'];
      }
      this.loadingSignIn = false;
    });
  }


  register() {
    if (this.registerForm.password !== this.registerForm.confirmPassword) {
      this.errorMessage = "Passwords do not match";
      return;
    }
    this.loadingSignIn = true;
    this.logInService.register(this.registerForm.email, this.registerForm.username, this.registerForm.password).subscribe(response => {
      if (response.success) {
        this.login.emit({username: this.registerForm.username, token: response['token']});
      } else {
        this.errorMessage = response['error'];
      }
      this.loadingSignIn = false;
    });
  }

  cleanForms() {
    this.logInForm = {email: '', password: '', valid: false};
    this.registerForm = {email: '', username: '', password: '', confirmPassword: '', valid: false};
    this.errorMessage = '';
  }
}
