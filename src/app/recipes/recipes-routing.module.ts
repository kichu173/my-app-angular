import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RecipesResolverService } from './recipes-reolver.service';
import { RecipesComponent } from './recipes.component';

const routes: Routes = [
  {
    //path: 'recipes',//! 1. lazy loading -> loads the required code content or feature module on demand when we go through or click that route. we will remove the root route here(recipes) and keep it empty and add(recipes) it in the app-routing.module.ts.
    // Initially without lazy loading we download all our code content/module in bundles (size is bigger) main.js/vendor.js/polyfills.js/styles.js.
    // Pre requisite is splitted to feature modules and separate routing config for that feature module(recipes-routing.module.ts).
    path: '',
    component: RecipesComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: RecipeStartComponent },
      { path: 'new', component: RecipeEditComponent },
      {
        path: ':id',
        component: RecipeDetailComponent,
        resolve: [RecipesResolverService],
      },
      {
        path: ':id/edit',
        component: RecipeEditComponent,
        resolve: [RecipesResolverService],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipesRoutingModule {}
