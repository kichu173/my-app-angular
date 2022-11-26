import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService, AuthResponseData } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    // console.log(form.value);
    if (form.invalid) {
      return;
    }  
    this.isLoading = true;

    let authObs: Observable<AuthResponseData>;

    if (this.isLoginMode) {
      authObs = this.authService.login(form.value.email, form.value.password);
    } else {
        // signup logic (Authentication - https://console.firebase.google.com/project/ng-angular-recipe-2022/authentication/users)
      authObs = this.authService.signup(form.value.email, form.value.password);
    }

    authObs.subscribe(
        (res) => {
          console.log('login or signup response payload => ',res);
          this.isLoading = false;
          this.router.navigate(['/recipes']);
        },
        (errMessage) => {
          console.log(errMessage);
          this.error = errMessage;
          this.isLoading = false;
        }
      );
    form.reset();
  }
}
