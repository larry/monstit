import { gameState } from '../game-state.js';
import { getMonsterById } from '../data/monsters.js';
import { WORLDS } from '../data/worlds.js';
import { TOPIC_CATEGORIES } from '../data/questions.js';
import { $, createMonsterSprite } from '../utils/helpers.js';

let navigateTo;
let onStartBattle;
let selectedWorld = null;

export function init(nav, startBattle) {
  navigateTo = nav;
  onStartBattle = startBattle;
}

export function enter() {
  selectedWorld = null;
  renderWorldMap();
}

export function exit() {}

function renderWorldMap() {
  const container = $('#battle-select-content');
  container.innerHTML = '';

  const hasMonster = gameState.activeMonster !== null;

  if (!hasMonster) {
    container.innerHTML = '<div class="no-monster-msg"><p>Hatch a monster first, then come back to battle!</p></div>';
    return;
  }

  // Active monster preview
  const active = gameState.activeMonster;
  const base = active ? getMonsterById(active.id) : null;
  if (!base) {
    container.innerHTML = '<div class="no-monster-msg"><p>Hatch a monster first, then come back to battle!</p></div>';
    return;
  }
  const stats = gameState.getMonsterStats(active);

  const preview = document.createElement('div');
  preview.className = 'active-monster-mini';
  const sprite = createMonsterSprite(base.cssClass);
  sprite.style.transform = 'scale(0.8)';
  if (active.activeSkin && active.activeSkin !== 'default') {
    sprite.classList.add(`skin-${active.activeSkin}`);
  }
  preview.appendChild(sprite);
  preview.innerHTML += `<span class="mini-name">${base.name} Lv.${stats.level}</span>`;
  container.appendChild(preview);

  // World cards
  const worldGrid = document.createElement('div');
  worldGrid.className = 'world-grid';

  for (const world of WORLDS) {
    const unlocked = gameState.isWorldUnlocked(world.id);
    const progress = gameState.getWorldProgress(world.id);

    const card = document.createElement('div');
    card.className = 'world-card';
    if (!unlocked) card.classList.add('world-locked');
    if (progress >= 5) card.classList.add('world-complete');

    card.style.borderColor = unlocked ? world.color : '#333';

    card.innerHTML = `
      <div class="world-icon">${world.icon}</div>
      <div class="world-info">
        <div class="world-name" style="color: ${unlocked ? world.color : 'var(--text-secondary)'}">${world.name}</div>
        <div class="world-progress-text">${unlocked ? (progress >= 5 ? 'Complete!' : `${progress}/5`) : 'Locked'}</div>
        <div class="world-progress-bar">
          <div class="world-progress-fill" style="width: ${(progress / 5) * 100}%; background: ${world.color}"></div>
        </div>
      </div>
    `;

    if (unlocked) {
      card.addEventListener('click', () => showLevels(world));
    }

    worldGrid.appendChild(card);
  }

  container.appendChild(worldGrid);
}

function showLevels(world) {
  selectedWorld = world;
  const container = $('#battle-select-content');
  container.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'level-header';
  header.innerHTML = `
    <button class="btn btn-back level-back-btn" id="btn-level-back">Back</button>
    <h3 style="color: ${world.color}">${world.icon} ${world.name}</h3>
    <p class="world-desc">${world.description}</p>
  `;
  container.appendChild(header);
  document.getElementById('btn-level-back').addEventListener('click', () => {
    selectedWorld = null;
    renderWorldMap();
  });

  const levelList = document.createElement('div');
  levelList.className = 'level-list';

  for (const levelData of world.levels) {
    const unlocked = gameState.isLevelUnlocked(world.id, levelData.level);
    const cleared = gameState.getWorldProgress(world.id) >= levelData.level;

    const el = document.createElement('div');
    el.className = 'level-card';
    if (!unlocked) el.classList.add('level-locked');
    if (cleared) el.classList.add('level-cleared');
    if (levelData.boss) el.classList.add('level-boss');

    el.style.background = unlocked ? world.bgGradient : '';

    el.innerHTML = `
      <div class="level-num">${levelData.boss ? '\u{1F451}' : levelData.level}</div>
      <div class="level-info">
        <div class="level-name">${levelData.name}</div>
        <div class="level-rewards">${unlocked ? `+${levelData.xp} XP \u00B7 +${levelData.gems} gems` : 'Locked'}</div>
      </div>
      <div class="level-status">${cleared ? '\u2713' : (unlocked ? 'GO' : '\u{1F512}')}</div>
    `;

    if (unlocked) {
      el.addEventListener('click', () => {
        showTopicPicker(world, levelData);
      });
    }

    levelList.appendChild(el);
  }

  container.appendChild(levelList);
}

function showTopicPicker(world, levelData) {
  const container = $('#battle-select-content');
  container.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'level-header';
  header.innerHTML = `
    <button class="btn btn-back level-back-btn" id="btn-topic-back">Back</button>
    <h3>Pick a Topic</h3>
    <p class="world-desc">${world.icon} ${world.name} - ${levelData.name}</p>
  `;
  container.appendChild(header);
  document.getElementById('btn-topic-back').addEventListener('click', () => {
    showLevels(world);
  });

  const topicGrid = document.createElement('div');
  topicGrid.className = 'topic-grid';

  for (const topic of TOPIC_CATEGORIES) {
    const card = document.createElement('div');
    card.className = 'topic-card';
    card.style.borderColor = topic.color;

    card.innerHTML = `
      <div class="topic-icon">${topic.icon}</div>
      <div class="topic-name" style="color: ${topic.color}">${topic.name}</div>
    `;

    card.addEventListener('click', () => {
      onStartBattle(world.id, levelData.level, topic.id);
    });

    topicGrid.appendChild(card);
  }

  container.appendChild(topicGrid);
}
