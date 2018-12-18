import {
  IBaseTreeOptions
} from '../contracts/base-tree.options.interface';

export interface IEditTreeOptions extends IBaseTreeOptions {
  maxNodeLevel?: number;
  onFilterChange?: (dataSource: any, filterText: string) => Object;
  minimumCharactersBeforeFilter?: number;
  hideExpandAll?: boolean;
}
