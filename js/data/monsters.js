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
  },

  // ── New Fire monsters ──
  {
    id: 'magmaw',
    name: 'Magmaw',
    type: 'fire',
    rarity: 'epic',
    baseHp: 115,
    baseAttack: 20,
    baseDefense: 15,
    description: 'A living furnace with jaws that drip molten rock.',
    cssClass: 'monster-magmaw'
  },
  {
    id: 'pyrdrake',
    name: 'Pyrdrake',
    type: 'fire',
    rarity: 'legendary',
    baseHp: 145,
    baseAttack: 24,
    baseDefense: 16,
    description: 'A winged drake that leaves trails of cinder across the sky.',
    cssClass: 'monster-pyrdrake'
  },
  {
    id: 'infernotitan',
    name: 'Infernotitan',
    type: 'fire',
    rarity: 'incredible',
    baseHp: 170,
    baseAttack: 26,
    baseDefense: 18,
    description: 'Born from the heart of a dying volcano. Its roar melts stone.',
    cssClass: 'monster-infernotitan'
  },

  // ── New Water monsters ──
  {
    id: 'coralwyrm',
    name: 'Coralwyrm',
    type: 'water',
    rarity: 'epic',
    baseHp: 125,
    baseAttack: 18,
    baseDefense: 18,
    description: 'A serpent of living coral that guards sunken reefs.',
    cssClass: 'monster-coralwyrm'
  },
  {
    id: 'abyssmaw',
    name: 'Abyssmaw',
    type: 'water',
    rarity: 'legendary',
    baseHp: 150,
    baseAttack: 22,
    baseDefense: 17,
    description: 'A deep-sea terror with a lantern lure and crushing jaws.',
    cssClass: 'monster-abyssmaw'
  },
  {
    id: 'leviathan',
    name: 'Leviathan',
    type: 'water',
    rarity: 'incredible',
    baseHp: 175,
    baseAttack: 23,
    baseDefense: 22,
    description: 'The ancient lord of all oceans. Tides bow to its will.',
    cssClass: 'monster-leviathan'
  },

  // ── New Earth monsters ──
  {
    id: 'mosshorn',
    name: 'Mosshorn',
    type: 'earth',
    rarity: 'rare',
    baseHp: 105,
    baseAttack: 15,
    baseDefense: 16,
    description: 'A gentle beast with mossy antlers that bloom in spring.',
    cssClass: 'monster-mosshorn'
  },
  {
    id: 'quakebrute',
    name: 'Quakebrute',
    type: 'earth',
    rarity: 'legendary',
    baseHp: 155,
    baseAttack: 21,
    baseDefense: 22,
    description: 'Each step cracks the ground. Villages feel it coming from miles away.',
    cssClass: 'monster-quakebrute'
  },
  {
    id: 'terradon',
    name: 'Terradon',
    type: 'earth',
    rarity: 'incredible',
    baseHp: 165,
    baseAttack: 22,
    baseDefense: 25,
    description: 'A mountain given life. It has slept for a thousand years — until now.',
    cssClass: 'monster-terradon'
  },

  // ── New Cloud monsters ──
  {
    id: 'zephyrkit',
    name: 'Zephyrkit',
    type: 'cloud',
    rarity: 'rare',
    baseHp: 95,
    baseAttack: 16,
    baseDefense: 12,
    description: 'A playful kit that rides wind currents like a tiny acrobat.',
    cssClass: 'monster-zephyrkit'
  },
  {
    id: 'thundermane',
    name: 'Thundermane',
    type: 'cloud',
    rarity: 'legendary',
    baseHp: 150,
    baseAttack: 23,
    baseDefense: 17,
    description: 'A majestic stallion wreathed in crackling storm clouds.',
    cssClass: 'monster-thundermane'
  },

  // ── New Sand monsters ──
  {
    id: 'cactusbur',
    name: 'Cactusbur',
    type: 'sand',
    rarity: 'rare',
    baseHp: 100,
    baseAttack: 14,
    baseDefense: 17,
    description: 'A spiny critter that rolls through the desert like a tumbleweed.',
    cssClass: 'monster-cactusbur'
  },
  {
    id: 'miragefox',
    name: 'Miragefox',
    type: 'sand',
    rarity: 'epic',
    baseHp: 110,
    baseAttack: 21,
    baseDefense: 13,
    description: 'A cunning fox that shimmers in the heat, impossible to pin down.',
    cssClass: 'monster-miragefox'
  },
  {
    id: 'sphinxara',
    name: 'Sphinxara',
    type: 'sand',
    rarity: 'incredible',
    baseHp: 165,
    baseAttack: 25,
    baseDefense: 21,
    description: 'An ancient sphinx who speaks in riddles. Those who fail her test are turned to sand.',
    cssClass: 'monster-sphinxara'
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
