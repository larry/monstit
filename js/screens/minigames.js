import { $ } from '../utils/helpers.js';

let navigateTo;

export function init(nav) {
  navigateTo = nav;
  $('#btn-minigames-back').addEventListener('click', () => navigateTo('menu'));
  $('#btn-mg-ctf').addEventListener('click', () => navigateTo('ctf'));
  $('#btn-mg-td').addEventListener('click', () => navigateTo('tower-defense'));
  $('#btn-mg-trade').addEventListener('click', () => navigateTo('trading'));
}

export function enter() {}
export function exit() {}
