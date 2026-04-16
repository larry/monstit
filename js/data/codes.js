// Redeemable codes and their rewards
// reward types: 'monster', 'gems', 'eggs', 'item'

export const CODES = {
  'ONESHOT': {
    description: 'Unlocks the legendary Omnistrike monster!',
    rewards: [
      { type: 'monster', monsterId: 'omnistrike' }
    ]
  },
  'GEMS500': {
    description: '500 free gems!',
    rewards: [
      { type: 'gems', amount: 500 }
    ]
  },
  'DINOPACK': {
    description: 'A pack of 3 Dino Eggs!',
    rewards: [
      { type: 'eggs', element: 'dino', amount: 3 }
    ]
  },
  'STARTERKIT': {
    description: 'One egg of every element!',
    rewards: [
      { type: 'eggs', element: 'earth', amount: 1 },
      { type: 'eggs', element: 'water', amount: 1 },
      { type: 'eggs', element: 'cloud', amount: 1 },
      { type: 'eggs', element: 'sand', amount: 1 },
      { type: 'eggs', element: 'fire', amount: 1 }
    ]
  }
};

export function getCode(code) {
  return CODES[code.toUpperCase()] || null;
}
