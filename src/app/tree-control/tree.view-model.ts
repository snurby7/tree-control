import {
  SelectionChange,
} from '@angular/cdk/collections';
import {
  BehaviorSubject,
  Observable,
} from 'rxjs';

import {
  FlatNode,
} from './contracts/flat-node.interface';
import {
  Node,
} from './contracts/node.interface';
import {
  ITreeOptions,
} from './tree-options.interface';
import {
  ITreeViewModel,
} from './tree.view-model.interface';

export class TreeViewModel<TTreeNode extends Node, TFlatNode extends FlatNode> implements ITreeViewModel {
  private _state: any = {
    masterDataSource: Object,
    filteredDataSource: Object,
    selectedNodes: []
  }; // this will store the state

  public minimumNodes: number = null;

  private _collapseExpandAll: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public get collapseExpandAll(): Observable<boolean> { return this._collapseExpandAll.asObservable(); }

  private _dataSource: BehaviorSubject<TTreeNode[]> = new BehaviorSubject<TTreeNode[]>([]);
  public get dataSource(): Observable<TTreeNode[]> { return this._dataSource.asObservable(); }

  private _notifyTreeChange: BehaviorSubject<void> = new BehaviorSubject<void>(null);
  public get notifyTreeChange(): Observable<void> { return this._notifyTreeChange.asObservable(); }

  get data(): TTreeNode[] { return this._dataSource.value; }

  constructor(private _options: ITreeOptions) {
    this._state.masterDataSource = this._options.dataSource;
    this._state.filteredDataSource = this._options.dataSource;

    const data = this.buildFileTree(this._options.dataSource, 0);
    this._dataSource.next(data);
    this.minimumNodes = this._options.maxNodeLevel || null;
  }

  private buildFileTree(obj: any, level: number): TTreeNode[] {
    console.log(obj);
    this._state.masterDataSource = obj;
    this._state.filterDataSource = obj;

    return Object.keys(obj).reduce<TTreeNode[]>((accumulator, key) => {
      const value = obj[key];
      if (value && value.payload) {
        if (value.payload.isHidden) {
          const isHidden = value.payload.isHidden.value;
          if (isHidden) {return accumulator; }
        }
      }
      const node = <TTreeNode>{};
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
    }, []);
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

  public updateSelectedNodes(event: SelectionChange<TTreeNode>): void {
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

  public insertItem(node: TFlatNode, parent: TTreeNode, name: string) {
    if (!parent.children) {
      parent.children = [];
    }
    node.expandable = true;
    parent.children.push({ item: name } as TTreeNode);
    this._dataSource.next(this.data);
  }

  public updateItem(node: TTreeNode, name: string) {
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

  public transformData(flatNode: TFlatNode, node: TTreeNode, level: number): void {
    if (node.item.length) {
      flatNode.item = node.item;
    } else {
      flatNode.payload = node.item;
    }
    flatNode.level = level;
    flatNode.expandable = !!node.children;
  }
}
