import { getMonsterById } from '../data/monsters.js';

export function pickAiMonster(levelData) {
  const pool = levelData.monsterPool
    .map(id => getMonsterById(id))
    .filter(m => m && !m.codeExclusive);

  const base = pool[Math.floor(Math.random() * pool.length)];
  const lvl = levelData.aiLevel;
  const levelBonus = lvl - 1;

  const stats = {
    ...base,
    hp: base.baseHp + levelBonus * 5,
    attack: base.baseAttack + levelBonus * 2,
    defense: base.baseDefense + levelBonus * 1,
    level: lvl
  };

  // Boss multipliers
  if (levelData.boss) {
    stats.hp = Math.floor(stats.hp * levelData.bossHpMult);
    stats.attack = Math.floor(stats.attack * levelData.bossAtkMult);
    stats.name = levelData.bossName;
    stats.isBoss = true;
    stats.cssClass = levelData.bossCssClass;
  }

  return stats;
}

export function aiDecideAttack(accuracy) {
  return Math.random() < accuracy;
}
