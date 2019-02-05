import {
    IBaseTreeOptions
} from '../contracts/base-tree.options.interface';

/**
 * @ngdoc object
 * @name nw.core.api:IMenuTreeOptions
 * @description
 * An options interface for initializing a edit tree that extends the base
 */
export interface IMenuTreeOptions extends IBaseTreeOptions {
	/**
	 * @ngdoc property
	 * @name nw.common.api:IMenuTreeOptions#maxNodeLevel
	 * @propertyOf nw.common.api:IBaseTreeOptions
	 * @returns The number representing the maximum depth we will allow on a tree so you can't add an infinite amount
	 */
	maxNodeLevel?: number;
}
