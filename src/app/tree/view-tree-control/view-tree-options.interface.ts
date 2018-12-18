import {
  IBaseTreeOptions
} from '../contracts/base-tree.options.interface';

export interface IViewTreeOptions extends IBaseTreeOptions {
  enableSelection?: boolean;
  onFilterChange?: (dataSource: any, filterText: string) => any;
}
