import {
  IBaseTreeOptions
} from '../contracts/base-tree.options.interface';

export interface IEditTreeOptions extends IBaseTreeOptions {
  maxNodeLevel?: number;
  minimumCharactersBeforeFilter?: number;
  hideExpandAll?: boolean;
}
