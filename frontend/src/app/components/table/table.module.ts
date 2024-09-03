import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table.component';
import {LoadingComponent} from "../loading/loading.component";



@NgModule({
  declarations: [
    TableComponent
  ],
    imports: [
        CommonModule,
        LoadingComponent
    ],
  exports: [
    TableComponent
  ]
})
export class TableModule { }
