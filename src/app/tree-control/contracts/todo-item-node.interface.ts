import {
  Observable,
  of,
} from 'rxjs';

export class TodoItemNode {
  children: TodoItemNode[];
  item: any;
  key: string;
  payload: any;
  isHidden?: Observable<boolean> = of(false);
}
