import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { User } from "./user.model";

// Response Payload - https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  
  user = new BehaviorSubject<User>(null);//* BehaviorSubject also gives subscribers immediate access to the previously emitted values even if they have'nt subscribed at the point of time that value was emitted.
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient,private router: Router) {}

  //https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
  // API_KEY - https://console.firebase.google.com/project/ng-angular-recipe-2022/settings/general | console - real time database

  //! TOKEN will expires in one hour(firebase token expiry).

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDxRSnyBUbZ4WFgpIWP19kCB7koMzElrb0`,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),// this will be executed only when any kind of error occurs from server, works well wtih throwError(returns Observable) and catchError(not returns observable).
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  // test@test.com | test123 (https://firebase.google.com/docs/reference/rest/auth#section-sign-in-email-password)
  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDxRSnyBUbZ4WFgpIWP19kCB7koMzElrb0`,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(
      new Date().getTime() + expiresIn * 1000// * timestamp(new Date().getTime()) in "ms" and expiresIn is in "seconds" which multiplies with 1000 to convert this to ms as well - which gives us expiration Date in milli seconds.
      //* Again this is wrapped inside the new Date, this will convert it back to a data object which is concrete timestamp in a date obj form and not in ms anymore.
    );
    const user = new User(
      email,
      userId,
      token,
      expirationDate
    );
    localStorage.setItem('userData', JSON.stringify(user));
    this.user.next(user);
    this.autoLogout(expiresIn * 1000); // gives in milli seconds (seconds(3600 is 1 hr) * 1000 => 3600000 ms is 1 hour)
  }

  private handleError(errorRes: HttpErrorResponse) {
    console.log(errorRes);
    
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {//if the errorRes object does'nt contain the error key or error key on error key
      return throwError(errorMessage);// this throwError will throw an observable so in component we can subscribe.
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.'
        break;
    }
    return throwError(errorMessage); 
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;

  }

  autoLogout(expirationDuration: number) {
    console.log("autoLogout() expirationDuration:: ",expirationDuration); // 3600000 ms is 1 hour
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }


  autoLogin() {// This method is called in app.component.ts inside ngOnInit(), to restore the state of app when page is reloaded.
    const userData: {// destructuring
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData'));

    if(!userData) {
      return;
    }

    // this loadedUser is for situation when page is reloaded and you want to retain the state.
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration = // (future time in ms - current time in ms)
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }
}