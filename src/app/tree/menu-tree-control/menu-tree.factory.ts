import {
    IMenuTreeOptions
} from './menu-tree-options.interface';
import {
    MenuTreeViewModel
} from './menu-tree.view-model';
import {
    IMenuTreeViewModel
} from './menu-tree.view-model.interface';

export class MenuTreeFactory {
	public create(options: IMenuTreeOptions): IMenuTreeViewModel {
		return new MenuTreeViewModel(options);
	}
}
