import {
    Observable
} from 'rxjs';

// ! This is still just an example, the final contract may be completely different
// ! but this a base for right now has all that we will need to construct a tree and the rest is sugar
export class FlatNode {
	item: string;
	level: number;
	payload: any;
	expandable: boolean;
	isHidden: Observable<boolean>;
}
