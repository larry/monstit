import { gameState } from '../game-state.js';
import { SHOP_ITEMS } from '../data/shop-items.js';
import { $ } from '../utils/helpers.js';

let navigateTo;

export function init(nav) {
  navigateTo = nav;
}

export function enter() {
  renderShop();
}

export function exit() {}

function renderShop() {
  $('#shop-gems').textContent = gameState.gems;

  const grid = $('#shop-grid');
  grid.innerHTML = '';

  for (const item of SHOP_ITEMS) {
    const el = document.createElement('div');
    el.className = 'shop-item';

    const canAfford = gameState.gems >= item.cost;

    el.innerHTML = `
      <div style="font-size: 2rem">${item.icon}</div>
      <div class="item-name">${item.name}</div>
      <div class="item-cost">${item.cost} gems</div>
      <div class="item-desc">${item.description}</div>
    `;

    const btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.style.minWidth = 'auto';
    btn.style.padding = '8px 16px';
    btn.style.fontSize = '0.85rem';
    btn.textContent = 'Buy';
    btn.disabled = !canAfford;

    btn.addEventListener('click', () => {
      buyItem(item);
    });

    el.appendChild(btn);
    grid.appendChild(el);
  }

  renderInventory();
}

function buyItem(item) {
  if (!gameState.spendGems(item.cost)) return;

  if (item.type === 'egg') {
    gameState.addElementalEgg(item.eggType);
  } else if (item.type === 'battle-item') {
    gameState.addItem(item.id);
  }

  renderShop();
}

function renderInventory() {
  const grid = $('#inventory-grid');
  grid.innerHTML = '';

  const entries = [
    { label: '\u{1F3D4}\uFE0F Earth Eggs', count: gameState.getElementalEggCount('earth') },
    { label: '\u{1F30A} Water Eggs', count: gameState.getElementalEggCount('water') },
    { label: '\u2601\uFE0F Cloud Eggs', count: gameState.getElementalEggCount('cloud') },
    { label: '\u{1F3DC}\uFE0F Sand Eggs', count: gameState.getElementalEggCount('sand') },
    { label: '\u{1F525} Fire Eggs', count: gameState.getElementalEggCount('fire') },
    { label: '\u{1F996} Dino Eggs', count: gameState.getElementalEggCount('dino') },
    { label: 'Potions', count: gameState.getItemCount('potion') },
    { label: 'Power Boosts', count: gameState.getItemCount('power-boost') },
    { label: 'Shield Charms', count: gameState.getItemCount('shield-charm') },
  ];

  for (const entry of entries) {
    if (entry.count > 0) {
      const el = document.createElement('div');
      el.className = 'inventory-item';
      el.textContent = `${entry.label}: ${entry.count}`;
      grid.appendChild(el);
    }
  }

  if (grid.children.length === 0) {
    grid.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.85rem;">No items yet</p>';
  }
}
