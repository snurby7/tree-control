// ! This is still just an example, the final contract may be completely different
// ! but this a base for right now has all that we will need to construct a tree
// ! and the rest is sugar
export class Node {
	children: Node[];
	item: string;
	key: string;
	payload: any;
}
