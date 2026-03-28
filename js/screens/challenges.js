import { gameState } from '../game-state.js';
import { $ } from '../utils/helpers.js';

let navigateTo;

export function init(nav) {
  navigateTo = nav;
  $('#btn-challenges-back').addEventListener('click', () => navigateTo('menu'));
}

export function enter() {
  render();
}

export function exit() {}

function render() {
  const challenges = gameState.getDailyChallenges();
  const list = $('#challenges-list');
  list.innerHTML = '';

  for (const c of challenges) {
    const progress = gameState.getChallengeProgress(c.id);
    const complete = progress >= c.target;
    const claimed = gameState.isChallengeClaimed(c.id);
    const percent = Math.min(100, Math.floor((progress / c.target) * 100));

    const el = document.createElement('div');
    el.className = 'challenge-card';
    if (claimed) el.classList.add('challenge-claimed');
    if (complete && !claimed) el.classList.add('challenge-ready');

    el.innerHTML = `
      <div class="challenge-info">
        <div class="challenge-desc">${c.description}</div>
        <div class="challenge-progress-bar">
          <div class="challenge-progress-fill" style="width: ${percent}%"></div>
        </div>
        <div class="challenge-progress-text">${Math.min(progress, c.target)} / ${c.target}</div>
      </div>
      <div class="challenge-reward-section">
        <div class="challenge-gem-reward"><span class="gem-icon"></span>${c.gems}</div>
      </div>
    `;

    if (complete && !claimed) {
      const btn = document.createElement('button');
      btn.className = 'btn challenge-claim-btn';
      btn.textContent = 'Claim!';
      btn.addEventListener('click', () => {
        gameState.claimChallengeReward(c.id, c.gems);
        render();
      });
      el.querySelector('.challenge-reward-section').appendChild(btn);
    } else if (claimed) {
      const check = document.createElement('div');
      check.className = 'challenge-check';
      check.textContent = '\u2713 Claimed';
      el.querySelector('.challenge-reward-section').appendChild(check);
    }

    list.appendChild(el);
  }
}
