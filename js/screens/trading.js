import { gameState } from '../game-state.js';
import { $, createMonsterSprite, shuffle } from '../utils/helpers.js';
import { getMonsterById, MONSTERS, RARITY_WEIGHTS } from '../data/monsters.js';

let navigateTo;
let offers = [];

// NPC traders with different personalities
const TRADERS = [
  { name: 'Grizzle', icon: '&#x1F9D9;', flavor: 'Hmm, I have something special today...', element: null },
  { name: 'Marina', icon: '&#x1F9DC;', flavor: 'Fresh from the deep!', element: 'water' },
  { name: 'Ember', icon: '&#x1F9DE;', flavor: 'Hot deals, literally.', element: 'fire' },
  { name: 'Mossworth', icon: '&#x1F333;', flavor: 'Nature provides...', element: 'earth' },
  { name: 'Zephyr', icon: '&#x1F32A;', flavor: 'Caught on the wind!', element: 'cloud' },
  { name: 'Dune', icon: '&#x1F3DC;', flavor: 'Desert treasures await.', element: 'sand' },
];

export function init(nav) {
  navigateTo = nav;
  $('#btn-trade-back').addEventListener('click', () => navigateTo('minigames'));
}

export function enter() {
  generateOffers();
  render();
}

export function exit() {}

function generateOffers() {
  offers = [];

  // Pick 2-3 random traders
  const traderPool = shuffle([...TRADERS]).slice(0, 3);

  for (const trader of traderPool) {
    // Each trader offers 1-2 trades
    const tradeCount = 1 + Math.floor(Math.random() * 2);

    for (let t = 0; t < tradeCount; t++) {
      const offer = generateOffer(trader);
      if (offer) offers.push(offer);
    }
  }
}

function generateOffer(trader) {
  const tradeType = Math.random();

  if (tradeType < 0.4 && gameState.monsters.length > 0) {
    // Monster-for-monster trade
    return generateMonsterTrade(trader);
  } else if (tradeType < 0.7) {
    // Gems-for-monster trade
    return generateGemForMonster(trader);
  } else {
    // Monster-for-gems trade
    return generateMonsterForGems(trader);
  }
}

function generateMonsterTrade(trader) {
  // Trader wants one of your monsters, offers a different one
  const pool = trader.element
    ? MONSTERS.filter(m => m.type === trader.element)
    : MONSTERS;

  if (pool.length === 0) return null;

  const offered = pool[Math.floor(Math.random() * pool.length)];
  const rarityValue = { common: 1, rare: 2, epic: 3, legendary: 4, incredible: 5 };

  // They want a monster of similar or lower rarity
  const wantRarity = Object.keys(rarityValue).filter(r =>
    rarityValue[r] <= rarityValue[offered.rarity] + 1 &&
    rarityValue[r] >= rarityValue[offered.rarity] - 1
  );

  const ownedOfRarity = gameState.monsters.filter(m => {
    const base = getMonsterById(m.id);
    return base && wantRarity.includes(base.rarity) && m.id !== offered.id;
  });

  if (ownedOfRarity.length === 0) return null;

  return {
    type: 'monster-for-monster',
    trader,
    offered: offered.id,
    wantRarity,
    description: `Trade a ${wantRarity.join('/')} monster for ${offered.name}`,
    completed: false
  };
}

function generateGemForMonster(trader) {
  const pool = trader.element
    ? MONSTERS.filter(m => m.type === trader.element)
    : MONSTERS;

  if (pool.length === 0) return null;

  const offered = pool[Math.floor(Math.random() * pool.length)];
  const costMap = { common: 30, rare: 60, epic: 120, legendary: 250, incredible: 500 };
  const cost = costMap[offered.rarity] || 50;

  return {
    type: 'gems-for-monster',
    trader,
    offered: offered.id,
    cost,
    description: `Buy ${offered.name} for ${cost} gems`,
    completed: false
  };
}

function generateMonsterForGems(trader) {
  if (gameState.monsters.length === 0) return null;

  const rewardMap = { common: 15, rare: 35, epic: 70, legendary: 150, incredible: 300 };

  return {
    type: 'monster-for-gems',
    trader,
    reward: rewardMap,
    description: 'Sell a monster for gems',
    completed: false
  };
}

function render() {
  const area = $('#trade-game-area');
  let html = `
    <div class="trade-header">
      <span class="gem-icon"></span> <span class="trade-gems">${gameState.gems} Gems</span>
      <span class="trade-monsters">${gameState.monsters.length} Monsters</span>
    </div>
    <div class="trade-offers">
  `;

  if (offers.length === 0) {
    html += '<p class="trade-empty">No traders today. Check back later!</p>';
  }

  for (let i = 0; i < offers.length; i++) {
    const o = offers[i];
    if (o.completed) continue;

    const monster = getMonsterById(o.offered);
    const traderHtml = `<span class="trade-trader-icon">${o.trader.icon}</span>`;

    html += `<div class="trade-card">
      <div class="trade-card-header">
        ${traderHtml}
        <div class="trade-trader-info">
          <span class="trade-trader-name">${o.trader.name}</span>
          <span class="trade-trader-flavor">${o.trader.flavor}</span>
        </div>
      </div>`;

    if (o.type === 'gems-for-monster') {
      html += `
        <div class="trade-offer-body">
          <div class="trade-monster-preview">
            <div class="trade-offer-sprite" data-css="${monster.cssClass}"></div>
            <span class="trade-monster-name">${monster.name}</span>
            <span class="rarity-badge rarity-${monster.rarity}">${monster.rarity}</span>
            <span class="type-badge type-${monster.type}">${monster.type}</span>
          </div>
          <p class="trade-cost">Cost: ${o.cost} gems</p>
          <button class="btn trade-btn" data-idx="${i}" ${gameState.gems < o.cost ? 'disabled' : ''}>
            Buy for ${o.cost} gems
          </button>
        </div>`;
    } else if (o.type === 'monster-for-monster') {
      html += `
        <div class="trade-offer-body">
          <div class="trade-monster-preview">
            <div class="trade-offer-sprite" data-css="${monster.cssClass}"></div>
            <span class="trade-monster-name">${monster.name}</span>
            <span class="rarity-badge rarity-${monster.rarity}">${monster.rarity}</span>
          </div>
          <p class="trade-wants">Wants: ${o.wantRarity.join(' / ')} rarity monster</p>
          <div class="trade-select-area" id="trade-select-${i}"></div>
          <button class="btn trade-btn trade-pick-btn" data-idx="${i}">Choose monster to trade</button>
        </div>`;
    } else if (o.type === 'monster-for-gems') {
      html += `
        <div class="trade-offer-body">
          <p class="trade-sell-info">Sell a monster for gems based on rarity</p>
          <div class="trade-price-list">
            <span>Common: 15g</span><span>Rare: 35g</span><span>Epic: 70g</span>
            <span>Legendary: 150g</span><span>Incredible: 300g</span>
          </div>
          <button class="btn trade-btn trade-sell-btn" data-idx="${i}">Choose monster to sell</button>
        </div>`;
    }

    html += '</div>';
  }

  html += '</div>';
  html += '<button class="btn btn-back" id="btn-trade-refresh">Refresh Traders</button>';
  area.innerHTML = html;

  // Add monster sprites
  area.querySelectorAll('.trade-offer-sprite').forEach(el => {
    el.appendChild(createMonsterSprite(el.dataset.css));
  });

  // Wire up buttons
  area.querySelectorAll('.trade-btn').forEach(btn => {
    const idx = parseInt(btn.dataset.idx);
    const offer = offers[idx];
    if (!offer) return;

    if (offer.type === 'gems-for-monster') {
      btn.addEventListener('click', () => buyMonster(idx));
    } else if (offer.type === 'monster-for-monster') {
      btn.addEventListener('click', () => showMonsterPicker(idx, 'trade'));
    } else if (offer.type === 'monster-for-gems') {
      btn.addEventListener('click', () => showMonsterPicker(idx, 'sell'));
    }
  });

  const refreshBtn = $('#btn-trade-refresh');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      generateOffers();
      render();
    });
  }
}

function buyMonster(offerIdx) {
  const offer = offers[offerIdx];
  if (!offer || offer.completed) return;
  if (!gameState.spendGems(offer.cost)) return;

  gameState.addMonster(offer.offered);
  offer.completed = true;
  gameState.addChallengeProgress('hatches'); // counts as acquiring a monster
  render();
}

function showMonsterPicker(offerIdx, mode) {
  const offer = offers[offerIdx];
  const area = $('#trade-game-area');

  let eligible;
  if (mode === 'trade') {
    eligible = gameState.monsters.map((m, i) => ({ m, i })).filter(({ m }) => {
      const base = getMonsterById(m.id);
      return base && offer.wantRarity.includes(base.rarity) && m.id !== offer.offered;
    });
  } else {
    eligible = gameState.monsters.map((m, i) => ({ m, i }));
  }

  if (eligible.length === 0) {
    return;
  }

  let html = '<div class="trade-picker-overlay">';
  html += `<h3>${mode === 'trade' ? 'Choose a monster to trade' : 'Choose a monster to sell'}</h3>`;
  html += '<div class="trade-picker-grid">';

  for (const { m, i } of eligible) {
    const base = getMonsterById(m.id);
    if (!base) continue;
    const reward = mode === 'sell' ? offer.reward[base.rarity] || 15 : 0;
    html += `
      <div class="trade-picker-card" data-mi="${i}" data-oi="${offerIdx}">
        <div class="trade-picker-sprite" data-css="${base.cssClass}"></div>
        <span>${base.name} Lv.${m.level}</span>
        <span class="rarity-badge rarity-${base.rarity}">${base.rarity}</span>
        ${reward ? `<span class="trade-gem-reward">+${reward}g</span>` : ''}
      </div>
    `;
  }

  html += '</div>';
  html += '<button class="btn btn-back trade-picker-cancel">Cancel</button>';
  html += '</div>';

  // Append overlay
  const overlay = document.createElement('div');
  overlay.className = 'trade-overlay-wrap';
  overlay.innerHTML = html;
  area.appendChild(overlay);

  // Add sprites
  overlay.querySelectorAll('.trade-picker-sprite').forEach(el => {
    el.appendChild(createMonsterSprite(el.dataset.css));
  });

  // Wire clicks
  overlay.querySelectorAll('.trade-picker-card').forEach(card => {
    card.addEventListener('click', () => {
      const mi = parseInt(card.dataset.mi);
      const oi = parseInt(card.dataset.oi);
      if (mode === 'trade') {
        executeTrade(oi, mi);
      } else {
        executeSell(oi, mi);
      }
      overlay.remove();
    });
  });

  overlay.querySelector('.trade-picker-cancel').addEventListener('click', () => {
    overlay.remove();
  });
}

function executeTrade(offerIdx, monsterIdx) {
  const offer = offers[offerIdx];
  if (!offer || offer.completed) return;

  // Remove the traded monster
  gameState.data.monsters.splice(monsterIdx, 1);
  if (gameState.data.activeMonsterIndex >= gameState.data.monsters.length) {
    gameState.data.activeMonsterIndex = Math.max(0, gameState.data.monsters.length - 1);
  }

  // Add the new monster
  gameState.addMonster(offer.offered);
  offer.completed = true;
  render();
}

function executeSell(offerIdx, monsterIdx) {
  const offer = offers[offerIdx];
  if (!offer || offer.completed) return;

  const monster = gameState.monsters[monsterIdx];
  const base = getMonsterById(monster.id);
  const reward = offer.reward[base.rarity] || 15;

  // Remove the sold monster
  gameState.data.monsters.splice(monsterIdx, 1);
  if (gameState.data.activeMonsterIndex >= gameState.data.monsters.length) {
    gameState.data.activeMonsterIndex = Math.max(0, gameState.data.monsters.length - 1);
  }
  gameState.addGems(reward);

  offer.completed = true;
  gameState.save();
  render();
}
