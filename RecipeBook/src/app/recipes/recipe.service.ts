import { EventEmitter, Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';

@Injectable()
export class RecipeService {
  private recipes: Recipe[] = [
    new Recipe(
      'Curry',
      'Flavorful curry',
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1576&q=80',
      [
        new Ingredient('Rice', 1),
        new Ingredient('Meat', 20),
        new Ingredient('Curry Powder', 2),
      ]
    ),
    new Recipe(
      'Burger',
      'Juicy pure beef burger',
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=602&q=80',
      [new Ingredient('Bread', 2), new Ingredient('Meat', 1)]
    ),
  ];
  recipeSelected = new EventEmitter<Recipe>();

  constructor(private slService: ShoppingListService) {}

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipeById(id: number) {
    return this.recipes[id];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addMultipleIngredients(ingredients);
  }
}
