import {
  Observable,
} from 'rxjs';

export class TodoItemFlatNode {
  item: string;
  level: number;
  payload: any;
  expandable: boolean;
  isHidden: Observable<boolean>;
}
