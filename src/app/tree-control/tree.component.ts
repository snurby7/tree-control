import { SelectionChange, SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTree, MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

import { TodoItemFlatNode } from './contracts/todo-item-flat-node.interface';
import { TodoItemNode } from './contracts/todo-item-node.interface';
import { TreeViewModel } from './tree.view-model';


@Component({
  selector: 'app-tree',
  templateUrl: 'tree.component.html'
})

export class TreeComponent implements OnInit {
  @ViewChild('tree') tree: MatTree<any>;

  @Input() vm: TreeViewModel;

  public flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();
  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  public nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();
  /** A selected parent node to be inserted */
  public selectedParent: TodoItemFlatNode | null = null;
  /** The new item's name */
  public newItemName = '';
  public treeControl: FlatTreeControl<TodoItemFlatNode>;
  public treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;
  public dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;
  /** The selection for checklist */
  public checklistSelection = new SelectionModel<TodoItemFlatNode>(true, null, true);
  private _subscriptions = [];

  public getLevel = (node: TodoItemFlatNode) => node.level;
  public isExpandable = (node: TodoItemFlatNode) => node.expandable;
  public getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;
  public hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;
  public hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === '';
  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
      ? existingNode
      : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  constructor() {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }

  public ngOnInit(): void {
    this._subscriptions.push(this.vm.collapseExpandAll.subscribe((collapse: any) => {
      if (collapse) {
        this.treeControl.collapseAll();
      } else {
        this.treeControl.expandAll();
      }
    }));
    this._subscriptions.push(this.vm.dataSource.subscribe((dataSource: any) => {
      if (!dataSource) { return; }
      this.dataSource.data = dataSource;
    }));
    this._subscriptions.push(this.checklistSelection.changed.subscribe((event: SelectionChange<any>) => {
      this.vm.updateSelectedNodes(event);
    }));
  }

  /** Whether all the descendants of the node are selected */
  public descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every(child => this.checklistSelection.isSelected(child));
  }

  /** Whether part of the descendants are selected */
  public descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  public todoItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
  }

  /** Select the category so we can insert the new item. */
  public addNewItem(node: TodoItemFlatNode) {
    const parentNode = this.flatNodeMap.get(node);
    if (!parentNode) { return; }
    if (!parentNode.children) {
      parentNode.children = [];
    }
    this.vm.insertItem(parentNode, '');
    this.treeControl.expand(node);
  }

  /** Save the node to view model */
  public saveNode(node: TodoItemFlatNode, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
    if (!nestedNode) { return; }
    this.vm.updateItem(nestedNode, itemValue);
  }
}
