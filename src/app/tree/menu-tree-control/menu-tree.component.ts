import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  BaseTreeComponent
} from '../base/base-tree.component';
import {
  FlatNode
} from '../contracts/flat-node.interface';
import {
  Node
} from '../contracts/node.interface';
import {
  MenuTreeViewModel
} from './menu-tree.view-model';

@Component({
  selector: 'buns-menu-tree',
  templateUrl: 'menu-tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuTreeComponent extends BaseTreeComponent implements OnInit, OnDestroy {
  @ContentChild('itemTemplate') itemTemplate: any;
  @Input() vm: MenuTreeViewModel;

  private _itemInAddState = false;
  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  private _flatNodeMap = new Map<FlatNode, Node>();

  /** A selected parent node to be inserted */
  public selectedParent: FlatNode | null = null;
  /** The new item's name */
  public newItemName = '';

  public maxLevel = 3; // ! This is just arbitrary for now and overrode in OnInit

  public get itemInAddState(): boolean { return this._itemInAddState; }

  constructor() {
    super();
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.maxLevel = this.vm.maximumNodes;
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  /** Select the category so we can insert the new item. */
  public addNewItem(node: FlatNode): void {
    const parentNode = this._flatNodeMap.get(node);
    if (!parentNode) {
      return;
    }
    this.vm.insertItem(node, parentNode, '');
    this._itemInAddState = true;
  }

  /** Save the node to view model */
  public saveNode(node: FlatNode, itemValue: string): void {
    const nestedNode = this._flatNodeMap.get(node);
    if (!nestedNode) {
      return;
    }
    this.vm.updateItem(nestedNode, itemValue);
    this._itemInAddState = false;
  }
}
