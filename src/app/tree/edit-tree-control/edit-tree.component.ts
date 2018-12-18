import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
  EditTreeViewModel
} from './edit-tree.view-model';

@Component({
  selector: 'app-edit-tree',
  templateUrl: 'edit-tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditTreeComponent extends BaseTreeComponent implements OnInit, OnDestroy {
  @ContentChild('itemTemplate') itemTemplate: any;
  @Input() vm: EditTreeViewModel;

  private _itemInAddState = false;
  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  private _flatNodeMap = new Map<FlatNode, Node>();

  /** A selected parent node to be inserted */
  public selectedParent: FlatNode | null = null;
  /** The new item's name */
  public newItemName = '';

  public maxLevel = 3;
  public get itemInAddState(): boolean { return this._itemInAddState; }

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super();
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.maxLevel = this.vm.minimumNodes;
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
    this.runFunctionOnNextData = () => this.treeControl.expand(node);
  }

  /** Save the node to view model */
  public saveNode(node: FlatNode, itemValue: string): void {
    const nestedNode = this._flatNodeMap.get(node);
    if (!nestedNode) {
      return;
    }
    this.vm.updateItem(nestedNode, itemValue);
    this._itemInAddState = false;
    this.runFunctionOnNextData = () => this.changeDetectorRef.detectChanges();
  }
}
