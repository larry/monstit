import * as menuScreen from './screens/menu.js';
import * as hatchScreen from './screens/hatch.js';
import * as collectionScreen from './screens/collection.js';
import * as shopScreen from './screens/shop.js';
import * as challengesScreen from './screens/challenges.js';
import * as battlePassScreen from './screens/battle-pass.js';
import * as battleSelectScreen from './screens/battle-select.js';
import * as battleScreen from './screens/battle.js';
import * as pvpScreen from './screens/pvp.js';
import * as pvpBattleScreen from './screens/pvp-battle.js';
import { playTrack, stopTrack, getMusicEnabled, setMusicEnabled } from './utils/music.js';
import { QuestionBank } from './data/questions.js';

const screens = {
  menu: { el: null, module: menuScreen },
  hatch: { el: null, module: hatchScreen },
  collection: { el: null, module: collectionScreen },
  shop: { el: null, module: shopScreen },
  challenges: { el: null, module: challengesScreen },
  'battle-pass': { el: null, module: battlePassScreen },
  'battle-select': { el: null, module: battleSelectScreen },
  battle: { el: null, module: battleScreen },
  pvp: { el: null, module: pvpScreen },
  'pvp-battle': { el: null, module: pvpBattleScreen },
  result: { el: null, module: null }
};

// Which music track each screen uses
const SCREEN_MUSIC = {
  menu: 'menu',
  hatch: 'menu',
  collection: 'menu',
  shop: 'menu',
  challenges: 'menu',
  'battle-pass': 'menu',
  'battle-select': 'menu',
  battle: 'battle',
  pvp: 'menu',
  'pvp-battle': 'battle',
  result: null // keeps whatever was playing
};

let currentScreen = null;
let currentBattleWorld = null;

function navigateTo(screenName) {
  if (currentScreen && screens[currentScreen]?.module?.exit) {
    screens[currentScreen].module.exit();
  }

  // Hide all screens
  for (const key of Object.keys(screens)) {
    if (screens[key].el) {
      screens[key].el.classList.remove('active');
    }
  }

  // Show target screen
  if (screens[screenName]?.el) {
    screens[screenName].el.classList.add('active');
  }

  currentScreen = screenName;

  if (screens[screenName]?.module?.enter) {
    screens[screenName].module.enter();
  }

  // Handle music
  if (getMusicEnabled()) {
    const track = SCREEN_MUSIC[screenName];
    if (track !== undefined) {
      if (track === null) {
        // keep current music (result screen)
      } else {
        playTrack(track);
      }
    }
  }
}

function startPvpBattle(data) {
  navigateTo('pvp-battle');
  pvpBattleScreen.startBattle(data);
}

function startBattle(worldId, level, topic) {
  currentBattleWorld = worldId;
  navigateTo('battle');

  // Play the world's music during battle
  if (getMusicEnabled()) {
    playTrack(worldId);
  }

  battleScreen.startBattle(worldId, level, topic);
}

async function init() {
  // Load question banks before anything else
  await QuestionBank.init();

  // Cache screen elements
  for (const key of Object.keys(screens)) {
    screens[key].el = document.getElementById(`screen-${key}`);
  }

  // Init screens that need references
  hatchScreen.init(navigateTo);
  shopScreen.init(navigateTo);
  challengesScreen.init(navigateTo);
  battlePassScreen.init(navigateTo);
  battleSelectScreen.init(navigateTo, startBattle);
  battleScreen.init(navigateTo);
  pvpScreen.init(navigateTo, startPvpBattle);
  pvpBattleScreen.init(navigateTo);

  // Wire up all data-screen buttons
  document.querySelectorAll('[data-screen]').forEach(btn => {
    btn.addEventListener('click', () => {
      navigateTo(btn.dataset.screen);
    });
  });

  // Music toggle button
  const musicBtn = document.getElementById('btn-music-toggle');
  if (musicBtn) {
    updateMusicButton(musicBtn);
    musicBtn.addEventListener('click', () => {
      const enabled = !getMusicEnabled();
      setMusicEnabled(enabled);
      updateMusicButton(musicBtn);
      if (enabled && currentScreen) {
        const track = SCREEN_MUSIC[currentScreen];
        if (track) playTrack(track);
      }
    });
  }

  // Start on menu
  navigateTo('menu');
}

function updateMusicButton(btn) {
  btn.textContent = getMusicEnabled() ? '\u{1F50A}' : '\u{1F507}';
  btn.title = getMusicEnabled() ? 'Music ON' : 'Music OFF';
}

document.addEventListener('DOMContentLoaded', init);
