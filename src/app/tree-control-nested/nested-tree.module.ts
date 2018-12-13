import {
  NgModule,
} from '@angular/core';
import {
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatTreeModule,
} from '@angular/material';
import {
  BrowserAnimationsModule,
} from '@angular/platform-browser/animations';

import {
  NestedTreeComponent,
} from './nested-tree.component';
import {
  NestedTreeFactory,
} from './nested-tree.factory';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTreeModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  exports: [NestedTreeComponent],
  declarations: [NestedTreeComponent],
  entryComponents: [NestedTreeComponent],
  providers: [NestedTreeFactory],
})
export class NestedTreeModule { }
