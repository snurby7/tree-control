import {
  IViewTreeOptions
} from './view-tree-options.interface';
import {
  ViewTreeViewModel
} from './view-tree.view-model';

export class ViewTreeFactory {
  public create(options: IViewTreeOptions): ViewTreeViewModel {
    return new ViewTreeViewModel(Object.assign(options));
  }
}
