import {
  ITreeOptions,
} from './nested-tree-options.interface';
import {
  NestedTreeViewModel,
} from './nested-tree.view-model';
import {
  INestedTreeViewModel,
} from './nested-tree.view-model.interface';

export class NestedTreeFactory {
  public create(options: ITreeOptions): INestedTreeViewModel {
    return new NestedTreeViewModel(options);
  }
}
