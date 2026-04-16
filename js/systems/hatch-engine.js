import { MONSTERS, RARITY_WEIGHTS, getMonstersByRarity } from '../data/monsters.js';
import { weightedRandom } from '../utils/helpers.js';

export function hatchEgg(element) {
  // Filter monsters by element type, exclude code-exclusive monsters
  const pool = MONSTERS.filter(m => m.type === element && !m.codeExclusive);

  if (pool.length === 0) {
    // Fallback: pick any common monster
    const fallback = getMonstersByRarity('common');
    return fallback[Math.floor(Math.random() * fallback.length)];
  }

  // Pick rarity first using weights
  const rarities = Object.entries(RARITY_WEIGHTS)
    .filter(([, w]) => w > 0)
    .map(([rarity, weight]) => ({ rarity, weight }));

  const chosen = weightedRandom(rarities, r => r.weight);

  // Try to find a monster of this element AND rarity
  const match = pool.filter(m => m.rarity === chosen.rarity);

  if (match.length > 0) {
    return match[Math.floor(Math.random() * match.length)];
  }

  // If no monster of that rarity exists for this element, pick any from the element pool
  return pool[Math.floor(Math.random() * pool.length)];
}
