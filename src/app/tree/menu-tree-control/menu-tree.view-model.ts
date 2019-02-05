import {
  SelectionChange
} from '@angular/cdk/collections';

import {
  BaseTreeViewModel
} from '../base/base-tree.view-model';
import {
  FlatNode
} from '../contracts/flat-node.interface';
import {
  Node
} from '../contracts/node.interface';
import {
  IMenuTreeOptions
} from './menu-tree-options.interface';
import {
  IMenuTreeViewModel
} from './menu-tree.view-model.interface';

export class MenuTreeViewModel<TTreeNode extends Node = any, TFlatNode extends FlatNode = any>
  extends BaseTreeViewModel implements IMenuTreeViewModel {
  public maximumNodes: number = null;

  constructor(
    private _options: IMenuTreeOptions
  ) {
    super();
    this._state.masterDataSource = this._options.dataSource;
    this._state.filteredDataSource = this._options.dataSource;

    const data = this.buildFileTree(this._options.dataSource, 0);
    this._dataSource.next(data);
    this.maximumNodes = this._options.maxNodeLevel || null;
  }

  private buildFileTree(obj: any, level: number): TTreeNode[] {
    this._state.masterDataSource = obj;
    this._state.filterDataSource = obj;

    return Object.keys(obj).reduce<TTreeNode[]>((accumulator, key) => {
      const value = obj[key];
      if (value && value.payload) {
        if (value.payload.isHidden) {
          if (value.payload.isHidden.value) { return accumulator; }
        }
      }
      const node = <TTreeNode>{};
      node.item = key;
      if (value != null) {
        // TODO could plug in here to hide a payload of sorts on the item
        if (typeof value === 'object' && key !== 'payload') {
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
      (x: { key: string; }) => !event.removed.some(removed => removed.key === x.key)
    );
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
    this._dataSource.next(this.data);
  }
}
