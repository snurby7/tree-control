import { ITreeOptions } from './tree-options.interface';
import { TreeViewModel } from './tree.view-model';
import { ITreeViewModel } from './tree.view-model.interface';

export class TreeFactory {
  public create(options: ITreeOptions): ITreeViewModel {
    return new TreeViewModel(
      options
    );
  }
}
