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
  },
  'SEASON2': {
    description: 'Season 2 welcome gift! Gems, eggs, and potions!',
    rewards: [
      { type: 'gems', amount: 250 },
      { type: 'eggs', element: 'dino', amount: 2 },
      { type: 'item', itemId: 'potion', amount: 3 }
    ]
  },
  'FIRESTORM': {
    description: 'A blazing bundle of Fire eggs!',
    rewards: [
      { type: 'eggs', element: 'fire', amount: 5 }
    ]
  },
  'TIDALSURGE': {
    description: 'A wave of Water eggs crashes in!',
    rewards: [
      { type: 'eggs', element: 'water', amount: 5 }
    ]
  },
  'MEGAGEMS': {
    description: 'A massive pile of 1000 gems!',
    rewards: [
      { type: 'gems', amount: 1000 }
    ]
  },
  'BATTLEREADY': {
    description: 'Gear up with potions and boosts!',
    rewards: [
      { type: 'item', itemId: 'potion', amount: 5 },
      { type: 'item', itemId: 'power-boost', amount: 3 },
      { type: 'item', itemId: 'shield-charm', amount: 3 }
    ]
  },
  'CLOUDNINE': {
    description: 'Cloud eggs rain from the sky!',
    rewards: [
      { type: 'eggs', element: 'cloud', amount: 4 },
      { type: 'gems', amount: 100 }
    ]
  },
  'SANDSTORM': {
    description: 'A desert haul of Sand eggs and gems!',
    rewards: [
      { type: 'eggs', element: 'sand', amount: 4 },
      { type: 'gems', amount: 100 }
    ]
  },
  'LUCKYDAY': {
    description: 'Feeling lucky? Eggs from every element!',
    rewards: [
      { type: 'eggs', element: 'fire', amount: 2 },
      { type: 'eggs', element: 'water', amount: 2 },
      { type: 'eggs', element: 'earth', amount: 2 },
      { type: 'eggs', element: 'cloud', amount: 2 },
      { type: 'eggs', element: 'sand', amount: 2 },
      { type: 'eggs', element: 'dino', amount: 2 }
    ]
  },
  'JURASSIC': {
    description: 'A prehistoric haul of Dino eggs!',
    rewards: [
      { type: 'eggs', element: 'dino', amount: 5 },
      { type: 'gems', amount: 200 }
    ]
  },
  'DRAGONHOARD': {
    description: 'A treasure trove of Dragon eggs from the Peak!',
    rewards: [
      { type: 'eggs', element: 'dragon', amount: 5 },
      { type: 'gems', amount: 200 }
    ]
  }
};

export function getCode(code) {
  return CODES[code.toUpperCase()] || null;
}
