import {
  SelectionChange,
} from '@angular/cdk/collections';
import {
  BehaviorSubject,
  Observable,
} from 'rxjs';

import {
  NestedFileNode,
} from './contracts/nested-node.interface';
import {
  ITreeOptions,
} from './nested-tree-options.interface';
import {
  INestedTreeViewModel,
} from './nested-tree.view-model.interface';

export class NestedTreeViewModel implements INestedTreeViewModel {
  private _state: any = {
    masterDataSource: Object,
    filteredDataSource: Object,
    selectedNodes: []
  }; // this will store the state

  public minimumNodes: number = null;

  private _collapseExpandAll: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public get collapseExpandAll(): Observable<boolean> { return this._collapseExpandAll.asObservable(); }

  private _dataSource: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public get dataSource(): Observable<any> { return this._dataSource.asObservable(); }

  private _notifyTreeChange: BehaviorSubject<void> = new BehaviorSubject<void>(null);
  public get notifyTreeChange(): Observable<void> { return this._notifyTreeChange.asObservable(); }

  get data(): any { return this._dataSource.value; }

  constructor(
    private _options: ITreeOptions
  ) {
    const dataObject = JSON.parse(this._options.dataSource);

    const data = this.buildFileTree(dataObject, 0);
    this._dataSource.next(data);
  }

  buildFileTree(obj: {[key: string]: any}, level: number): NestedFileNode[] {
    return Object.keys(obj).reduce<NestedFileNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new NestedFileNode();
      node.filename = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.type = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  public filterDataSource(filterText: string): void {
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
