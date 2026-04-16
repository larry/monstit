import { gameState } from '../game-state.js';
import { getMonsterById } from '../data/monsters.js';
import { $, createMonsterSprite } from '../utils/helpers.js';

let navigateTo;

export function init(nav) {
  navigateTo = nav;

  $('#btn-redeem').addEventListener('click', handleRedeem);
  $('#code-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleRedeem();
  });
}

export function enter() {
  $('#code-input').value = '';
  $('#code-result').hidden = true;
  $('#code-result').className = 'code-result';
  $('#code-reward-display').hidden = true;
}

export function exit() {}

function handleRedeem() {
  const input = $('#code-input');
  const code = input.value.trim();

  if (!code) return;

  const result = gameState.redeemCode(code);
  const resultEl = $('#code-result');
  const rewardDisplay = $('#code-reward-display');

  resultEl.hidden = false;
  rewardDisplay.hidden = true;

  if (result.success) {
    resultEl.className = 'code-result code-success';
    resultEl.innerHTML = `<h3>Code Redeemed!</h3><p>${result.description}</p>`;

    // Show reward details
    rewardDisplay.hidden = false;
    rewardDisplay.innerHTML = '';

    for (const line of result.rewards) {
      const item = document.createElement('div');
      item.className = 'code-reward-item';
      item.textContent = line;
      rewardDisplay.appendChild(item);
    }

    // If a monster was rewarded, show its sprite
    const monsterReward = gameState.monsters[gameState.monsters.length - 1];
    if (monsterReward && result.rewards.some(r => r.includes('monster'))) {
      const base = getMonsterById(monsterReward.id);
      if (base) {
        const spriteWrap = document.createElement('div');
        spriteWrap.className = 'code-reward-sprite';
        spriteWrap.appendChild(createMonsterSprite(base.cssClass));
        rewardDisplay.prepend(spriteWrap);
      }
    }

    input.value = '';
  } else if (result.reason === 'already') {
    resultEl.className = 'code-result code-error';
    resultEl.innerHTML = '<h3>Already Redeemed</h3><p>You\'ve already used this code.</p>';
  } else {
    resultEl.className = 'code-result code-error';
    resultEl.innerHTML = '<h3>Invalid Code</h3><p>That code doesn\'t exist. Check for typos!</p>';
  }
}
