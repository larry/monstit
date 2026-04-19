import { gameState } from '../game-state.js';
import { $, createMonsterSprite } from '../utils/helpers.js';

let navigateTo;

const LAB_COST = 100;
const STAT_POINTS = 100;
const BODY_COLORS = ['#ff6b35', '#00b4d8', '#8cb369', '#b8c0ff', '#e0a458', '#9b4ace', '#1fb874', '#ff3ba6', '#6a4ea8', '#e94560'];
const EYE_COLORS = ['#ffd84c', '#ff3030', '#00e5ff', '#c8ff2a', '#ff60ff', '#ffffff', '#ffb347', '#a0ffcc'];

const state = {
  name: '',
  type: 'fire',
  hp: 100,
  atk: 15,
  def: 10,
  bodyColor: BODY_COLORS[0],
  eyeColor: EYE_COLORS[0]
};

export function init(nav) {
  navigateTo = nav;
}

export function enter() {
  renderScreen();
}

export function exit() {}

function pointsUsed() {
  // Normalize each stat onto a point budget: 1 pt = 1 HP = 1 ATK = 1 DEF
  // HP range 50-200, ATK 5-40, DEF 5-40. Base cost: HP/4, ATK, DEF
  return Math.ceil(state.hp / 4) + state.atk + state.def;
}

function pointsBudget() {
  // 50 baseline (from min stats) + STAT_POINTS extra
  // Min stats cost: ceil(50/4) + 5 + 5 = 13 + 10 = 23
  return 23 + STAT_POINTS;
}

function renderScreen() {
  const container = $('#screen-monster-lab');
  container.innerHTML = `
    <div class="lab-container">
      <h2>Monster Lab</h2>
      <p class="lab-subtitle">Forge your own one-of-a-kind monster. Costs ${LAB_COST} gems.</p>

      <div class="lab-preview" id="lab-preview"></div>

      <div class="lab-form">
        <div class="lab-field">
          <label for="lab-name">Name</label>
          <input class="lab-input" id="lab-name" type="text" maxlength="16" placeholder="MyBeast" />
        </div>

        <div class="lab-field">
          <label for="lab-type">Type</label>
          <select class="lab-select" id="lab-type">
            <option value="fire">Fire</option>
            <option value="water">Water</option>
            <option value="earth">Earth</option>
            <option value="cloud">Cloud</option>
            <option value="sand">Sand</option>
            <option value="dino">Dino</option>
            <option value="dragon">Dragon</option>
          </select>
        </div>

        <div class="lab-budget" id="lab-budget"></div>

        <div class="lab-field">
          <div class="lab-stat-row">
            <label for="lab-hp">HP</label>
            <input type="range" id="lab-hp" min="50" max="200" step="5" />
            <span class="lab-stat-value" id="lab-hp-val"></span>
          </div>
          <div class="lab-stat-row">
            <label for="lab-atk">ATK</label>
            <input type="range" id="lab-atk" min="5" max="40" step="1" />
            <span class="lab-stat-value" id="lab-atk-val"></span>
          </div>
          <div class="lab-stat-row">
            <label for="lab-def">DEF</label>
            <input type="range" id="lab-def" min="5" max="40" step="1" />
            <span class="lab-stat-value" id="lab-def-val"></span>
          </div>
        </div>

        <div class="lab-colors">
          <div class="lab-field">
            <label>Body Color</label>
            <div class="lab-swatch-row" id="lab-body-swatches"></div>
          </div>
          <div class="lab-field">
            <label>Eye Color</label>
            <div class="lab-swatch-row" id="lab-eye-swatches"></div>
          </div>
        </div>

        <button class="btn lab-create-btn" id="lab-create-btn">Create Monster (${LAB_COST} gems)</button>
        <div class="lab-msg" id="lab-msg"></div>
      </div>

      <button class="btn btn-back" data-screen="menu">Back</button>
    </div>
  `;

  // Wire up inputs
  const nameInput = $('#lab-name');
  const typeInput = $('#lab-type');
  const hpInput = $('#lab-hp');
  const atkInput = $('#lab-atk');
  const defInput = $('#lab-def');

  nameInput.value = state.name;
  typeInput.value = state.type;
  hpInput.value = state.hp;
  atkInput.value = state.atk;
  defInput.value = state.def;

  nameInput.addEventListener('input', () => { state.name = nameInput.value.trim(); updateUi(); });
  typeInput.addEventListener('change', () => { state.type = typeInput.value; updateUi(); });
  hpInput.addEventListener('input', () => { state.hp = parseInt(hpInput.value, 10); updateUi(); });
  atkInput.addEventListener('input', () => { state.atk = parseInt(atkInput.value, 10); updateUi(); });
  defInput.addEventListener('input', () => { state.def = parseInt(defInput.value, 10); updateUi(); });

  // Swatches
  const bodyRow = $('#lab-body-swatches');
  BODY_COLORS.forEach(color => {
    const sw = document.createElement('button');
    sw.className = 'lab-swatch';
    sw.style.background = color;
    sw.dataset.color = color;
    if (color === state.bodyColor) sw.classList.add('selected');
    sw.addEventListener('click', () => {
      state.bodyColor = color;
      bodyRow.querySelectorAll('.lab-swatch').forEach(s => s.classList.toggle('selected', s.dataset.color === color));
      updateUi();
    });
    bodyRow.appendChild(sw);
  });

  const eyeRow = $('#lab-eye-swatches');
  EYE_COLORS.forEach(color => {
    const sw = document.createElement('button');
    sw.className = 'lab-swatch';
    sw.style.background = color;
    sw.dataset.color = color;
    if (color === state.eyeColor) sw.classList.add('selected');
    sw.addEventListener('click', () => {
      state.eyeColor = color;
      eyeRow.querySelectorAll('.lab-swatch').forEach(s => s.classList.toggle('selected', s.dataset.color === color));
      updateUi();
    });
    eyeRow.appendChild(sw);
  });

  // Back button
  container.querySelector('[data-screen="menu"]').addEventListener('click', () => navigateTo('menu'));

  // Create button
  $('#lab-create-btn').addEventListener('click', onCreate);

  updateUi();
}

function updateUi() {
  $('#lab-hp-val').textContent = state.hp;
  $('#lab-atk-val').textContent = state.atk;
  $('#lab-def-val').textContent = state.def;

  const used = pointsUsed();
  const budget = pointsBudget();
  const budgetEl = $('#lab-budget');
  budgetEl.textContent = `Stat Points: ${used} / ${budget}`;
  budgetEl.classList.toggle('over', used > budget);

  const btn = $('#lab-create-btn');
  const nameOk = state.name.length >= 2;
  const canAfford = gameState.gems >= LAB_COST;
  const inBudget = used <= budget;
  btn.disabled = !(nameOk && canAfford && inBudget);

  // Live preview
  const preview = $('#lab-preview');
  preview.innerHTML = '';
  const sprite = createMonsterSprite({
    cssClass: 'monster-custom',
    bodyColor: state.bodyColor,
    eyeColor: state.eyeColor
  });
  preview.appendChild(sprite);
}

function onCreate() {
  const msg = $('#lab-msg');
  msg.className = 'lab-msg';
  msg.textContent = '';

  if (state.name.length < 2) {
    msg.textContent = 'Name must be at least 2 characters.';
    msg.classList.add('error');
    return;
  }
  if (pointsUsed() > pointsBudget()) {
    msg.textContent = 'Over stat budget — turn some stats down.';
    msg.classList.add('error');
    return;
  }
  if (!gameState.spendGems(LAB_COST)) {
    msg.textContent = `Not enough gems (need ${LAB_COST}).`;
    msg.classList.add('error');
    return;
  }

  const def = gameState.createCustomMonster({
    name: state.name,
    type: state.type,
    baseHp: state.hp,
    baseAttack: state.atk,
    baseDefense: state.def,
    bodyColor: state.bodyColor,
    eyeColor: state.eyeColor
  });
  gameState.addMonster(def.id);

  msg.textContent = `${def.name} forged! Find it in your Collection.`;
  msg.classList.add('success');
  $('#lab-create-btn').disabled = true;
}
