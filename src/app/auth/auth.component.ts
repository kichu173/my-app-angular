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
        (errMessage) => {// throwError(errorMessage) will be gettin here.
          console.log(errMessage);
          this.error = errMessage;
          // this.showAlert(errMessage); // this is for dynamic component loading using imperative(programmatic approach rather using declarative(*ngIf) easy approach).
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

//* Creating a component programmatic (managing creation, showing component on demand and deletion). Goal is to dynamically create alert component using code.
//   private showErrorAlert(message: string) {
//      const alertCmp = new AlertComponent();//* valid typescript code but not valid angular code(so avoid it).
//     const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory( //* best way to instanstiate component(componentFactoryResolver) in angular.
//       AlertComponent
//     );
//     const hostViewContainerRef = this.alertHost.viewContainerRef;//* ViewContainerRef managed by angular which give a pointer to place in DOM. Create a utility helper directive -> PlaceHolderDirective.
//     hostViewContainerRef.clear();//* simply clears all angular components that have been rendered in that place before. Clear something if exsists to render something new.

//     const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);//* This line will create a new component in that place we pointed in DOM using viewContainerRef Object.
//*     Angular 9 or Higher -> entryComponents works out of the box, but if you get error then declare in app.module.ts @NgModule({entryComponents:[AlertComponent]})

//*     How can we now pass data into that component or listen to an event or remove that? Below code is to interact with the component(AlertComponent) properties.
//     componentRef.instance.message = message;
//     this.closeSub = componentRef.instance.close.subscribe(() => {
//       this.closeSub.unsubscribe();//* to clear the subscription as we know this component will be removed.
//       hostViewContainerRef.clear();
//     });
//   }

//   ngOnDestroy() {//* to clear above closeSubscription even if authComponent is destroyed.
//     if (this.closeSub) {
//       this.closeSub.unsubscribe();
//     }
//   }
}
