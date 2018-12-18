import {
  NgModule
} from '@angular/core';
import {
  BrowserModule
} from '@angular/platform-browser';

import {
  AppComponent
} from './app.component';
import {
  TreeModule
} from './tree/tree.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    TreeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
