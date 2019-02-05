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
    MenuTreeComponent
} from './menu-tree-control/menu-tree.component';
import {
    MenuTreeFactory
} from './menu-tree-control/menu-tree.factory';
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
		MenuTreeComponent,
		ViewTreeComponent
	],
	declarations: [
		MenuTreeComponent,
		ViewTreeComponent
	],
	entryComponents: [
		MenuTreeComponent,
		ViewTreeComponent
	],
	providers: [
		MenuTreeFactory,
		ViewTreeFactory
	],

})
export class TreeModule { }
