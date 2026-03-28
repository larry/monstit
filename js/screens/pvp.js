import { gameState } from '../game-state.js';
import { getMonsterById } from '../data/monsters.js';
import { connect, send, onMessage, disconnect } from '../utils/network.js';
import { $, createMonsterSprite } from '../utils/helpers.js';

let navigateTo;
let onPvpBattleStart;

export function init(nav, startPvpBattle) {
  navigateTo = nav;
  onPvpBattleStart = startPvpBattle;

  $('#btn-pvp-back').addEventListener('click', () => {
    send({ type: 'leave_room' });
    disconnect();
    navigateTo('menu');
  });

  $('#btn-quick-match').addEventListener('click', quickMatch);
  $('#btn-create-room').addEventListener('click', createRoom);
  $('#btn-join-room').addEventListener('click', joinRoom);
}

export function enter() {
  showPhase('matchmaking');
  $('#pvp-status').textContent = '';
  $('#pvp-room-code').textContent = '';
  $('#pvp-join-input').value = '';
  $('#pvp-monster-select').innerHTML = '';
  $('#pvp-opponent-status').textContent = '';

  if (!gameState.activeMonster) {
    $('#pvp-status').textContent = 'You need a monster first! Hatch one and come back.';
    $('#btn-quick-match').disabled = true;
    $('#btn-create-room').disabled = true;
    $('#btn-join-room').disabled = true;
  } else {
    $('#btn-quick-match').disabled = false;
    $('#btn-create-room').disabled = false;
    $('#btn-join-room').disabled = false;
  }
}

export function exit() {}

function showPhase(phase) {
  document.querySelectorAll('.pvp-phase').forEach(el => el.hidden = true);
  const el = document.getElementById(`pvp-phase-${phase}`);
  if (el) el.hidden = false;
}

function setupMessageHandler() {
  onMessage((msg) => {
    switch (msg.type) {
      case 'room_created':
        showPhase('waiting');
        $('#pvp-room-code').textContent = msg.code;
        $('#pvp-status').textContent = msg.waiting
          ? 'Searching for opponent...'
          : 'Share this code with a friend!';
        break;

      case 'room_joined':
        showPhase('select');
        $('#pvp-status').textContent = 'Connected! Pick your monster.';
        renderMonsterSelect();
        break;

      case 'player_joined':
        if (msg.playerCount === 2) {
          showPhase('select');
          $('#pvp-status').textContent = 'Opponent joined! Pick your monster.';
          renderMonsterSelect();
        }
        break;

      case 'monster_selected':
        $('#pvp-opponent-status').textContent = msg.ready
          ? 'Both ready! Starting battle...'
          : 'Waiting for opponent to pick...';
        break;

      case 'battle_start':
        onPvpBattleStart(msg);
        break;

      case 'error':
        $('#pvp-status').textContent = msg.message;
        break;

      case 'room_closed':
        $('#pvp-status').textContent = msg.reason || 'Room closed.';
        showPhase('matchmaking');
        break;

      case 'disconnected':
        $('#pvp-status').textContent = 'Disconnected from server.';
        showPhase('matchmaking');
        break;
    }
  });
}

async function quickMatch() {
  $('#pvp-status').textContent = 'Connecting...';
  try {
    await connect();
    setupMessageHandler();
    send({ type: 'quick_match', name: `Player ${gameState.playerLevel}` });
  } catch {
    $('#pvp-status').textContent = 'Could not connect to server.';
  }
}

async function createRoom() {
  $('#pvp-status').textContent = 'Connecting...';
  try {
    await connect();
    setupMessageHandler();
    send({ type: 'create_room', name: `Player ${gameState.playerLevel}` });
  } catch {
    $('#pvp-status').textContent = 'Could not connect to server.';
  }
}

async function joinRoom() {
  const code = $('#pvp-join-input').value.trim().toUpperCase();
  if (!code) {
    $('#pvp-status').textContent = 'Enter a room code!';
    return;
  }
  $('#pvp-status').textContent = 'Connecting...';
  try {
    await connect();
    setupMessageHandler();
    send({ type: 'join_room', code, name: `Player ${gameState.playerLevel}` });
  } catch {
    $('#pvp-status').textContent = 'Could not connect to server.';
  }
}

function renderMonsterSelect() {
  const grid = $('#pvp-monster-select');
  grid.innerHTML = '';

  gameState.monsters.forEach((owned, index) => {
    const base = getMonsterById(owned.id);
    if (!base) return;
    const stats = gameState.getMonsterStats(owned);

    const card = document.createElement('div');
    card.className = 'monster-card';
    if (index === gameState.activeMonsterIndex) card.classList.add('active-monster');

    const sprite = createMonsterSprite(base.cssClass);
    sprite.style.transform = 'scale(0.65)';
    sprite.style.width = '60px';
    sprite.style.height = '60px';
    if (owned.activeSkin && owned.activeSkin !== 'default') {
      sprite.classList.add(`skin-${owned.activeSkin}`);
    }
    card.appendChild(sprite);

    const info = document.createElement('div');
    info.innerHTML = `
      <div class="card-name">${base.name}</div>
      <div class="card-level">Lv.${owned.level} | ${stats.hp} HP</div>
    `;
    card.appendChild(info);

    card.addEventListener('click', () => {
      // Select and send to server
      const monsterData = {
        id: base.id,
        name: base.name,
        cssClass: base.cssClass,
        type: base.type,
        hp: stats.hp,
        attack: stats.attack,
        defense: stats.defense,
        level: stats.level,
        currentHp: stats.hp
      };
      send({ type: 'select_monster', monster: monsterData });

      grid.querySelectorAll('.monster-card').forEach(c => c.classList.remove('active-monster'));
      card.classList.add('active-monster');
      $('#pvp-opponent-status').textContent = 'Waiting for opponent to pick...';
    });

    grid.appendChild(card);
  });
}
