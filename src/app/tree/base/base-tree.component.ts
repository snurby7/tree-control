import {
  SelectionChange,
  SelectionModel
} from '@angular/cdk/collections';
import {
  FlatTreeControl
} from '@angular/cdk/tree';
import {
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener
} from '@angular/material';

import {
  Subscription
} from 'rxjs';

import {
  FlatNode
} from '../contracts/flat-node.interface';
import {
  Node
} from '../contracts/node.interface';
import {
  EditTreeViewModel
} from '../edit-tree-control/edit-tree.view-model';
import {
  ViewTreeViewModel
} from '../view-tree-control/view-tree.view-model';

export abstract class BaseTreeComponent implements OnInit, OnDestroy {
  public treeControl: FlatTreeControl<FlatNode>;
  public treeFlattener: MatTreeFlattener<Node, FlatNode>;
  public dataSource: MatTreeFlatDataSource<Node, FlatNode>;

  public checklistSelection = new SelectionModel<FlatNode>(true, null, true);

  public vm: EditTreeViewModel | ViewTreeViewModel = null;

  public subscriptions: Subscription[] = [];
  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  public nestedNodeMap = new Map<Node, FlatNode>();
  public flatNodeMap = new Map<FlatNode, Node>();

  public runFunctionOnNextData: () => void = null;

  public getLevel = (node: FlatNode) => node.level;
  public isExpandable = (node: FlatNode) => node.expandable;
  public getChildren = (node: Node): Node[] => node.children;
  public hasChild = (_: number, _nodeData: FlatNode) => _nodeData.expandable;
  public hasNoContent = (_: number, _nodeData: FlatNode) => _nodeData.payload === '' || _nodeData.item === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  private _transformer = (node: Node, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
      ? existingNode
      : new FlatNode();
    if (node.item.length) {
      flatNode.item = node.item;
    } else {
      flatNode.payload = node.item;
    }
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.vm.transformData(flatNode, node, level);
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  public ngOnInit() {
    this.treeFlattener = new MatTreeFlattener(
      this._transformer /* Transformer is a declared as a lambda to keep proper context */,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );
    this.treeControl = new FlatTreeControl<FlatNode>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );

    this.subscriptions.push(
      this.vm.collapseExpandAll.subscribe((collapse: boolean) => {
        if (collapse) {
          this.treeControl.collapseAll();
        } else {
          this.treeControl.expandAll();
        }
      })
    );

    this.subscriptions.push(
      this.checklistSelection.changed.subscribe(
        (event: SelectionChange<any>) => {
          this.vm.updateSelectedNodes(event);
        }
      )
    );

    this.subscriptions.push(
      this.vm.dataSource.subscribe((dataSource: any[]) => {
        this.dataSource.data = dataSource || [];
        if (this.runFunctionOnNextData) {
          this.runFunctionOnNextData();
          this.runFunctionOnNextData = null;
        }
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  /** Whether all the descendants of the node are selected */
  public descendantsAllSelected(node: FlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
  }

  /** Whether part of the descendants are selected */
  public descendantsPartiallySelected(node: FlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child =>
      this.checklistSelection.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  public selectionToggle(node: FlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
  }
}
