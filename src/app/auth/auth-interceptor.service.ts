import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpParams
} from '@angular/common/http';
import { take, exhaustMap } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.user.pipe(
      take(1),// * take is called as a function and you simply pass a number to it and I pass one here and what this tells RxJS is that I only want to take one value from that observable and therafter, it should automatically unsubscribe.
      exhaustMap(user => {//* v16(Authentication section) - exhaustMap - It combines two observable, waits for the first observble(user observable) to complete and now we return a new observable(http observable) in there which will then replace our previous observable in that entire observable chain.
        // check to make sure this token(user object) will not apply to login/signup outgoing requests - because it is null in behavior subject at inital.
        if (!user) {
          return next.handle(req);
        }
        const modifiedReq = req.clone({
          params: new HttpParams().set('auth', user.token)
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
