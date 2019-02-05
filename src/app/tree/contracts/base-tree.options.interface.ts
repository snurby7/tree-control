export interface IBaseTreeOptions {
  dataSource: Object;
  onFilterChange?: (dataSource: any, filterText: string) => Object;
  hideExpandAll?: boolean;
}
