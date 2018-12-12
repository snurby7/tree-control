export interface ITreeOptions {
  dataSource: Object;
  showComboBox: boolean;
  isViewOnly: boolean;
  onFilterChange?: (dataSource: any, filterText: string) => Object;
  minimumCharactersBeforeFilter?: number;
  hideExpandAll?: boolean;
}
