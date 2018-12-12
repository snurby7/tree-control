import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatTreeModule,
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TreeComponent } from './tree.component';
import { TreeFactory } from './tree.factory';

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
  exports: [TreeComponent],
  declarations: [TreeComponent],
  entryComponents: [TreeComponent],
  providers: [TreeFactory],
})
export class TreeModule { }
