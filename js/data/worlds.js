export const WORLDS = [
  {
    id: 'earth',
    name: 'Earth World',
    icon: '\u{1F3D4}\uFE0F',
    color: '#8cb369',
    bgGradient: 'linear-gradient(135deg, #2d4a22, #1a2e14)',
    description: 'Rocky mountains and deep caves.',
    levels: [
      { level: 1, name: 'Stone Path',     aiLevel: 1,  accuracy: 0.35, difficulty: 1, monsterPool: ['pebblit'],              gems: 5,  xp: 10 },
      { level: 2, name: 'Mossy Cave',      aiLevel: 3,  accuracy: 0.40, difficulty: 1, monsterPool: ['pebblit', 'dustling'],  gems: 8,  xp: 15 },
      { level: 3, name: 'Crystal Cavern',  aiLevel: 5,  accuracy: 0.45, difficulty: 1, monsterPool: ['pebblit', 'thornback'], gems: 10, xp: 20 },
      { level: 4, name: 'Tremor Ridge',    aiLevel: 7,  accuracy: 0.50, difficulty: 1, monsterPool: ['thornback', 'pebblit'], gems: 12, xp: 25 },
      { level: 5, name: 'Golem King',      aiLevel: 10, accuracy: 0.55, difficulty: 2, monsterPool: ['thornback'],            gems: 25, xp: 50, boss: true, bossName: 'Golem King', bossMonster: 'thornback', bossCssClass: 'monster-boss-golem', bossHpMult: 1.5, bossAtkMult: 1.3 },
    ]
  },
  {
    id: 'water',
    name: 'Water World',
    icon: '\u{1F30A}',
    color: '#00b4d8',
    bgGradient: 'linear-gradient(135deg, #023e8a, #011627)',
    description: 'Endless oceans and coral reefs.',
    levels: [
      { level: 1, name: 'Shallow Tide',    aiLevel: 5,  accuracy: 0.45, difficulty: 1, monsterPool: ['pondling'],               gems: 10, xp: 20 },
      { level: 2, name: 'Coral Reef',       aiLevel: 7,  accuracy: 0.50, difficulty: 1, monsterPool: ['pondling', 'tidecrawl'],  gems: 12, xp: 25 },
      { level: 3, name: 'Deep Trench',      aiLevel: 9,  accuracy: 0.55, difficulty: 2, monsterPool: ['tidecrawl', 'pondling'],  gems: 15, xp: 30 },
      { level: 4, name: 'Whirlpool',        aiLevel: 11, accuracy: 0.60, difficulty: 2, monsterPool: ['tidecrawl'],              gems: 18, xp: 35 },
      { level: 5, name: 'Tidal Guardian',   aiLevel: 14, accuracy: 0.65, difficulty: 2, monsterPool: ['tidecrawl'],              gems: 40, xp: 75, boss: true, bossName: 'Tidal Guardian', bossMonster: 'tidecrawl', bossCssClass: 'monster-boss-tidal', bossHpMult: 1.5, bossAtkMult: 1.3 },
    ]
  },
  {
    id: 'cloud',
    name: 'Cloud World',
    icon: '\u2601\uFE0F',
    color: '#b8c0ff',
    bgGradient: 'linear-gradient(135deg, #3a3d98, #1a1a4e)',
    description: 'Floating islands above the storms.',
    levels: [
      { level: 1, name: 'Misty Platform',   aiLevel: 9,  accuracy: 0.55, difficulty: 2, monsterPool: ['puffwisp'],               gems: 15, xp: 30 },
      { level: 2, name: 'Wind Tunnel',      aiLevel: 11, accuracy: 0.60, difficulty: 2, monsterPool: ['puffwisp', 'skywhale'],   gems: 18, xp: 35 },
      { level: 3, name: 'Thunder Spire',    aiLevel: 13, accuracy: 0.65, difficulty: 2, monsterPool: ['skywhale', 'puffwisp'],   gems: 22, xp: 40 },
      { level: 4, name: 'Eye of the Storm', aiLevel: 15, accuracy: 0.70, difficulty: 3, monsterPool: ['skywhale'],               gems: 25, xp: 50 },
      { level: 5, name: 'Storm Lord',       aiLevel: 18, accuracy: 0.75, difficulty: 3, monsterPool: ['skywhale'],               gems: 55, xp: 100, boss: true, bossName: 'Storm Lord', bossMonster: 'skywhale', bossCssClass: 'monster-boss-storm', bossHpMult: 1.6, bossAtkMult: 1.4 },
    ]
  },
  {
    id: 'sand',
    name: 'Sand World',
    icon: '\u{1F3DC}\uFE0F',
    color: '#e0a458',
    bgGradient: 'linear-gradient(135deg, #5c3d1a, #2a1a08)',
    description: 'Scorching deserts and hidden ruins.',
    levels: [
      { level: 1, name: 'Dune Trail',      aiLevel: 13, accuracy: 0.65, difficulty: 2, monsterPool: ['dustling'],                  gems: 22, xp: 40 },
      { level: 2, name: 'Sandstorm',        aiLevel: 15, accuracy: 0.70, difficulty: 2, monsterPool: ['dustling', 'sandstalker'],   gems: 25, xp: 50 },
      { level: 3, name: 'Buried Temple',    aiLevel: 17, accuracy: 0.75, difficulty: 3, monsterPool: ['sandstalker', 'dustling'],   gems: 30, xp: 60 },
      { level: 4, name: 'Quicksand Pit',    aiLevel: 19, accuracy: 0.80, difficulty: 3, monsterPool: ['sandstalker'],               gems: 35, xp: 70 },
      { level: 5, name: 'Dune Emperor',     aiLevel: 22, accuracy: 0.85, difficulty: 3, monsterPool: ['sandstalker'],               gems: 70, xp: 125, boss: true, bossName: 'Dune Emperor', bossMonster: 'sandstalker', bossCssClass: 'monster-boss-dune', bossHpMult: 1.7, bossAtkMult: 1.4 },
    ]
  },
  {
    id: 'fire',
    name: 'Fire World',
    icon: '\u{1F525}',
    color: '#ff6b35',
    bgGradient: 'linear-gradient(135deg, #6b1010, #2a0505)',
    description: 'Volcanoes and rivers of lava.',
    levels: [
      { level: 1, name: 'Ember Path',       aiLevel: 17, accuracy: 0.75, difficulty: 3, monsterPool: ['emberpup'],                gems: 30, xp: 60 },
      { level: 2, name: 'Lava Flow',        aiLevel: 19, accuracy: 0.80, difficulty: 3, monsterPool: ['emberpup', 'blazefang'],   gems: 35, xp: 70 },
      { level: 3, name: 'Inferno Cavern',   aiLevel: 21, accuracy: 0.82, difficulty: 3, monsterPool: ['blazefang', 'emberpup'],   gems: 40, xp: 80 },
      { level: 4, name: 'Magma Core',       aiLevel: 23, accuracy: 0.85, difficulty: 3, monsterPool: ['blazefang'],               gems: 50, xp: 100 },
      { level: 5, name: 'Inferno Beast',    aiLevel: 26, accuracy: 0.90, difficulty: 3, monsterPool: ['blazefang'],               gems: 100, xp: 200, boss: true, bossName: 'Inferno Beast', bossMonster: 'blazefang', bossCssClass: 'monster-boss-inferno', bossHpMult: 1.8, bossAtkMult: 1.5 },
    ]
  }
];

export function getWorld(worldId) {
  return WORLDS.find(w => w.id === worldId);
}

export function getLevel(worldId, levelNum) {
  const world = getWorld(worldId);
  return world?.levels.find(l => l.level === levelNum);
}
