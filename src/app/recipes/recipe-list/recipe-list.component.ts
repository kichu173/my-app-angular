import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit,OnDestroy {
  recipes: Recipe[];
  private sub: Subscription;

  constructor(private recipeService: RecipeService) { }

  ngOnInit() {
    this.sub = this.recipeService.recipesChanged.subscribe((recipes: Recipe[]) => {
      this.recipes = recipes;
    })
    this.recipes = this.recipeService.getRecipes();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
