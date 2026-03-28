import { gameState } from '../game-state.js';
import { BATTLE_PASS_REWARDS, BATTLE_PASS_DAYS, PREMIUM_COST } from '../data/battle-pass.js';
import { $ } from '../utils/helpers.js';

let navigateTo;

export function init(nav) {
  navigateTo = nav;
  $('#btn-bp-back').addEventListener('click', () => navigateTo('menu'));
  $('#btn-buy-premium').addEventListener('click', buyPremium);
}

export function enter() {
  gameState.initBattlePass();
  render();
}

export function exit() {}

function render() {
  const currentDay = gameState.getBattlePassDay();
  const isPremium = gameState.hasPremiumPass;

  // Header info
  $('#bp-current-day').textContent = currentDay;
  $('#bp-total-days').textContent = BATTLE_PASS_DAYS;
  $('#bp-gems').textContent = gameState.gems;

  // Premium button
  const premiumBtn = $('#btn-buy-premium');
  if (isPremium) {
    premiumBtn.textContent = 'Premium Active';
    premiumBtn.disabled = true;
    premiumBtn.classList.add('premium-active');
  } else {
    premiumBtn.textContent = `Unlock Premium (${PREMIUM_COST.toLocaleString()} Gems)`;
    premiumBtn.disabled = gameState.gems < PREMIUM_COST;
    premiumBtn.classList.remove('premium-active');
  }

  // Render reward track
  const track = $('#bp-track');
  track.innerHTML = '';

  for (const entry of BATTLE_PASS_REWARDS) {
    const dayEl = document.createElement('div');
    dayEl.className = 'bp-day';

    const isUnlocked = entry.day <= currentDay;
    const freeClaimed = gameState.hasClaimedFree(entry.day);
    const premiumClaimed = gameState.hasClaimedPremium(entry.day);

    if (!isUnlocked) dayEl.classList.add('bp-locked');
    if (entry.day === currentDay) dayEl.classList.add('bp-today');

    // Day number
    const dayNum = document.createElement('div');
    dayNum.className = 'bp-day-num';
    dayNum.textContent = `Day ${entry.day}`;
    dayEl.appendChild(dayNum);

    // Free reward
    const freeSlot = document.createElement('div');
    freeSlot.className = 'bp-reward bp-reward-free';
    if (freeClaimed) freeSlot.classList.add('bp-claimed');

    freeSlot.innerHTML = `
      <div class="bp-reward-label">FREE</div>
      <div class="bp-reward-value">${entry.free.label}</div>
    `;

    if (isUnlocked && !freeClaimed) {
      const claimBtn = document.createElement('button');
      claimBtn.className = 'btn bp-claim-btn';
      claimBtn.textContent = 'Claim';
      claimBtn.addEventListener('click', () => claimFree(entry.day, entry.free));
      freeSlot.appendChild(claimBtn);
    } else if (freeClaimed) {
      const check = document.createElement('div');
      check.className = 'bp-check';
      check.textContent = '\u2713';
      freeSlot.appendChild(check);
    }

    dayEl.appendChild(freeSlot);

    // Premium reward
    const premSlot = document.createElement('div');
    premSlot.className = 'bp-reward bp-reward-premium';
    if (premiumClaimed) premSlot.classList.add('bp-claimed');
    if (!isPremium) premSlot.classList.add('bp-locked-premium');

    premSlot.innerHTML = `
      <div class="bp-reward-label">PREMIUM</div>
      <div class="bp-reward-value">${entry.premium.label}</div>
    `;

    if (isPremium && isUnlocked && !premiumClaimed) {
      const claimBtn = document.createElement('button');
      claimBtn.className = 'btn bp-claim-btn bp-claim-premium';
      claimBtn.textContent = 'Claim';
      claimBtn.addEventListener('click', () => claimPremium(entry.day, entry.premium));
      premSlot.appendChild(claimBtn);
    } else if (premiumClaimed) {
      const check = document.createElement('div');
      check.className = 'bp-check';
      check.textContent = '\u2713';
      premSlot.appendChild(check);
    } else if (!isPremium) {
      const lock = document.createElement('div');
      lock.className = 'bp-lock-icon';
      lock.textContent = '\u{1F512}';
      premSlot.appendChild(lock);
    }

    dayEl.appendChild(premSlot);
    track.appendChild(dayEl);
  }

  // Auto-scroll to current day
  const todayEl = track.querySelector('.bp-today');
  if (todayEl) {
    setTimeout(() => todayEl.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
  }
}

function claimFree(day, reward) {
  if (gameState.claimFreeReward(day)) {
    gameState.grantReward(reward);
    render();
  }
}

function claimPremium(day, reward) {
  if (gameState.claimPremiumReward(day)) {
    gameState.grantReward(reward);
    render();
  }
}

function buyPremium() {
  if (gameState.buyPremiumPass()) {
    render();
  }
}
