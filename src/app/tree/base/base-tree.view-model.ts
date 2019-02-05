import {
  SelectionChange
} from '@angular/cdk/collections';

import {
  BehaviorSubject,
  Observable
} from 'rxjs';

import {
  FlatNode
} from '../contracts/flat-node.interface';
import {
  Node
} from '../contracts/node.interface';

export abstract class BaseTreeViewModel {
  public _state: any = {
    masterDataSource: Object,
    filteredDataSource: Object,
    selectedNodes: []
  };

  protected _dataSource: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public get dataSource(): Observable<any[]> { return this._dataSource.asObservable(); }

  protected _collapseExpandAll: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public get collapseExpandAll(): Observable<boolean> { return this._collapseExpandAll.asObservable(); }

  protected _notifyTreeChange: BehaviorSubject<void> = new BehaviorSubject<void>(null);
  public get notifyTreeChange(): Observable<void> { return this._notifyTreeChange.asObservable(); }

  get data(): any[] { return this._dataSource.value; }

  public expand(): void {
    this._collapseExpandAll.next(false);
  }

  public collapse(): void {
    this._collapseExpandAll.next(true);
  }

  public updateDataSource(dataSource: any): void {
    this._state.masterDataSource = dataSource;
    this._state.filteredDataSource = dataSource;
    this.notifyListenersOnDataUpdate();
  }

  public notifyListenersOnDataUpdate(dataSource?: any[]): void {
    this._dataSource.next(dataSource ? dataSource : this._state.masterDataSource);
    this._notifyTreeChange.next(null);
  }

  public getVisibleNodeMap(): any {
    return this._state.filteredDataSource;
  }

  public transformData(flatNode: FlatNode, node: Node, level: number): void {
    if (node.item.length) {
      flatNode.item = node.item;
    } else {
      flatNode.payload = node.item;
    }
    flatNode.level = level;
    flatNode.expandable = !!node.children;
  }

  public updateSelectedNodes(event: SelectionChange<Node>): void {
    this._state.selectedNodes.push(event.added);
    this._state.selectedNodes = this._state.selectedNodes.filter(
      (x: { key: string; }) => !event.removed.some(removed => removed.key === x.key)
    );
    console.log(this._state.selectedNodes);
  }
}
