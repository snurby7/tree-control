import { Component } from '@angular/core';

import { TreeFactory } from './tree-control/tree.factory';
import { ITreeViewModel } from './tree-control/tree.view-model.interface';

const TREE_DATA = {
  Groceries: {
    'Almond Meal flour': null,
    'Organic eggs': null,
    'Protein Powder': null,
    Fruits: {
      Apple: null,
      Berries: ['Blueberry', 'Raspberry'],
      Orange: null
    }
  },
  Reminders: [
    'Cook dinner',
    'Read the Material Design spec',
    'Upgrade Application to Angular'
  ]
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public treeVM: ITreeViewModel;

  constructor(
    treeFactory: TreeFactory
  ) {
    this.treeVM = treeFactory.create({
      dataSource: TREE_DATA,
      showComboBox: false,
      isViewOnly: false
    });
  }
}
