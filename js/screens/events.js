import { $ } from '../utils/helpers.js';

let navigateTo;

export function init(nav) {
  navigateTo = nav;

  document.getElementById('event-primeval').addEventListener('click', () => {
    navigateTo('battle-select');
  });

  document.getElementById('event-dragon').addEventListener('click', () => {
    navigateTo('battle-select');
  });
}

export function enter() {}

export function exit() {}
