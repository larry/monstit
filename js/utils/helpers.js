export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function weightedRandom(items, weightFn) {
  const totalWeight = items.reduce((sum, item) => sum + weightFn(item), 0);
  let random = Math.random() * totalWeight;
  for (const item of items) {
    random -= weightFn(item);
    if (random <= 0) return item;
  }
  return items[items.length - 1];
}

export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function $(selector) {
  return document.querySelector(selector);
}

export function $$(selector) {
  return document.querySelectorAll(selector);
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function createMonsterSprite(cssClass) {
  const el = document.createElement('div');
  el.className = `monster ${cssClass}`;
  el.innerHTML = `
    <div class="body"></div>
    <div class="eyes"><div class="eye left"></div><div class="eye right"></div></div>
    <div class="mouth"></div>
    <div class="tail"></div>
  `;
  return el;
}
