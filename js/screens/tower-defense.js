import { gameState } from '../game-state.js';
import { $, createMonsterSprite, wait, randomInt } from '../utils/helpers.js';
import { QuizSession } from '../systems/quiz.js';
import { getMonsterById, MONSTERS } from '../data/monsters.js';

let navigateTo;
let quiz;
let gameActive = false;

// Grid: 5 columns x 4 rows, enemies walk left-to-right along row paths
const COLS = 5;
const ROWS = 4;
let grid; // grid[row][col] = null | { monsterId, level, cooldown }
let enemies; // array of { row, col (float), hp, maxHp, speed, name, type }
let wave, maxWaves;
let lives, score;
let waveTimer;
let tickInterval;
let placingMonsterIndex; // index into gameState.monsters

export function init(nav) {
  navigateTo = nav;
  $('#btn-td-back').addEventListener('click', () => {
    stopGame();
    navigateTo('minigames');
  });
}

export function enter() {
  if (!gameState.activeMonster) {
    $('#td-game-area').innerHTML = '<p class="no-monster-msg">You need a monster first! Hatch an egg.</p>';
    return;
  }
  showSetup();
}

export function exit() {
  stopGame();
}

function stopGame() {
  gameActive = false;
  clearInterval(tickInterval);
  clearTimeout(waveTimer);
}

function showSetup() {
  const area = $('#td-game-area');
  area.innerHTML = `
    <div class="td-setup">
      <p class="td-instructions">Place your monsters on the grid to defend against enemy waves. Answer quiz questions to power up your towers!</p>
      <div class="td-difficulty">
        <button class="btn td-diff-btn" data-waves="5">Easy (5 waves)</button>
        <button class="btn td-diff-btn" data-waves="8">Normal (8 waves)</button>
        <button class="btn td-diff-btn" data-waves="12">Hard (12 waves)</button>
      </div>
    </div>
  `;

  area.querySelectorAll('.td-diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      maxWaves = parseInt(btn.dataset.waves);
      startGame();
    });
  });
}

function startGame() {
  gameActive = true;
  grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  enemies = [];
  wave = 0;
  lives = 10;
  score = 0;
  placingMonsterIndex = null;

  const difficulty = Math.min(3, Math.ceil(gameState.playerLevel / 3));
  quiz = new QuizSession(difficulty);

  render();
  spawnNextWave();

  tickInterval = setInterval(() => {
    if (gameActive) tick();
  }, 600);
}

function render() {
  const area = $('#td-game-area');
  area.innerHTML = `
    <div class="td-hud">
      <span class="td-lives">Lives: ${lives}</span>
      <span class="td-wave">Wave ${wave}/${maxWaves}</span>
      <span class="td-score">Score: ${score}</span>
    </div>
    <div class="td-grid" id="td-grid">
      ${renderGrid()}
    </div>
    <div class="td-controls">
      <div class="td-monster-picker" id="td-picker">
        <p class="td-pick-label">Place a tower:</p>
        <div class="td-pick-list" id="td-pick-list"></div>
      </div>
      <div class="td-quiz-area" id="td-quiz-area"></div>
    </div>
  `;

  // Wire grid cells
  const gridEl = $('#td-grid');
  gridEl.querySelectorAll('.td-cell').forEach(cell => {
    cell.addEventListener('click', () => {
      const r = parseInt(cell.dataset.row);
      const c = parseInt(cell.dataset.col);
      placeMonster(r, c);
    });
  });

  // Render monster picker
  renderPicker();
}

function renderGrid() {
  let html = '';
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const tower = grid[r][c];
      let content = '';
      let cls = 'td-cell';

      if (tower) {
        const base = getMonsterById(tower.monsterId);
        const typeColors = { fire: '#ff6b35', water: '#00b4d8', earth: '#8cb369', cloud: '#b8c0ff', sand: '#e0a458' };
        const color = typeColors[base.type] || '#fff';
        content = `<div class="td-tower" style="color:${color}" title="${base.name}">&#x25C6;</div>`;
        cls += ' td-cell-tower';
        if (tower.cooldown > 0) cls += ' td-cell-cooldown';
      }

      // Check for enemies in this cell
      const enemiesHere = enemies.filter(e => e.row === r && Math.floor(e.col) === c);
      if (enemiesHere.length > 0) {
        const e = enemiesHere[0];
        const hpPct = Math.round((e.hp / e.maxHp) * 100);
        content += `<div class="td-enemy" title="${e.name} (${e.hp}/${e.maxHp})">
          <div class="td-enemy-hp"><div class="td-enemy-hp-fill" style="width:${hpPct}%"></div></div>
          &#x1F47E;
        </div>`;
        cls += ' td-cell-enemy';
      }

      html += `<div class="${cls}" data-row="${r}" data-col="${c}">${content}</div>`;
    }
  }
  return html;
}

function renderPicker() {
  const list = $('#td-pick-list');
  if (!list) return;

  const placed = new Set();
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (grid[r][c]) placed.add(grid[r][c].monsterIndex);
    }
  }

  let html = '';
  gameState.monsters.forEach((m, i) => {
    if (placed.has(i)) return;
    const base = getMonsterById(m.id);
    if (!base) return;
    const selected = placingMonsterIndex === i ? ' td-pick-selected' : '';
    html += `<button class="td-pick-btn${selected}" data-idx="${i}" title="${base.name} Lv.${m.level}">${base.name.slice(0, 6)}</button>`;
  });

  if (!html) html = '<span class="td-no-towers">All placed!</span>';
  list.innerHTML = html;

  list.querySelectorAll('.td-pick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      placingMonsterIndex = parseInt(btn.dataset.idx);
      renderPicker();
    });
  });
}

function placeMonster(row, col) {
  if (!gameActive || placingMonsterIndex === null) return;
  if (grid[row][col]) return;

  const monster = gameState.monsters[placingMonsterIndex];
  if (!monster) return;

  grid[row][col] = {
    monsterId: monster.id,
    monsterIndex: placingMonsterIndex,
    level: monster.level,
    cooldown: 0
  };

  placingMonsterIndex = null;
  render();
}

function spawnNextWave() {
  if (!gameActive) return;
  wave++;
  if (wave > maxWaves) {
    // All waves done, wait for remaining enemies
    return;
  }

  const enemyCount = 2 + wave;
  const baseHp = 20 + wave * 15;

  for (let i = 0; i < enemyCount; i++) {
    const row = randomInt(0, ROWS - 1);
    const types = ['fire', 'water', 'earth', 'cloud', 'sand'];
    const type = types[randomInt(0, types.length - 1)];
    const isBoss = i === enemyCount - 1 && wave % 3 === 0;

    enemies.push({
      row,
      col: -1 - i * 0.8, // stagger spawn
      hp: isBoss ? baseHp * 3 : baseHp,
      maxHp: isBoss ? baseHp * 3 : baseHp,
      speed: isBoss ? 0.3 : 0.5,
      name: isBoss ? 'BOSS' : `Wave ${wave}`,
      type,
      boss: isBoss
    });
  }

  // Schedule next wave
  if (wave < maxWaves) {
    waveTimer = setTimeout(() => spawnNextWave(), 8000);
  }
}

function tick() {
  if (!gameActive) return;

  // Move enemies
  for (const enemy of enemies) {
    enemy.col += enemy.speed;
  }

  // Check enemies that passed through
  const passed = enemies.filter(e => e.col >= COLS);
  lives -= passed.length;
  enemies = enemies.filter(e => e.col < COLS);

  // Towers attack
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const tower = grid[r][c];
      if (!tower || tower.cooldown > 0) {
        if (tower) tower.cooldown--;
        continue;
      }

      // Find nearest enemy in same row
      const target = enemies
        .filter(e => e.row === r && e.col >= 0)
        .sort((a, b) => a.col - b.col)[0];

      if (target) {
        const base = getMonsterById(tower.monsterId);
        const damage = base.baseAttack + tower.level * 2;
        target.hp -= damage;
        tower.cooldown = 2;

        if (target.hp <= 0) {
          score += target.boss ? 30 : 10;
          enemies = enemies.filter(e => e !== target);
        }
      }
    }
  }

  // Check lose condition
  if (lives <= 0) {
    lives = 0;
    endGame(false);
    return;
  }

  // Check win condition: all waves spawned and no enemies left
  if (wave >= maxWaves && enemies.length === 0) {
    endGame(true);
    return;
  }

  render();

  // Randomly trigger a quiz question for bonus damage
  if (Math.random() < 0.2 && enemies.length > 0) {
    showQuizBonus();
  }
}

function showQuizBonus() {
  const quizArea = $('#td-quiz-area');
  if (!quizArea || quizArea.children.length > 0) return;

  const question = quiz.getQuestion();
  quizArea.innerHTML = `
    <p class="td-quiz-prompt">Bonus Attack!</p>
    <p class="td-quiz-q">${question.question}</p>
    <div class="td-quiz-answers">
      ${question.answers.map((a, i) => `<button class="btn td-quiz-btn" data-idx="${i}">${a}</button>`).join('')}
    </div>
  `;

  quizArea.querySelectorAll('.td-quiz-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const correct = quiz.checkAnswer(question, parseInt(btn.dataset.idx));
      if (correct) {
        // Deal massive damage to all enemies
        for (const e of enemies) {
          e.hp -= 30;
        }
        enemies = enemies.filter(e => e.hp > 0);
        score += 15;
        gameState.addChallengeProgress('correct_answers');
        quizArea.innerHTML = '<p class="td-quiz-result td-correct">Bonus damage dealt!</p>';
      } else {
        quizArea.innerHTML = '<p class="td-quiz-result td-wrong">Missed! No bonus.</p>';
      }
      setTimeout(() => { if (quizArea) quizArea.innerHTML = ''; }, 1500);
    });
  });
}

function endGame(won) {
  stopGame();

  let gems = 0;
  let xp = 0;

  if (won) {
    gems = 20 + score;
    xp = 25 + Math.floor(score / 2);
    gameState.recordWin(gameState.activeMonsterIndex);
    gameState.addChallengeProgress('wins');
  } else {
    gems = 5 + Math.floor(score / 3);
    xp = 10 + Math.floor(score / 4);
    gameState.recordLoss(gameState.activeMonsterIndex);
  }

  gameState.addGems(gems);
  gameState.addPlayerXp(xp);
  gameState.addMonsterXp(gameState.activeMonsterIndex, xp);
  gameState.addChallengeProgress('battles');

  const area = $('#td-game-area');
  area.innerHTML = `
    <div class="td-result">
      <h3>${won ? 'Victory!' : 'Defeat!'}</h3>
      <p>Waves survived: ${Math.min(wave, maxWaves)}/${maxWaves}</p>
      <p>Score: ${score}</p>
      <div class="td-rewards">
        <p>+${gems} Gems</p>
        <p>+${xp} XP</p>
      </div>
      <button class="btn btn-primary" id="btn-td-again">Play Again</button>
      <button class="btn btn-back" id="btn-td-result-back">Back</button>
    </div>
  `;

  $('#btn-td-again').addEventListener('click', () => showSetup());
  $('#btn-td-result-back').addEventListener('click', () => navigateTo('minigames'));
}
