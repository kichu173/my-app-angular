import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ShoppingListService } from './shopping-list/shopping-list.service';
import { AppRoutingModule } from './app-routing.module';
import { AuthComponent } from './auth/auth.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
// import { RecipesModule } from './recipes/recipes.module';// comment/remove import too after doing lazy loading
import { ShoppingModule } from './shopping-list/shopping.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [// declaring same components in multiple modules is not allowed, where as rule is not same for imports and exports.
    AppComponent,
    HeaderComponent,
    AuthComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    //RecipesModule,// Including feature modules which are separated module here in app.module.ts, after implementing lazy loading you can remove from here because you are not eagerly loading that
    ShoppingModule,
    SharedModule,
  ],
  providers: [
    ShoppingListService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  // entryComponents: [ // you can remove here as it is also written in shared module and imported here.
  //   AlertComponent
  // ]
})
export class AppModule {}

/* 
Different types of module you can create:
feature module(recipes,shopping.module.ts)

shared module (common things to be shifted there and imported in created modules and app.module.ts)

core module (for services to be have in separate file, in @NgModule we declare providers array and no exports needed for services since its for global access and import here in imports array(app.module.ts)) | most times we go for @Injectable({providedIn:'root'}) and ignore providers in app.module.ts and creating core module separately. video.10 in optimizing angular apps
3.33 time
*/
