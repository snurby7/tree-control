import {
  IEditTreeOptions
} from './edit-tree-options.interface';
import {
  EditTreeViewModel
} from './edit-tree.view-model';
import {
  IEditTreeViewModel
} from './edit-tree.view-model.interface';

export class EditTreeFactory {
  public create(options: IEditTreeOptions): IEditTreeViewModel {
    return new EditTreeViewModel(options);
  }
}
