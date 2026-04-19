import { gameState } from '../game-state.js';
import { BattleState } from '../systems/battle-engine.js';
import { QuizSession } from '../systems/quiz.js';
import { pickAiMonster, aiDecideAttack } from '../systems/ai.js';
import { getBattleRewards } from '../systems/progression.js';
import { getShopItem } from '../data/shop-items.js';
import { getLevel } from '../data/worlds.js';
import { $, wait, createMonsterSprite } from '../utils/helpers.js';
import { playHit, playMiss, playHeal, playVictory, playDefeat } from '../utils/sfx.js';

let navigateTo;
let battleState;
let quizSession;
let currentWorldId;
let currentLevelNum;
let currentLevelData;
let missedThisBattle;

export function init(nav) {
  navigateTo = nav;
}

export function startBattle(worldId, levelNum, topic) {
  currentWorldId = worldId;
  currentLevelNum = levelNum;
  currentLevelData = getLevel(worldId, levelNum);
  missedThisBattle = false;

  const owned = gameState.activeMonster;
  const playerStats = gameState.getMonsterStats(owned);
  const opponentMonster = pickAiMonster(currentLevelData);

  // Apply boosts
  const boosts = {};
  if (gameState.getItemCount('power-boost') > 0) {
    const item = getShopItem('power-boost');
    boosts.attackBoost = item.value;
    gameState.useItem('power-boost');
  }
  if (gameState.getItemCount('shield-charm') > 0) {
    const item = getShopItem('shield-charm');
    boosts.defenseBoost = item.value;
    gameState.useItem('shield-charm');
  }

  battleState = new BattleState(playerStats, opponentMonster, boosts);
  quizSession = new QuizSession(currentLevelData.difficulty, topic || null);

  gameState.addChallengeProgress('battles');

  renderBattleSetup();
  startPlayerTurn();
}

function renderBattleSetup() {
  // Apply world theme
  const field = document.querySelector('#screen-battle .battle-field');
  field.className = 'battle-field';
  field.classList.add(`battle-field--${currentWorldId}`);

  // Remove old decorations and add new ones
  field.querySelectorAll('.world-decor').forEach(el => el.remove());
  const decor = document.createElement('div');
  decor.className = `world-decor world-decor--${currentWorldId}`;
  field.appendChild(decor);

  // Player
  $('#player-name').textContent = battleState.player.name;
  $('#player-level').textContent = `Lv.${battleState.player.level}`;
  const playerSlot = $('#player-sprite');
  playerSlot.innerHTML = '';
  const playerSprite = createMonsterSprite(battleState.player);
  const activeOwned = gameState.activeMonster;
  if (activeOwned && activeOwned.activeSkin && activeOwned.activeSkin !== 'default') {
    playerSprite.classList.add(`skin-${activeOwned.activeSkin}`);
  }
  playerSlot.appendChild(playerSprite);

  // Opponent
  const opponentName = currentLevelData.boss ? currentLevelData.bossName : battleState.opponent.name;
  $('#opponent-name').textContent = opponentName;
  $('#opponent-level').textContent = currentLevelData.boss ? 'BOSS' : `Lv.${battleState.opponent.level}`;
  const opponentSlot = $('#opponent-sprite');
  opponentSlot.innerHTML = '';
  const opponentSprite = createMonsterSprite(battleState.opponent);
  if (currentLevelData.boss) {
    opponentSlot.classList.add('boss-slot');
    opponentSprite.classList.add('boss-monster');
  } else {
    opponentSlot.classList.remove('boss-slot');
  }
  opponentSlot.appendChild(opponentSprite);

  updateHpBars();

  // Potion button
  const potionCount = gameState.getItemCount('potion');
  const potionBtn = $('#btn-use-potion');
  potionBtn.hidden = potionCount <= 0;
  $('#potion-count').textContent = potionCount;
  potionBtn.onclick = usePotion;

  $('#battle-items').hidden = false;
}

function updateHpBars() {
  const playerPercent = battleState.getPlayerHpPercent();
  const opponentPercent = battleState.getOpponentHpPercent();

  const playerHpBar = $('#player-hp');
  playerHpBar.style.width = `${playerPercent}%`;
  playerHpBar.className = 'hp-fill' +
    (playerPercent <= 25 ? ' hp-low' : playerPercent <= 50 ? ' hp-medium' : '');

  const opponentHpBar = $('#opponent-hp');
  opponentHpBar.style.width = `${opponentPercent}%`;
  opponentHpBar.className = 'hp-fill' +
    (opponentPercent <= 25 ? ' hp-low' : opponentPercent <= 50 ? ' hp-medium' : '');

  $('#player-hp-text').textContent = `${battleState.player.currentHp}/${battleState.player.hp}`;
  $('#opponent-hp-text').textContent = `${battleState.opponent.currentHp}/${battleState.opponent.hp}`;
}

function showMessage(text) {
  const msg = $('#battle-message');
  msg.textContent = text;
  msg.classList.add('visible');
  return new Promise(resolve => {
    setTimeout(() => {
      msg.classList.remove('visible');
      resolve();
    }, 1200);
  });
}

function showDamageNumber(slot, damage, isHeal = false) {
  const el = document.createElement('div');
  el.className = isHeal ? 'damage-number heal' : 'damage-number';
  el.textContent = isHeal ? `+${damage}` : `-${damage}`;
  const container = $(slot);
  container.style.position = 'relative';
  el.style.left = '50%';
  el.style.top = '10px';
  container.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

function showMissText(slot) {
  const el = document.createElement('div');
  el.className = 'miss-text';
  el.textContent = 'MISS';
  const container = $(slot);
  container.style.position = 'relative';
  el.style.left = '50%';
  el.style.top = '10px';
  container.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

function playAnimation(slot, animClass) {
  const sprite = $(slot)?.querySelector('.monster');
  if (!sprite) return Promise.resolve();
  sprite.classList.add(animClass);
  return new Promise(resolve => {
    setTimeout(() => {
      sprite.classList.remove(animClass);
      resolve();
    }, 500);
  });
}

function startPlayerTurn() {
  if (battleState.isOver) return;

  const quiz = $('#quiz-panel');
  quiz.hidden = false;

  const question = quizSession.getQuestion();
  $('#quiz-question').textContent = question.question;

  const answersEl = $('#quiz-answers');
  answersEl.innerHTML = '';

  question.answers.forEach((answer, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-answer';
    btn.textContent = answer;
    btn.addEventListener('click', () => handleAnswer(question, i, answersEl));
    answersEl.appendChild(btn);
  });
}

async function handleAnswer(question, answerIndex, answersEl) {
  const buttons = answersEl.querySelectorAll('.quiz-answer');
  buttons.forEach(b => b.disabled = true);

  const correct = quizSession.checkAnswer(question, answerIndex);

  // Highlight answers
  buttons[question.correctIndex].classList.add('correct');
  if (!correct) {
    buttons[answerIndex].classList.add('wrong');
  }

  await wait(600);
  $('#quiz-panel').hidden = true;

  if (correct) {
    gameState.addChallengeProgress('correct');

    // Player attacks
    await playAnimation('#player-sprite', 'attack-lunge-right');
    const result = battleState.playerAttack();
    playHit();
    await playAnimation('#opponent-sprite', 'damage-shake');
    showDamageNumber('#opponent-sprite', result.damage);
    updateHpBars();

    if (battleState.isOver) {
      await handleBattleEnd();
      return;
    }

    // After correct answer, enemy may get a free attack if player HP is above 40%
    const hpPercent = battleState.getPlayerHpPercent();
    if (hpPercent > 40) {
      await wait(400);
      const hits = aiDecideAttack(currentLevelData.accuracy);
      if (hits) {
        await enemyAttack();
        if (battleState.isOver) return;
      } else {
        battleState.opponentMiss();
        playMiss();
        showMissText('#opponent-sprite');
        await showMessage('Enemy missed!');
      }
    } else {
      await wait(200);
      await showMessage('Enemy holds back...');
    }
  } else {
    // Wrong answer — enemy punishes with one attack
    missedThisBattle = true;
    playMiss();
    await showMessage('Wrong answer!');
    await wait(300);
    await enemyAttack();
    if (battleState.isOver) return;
  }

  await wait(400);
  startPlayerTurn();
}

async function enemyAttack() {
  await playAnimation('#opponent-sprite', 'attack-lunge-left');
  const result = battleState.opponentAttack();
  playHit();
  await playAnimation('#player-sprite', 'damage-shake');
  showDamageNumber('#player-sprite', result.damage);
  updateHpBars();

  if (battleState.isOver) {
    await handleBattleEnd();
  }
}

async function usePotion() {
  if (battleState.potionUsed) return;
  if (gameState.getItemCount('potion') <= 0) return;

  const item = getShopItem('potion');
  gameState.useItem('potion');
  const healed = battleState.usePotion(item.value);

  if (healed !== false) {
    playHeal();
    showDamageNumber('#player-sprite', healed, true);
    updateHpBars();
    await showMessage(`Healed ${healed} HP!`);
  }

  $('#btn-use-potion').hidden = true;
}

async function handleBattleEnd() {
  const won = battleState.winner === 'player';
  const monsterIndex = gameState.activeMonsterIndex;

  if (won) {
    const opponentSprite = $('#opponent-sprite').querySelector('.monster');
    if (opponentSprite) opponentSprite.classList.add('faint');
    playVictory();
    await wait(1000);
    gameState.recordWin(monsterIndex);
    gameState.addChallengeProgress('wins');
    if (!missedThisBattle) gameState.addChallengeProgress('perfectBattle');
    if (currentLevelData.boss) gameState.addChallengeProgress('bossWins');
    gameState.completeLevel(currentWorldId, currentLevelNum);
  } else {
    const playerSprite = $('#player-sprite').querySelector('.monster');
    if (playerSprite) playerSprite.classList.add('faint');
    playDefeat();
    await wait(1000);
    gameState.recordLoss(monsterIndex);
  }

  // Calculate rewards
  const rewards = getBattleRewards(currentLevelData, won);
  const monsterLevelUps = gameState.addMonsterXp(monsterIndex, rewards.monsterXp);
  const playerLevelUps = gameState.addPlayerXp(rewards.playerXp);

  if (rewards.gems > 0) {
    gameState.addGems(rewards.gems);
  }

  showResult(won, rewards, monsterLevelUps, playerLevelUps);
}

function showResult(won, rewards, monsterLevelUps, playerLevelUps) {
  const isBoss = currentLevelData.boss;
  let title = won ? 'Victory!' : 'Defeat...';
  if (won && isBoss) title = `${currentLevelData.bossName} Defeated!`;

  $('#result-title').textContent = title;
  $('#result-title').style.color = won ? '#4caf50' : '#f44336';
  $('#result-monster-xp').textContent = rewards.monsterXp;
  $('#result-player-xp').textContent = rewards.playerXp;
  $('#result-gems').textContent = rewards.gems;
  $('#result-gems-section').hidden = !won;

  const levelUpEl = $('#result-levelup');
  const lines = [];
  if (monsterLevelUps.length > 0) {
    lines.push(`Monster leveled up to Lv.${monsterLevelUps[monsterLevelUps.length - 1]}!`);
  }
  if (playerLevelUps.length > 0) {
    lines.push(`Player leveled up to Lv.${playerLevelUps[playerLevelUps.length - 1]}!`);
  }
  if (won && isBoss) {
    lines.push('New world unlocked!');
  }
  if (lines.length > 0) {
    levelUpEl.hidden = false;
    $('#result-levelup-text').innerHTML = lines.join('<br>');
  } else {
    levelUpEl.hidden = true;
  }

  navigateTo('result');
}

export function exit() {
  $('#quiz-panel').hidden = true;
  $('#battle-message').classList.remove('visible');
  $('#opponent-sprite').classList.remove('boss-slot');
}
