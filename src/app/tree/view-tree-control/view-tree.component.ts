import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  OnDestroy
} from '@angular/core';

import {
  BaseTreeComponent
} from '../base/base-tree.component';
import {
  ViewTreeViewModel
} from './view-tree.view-model';

@Component({
  selector: 'buns-view-tree',
  templateUrl: 'view-tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewTreeComponent extends BaseTreeComponent implements OnDestroy {
  @ContentChild('itemTemplate') itemTemplate: any;
  @Input() vm: ViewTreeViewModel;

  constructor() {
    super();
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
