import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { map, tap } from "rxjs/operators";

@Injectable({providedIn: 'root'})// if your service will have another service injected
export class DataStorageService {
    constructor(private http: HttpClient, private recipeService: RecipeService) {}

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        // firebase works in such way that if we send that put requests to a URL, any data its in there will be overwritten.
        this.http.put<Recipe[]>(`https://ng-angular-recipe-2022-default-rtdb.firebaseio.com/recipes.json`,
        recipes).subscribe((res) => {
            console.log(res);
        });
    }

    fetchRecipes() {
        return this.http.get<Recipe[]>(`https://ng-angular-recipe-2022-default-rtdb.firebaseio.com/recipes.json`)
            .pipe(map((data) => {
                return data.map(function (recipe) {
                    return {
                        ...recipe, // spread operator to copy all the properties of recipe/ copy all the existing data.
                        ingredients: recipe.ingredients ? recipe.ingredients : []
                    }
                })
            }),
                tap((recipes) => {
                    this.recipeService.setRecipes(recipes);
                })
            )
    }
}