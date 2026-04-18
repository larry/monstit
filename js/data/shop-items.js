export const SHOP_ITEMS = [
  {
    id: 'earth-egg',
    name: 'Earth Egg',
    cost: 10,
    description: 'Hatches an Earth-type monster.',
    icon: '\u{1F3D4}\uFE0F',
    type: 'egg',
    eggType: 'earth'
  },
  {
    id: 'water-egg',
    name: 'Water Egg',
    cost: 10,
    description: 'Hatches a Water-type monster.',
    icon: '\u{1F30A}',
    type: 'egg',
    eggType: 'water'
  },
  {
    id: 'cloud-egg',
    name: 'Cloud Egg',
    cost: 10,
    description: 'Hatches a Cloud-type monster.',
    icon: '\u2601\uFE0F',
    type: 'egg',
    eggType: 'cloud'
  },
  {
    id: 'sand-egg',
    name: 'Sand Egg',
    cost: 10,
    description: 'Hatches a Sand-type monster.',
    icon: '\u{1F3DC}\uFE0F',
    type: 'egg',
    eggType: 'sand'
  },
  {
    id: 'fire-egg',
    name: 'Fire Egg',
    cost: 10,
    description: 'Hatches a Fire-type monster.',
    icon: '\u{1F525}',
    type: 'egg',
    eggType: 'fire'
  },
  {
    id: 'dino-egg',
    name: 'Dino Egg',
    cost: 15,
    description: 'Hatches a prehistoric Dino-type monster!',
    icon: '\u{1F996}',
    type: 'egg',
    eggType: 'dino'
  },
  {
    id: 'dragon-egg',
    name: 'Dragon Egg',
    cost: 20,
    description: 'Hatches a legendary Dragon-type monster!',
    icon: '\u{1F409}',
    type: 'egg',
    eggType: 'dragon'
  },
  {
    id: 'potion',
    name: 'Potion',
    cost: 8,
    description: 'Heal 30 HP mid-battle. One use per battle.',
    icon: '\u{1F9EA}',
    type: 'battle-item',
    effect: 'heal',
    value: 30
  },
  {
    id: 'power-boost',
    name: 'Power Boost',
    cost: 15,
    description: '+5 ATK for one battle.',
    icon: '\u2694\uFE0F',
    type: 'battle-item',
    effect: 'attackBoost',
    value: 5
  },
  {
    id: 'shield-charm',
    name: 'Shield Charm',
    cost: 15,
    description: '+5 DEF for one battle.',
    icon: '\u{1F6E1}\uFE0F',
    type: 'battle-item',
    effect: 'defenseBoost',
    value: 5
  }
];

export function getShopItem(id) {
  return SHOP_ITEMS.find(item => item.id === id);
}
