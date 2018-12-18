import {
  NgModule
} from '@angular/core';
import {
  ReactiveFormsModule
} from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatTreeModule
} from '@angular/material';
import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';

import {
  EditTreeComponent
} from './edit-tree-control/edit-tree.component';
import {
  EditTreeFactory
} from './edit-tree-control/edit-tree.factory';
import {
  ViewTreeComponent
} from './view-tree-control/view-tree.component';
import {
  ViewTreeFactory
} from './view-tree-control/view-tree.factory';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatTreeModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  exports: [
    EditTreeComponent,
    ViewTreeComponent
  ],
  declarations: [
    EditTreeComponent,
    ViewTreeComponent
  ],
  entryComponents: [
    EditTreeComponent,
    ViewTreeComponent
  ],
  providers: [
    EditTreeFactory,
    ViewTreeFactory
  ],

})
export class TreeModule { }
