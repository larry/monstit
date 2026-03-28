// 30-day battle pass with free and premium reward tracks
export const BATTLE_PASS_DAYS = 30;
export const PREMIUM_COST = 10000;

// Each day has a free reward and a premium reward
export const BATTLE_PASS_REWARDS = [
  // Day 1-5
  { day: 1,  free: { type: 'gems', amount: 5, label: '5 Gems' },           premium: { type: 'gems', amount: 50, label: '50 Gems' } },
  { day: 2,  free: { type: 'egg', element: 'earth', amount: 1, label: '1 Earth Egg' }, premium: { type: 'egg', element: 'fire', amount: 1, label: '1 Fire Egg' } },
  { day: 3,  free: { type: 'gems', amount: 10, label: '10 Gems' },         premium: { type: 'item', itemId: 'power-boost', amount: 2, label: '2 Power Boosts' } },
  { day: 4,  free: { type: 'item', itemId: 'potion', amount: 1, label: '1 Potion' }, premium: { type: 'gems', amount: 75, label: '75 Gems' } },
  { day: 5,  free: { type: 'gems', amount: 15, label: '15 Gems' },         premium: { type: 'egg', element: 'cloud', amount: 2, label: '2 Cloud Eggs' } },

  // Day 6-10
  { day: 6,  free: { type: 'egg', element: 'water', amount: 1, label: '1 Water Egg' }, premium: { type: 'item', itemId: 'shield-charm', amount: 2, label: '2 Shield Charms' } },
  { day: 7,  free: { type: 'gems', amount: 20, label: '20 Gems' },         premium: { type: 'gems', amount: 100, label: '100 Gems' } },
  { day: 8,  free: { type: 'item', itemId: 'potion', amount: 1, label: '1 Potion' }, premium: { type: 'egg', element: 'sand', amount: 1, label: '1 Sand Egg' } },
  { day: 9,  free: { type: 'gems', amount: 10, label: '10 Gems' },         premium: { type: 'item', itemId: 'power-boost', amount: 3, label: '3 Power Boosts' } },
  { day: 10, free: { type: 'egg', element: 'fire', amount: 2, label: '2 Fire Eggs' }, premium: { type: 'gems', amount: 150, label: '150 Gems' } },

  // Day 11-15
  { day: 11, free: { type: 'gems', amount: 15, label: '15 Gems' },         premium: { type: 'item', itemId: 'shield-charm', amount: 3, label: '3 Shield Charms' } },
  { day: 12, free: { type: 'item', itemId: 'potion', amount: 2, label: '2 Potions' }, premium: { type: 'egg', element: 'water', amount: 2, label: '2 Water Eggs' } },
  { day: 13, free: { type: 'gems', amount: 20, label: '20 Gems' },         premium: { type: 'gems', amount: 200, label: '200 Gems' } },
  { day: 14, free: { type: 'egg', element: 'cloud', amount: 1, label: '1 Cloud Egg' }, premium: { type: 'item', itemId: 'power-boost', amount: 3, label: '3 Power Boosts' } },
  { day: 15, free: { type: 'gems', amount: 25, label: '25 Gems' },         premium: { type: 'egg', element: 'earth', amount: 3, label: '3 Earth Eggs' } },

  // Day 16-20
  { day: 16, free: { type: 'item', itemId: 'potion', amount: 2, label: '2 Potions' }, premium: { type: 'gems', amount: 250, label: '250 Gems' } },
  { day: 17, free: { type: 'gems', amount: 15, label: '15 Gems' },         premium: { type: 'item', itemId: 'shield-charm', amount: 4, label: '4 Shield Charms' } },
  { day: 18, free: { type: 'egg', element: 'sand', amount: 2, label: '2 Sand Eggs' }, premium: { type: 'egg', element: 'fire', amount: 2, label: '2 Fire Eggs' } },
  { day: 19, free: { type: 'gems', amount: 20, label: '20 Gems' },         premium: { type: 'item', itemId: 'power-boost', amount: 4, label: '4 Power Boosts' } },
  { day: 20, free: { type: 'gems', amount: 30, label: '30 Gems' },         premium: { type: 'gems', amount: 300, label: '300 Gems' } },

  // Day 21-25
  { day: 21, free: { type: 'item', itemId: 'potion', amount: 3, label: '3 Potions' }, premium: { type: 'egg', element: 'cloud', amount: 3, label: '3 Cloud Eggs' } },
  { day: 22, free: { type: 'gems', amount: 25, label: '25 Gems' },         premium: { type: 'item', itemId: 'power-boost', amount: 5, label: '5 Power Boosts' } },
  { day: 23, free: { type: 'egg', element: 'earth', amount: 2, label: '2 Earth Eggs' }, premium: { type: 'gems', amount: 350, label: '350 Gems' } },
  { day: 24, free: { type: 'gems', amount: 30, label: '30 Gems' },         premium: { type: 'item', itemId: 'shield-charm', amount: 5, label: '5 Shield Charms' } },
  { day: 25, free: { type: 'gems', amount: 35, label: '35 Gems' },         premium: { type: 'egg', element: 'water', amount: 4, label: '4 Water Eggs' } },

  // Day 26-30 (finale rewards get bigger)
  { day: 26, free: { type: 'item', itemId: 'potion', amount: 3, label: '3 Potions' }, premium: { type: 'gems', amount: 400, label: '400 Gems' } },
  { day: 27, free: { type: 'gems', amount: 40, label: '40 Gems' },         premium: { type: 'item', itemId: 'power-boost', amount: 5, label: '5 Power Boosts' } },
  { day: 28, free: { type: 'egg', element: 'fire', amount: 3, label: '3 Fire Eggs' }, premium: { type: 'egg', element: 'sand', amount: 5, label: '5 Sand Eggs' } },
  { day: 29, free: { type: 'gems', amount: 50, label: '50 Gems' },         premium: { type: 'gems', amount: 500, label: '500 Gems' } },
  { day: 30, free: { type: 'egg', element: 'earth', amount: 5, label: '5 Earth Eggs' }, premium: { type: 'egg', element: 'fire', amount: 5, label: '5 Fire Eggs' } },
];
