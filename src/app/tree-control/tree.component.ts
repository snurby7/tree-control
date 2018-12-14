import {
  SelectionChange,
  SelectionModel,
} from '@angular/cdk/collections';
import {
  FlatTreeControl,
} from '@angular/cdk/tree';
import {
  ChangeDetectorRef,
  Component,
  ContentChild,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import {
  Subscription,
} from 'rxjs';

import {
  TodoItemFlatNode,
} from './contracts/todo-item-flat-node.interface';
import {
  TodoItemNode,
} from './contracts/todo-item-node.interface';
import {
  TreeViewModel,
} from './tree.view-model';

@Component({
  selector: 'app-tree',
  templateUrl: 'tree.component.html'
})
export class TreeComponent implements OnInit, OnDestroy {
  @ContentChild('itemTemplate') itemTemplate: any;

  @Input() vm: TreeViewModel;

  private _itemInAddState = false;
  // this is callback to store the node expansion and once the data is set it will fire
  // the callback to open that node.
  private _runFunctionOnNextData: () => void = null;
  private _nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();
  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  private _flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();
  private _subscriptions: Subscription[] = [];

  /** A selected parent node to be inserted */
  public selectedParent: TodoItemFlatNode | null = null;
  /** The new item's name */
  public newItemName = '';

  public treeControl: FlatTreeControl<TodoItemFlatNode>;
  public treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;
  public dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;
  /** The selection for checklist */
  public checklistSelection = new SelectionModel<TodoItemFlatNode>(true, null, true);

  public maxLevel = 3;
  public get itemInAddState(): boolean {
    return this._itemInAddState;
  }
  public getLevel = (node: TodoItemFlatNode) => node.level;
  public isExpandable = (node: TodoItemFlatNode) => node.expandable;
  public getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;
  public hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;
  public hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  private _transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this._nestedNodeMap.get(node);
    const flatNode =  existingNode && existingNode.item === node.item
        ? existingNode
        : new TodoItemFlatNode();
    if (node.item.length) {
      flatNode.item = node.item;
    } else {
      flatNode.payload = node.item;
    }
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this._flatNodeMap.set(flatNode, node);
    this._nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    this.treeFlattener = new MatTreeFlattener(
      this._transformer, /* Transformer is a declared as a lambda to keep proper context */
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );
  }

  public ngOnInit(): void {
    this._subscriptions.push(
      this.vm.collapseExpandAll.subscribe((collapse: boolean) => {
        if (collapse) {
          this.treeControl.collapseAll();
        } else {
          this.treeControl.expandAll();
        }
      })
    );
    this._subscriptions.push(
      this.vm.dataSource.subscribe((dataSource: any) => {
        if (!dataSource) {
          return;
        }
        this.dataSource.data = dataSource;
        if (this._runFunctionOnNextData) {
          this._runFunctionOnNextData();
          this._runFunctionOnNextData = null;
        }
      })
    );
    this._subscriptions.push(
      this.checklistSelection.changed.subscribe(
        (event: SelectionChange<any>) => {
          this.vm.updateSelectedNodes(event);
        }
      )
    );
    this.maxLevel = this.vm.minimumNodes;
  }

  public ngOnDestroy(): void {
    this._subscriptions.forEach(x => x.unsubscribe());
  }

  /** Whether all the descendants of the node are selected */
  public descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
  }

  /** Whether part of the descendants are selected */
  public descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child =>
      this.checklistSelection.isSelected(child)
    );
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
    const parentNode = this._flatNodeMap.get(node);
    if (!parentNode) {
      return;
    }
    this.vm.insertItem(node, parentNode, '');
    this._itemInAddState = true;
    this._runFunctionOnNextData = () => this.treeControl.expand(node);
  }

  /** Save the node to view model */
  public saveNode(node: TodoItemFlatNode, itemValue: string) {
    const nestedNode = this._flatNodeMap.get(node);
    if (!nestedNode) {
      return;
    }
    this.vm.updateItem(nestedNode, itemValue);
    this._itemInAddState = false;
    this._runFunctionOnNextData = () => this.changeDetectorRef.detectChanges();
  }
}
