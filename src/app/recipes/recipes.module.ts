import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
import { RecipeItemComponent } from "./recipe-list/recipe-item/recipe-item.component";
import { RecipeListComponent } from "./recipe-list/recipe-list.component";
import { RecipeStartComponent } from "./recipe-start/recipe-start.component";
import { RecipesRoutingModule } from "./recipes-routing.module";
import { RecipesComponent } from "./recipes.component";

@NgModule({
  declarations: [
    RecipesComponent,
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeItemComponent,
    RecipeStartComponent,
    RecipeEditComponent,
  ],
  imports: [//imports needed because components declared here are dependent on these modules, imports are module specific declared components.
    RouterModule,
    //CommonModule,// This unlocks ngIf and ngFor | browser module takes care of start our app and it is used only once so in app module(ngIf and ngFor)
    ReactiveFormsModule,
    RecipesRoutingModule,
    SharedModule
  ],
  //   exports: [// 2.we no need this exports, since already we are exposing components in recipes-routing module with path and its component there(RecipesRoutingModule).
  //1.To use recipes module in app module we use exports,so that we can not just use them in recipes module but in any module that imports the recipe module that could be the app module.
  //     RecipesComponent,
  //     RecipeListComponent,
  //     RecipeDetailComponent,
  //     RecipeItemComponent,
  //     RecipeStartComponent,
  //     RecipeEditComponent,
  //   ],
})
export class RecipesModule {}