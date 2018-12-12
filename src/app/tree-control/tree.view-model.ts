import { SelectionChange } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';

import { TodoItemNode } from './contracts/todo-item-node.interface';
import { ITreeOptions } from './tree-options.interface';
import { ITreeViewModel } from './tree.view-model.interface';



export class TreeViewModel implements ITreeViewModel {
  private _state: any = {
    masterDataSource: Object,
    filteredDataSource: Object,
    selectedNodes: []
  }; // this will store the state

  _collapseExpandAll: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public get collapseExpandAll(): Observable<boolean> { return this._collapseExpandAll.asObservable(); }

  _dataSource: BehaviorSubject<TodoItemNode[]> = new BehaviorSubject<TodoItemNode[]>([]);
  public get dataSource(): Observable<TodoItemNode[]> { return this._dataSource.asObservable(); }

  _notifyTreeChange: BehaviorSubject<void> = new BehaviorSubject<void>(null);
  public get notifyTreeChange(): Observable<void> { return this._notifyTreeChange.asObservable(); }

  get data(): TodoItemNode[] { return this._dataSource.value; }

  constructor(
    private _options: ITreeOptions
  ) {
    const data = this.buildFileTree(this._options.dataSource, 0);
    this._dataSource.next(data);
  }

  buildFileTree(obj: object, level: number): TodoItemNode[] {
    this._state.masterDataSource = obj;
    this._state.filterDataSource = obj;

    return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TodoItemNode();
      node.item = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.item = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  public updateSelectedNodeState(nodeClicked: { id: any; }): void {
    const selectedNodes: any = this._state.selectedNodes;
    if (selectedNodes.some((node: { id: any; }) => node.id === nodeClicked.id)) {
      selectedNodes.filter((node: { id: any; }) => node.id !== nodeClicked);
    } else {
      selectedNodes.push(nodeClicked);
    }
    this._state.selectedNodes = selectedNodes;
  }

  public filterDataSource(filterText: string): void {
    if (this._options.onFilterChange) {
      const masterCopy: any = this._state.masterDataSource;
      this._state.filteredDataSource = this._options.onFilterChange(masterCopy, filterText);
    } else {
      this._state.filteredDataSource = []; /* Do some filtering on the masterDataSource */
    }
    this.notifyListenersOnDataUpdate();
  }

  public updateSelectedNodes(event: SelectionChange<any>): void {
      console.log(event);
  }

  public updateDataSource(dataSource: any): void {
    this._state.masterDataSource = dataSource;
    this._state.filteredDataSource = dataSource;
    this.notifyListenersOnDataUpdate();
  }

  public insertItem(parent: TodoItemNode, name: string) {
    if (!parent.children) {
      parent.children = [];
    }
    parent.children.push({ item: name } as TodoItemNode);
    this._dataSource.next(this.data);
  }

  public updateItem(node: TodoItemNode, name: string) {
    node.item = name;
    this._dataSource.next(this.data);
  }

  public notifyListenersOnDataUpdate(): void {
    this._dataSource.next(this._state.masterDataSource);
    this._notifyTreeChange.next(null);
  }

  public getVisibleNodeMap(): any {
    return this._state.filteredDataSource;
  }
}
