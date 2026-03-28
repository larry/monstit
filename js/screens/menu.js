import { gameState } from '../game-state.js';
import { $ } from '../utils/helpers.js';

export function enter() {
  updateDisplay();
}

export function exit() {}

function updateDisplay() {
  $('#menu-player-level').textContent = gameState.playerLevel;
  $('#menu-gems').textContent = gameState.gems;
  $('#menu-eggs').textContent = gameState.totalElementalEggs;

  const xpPercent = (gameState.playerXp / gameState.playerXpToNextLevel()) * 100;
  $('#menu-player-xp').style.width = `${xpPercent}%`;
}
