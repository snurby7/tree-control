import {
  Observable,
} from 'rxjs';

export class FlatNode {
  item: string;
  level: number;
  payload: any;
  expandable: boolean;
  isHidden: Observable<boolean>;
}
