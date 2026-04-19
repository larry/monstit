const STORAGE_KEY = 'monstit_save';

const DEFAULT_STATE = {
  firstVisit: true,
  playerLevel: 1,
  playerXp: 0,
  gems: 0,
  eggs: 0,
  rareEggs: 0,
  elementalEggs: {
    earth: 0,
    water: 0,
    cloud: 0,
    sand: 0,
    fire: 0,
    dino: 0,
    dragon: 0
  },
  monsters: [],
  activeMonsterIndex: -1,
  items: {
    potion: 0,
    'power-boost': 0,
    'shield-charm': 0
  },
  battlePass: {
    premium: false,
    startDate: null,
    claimedFree: [],
    claimedPremium: [],
    lastClaimDate: null
  },
  challenges: {
    date: null,
    progress: {},
    claimed: []
  },
  redeemedCodes: [],
  customMonsters: [],
  worldProgress: {
    earth: 0,
    water: 0,
    cloud: 0,
    sand: 0,
    fire: 0,
    primeval: 0,
    dragon: 0
  }
};

export function loadGame() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      const state = {
        ...DEFAULT_STATE,
        items: { ...DEFAULT_STATE.items },
        battlePass: { ...DEFAULT_STATE.battlePass },
        ...parsed,
        items: { ...DEFAULT_STATE.items, ...(parsed.items || {}) },
        elementalEggs: { ...DEFAULT_STATE.elementalEggs, ...(parsed.elementalEggs || {}) },
        battlePass: { ...DEFAULT_STATE.battlePass, ...(parsed.battlePass || {}) },
        challenges: { ...DEFAULT_STATE.challenges, ...(parsed.challenges || {}) },
        worldProgress: { ...DEFAULT_STATE.worldProgress, ...(parsed.worldProgress || {}) }
      };
      // Migrate old monsters that don't have skin data
      state.monsters = state.monsters.map(m => ({
        skins: ['default'],
        activeSkin: 'default',
        ...m
      }));
      return state;
    }
  } catch (e) {
    console.warn('Failed to load save data:', e);
  }
  return { ...DEFAULT_STATE, items: { ...DEFAULT_STATE.items } };
}

export function saveGame(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save game:', e);
  }
}

export function clearSave() {
  localStorage.removeItem(STORAGE_KEY);
}
