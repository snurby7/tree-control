import { BehaviorSubject, Observable } from 'rxjs';

export abstract class BaseTreeViewModel {
  public _state: any = {
    masterDataSource: Object,
    filteredDataSource: Object,
    selectedNodes: []
  };

  _dataSource: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public get dataSource(): Observable<any[]> { return this._dataSource.asObservable(); }

  _collapseExpandAll: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public get collapseExpandAll(): Observable<boolean> { return this._collapseExpandAll.asObservable(); }

  _notifyTreeChange: BehaviorSubject<void> = new BehaviorSubject<void>(null);
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
}
