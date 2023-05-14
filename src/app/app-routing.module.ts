import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import {AuthComponent} from "./auth/auth.component"

const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  //Recipes related routes are shifted to recipes-routing.module.ts
  //Shopping related routes are shifted to shopping.module.ts since it is already small lines of code reusing it else you can create a separate file.
  { path: 'auth', component: AuthComponent },
  //{ path: 'recipes', loadChildren: './recipes/recipes.module#RecipesModule' },//** 2.lazy loading registering here with loadChildren in app.routing.module.ts **
  // alternate syntax for newer versions lazy loading loadChildren is below commented for reference(modern approach)
  // after writing code here,remove recipes module from app.module.ts imports array and import, comments are written there for future reference.
  {
    path: 'recipes',
    loadChildren: () =>
      import('./recipes/recipes.module').then((m) => {
        return m.RecipesModule;
      }),
  },
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})],// Preloading lazy-loaded code, if you want to optimize lazy loading and you want to ensure that bundle downloads and parses are preloaded and as fast as possible.
    exports: [RouterModule]// exports here is declared in app.module.ts -> imports[].
})
export class AppRoutingModule { }