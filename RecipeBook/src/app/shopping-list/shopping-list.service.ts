import { EventEmitter } from "@angular/core";
import { Ingredient } from "../shared/ingredient.model";

export class ShoppingListService {
  ingredientsChanged = new EventEmitter<Ingredient[]>()
  private ingredients: Ingredient[] = [
    new Ingredient('apples', 5),
    new Ingredient('oranges', 2),
  ]

  getIngredients() {
    return this.ingredients.slice()
  }
  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient)
    this.ingredientsChanged.emit(this.ingredients.slice())
  }

  addMultipleIngredients(ingredients: Ingredient[]) {
    // INEFFICIENT:
    // for (let ingredient of ingredients) {
    //   this.addIngredient(ingredient)
    // }

    this.ingredients.push(...ingredients)
    this.ingredientsChanged.emit(this.ingredients.slice())
  }
}