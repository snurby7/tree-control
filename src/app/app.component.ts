import {
  Component,
} from '@angular/core';

import {
  NestedTreeFactory,
} from './tree-control-nested/nested-tree.factory';
import {
  INestedTreeViewModel,
} from './tree-control-nested/nested-tree.view-model.interface';
import {
  TreeFactory,
} from './tree-control/tree.factory';
import {
  ITreeViewModel,
} from './tree-control/tree.view-model.interface';

const TREE_DATA = {
  Groceries: {
    'Almond Meal flour': {
      payload: {
        value: 'waffles are good',
        test2: 'cheetoh'
      }
    },
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

const NESTED_TREE_DATA = {
  Applications: {
    Calendar: 'app',
    Chrome: 'app',
    Webstorm: 'app'
  },
  Documents: {
    angular: {
      src: {
        compiler: 'ts',
        core: 'ts'
      }
    },
    material2: {
      src: {
        button: 'ts',
        checkbox: 'ts',
        input: 'ts'
      }
    }
  },
  Downloads: {
    October: 'pdf',
    November: 'pdf',
    Tutorial: 'html'
  },
  Pictures: {
    'Photo Booth Library': {
      Contents: 'dir',
      Pictures: 'dir'
    },
    Sun: 'png',
    Woods: 'jpg'
  }
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public treeVM: ITreeViewModel;
  public nestedTreeVM: INestedTreeViewModel;

  constructor(treeFactory: TreeFactory, nestedTreeFactory: NestedTreeFactory) {
    this.treeVM = treeFactory.create({
      dataSource: TREE_DATA,
      showComboBox: false,
      isViewOnly: false,
      maxNodeLevel: 3
    });

    this.nestedTreeVM = nestedTreeFactory.create({
      dataSource: NESTED_TREE_DATA
    });
  }

  public onClick(node): void {
    console.log(node);
  }
}
