import { gameState } from '../game-state.js';
import { hatchEgg } from '../systems/hatch-engine.js';
import { $, wait, createMonsterSprite } from '../utils/helpers.js';

let navigateTo;

const EGG_TYPES = [
  { id: 'earth', name: 'Earth', icon: '\u{1F3D4}\uFE0F', topColor: '#6a994e', bottomColor: '#4a7c3a' },
  { id: 'water', name: 'Water', icon: '\u{1F30A}', topColor: '#48cae4', bottomColor: '#0096c7' },
  { id: 'cloud', name: 'Cloud', icon: '\u2601\uFE0F', topColor: '#b8c0ff', bottomColor: '#8a92d0' },
  { id: 'sand', name: 'Sand', icon: '\u{1F3DC}\uFE0F', topColor: '#e0a458', bottomColor: '#c4893a' },
  { id: 'fire', name: 'Fire', icon: '\u{1F525}', topColor: '#ff6b35', bottomColor: '#d4421e' },
  { id: 'dino', name: 'Dino', icon: '\u{1F996}', topColor: '#9b4ace', bottomColor: '#6b1a8a' },
  { id: 'dragon', name: 'Dragon', icon: '\u{1F409}', topColor: '#1fb874', bottomColor: '#0a5a3c' }
];

export function init(nav) {
  navigateTo = nav;
  $('#btn-hatch-back').addEventListener('click', () => navigateTo('menu'));
  $('#btn-hatch-no-eggs').addEventListener('click', () => navigateTo('menu'));
}

export function enter() {
  $('#egg-stage').hidden = true;
  $('#hatch-reveal').hidden = true;
  $('#btn-hatch-back').hidden = true;
  $('#btn-hatch-no-eggs').hidden = true;

  renderEggPicker();
}

export function exit() {}

function renderEggPicker() {
  const picker = $('#egg-picker');
  picker.hidden = false;
  picker.innerHTML = '';

  const hasAny = gameState.totalElementalEggs > 0;

  if (!hasAny) {
    picker.hidden = true;
    $('#btn-hatch-no-eggs').hidden = false;
    return;
  }

  for (const egg of EGG_TYPES) {
    const count = gameState.getElementalEggCount(egg.id);
    const card = document.createElement('div');
    card.className = 'egg-pick-card';
    if (count <= 0) card.classList.add('egg-pick-empty');

    card.innerHTML = `
      <div class="egg-pick-preview">
        <div class="egg-mini">
          <div class="egg-mini-top" style="background: linear-gradient(135deg, ${egg.topColor}, ${egg.bottomColor})"></div>
          <div class="egg-mini-bottom" style="background: linear-gradient(135deg, ${egg.bottomColor}, ${darken(egg.bottomColor)})"></div>
        </div>
      </div>
      <div class="egg-pick-info">
        <div class="egg-pick-name">${egg.icon} ${egg.name}</div>
        <div class="egg-pick-count">${count > 0 ? `x${count}` : 'None'}</div>
      </div>
    `;

    if (count > 0) {
      card.addEventListener('click', () => doHatch(egg));
    }

    picker.appendChild(card);
  }
}

function darken(hex) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - 30);
  const g = Math.max(0, ((num >> 8) & 0xff) - 30);
  const b = Math.max(0, (num & 0xff) - 30);
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

async function doHatch(eggType) {
  if (!gameState.useElementalEgg(eggType.id)) return;

  // Hide picker, show egg
  $('#egg-picker').hidden = true;

  // Color the egg
  const eggTop = document.querySelector('#hatch-egg .egg-top');
  const eggBottom = document.querySelector('#hatch-egg .egg-bottom');
  eggTop.style.background = `linear-gradient(135deg, ${eggType.topColor}, ${eggType.bottomColor})`;
  eggBottom.style.background = `linear-gradient(135deg, ${eggType.bottomColor}, ${darken(eggType.bottomColor)})`;

  const eggStage = $('#egg-stage');
  eggStage.hidden = false;
  eggStage.classList.remove('egg-wobbling', 'egg-wobbling-fast', 'egg-cracking');

  // Wobble phase
  eggStage.classList.add('egg-wobbling');
  await wait(400);
  eggStage.classList.remove('egg-wobbling');
  await wait(200);
  eggStage.classList.add('egg-wobbling');
  await wait(400);
  eggStage.classList.remove('egg-wobbling');
  await wait(200);

  // Fast wobble
  eggStage.classList.add('egg-wobbling-fast');
  await wait(1000);
  eggStage.classList.remove('egg-wobbling-fast');

  // Crack!
  eggStage.classList.add('egg-cracking');
  await wait(800);
  eggStage.hidden = true;

  // Hatch the monster from this element
  const monster = hatchEgg(eggType.id);
  const owned = gameState.addMonster(monster.id);
  gameState.addChallengeProgress('hatches');

  // Reveal
  const reveal = $('#hatch-reveal');
  reveal.hidden = false;

  const spriteContainer = $('#reveal-monster-sprite');
  spriteContainer.innerHTML = '';
  spriteContainer.appendChild(createMonsterSprite(monster.cssClass));

  $('#reveal-monster-name').textContent = monster.name;

  const typeBadge = $('#reveal-monster-type');
  typeBadge.textContent = monster.type;
  typeBadge.className = `type-badge type-${monster.type}`;

  const rarityBadge = $('#reveal-monster-rarity');
  rarityBadge.textContent = monster.rarity;
  rarityBadge.className = `rarity-badge rarity-${monster.rarity}`;

  $('#reveal-stats').innerHTML = `
    <span>HP: ${monster.baseHp}</span>
    <span>ATK: ${monster.baseAttack}</span>
    <span>DEF: ${monster.baseDefense}</span>
  `;

  // Add glow for epic+
  spriteContainer.classList.remove('glow-epic', 'glow-legendary', 'glow-incredible');
  if (monster.rarity === 'incredible') {
    spriteContainer.classList.add('glow-incredible');
  } else if (monster.rarity === 'legendary') {
    spriteContainer.classList.add('glow-legendary');
  } else if (monster.rarity === 'epic') {
    spriteContainer.classList.add('glow-epic');
  }

  $('#btn-hatch-back').hidden = false;
}
