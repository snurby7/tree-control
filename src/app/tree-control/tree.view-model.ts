import {
  SelectionChange,
} from '@angular/cdk/collections';
import {
  BehaviorSubject,
  Observable,
  of,
} from 'rxjs';

import {
  TodoItemFlatNode,
} from './contracts/todo-item-flat-node.interface';
import {
  TodoItemNode,
} from './contracts/todo-item-node.interface';
import {
  ITreeOptions,
} from './tree-options.interface';
import {
  ITreeViewModel,
} from './tree.view-model.interface';

export class TreeViewModel implements ITreeViewModel {
  private _state: any = {
    masterDataSource: Object,
    filteredDataSource: Object,
    selectedNodes: []
  }; // this will store the state

  public minimumNodes: number = null;

  private _collapseExpandAll: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);
  public get collapseExpandAll(): Observable<boolean> {
    return this._collapseExpandAll.asObservable();
  }

  private _dataSource: BehaviorSubject<TodoItemNode[]> = new BehaviorSubject<
    TodoItemNode[]
  >([]);
  public get dataSource(): Observable<TodoItemNode[]> {
    return this._dataSource.asObservable();
  }

  private _notifyTreeChange: BehaviorSubject<void> = new BehaviorSubject<void>(
    null
  );
  public get notifyTreeChange(): Observable<void> {
    return this._notifyTreeChange.asObservable();
  }

  get data(): TodoItemNode[] {
    return this._dataSource.value;
  }

  constructor(private _options: ITreeOptions) {
    this._state.masterDataSource = this._options.dataSource;
    this._state.filteredDataSource = this._options.dataSource;

    const data = this.buildFileTree(this._options.dataSource, 0);
    this._dataSource.next(data);
    this.minimumNodes = this._options.maxNodeLevel || null;
  }

  private buildFileTree(obj: any, level: number): TodoItemNode[] {
    this._state.masterDataSource = obj;
    this._state.filterDataSource = obj;

    const treeData = Object.keys(obj).reduce<TodoItemNode[]>(
      (accumulator, key) => {
        const value = obj[key];
        console.log(value);
        if (value && value.payload) {
          if (value.payload.isHidden) {
            const isHidden = value.payload.isHidden.value;
            if (isHidden) {return accumulator; }
          }
        }
        const node = new TodoItemNode();
        node.item = key;
        if (value != null) {
          // TODO could plug in here to hide a payload of sorts on the item
          if (typeof value === 'object' && key !== 'payload' && key !== 'isHidden') {
            node.children = this.buildFileTree(value, level + 1);
          } else {
            node.key = key;
            node.payload = value;
            node.item = value;
          }
        }
        return accumulator.concat(node);
      },
      []
    );
    return treeData;
  }

  public updateSelectedNodeState(nodeClicked: { id: any }): void {
    const selectedNodes: any = this._state.selectedNodes;
    if (selectedNodes.some((node: { id: any }) => node.id === nodeClicked.id)) {
      selectedNodes.filter((node: { id: any }) => node.id !== nodeClicked);
    } else {
      selectedNodes.push(nodeClicked);
    }
    this._state.selectedNodes = selectedNodes;
  }

  public filterDataSource(filterText: string): void {
    if (this._options.onFilterChange) {
      const masterCopy: any = this._state.masterDataSource;
      this._state.filteredDataSource = this._options.onFilterChange(
        masterCopy,
        filterText
      );
    } else {
      this._state.filteredDataSource = []; /* Do some filtering on the masterDataSource */
    }
    this.notifyListenersOnDataUpdate();
  }

  public updateSelectedNodes(event: SelectionChange<TodoItemNode>): void {
    this._state.selectedNodes.push(event.added);
    this._state.selectedNodes = this._state.selectedNodes.filter(
      x => !event.removed.some(removed => removed.key === x.key)
    );
    console.log(this._state.selectedNodes);
  }

  public updateDataSource(dataSource: any): void {
    this._state.masterDataSource = dataSource;
    this._state.filteredDataSource = dataSource;
    this.notifyListenersOnDataUpdate();
  }

  public insertItem(
    node: TodoItemFlatNode,
    parent: TodoItemNode,
    name: string
  ) {
    if (!parent.children) {
      parent.children = [];
    }
    node.expandable = true;
    parent.children.push({ item: name, isHidden: of(false) } as TodoItemNode);
    this._dataSource.next(this.data);
  }

  public updateItem(node: TodoItemNode, name: string) {
    node.item = name;
    // TODO Enforce uniqueness on the nodes
    this._dataSource.next(this.data);
  }

  public notifyListenersOnDataUpdate(): void {
    this._dataSource.next(this._state.masterDataSource);
    this._notifyTreeChange.next(null);
  }

  public getVisibleNodeMap(): any {
    return this._state.filteredDataSource;
  }

  public expand(): void {
    this._collapseExpandAll.next(false);
  }

  public collapse(): void {
    this._collapseExpandAll.next(true);
  }
}
