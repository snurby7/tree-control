import {
  NestedTreeControl,
} from '@angular/cdk/tree';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  MatTreeNestedDataSource,
} from '@angular/material';
import {
  Subscription,
} from 'rxjs';

import {
  NestedFileNode,
} from './contracts/nested-node.interface';
import {
  NestedTreeViewModel,
} from './nested-tree.view-model';

@Component({
  selector: 'app-tree-nested',
  templateUrl: 'nested-tree.component.html'
})
export class NestedTreeComponent implements OnInit, OnDestroy {
  @Input() vm: NestedTreeViewModel;

  private _subscriptions: Subscription[] = [];

  nestedTreeControl: NestedTreeControl<NestedFileNode>;
  nestedDataSource: MatTreeNestedDataSource<NestedFileNode>;
  hasNestedChild = (_: number, nodeData: NestedFileNode) => !nodeData.type;

  private _getChildren = (node: NestedFileNode) => node.children;
  constructor() {
    this.nestedTreeControl = new NestedTreeControl<NestedFileNode>(
      this._getChildren
    );
    this.nestedDataSource = new MatTreeNestedDataSource();
  }

  public ngOnInit(): void {
    this._subscriptions.push(
      this.vm.dataSource.subscribe((dataSource: any) => {
        if (!dataSource) {
          return;
        }
        this.nestedDataSource.data = dataSource;
      })
    );
  }

  public ngOnDestroy(): void {
    this._subscriptions.forEach(x => x.unsubscribe());
  }
}
