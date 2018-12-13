import {
  NgModule,
} from '@angular/core';
import {
  BrowserModule,
} from '@angular/platform-browser';

import {
  AppComponent,
} from './app.component';
import {
  NestedTreeModule,
} from './tree-control-nested/nested-tree.module';
import {
  TreeModule,
} from './tree-control/tree.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    TreeModule,
    NestedTreeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
