import {
  Component
} from '@angular/core';

import {
  IMenuTreeViewModel,
  MenuTreeFactory,
  ViewTreeFactory,
  ViewTreeViewModel
} from './tree';
import {
  TREE_DATA
} from './tree.data';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public menuTreeVM: IMenuTreeViewModel;
  public viewTreeVM: ViewTreeViewModel;

  constructor(
    menuTreeFactory: MenuTreeFactory,
    viewTreeFactory: ViewTreeFactory
  ) {
    this.menuTreeVM = menuTreeFactory.create({
      dataSource: TREE_DATA
    });
    this.viewTreeVM = viewTreeFactory.create({
      dataSource: TREE_DATA,
      onFilterChange: (dataSource, filterText) => this.filterData(dataSource, filterText)
    });
  }

  public onClick(node): void {
    console.log(node);
  }

  public filterChanged(filterText: string): void {
    this.viewTreeVM.filterDataSource(filterText);
  }

  private filterData(dataSource: any, filterText: string): Object {
    console.log(dataSource);
    return dataSource;
  }
}
