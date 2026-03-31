import { gameState } from '../game-state.js';
import { getMonsterById } from '../data/monsters.js';
import { $, createMonsterSprite } from '../utils/helpers.js';

const SKINS = [
  { id: 'default', name: 'Default', cost: 0 },
  { id: 'silver', name: 'Silver', cost: 50 },
  { id: 'gold', name: 'Gold', cost: 150 }
];

let currentModalIndex = -1;

export function enter() {
  renderCollection();
}

export function exit() {
  closeModal();
}

function renderCollection() {
  const grid = $('#collection-grid');
  const empty = $('#collection-empty');
  grid.innerHTML = '';

  const monsters = gameState.monsters;

  if (monsters.length === 0) {
    empty.hidden = false;
    return;
  }

  empty.hidden = true;

  monsters.forEach((owned, index) => {
    const base = getMonsterById(owned.id);
    if (!base) return;

    const stats = gameState.getMonsterStats(owned);
    const card = document.createElement('div');
    card.className = 'monster-card';
    if (index === gameState.activeMonsterIndex) {
      card.classList.add('active-monster');
    }

    const sprite = createMonsterSprite(base.cssClass);
    sprite.classList.add('card-sprite');
    sprite.style.width = '60px';
    sprite.style.height = '60px';
    sprite.style.transform = 'scale(0.75)';
    if (owned.activeSkin && owned.activeSkin !== 'default') {
      sprite.classList.add(`skin-${owned.activeSkin}`);
    }

    card.appendChild(sprite);

    const nameEl = document.createElement('div');
    nameEl.className = 'card-name';
    nameEl.textContent = base.name;
    card.appendChild(nameEl);

    const levelEl = document.createElement('div');
    levelEl.className = 'card-level';
    levelEl.textContent = `Lv.${owned.level} | ${stats.hp} HP`;
    card.appendChild(levelEl);

    const typeBadge = document.createElement('span');
    typeBadge.className = `type-badge type-${base.type}`;
    typeBadge.textContent = base.type;
    typeBadge.style.fontSize = '0.7rem';
    typeBadge.style.padding = '2px 8px';
    card.appendChild(typeBadge);

    if (owned.activeSkin && owned.activeSkin !== 'default') {
      const skinBadge = document.createElement('span');
      skinBadge.className = `skin-badge skin-badge-${owned.activeSkin}`;
      skinBadge.textContent = owned.activeSkin;
      card.appendChild(skinBadge);
    }

    card.addEventListener('click', () => {
      gameState.setActiveMonster(index);
      openModal(index);
      renderCollection();
    });

    grid.appendChild(card);
  });
}

function openModal(monsterIndex) {
  const owned = gameState.monsters[monsterIndex];
  const base = getMonsterById(owned.id);
  if (!base) return;

  currentModalIndex = monsterIndex;
  const stats = gameState.getMonsterStats(owned);
  const modal = $('#monster-modal');

  // Sprite
  const spriteContainer = $('#modal-sprite');
  spriteContainer.innerHTML = '';
  const sprite = createMonsterSprite(base.cssClass);
  if (owned.activeSkin && owned.activeSkin !== 'default') {
    sprite.classList.add(`skin-${owned.activeSkin}`);
  }
  spriteContainer.appendChild(sprite);

  // Name & stats
  $('#modal-name').textContent = base.name;
  $('#modal-stats').innerHTML = `
    <span class="type-badge type-${base.type}" style="font-size:0.8rem;padding:2px 10px">${base.type}</span>
    <span class="rarity-badge rarity-${base.rarity}" style="font-size:0.8rem">${base.rarity}</span>
    <span>Lv.${owned.level}</span>
    <span>${stats.hp} HP</span>
    <span>${stats.attack} ATK</span>
    <span>${stats.defense} DEF</span>
    <span>${owned.wins}W / ${owned.losses}L</span>
  `;

  // Skins grid
  renderSkins(monsterIndex);

  // Show modal
  modal.hidden = false;

  // Close button
  $('#modal-close').onclick = () => closeModal();

  // Click overlay to close
  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };
}

function renderSkins(monsterIndex) {
  const owned = gameState.monsters[monsterIndex];
  const grid = $('#skins-grid');
  grid.innerHTML = '';
  const base = getMonsterById(owned.id);

  SKINS.forEach(skin => {
    const card = document.createElement('div');
    card.className = 'skin-card';

    const isOwned = owned.skins.includes(skin.id);
    const isActive = owned.activeSkin === skin.id;

    if (isActive) card.classList.add('skin-active');

    // Skin preview sprite
    const previewWrap = document.createElement('div');
    previewWrap.style.width = '60px';
    previewWrap.style.height = '60px';
    previewWrap.style.display = 'flex';
    previewWrap.style.alignItems = 'center';
    previewWrap.style.justifyContent = 'center';
    previewWrap.style.overflow = 'visible';

    const preview = createMonsterSprite(base.cssClass);
    preview.style.transform = 'scale(0.8)';
    preview.style.transformOrigin = 'center center';
    if (skin.id !== 'default') {
      preview.classList.add(`skin-${skin.id}`);
    }
    previewWrap.appendChild(preview);
    card.appendChild(previewWrap);

    const nameEl = document.createElement('div');
    nameEl.className = 'skin-name';
    nameEl.textContent = skin.name;
    card.appendChild(nameEl);

    if (isActive) {
      const badge = document.createElement('div');
      badge.className = 'skin-equipped';
      badge.textContent = 'Equipped';
      card.appendChild(badge);
    } else if (isOwned) {
      const btn = document.createElement('button');
      btn.className = 'btn skin-equip-btn';
      btn.textContent = 'Equip';
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        gameState.equipSkin(monsterIndex, skin.id);
        openModal(monsterIndex);
        renderCollection();
      });
      card.appendChild(btn);
    } else {
      const btn = document.createElement('button');
      btn.className = 'btn skin-buy-btn';
      btn.textContent = `${skin.cost} Gems`;
      if (gameState.gems < skin.cost) {
        btn.disabled = true;
      }
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (gameState.buySkin(monsterIndex, skin.id)) {
          openModal(monsterIndex);
          renderCollection();
        }
      });
      card.appendChild(btn);
    }

    grid.appendChild(card);
  });
}

function closeModal() {
  const modal = $('#monster-modal');
  if (modal) modal.hidden = true;
  currentModalIndex = -1;
}
