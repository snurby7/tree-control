import {
  SelectionChange,
  SelectionModel,
} from '@angular/cdk/collections';
import {
  NestedTreeControl,
} from '@angular/cdk/tree';
import {
  Component,
  ContentChild,
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
  templateUrl: 'nested-tree.component.html',
  styleUrls: ['./nested-tree.component.scss']
})
export class NestedTreeComponent implements OnInit, OnDestroy {
  @ContentChild('itemLeadNodeTemplate') itemLeadNodeTemplate: any;
  @ContentChild('itemNodeTemplate') itemNodeTemplate: any;

  @Input() vm: NestedTreeViewModel;

  public nestedTreeControl: NestedTreeControl<NestedFileNode>;
  public nestedDataSource: MatTreeNestedDataSource<NestedFileNode>;
  public checklistSelection = new SelectionModel<NestedFileNode>(true, null, true);

  private _subscriptions: Subscription[] = [];
  private _getChildren = (node: NestedFileNode) => node.children;

  constructor() {
    this.nestedTreeControl = new NestedTreeControl<NestedFileNode>(
      this._getChildren
    );
    this.nestedDataSource = new MatTreeNestedDataSource();
  }

  public hasNestedChild = (_: number, nodeData: NestedFileNode) => !nodeData.type && nodeData.children;
  public hasEmptyChildren = (_: number, nodeData: NestedFileNode) => nodeData.children;
  public showInput = (_: number, nodeData: NestedFileNode) => nodeData.children && nodeData.children.length === 0;

  public ngOnInit(): void {
    this._subscriptions.push(
      this.vm.dataSource.subscribe((dataSource: any) => {
        if (!dataSource) {
          return;
        }
        this.nestedDataSource.data = dataSource;
      })
    );

    this._subscriptions.push(this.checklistSelection.changed.subscribe((event: SelectionChange<any>) => {
      this.vm.updateSelectedNodes(event);
    }));
  }

  public ngOnDestroy(): void {
    this._subscriptions.forEach(x => x.unsubscribe());
  }

  public descendantsAllSelected(node: NestedFileNode): boolean {
    const descendants = this.nestedTreeControl.getDescendants(node);
    return descendants.every(child => this.checklistSelection.isSelected(child));
  }

  /** Whether part of the descendants are selected */
  public descendantsPartiallySelected(node: NestedFileNode): boolean {
    const descendants = this.nestedTreeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  public todoItemSelectionToggle(node: NestedFileNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.nestedTreeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
  }

  public addNewItem(node: NestedFileNode) {
    this.vm.insertItem(node);
  }
}
