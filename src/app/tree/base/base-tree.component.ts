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
  Observable,
  of,
  Subscription
} from 'rxjs';

import {
  FlatNode
} from '../contracts/flat-node.interface';
import {
  Node
} from '../contracts/node.interface';
import {
  BaseTreeViewModel
} from './base-tree.view-model';

export abstract class BaseTreeComponent implements OnInit, OnDestroy {
  public treeControl: FlatTreeControl<FlatNode>;
  public treeFlattener: MatTreeFlattener<Node, FlatNode>;
  public dataSource: MatTreeFlatDataSource<Node, FlatNode>;

  public checklistSelection = new SelectionModel<FlatNode>(true, null, true);

  public vm: BaseTreeViewModel = null;

  public subscriptions: Subscription[] = [];

  // * Map from nested node to flattened node.
  // * This helps us to keep the same object for selection
  public nestedNodeMap = new Map<Node, FlatNode>();
  public flatNodeMap = new Map<FlatNode, Node>();

  public getLevel = (node: FlatNode) => node.level;
  public isExpandable = (node: FlatNode) => node.expandable;
  public getChildren = (node: Node): Observable<Node[]> => of(node.children);
  public hasChild = (_: number, _nodeData: FlatNode) => _nodeData.expandable;
  public hasNoContent = (_: number, _nodeData: FlatNode) => _nodeData.payload === '' || _nodeData.item === '';

	/**
	 * Intentionally left up here to enforce that this is not public and should be treated as a variable consumed in ngOnInit
	 * @name transformer
	 * @description Transformer to convert nested node to flat node. Record the nodes in maps for later use
	 */
  private transformer = (node: Node, level: number) => {
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

	/**
	 * *This is done in ngOnInit as the VM is an input to the component
	 * *so it needs to be initialized before we begin
	 */
  public ngOnInit() {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer, // *Transformer is a declared as a lambda to keep proper context
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
      this.checklistSelection.onChange.subscribe(
        (event: SelectionChange<any>) => {
          this.vm.updateSelectedNodes(event);
        }
      )
    );

    this.subscriptions.push(
      this.vm.dataSource.subscribe((dataSource: any[] = []) => {
        this.dataSource.data = dataSource;
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  /**
	 * @description Function here will determine if all of the descendants on the given node are selected
	 * @param node The given node you want to check the descendants on
	 * @returns True if EVERY node is selected and false otherwise
	 */
  public descendantsAllSelected(node: FlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every(child => this.checklistSelection.isSelected(child));
  }

	/**
	 * @description This is useful for determining indeterminate state if that is needed on a given node
	 * @param node The flat node of interest
	 * @returns True if some descendant is partially selected
	 */
  public descendantsPartiallySelected(node: FlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child =>
      this.checklistSelection.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

	/**
	 * @description This is to select/deselect a node and trickle that down to all the descendants
	 * @param node The node you want to select/deselect for a given record.
	 */
  public selectionToggle(node: FlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
  }
}
