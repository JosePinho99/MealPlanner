import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ContentComponent } from './content/content/content.component';
import { PanelModule } from './components/panel/panel.module';
import { ButtonModule } from './components/button/button.module';
import { IngredientsComponent } from './content/ingredients/ingredients.component';
import { TableModule } from './components/table/table.module';
import { SearchModule } from './components/search/search.module';
import { NewIngredientComponent } from './content/new-ingredient/new-ingredient.component';
import { NewPlanComponent } from './content/new-plan/new-plan.component';
import { SelectModule } from './components/select/select.module';
import { RestrictionLineComponent } from './content/new-plan/restriction-line/restriction-line.component';
import { InputModule } from './components/input/input.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    ContentComponent,
    IngredientsComponent,
    NewIngredientComponent,
    NewPlanComponent,
    RestrictionLineComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    PanelModule,
    ButtonModule,
    TableModule,
    SearchModule,
    SelectModule,
    InputModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
