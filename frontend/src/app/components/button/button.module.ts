import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button.component';
import {LoadingComponent} from "../loading/loading.component";



@NgModule({
  declarations: [
    ButtonComponent
  ],
    imports: [
        CommonModule,
        LoadingComponent
    ],
  exports: [
    ButtonComponent
  ]
})
export class ButtonModule { }
