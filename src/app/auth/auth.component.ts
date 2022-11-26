import { Component, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placholder/placeholder.directive';
import { AuthService, AuthResponseData } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
//   @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;

  constructor(private authService: AuthService, private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver) {}

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

  onHandleError() {
    // reset the error
    this.error = null;
  }

//   private closeSub: Subscription;

        // Creating a component programmatic (managing creation, showing component on demand and deletion)
//   private showErrorAlert(message: string) {
//     // const alertCmp = new AlertComponent();
//     const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(
//       AlertComponent
//     );
//     const hostViewContainerRef = this.alertHost.viewContainerRef;
//     hostViewContainerRef.clear();

//     const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);

//     componentRef.instance.message = message;
//     this.closeSub = componentRef.instance.close.subscribe(() => {
//       this.closeSub.unsubscribe();
//       hostViewContainerRef.clear();
//     });
//   }

//   ngOnDestroy() {
//     if (this.closeSub) {
//       this.closeSub.unsubscribe();
//     }
//   }
}
