import {
  BehaviorSubject
} from 'rxjs';

export const TREE_DATA = {
  Groceries: {
    'Almond Meal flour': {
      payload: {
        isHidden: new BehaviorSubject<boolean>(true),
        value: 'waffles are good'
      }
    },
    'Organic eggs': null,
    'Protein Powder': null,
    Fruits: {
      Apple: null,
      Berries: ['Blueberry', 'Raspberry', 'Cheetohs'],
      Orange: null
    }
  },
  Reminders: [
    'Cook dinner',
    'Read the Material Design spec',
    'Upgrade Application to Angular'
  ]
};
