import { gameState } from '../game-state.js';
import { $, createMonsterSprite, wait } from '../utils/helpers.js';
import { QuizSession } from '../systems/quiz.js';
import { getMonsterById } from '../data/monsters.js';

let navigateTo;
let quiz;
let gameActive = false;

// Game state
let playerPos, opponentPos;
let playerScore, opponentScore;
const FLAG_DISTANCE = 6; // steps to reach enemy flag
const ROUNDS_MAX = 10;
let round;
let opponentAccuracy;

export function init(nav) {
  navigateTo = nav;
  $('#btn-ctf-back').addEventListener('click', () => {
    gameActive = false;
    navigateTo('minigames');
  });
}

export function enter() {
  const active = gameState.activeMonster;
  if (!active) {
    showNoMonster();
    return;
  }
  startGame();
}

export function exit() {
  gameActive = false;
}

function showNoMonster() {
  $('#ctf-game-area').innerHTML = `
    <p class="no-monster-msg">You need a monster first! Hatch an egg.</p>
  `;
}

function startGame() {
  gameActive = true;
  playerPos = 0;
  opponentPos = 0;
  playerScore = 0;
  opponentScore = 0;
  round = 0;
  opponentAccuracy = 0.5 + Math.random() * 0.3; // 50-80% chance opponent advances

  const difficulty = Math.min(3, Math.ceil(gameState.playerLevel / 3));
  quiz = new QuizSession(difficulty);

  renderField();
  nextRound();
}

function renderField() {
  const active = gameState.activeMonster;
  const stats = gameState.getMonsterStats(active);
  const base = getMonsterById(active.id);

  const container = $('#ctf-game-area');
  container.innerHTML = `
    <div class="ctf-scoreboard">
      <span class="ctf-score ctf-player-score">You: <strong>${playerScore}</strong></span>
      <span class="ctf-round">Round ${round}/${ROUNDS_MAX}</span>
      <span class="ctf-score ctf-opp-score">Enemy: <strong>${opponentScore}</strong></span>
    </div>
    <div class="ctf-field">
      <div class="ctf-flag ctf-flag-enemy">&#x1F6A9;</div>
      <div class="ctf-track">
        ${renderTrack()}
      </div>
      <div class="ctf-flag ctf-flag-player">&#x1F3F3;</div>
    </div>
    <div class="ctf-monster-display">
      <div class="ctf-sprite" id="ctf-player-sprite"></div>
      <span class="ctf-monster-name">${stats.name} Lv.${stats.level}</span>
    </div>
    <div class="ctf-message" id="ctf-message"></div>
    <div class="ctf-quiz" id="ctf-quiz"></div>
  `;

  // Add monster sprite
  const spriteContainer = $('#ctf-player-sprite');
  if (spriteContainer) {
    const skinClass = active.activeSkin !== 'default' ? `skin-${active.activeSkin}` : '';
    spriteContainer.appendChild(createMonsterSprite(`${base.cssClass} ${skinClass}`));
  }
}

function renderTrack() {
  let cells = '';
  for (let i = FLAG_DISTANCE; i >= -FLAG_DISTANCE; i--) {
    let content = '';
    let cls = 'ctf-cell';

    if (i === 0) cls += ' ctf-cell-mid';
    if (i > 0 && i === playerPos) { content = '&#x1F7E2;'; cls += ' ctf-cell-player'; }
    if (i < 0 && Math.abs(i) === opponentPos) { content = '&#x1F534;'; cls += ' ctf-cell-opp'; }
    if (i === FLAG_DISTANCE) { content = '&#x1F6A9;'; cls += ' ctf-cell-flag'; }
    if (i === -FLAG_DISTANCE) { content = '&#x1F3F3;'; cls += ' ctf-cell-flag'; }

    // Show player at their position moving toward enemy flag (positive direction)
    if (i > 0 && i === playerPos) content = '&#x1F7E2;';
    if (i < 0 && Math.abs(i) === opponentPos) content = '&#x1F534;';

    cells += `<div class="${cls}">${content}</div>`;
  }
  return cells;
}

async function nextRound() {
  if (!gameActive) return;

  round++;
  if (round > ROUNDS_MAX || playerScore >= 3 || opponentScore >= 3) {
    endGame();
    return;
  }

  // Reset positions for new capture attempt
  playerPos = 0;
  opponentPos = 0;
  renderField();

  await wait(500);
  showQuestion();
}

function showQuestion() {
  if (!gameActive) return;

  const question = quiz.getQuestion();
  const quizEl = $('#ctf-quiz');
  const msgEl = $('#ctf-message');
  msgEl.textContent = 'Answer correctly to advance toward the flag!';

  const answers = question.answers.map((a, i) => `
    <button class="btn ctf-answer" data-idx="${i}">${a}</button>
  `).join('');

  quizEl.innerHTML = `
    <p class="ctf-question">${question.question}</p>
    <div class="ctf-answers">${answers}</div>
  `;

  quizEl.querySelectorAll('.ctf-answer').forEach(btn => {
    btn.addEventListener('click', () => handleAnswer(question, parseInt(btn.dataset.idx)));
  });
}

async function handleAnswer(question, answerIdx) {
  if (!gameActive) return;

  const correct = quiz.checkAnswer(question, answerIdx);
  const msgEl = $('#ctf-message');
  const quizEl = $('#ctf-quiz');
  quizEl.innerHTML = '';

  // Player advances if correct
  if (correct) {
    playerPos++;
    msgEl.innerHTML = '<span style="color:#4caf50">Correct! You advance!</span>';
    gameState.addChallengeProgress('correct_answers');
  } else {
    msgEl.innerHTML = '<span style="color:#f44336">Wrong! You stay put.</span>';
  }

  // Opponent turn (random)
  const oppAdvances = Math.random() < opponentAccuracy;
  if (oppAdvances) {
    opponentPos++;
  }

  renderField();
  await wait(1000);

  // Check if either reached the flag
  if (playerPos >= FLAG_DISTANCE) {
    playerScore++;
    msgEl.innerHTML = '<span style="color:#4caf50">You captured the flag!</span>';
    renderField();
    await wait(1500);
    nextRound();
    return;
  }

  if (opponentPos >= FLAG_DISTANCE) {
    opponentScore++;
    msgEl.innerHTML = '<span style="color:#f44336">Enemy captured your flag!</span>';
    renderField();
    await wait(1500);
    nextRound();
    return;
  }

  // Continue answering questions in same round
  showQuestion();
}

function endGame() {
  gameActive = false;
  const won = playerScore > opponentScore;
  const tied = playerScore === opponentScore;

  let gems = 0;
  let xp = 0;

  if (won) {
    gems = 15 + playerScore * 5;
    xp = 20 + playerScore * 5;
    gameState.recordWin(gameState.activeMonsterIndex);
    gameState.addChallengeProgress('wins');
  } else if (tied) {
    gems = 10;
    xp = 15;
  } else {
    gems = 5;
    xp = 10;
    gameState.recordLoss(gameState.activeMonsterIndex);
  }

  gameState.addGems(gems);
  gameState.addPlayerXp(xp);
  gameState.addMonsterXp(gameState.activeMonsterIndex, xp);
  gameState.addChallengeProgress('battles');

  const container = $('#ctf-game-area');
  container.innerHTML = `
    <div class="ctf-result">
      <h3>${won ? 'Victory!' : tied ? 'Draw!' : 'Defeat!'}</h3>
      <p>Flags captured: ${playerScore} - ${opponentScore}</p>
      <div class="ctf-rewards">
        <p>+${gems} Gems</p>
        <p>+${xp} XP</p>
      </div>
      <button class="btn btn-primary" id="btn-ctf-play-again">Play Again</button>
      <button class="btn btn-back" id="btn-ctf-result-back">Back</button>
    </div>
  `;

  $('#btn-ctf-play-again').addEventListener('click', () => startGame());
  $('#btn-ctf-result-back').addEventListener('click', () => navigateTo('minigames'));
}
