import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('form', {static: false}) shoppingForm: NgForm
  private sub: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit() {
    this.sub = this.shoppingListService.startedEditing.subscribe((id: number) => {
      this.editedItemIndex = id;
      this.editMode = true;
      this.editedItem = this.shoppingListService.getIngredient(id);
      this.shoppingForm.setValue({
        name: this.editedItem.name,
        amount: this.editedItem.amount
      })
    });
  }

  onSubmit() {
    const val = this.shoppingForm.value;
    const newIngredient = new Ingredient(val.name, val.amount);
    if (this.editMode) {
      this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient);
    } else {
      this.shoppingListService.addIngredient(newIngredient);
    }
    this.editMode = false;
    this.shoppingForm.reset();
  }

  onClear() {
    this.shoppingForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.onClear();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
