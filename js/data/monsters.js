export const MONSTERS = [
  {
    id: 'emberpup',
    name: 'Emberpup',
    type: 'fire',
    rarity: 'common',
    baseHp: 80,
    baseAttack: 14,
    baseDefense: 8,
    description: 'A scrappy pup whose tail never stops smoldering.',
    cssClass: 'monster-emberpup'
  },
  {
    id: 'pondling',
    name: 'Pondling',
    type: 'water',
    rarity: 'common',
    baseHp: 90,
    baseAttack: 10,
    baseDefense: 12,
    description: 'A bubbly blob that lives in shallow ponds.',
    cssClass: 'monster-pondling'
  },
  {
    id: 'pebblit',
    name: 'Pebblit',
    type: 'earth',
    rarity: 'common',
    baseHp: 100,
    baseAttack: 12,
    baseDefense: 14,
    description: 'A sturdy little rock creature, tougher than it looks.',
    cssClass: 'monster-pebblit'
  },
  {
    id: 'puffwisp',
    name: 'Puffwisp',
    type: 'cloud',
    rarity: 'common',
    baseHp: 70,
    baseAttack: 15,
    baseDefense: 7,
    description: 'A fluffy wisp that drifts through the sky on tiny wings.',
    cssClass: 'monster-puffwisp'
  },
  {
    id: 'dustling',
    name: 'Dustling',
    type: 'sand',
    rarity: 'common',
    baseHp: 85,
    baseAttack: 13,
    baseDefense: 11,
    description: 'A gritty critter born from desert sandstorms.',
    cssClass: 'monster-dustling'
  },
  {
    id: 'blazefang',
    name: 'Blazefang',
    type: 'fire',
    rarity: 'rare',
    baseHp: 100,
    baseAttack: 18,
    baseDefense: 10,
    description: 'A fierce predator with fangs that glow white-hot.',
    cssClass: 'monster-blazefang'
  },
  {
    id: 'tidecrawl',
    name: 'Tidecrawl',
    type: 'water',
    rarity: 'rare',
    baseHp: 110,
    baseAttack: 14,
    baseDefense: 16,
    description: 'An armored crustacean that rides the ocean currents.',
    cssClass: 'monster-tidecrawl'
  },
  {
    id: 'thornback',
    name: 'Thornback',
    type: 'earth',
    rarity: 'epic',
    baseHp: 120,
    baseAttack: 20,
    baseDefense: 18,
    description: 'A hulking beast covered in razor-sharp thorns.',
    cssClass: 'monster-thornback'
  },
  {
    id: 'skywhale',
    name: 'Skywhale',
    type: 'cloud',
    rarity: 'epic',
    baseHp: 130,
    baseAttack: 17,
    baseDefense: 19,
    description: 'A massive creature that glides silently above the clouds.',
    cssClass: 'monster-skywhale'
  },
  {
    id: 'sandstalker',
    name: 'Sandstalker',
    type: 'sand',
    rarity: 'legendary',
    baseHp: 140,
    baseAttack: 22,
    baseDefense: 14,
    description: 'An ancient predator that lurks beneath endless dunes.',
    cssClass: 'monster-sandstalker'
  },
  {
    id: 'celestrix',
    name: 'Celestrix',
    type: 'cloud',
    rarity: 'incredible',
    baseHp: 160,
    baseAttack: 24,
    baseDefense: 20,
    description: 'A divine being forged from starlight and storm. Legends say only one exists.',
    cssClass: 'monster-celestrix'
  }
];

export const RARITY_WEIGHTS = {
  common: 45,
  rare: 25,
  epic: 17,
  legendary: 10,
  incredible: 3
};

export const RARE_EGG_WEIGHTS = {
  common: 0,
  rare: 30,
  epic: 35,
  legendary: 25,
  incredible: 10
};

export function getMonsterById(id) {
  return MONSTERS.find(m => m.id === id);
}

export function getMonstersByRarity(rarity) {
  return MONSTERS.filter(m => m.rarity === rarity);
}
