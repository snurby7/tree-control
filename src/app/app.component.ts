import {
  Component
} from '@angular/core';

import {
  BehaviorSubject
} from 'rxjs';

import {
  EditTreeFactory,
  IEditTreeViewModel,
  ViewTreeFactory,
  ViewTreeViewModel
} from './tree';


const TREE_DATA = {
  Groceries: {
    'Almond Meal flour': {
      payload: {
        isHidden: new BehaviorSubject<boolean>(true),
        value: 'waffles are good'
      }
    },
    'Organic eggs': null,
    'Protein Powder': null,
    Fruits: {
      Apple: null,
      Berries: ['Blueberry', 'Raspberry', 'Cheetohs'],
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
  public editTreeVM: IEditTreeViewModel;
  public viewTreeVM: ViewTreeViewModel;

  constructor(
    editTreeFactory: EditTreeFactory,
    viewTreeFactory: ViewTreeFactory
  ) {
    this.editTreeVM = editTreeFactory.create({
      dataSource: TREE_DATA
    });
    this.viewTreeVM = viewTreeFactory.create({
      dataSource: TREE_DATA
    });
  }

  public onClick(node): void {
    console.log(node);
  }
}
