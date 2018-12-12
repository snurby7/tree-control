export interface ITreeViewModel {
  updateSelectedNodeState: (nodeClicked: { id: any; }) => void;
  filterDataSource: (filterText: string) => void;
  updateDataSource: (dataSource: any) => void;
  notifyListenersOnDataUpdate: () => void;
  getVisibleNodeMap: () => any;
}
