import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { ShoppingEditComponent } from "./shopping-edit/shopping-edit.component";
import { ShoppingListComponent } from "./shopping-list.component";

@NgModule({
  declarations: [ShoppingListComponent, ShoppingEditComponent],
  imports: [
    RouterModule.forChild([
      {
        path: 'shopping-list',//empty path here if you need it to lazily load as recipes does
        component: ShoppingListComponent,
      },
    ]),
    //CommonModule,// commenting commonmodule as it is exported with shared module and used as imports here.
    SharedModule,
    FormsModule,
  ],
//   exports: [ShoppingListComponent, ShoppingEditComponent], //commenting it since I am using router here.
})
export class ShoppingModule {}