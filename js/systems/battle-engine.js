import { clamp } from '../utils/helpers.js';

export function calculateDamage(attacker, defender) {
  const baseDamage = attacker.attack * 2 - defender.defense;
  const variance = 0.85 + Math.random() * 0.3;
  return Math.max(1, Math.floor(baseDamage * variance));
}

export class BattleState {
  constructor(playerStats, opponentStats, boosts = {}) {
    this.player = {
      ...playerStats,
      currentHp: playerStats.hp,
      attack: playerStats.attack + (boosts.attackBoost || 0),
      defense: playerStats.defense + (boosts.defenseBoost || 0)
    };
    this.opponent = {
      ...opponentStats,
      currentHp: opponentStats.hp
    };
    this.turn = 'player';
    this.isOver = false;
    this.winner = null;
    this.potionUsed = false;
  }

  playerAttack() {
    const damage = calculateDamage(this.player, this.opponent);
    this.opponent.currentHp = clamp(this.opponent.currentHp - damage, 0, this.opponent.hp);

    if (this.opponent.currentHp <= 0) {
      this.isOver = true;
      this.winner = 'player';
    }

    this.turn = 'opponent';
    return { damage };
  }

  opponentAttack() {
    const damage = calculateDamage(this.opponent, this.player);
    this.player.currentHp = clamp(this.player.currentHp - damage, 0, this.player.hp);

    if (this.player.currentHp <= 0) {
      this.isOver = true;
      this.winner = 'opponent';
    }

    this.turn = 'player';
    return { damage };
  }

  opponentMiss() {
    this.turn = 'player';
    return { damage: 0, missed: true };
  }

  usePotion(healAmount) {
    if (this.potionUsed) return false;
    this.potionUsed = true;
    const before = this.player.currentHp;
    this.player.currentHp = clamp(this.player.currentHp + healAmount, 0, this.player.hp);
    return this.player.currentHp - before;
  }

  getPlayerHpPercent() {
    return (this.player.currentHp / this.player.hp) * 100;
  }

  getOpponentHpPercent() {
    return (this.opponent.currentHp / this.opponent.hp) * 100;
  }
}
