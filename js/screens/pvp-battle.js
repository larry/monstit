import { gameState } from '../game-state.js';
import { send, onMessage, disconnect } from '../utils/network.js';
import { $, wait, createMonsterSprite } from '../utils/helpers.js';
import { playHit, playMiss, playVictory, playDefeat } from '../utils/sfx.js';

let navigateTo;
let myMonster, oppMonster, oppName;

export function init(nav) {
  navigateTo = nav;
}

export function startBattle(data) {
  myMonster = data.yourMonster;
  oppMonster = data.opponentMonster;
  oppName = data.opponentName;

  renderSetup();
  setupMessageHandler();
  showMsg('Battle Start!');
}

export function exit() {
  $('#pvp-quiz').hidden = true;
  $('#pvp-battle-msg').classList.remove('visible');
}

function setupMessageHandler() {
  onMessage((msg) => {
    switch (msg.type) {
      case 'question':
        showQuestion(msg);
        break;
      case 'opponent_answered':
        $('#pvp-opp-answered').hidden = false;
        break;
      case 'turn_result':
        handleResult(msg);
        break;
      case 'battle_over':
        handleGameOver(msg);
        break;
      case 'room_closed':
      case 'disconnected':
        showMsg('Opponent disconnected!');
        setTimeout(() => navigateTo('menu'), 2000);
        break;
    }
  });
}

function renderSetup() {
  // Player
  $('#pvp-p-name').textContent = myMonster.name;
  $('#pvp-p-level').textContent = `Lv.${myMonster.level}`;
  const pSlot = $('#pvp-p-sprite');
  pSlot.innerHTML = '';
  const pSprite = createMonsterSprite(myMonster.cssClass);
  const pvpOwned = gameState.activeMonster;
  if (pvpOwned && pvpOwned.activeSkin && pvpOwned.activeSkin !== 'default') {
    pSprite.classList.add(`skin-${pvpOwned.activeSkin}`);
  }
  pSlot.appendChild(pSprite);

  // Opponent
  $('#pvp-o-name').textContent = `${oppName}'s ${oppMonster.name}`;
  $('#pvp-o-level').textContent = `Lv.${oppMonster.level}`;
  const oSlot = $('#pvp-o-sprite');
  oSlot.innerHTML = '';
  oSlot.appendChild(createMonsterSprite(oppMonster.cssClass));

  updateHp(myMonster.currentHp, myMonster.hp, oppMonster.currentHp, oppMonster.hp);
  $('#pvp-timer').textContent = '';
  $('#pvp-opp-answered').hidden = true;
}

function updateHp(myHp, myMax, oppHp, oppMax) {
  const myPct = (myHp / myMax) * 100;
  const oppPct = (oppHp / oppMax) * 100;

  const myBar = $('#pvp-p-hp');
  myBar.style.width = `${myPct}%`;
  myBar.className = 'hp-fill' + (myPct <= 25 ? ' hp-low' : myPct <= 50 ? ' hp-medium' : '');
  $('#pvp-p-hp-text').textContent = `${myHp}/${myMax}`;

  const oppBar = $('#pvp-o-hp');
  oppBar.style.width = `${oppPct}%`;
  oppBar.className = 'hp-fill' + (oppPct <= 25 ? ' hp-low' : oppPct <= 50 ? ' hp-medium' : '');
  $('#pvp-o-hp-text').textContent = `${oppHp}/${oppMax}`;
}

function showMsg(text) {
  const el = $('#pvp-battle-msg');
  el.textContent = text;
  el.classList.add('visible');
  setTimeout(() => el.classList.remove('visible'), 1500);
}

function showDmgNum(slot, dmg, heal = false) {
  const el = document.createElement('div');
  el.className = heal ? 'damage-number heal' : 'damage-number';
  el.textContent = heal ? `+${dmg}` : `-${dmg}`;
  const container = $(slot);
  container.style.position = 'relative';
  el.style.left = '50%';
  el.style.top = '10px';
  container.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

function anim(slot, cls) {
  const sprite = $(slot)?.querySelector('.monster');
  if (!sprite) return Promise.resolve();
  sprite.classList.add(cls);
  return new Promise(r => setTimeout(() => { sprite.classList.remove(cls); r(); }, 500));
}

let timerInterval = null;

function showQuestion(msg) {
  $('#pvp-opp-answered').hidden = true;
  const quiz = $('#pvp-quiz');
  quiz.hidden = false;

  $('#pvp-question').textContent = msg.question;
  const answersEl = $('#pvp-answers');
  answersEl.innerHTML = '';

  let answered = false;

  msg.answers.forEach((a, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-answer';
    btn.textContent = a;
    btn.addEventListener('click', () => {
      if (answered) return;
      answered = true;
      answersEl.querySelectorAll('.quiz-answer').forEach(b => b.disabled = true);
      btn.style.borderColor = 'var(--type-cloud)';
      send({ type: 'answer', answerIndex: i });
      clearInterval(timerInterval);
      $('#pvp-timer').textContent = 'Waiting...';
    });
    answersEl.appendChild(btn);
  });

  // Timer
  let timeLeft = 15;
  $('#pvp-timer').textContent = `${timeLeft}s`;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    $('#pvp-timer').textContent = `${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      if (!answered) {
        answered = true;
        answersEl.querySelectorAll('.quiz-answer').forEach(b => b.disabled = true);
        $('#pvp-timer').textContent = "Time's up!";
      }
    }
  }, 1000);
}

async function handleResult(msg) {
  clearInterval(timerInterval);

  const quiz = $('#pvp-quiz');
  // Highlight correct answer
  const btns = quiz.querySelectorAll('.quiz-answer');
  if (btns[msg.correctIndex]) btns[msg.correctIndex].classList.add('correct');

  await wait(500);
  quiz.hidden = true;

  // Animate attacks
  if (msg.youCorrect) {
    await anim('#pvp-p-sprite', 'attack-lunge-right');
    if (msg.damageToOpponent > 0) {
      playHit();
      await anim('#pvp-o-sprite', 'damage-shake');
      showDmgNum('#pvp-o-sprite', msg.damageToOpponent);
    }
  } else {
    playMiss();
    showMsg('You missed!');
    await wait(600);
  }

  if (msg.opponentCorrect) {
    await anim('#pvp-o-sprite', 'attack-lunge-left');
    if (msg.damageToYou > 0) {
      playHit();
      await anim('#pvp-p-sprite', 'damage-shake');
      showDmgNum('#pvp-p-sprite', msg.damageToYou);
    }
  }

  updateHp(msg.yourHp, msg.yourMaxHp, msg.opponentHp, msg.opponentMaxHp);
  myMonster.currentHp = msg.yourHp;
  oppMonster.currentHp = msg.opponentHp;

  $('#pvp-timer').textContent = '';
}

async function handleGameOver(msg) {
  await wait(500);

  if (msg.result === 'win') {
    const oSprite = $('#pvp-o-sprite').querySelector('.monster');
    if (oSprite) oSprite.classList.add('faint');
    playVictory();
  } else if (msg.result === 'lose') {
    const pSprite = $('#pvp-p-sprite').querySelector('.monster');
    if (pSprite) pSprite.classList.add('faint');
    playDefeat();
  }

  await wait(1500);

  gameState.addGems(msg.gems);

  const title = msg.result === 'win' ? 'You Win!' : (msg.result === 'lose' ? 'You Lose...' : 'Draw!');
  const color = msg.result === 'win' ? '#4caf50' : (msg.result === 'lose' ? '#f44336' : '#ffd60a');

  $('#pvp-result-title').textContent = title;
  $('#pvp-result-title').style.color = color;
  $('#pvp-result-gems').textContent = msg.gems;
  $('#pvp-result-panel').hidden = false;

  $('#btn-pvp-result-back').onclick = () => {
    disconnect();
    navigateTo('menu');
  };
}
