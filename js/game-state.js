import { loadGame, saveGame } from './utils/storage.js';
import { getMonsterById } from './data/monsters.js';
import { getDailyChallenges } from './data/challenges.js';
import { getCode } from './data/codes.js';

class GameState {
  constructor() {
    this.data = loadGame();
    this.cleanInvalidMonsters();
    this.handleFirstVisit();
  }

  cleanInvalidMonsters() {
    // Remove monsters with IDs that no longer exist (from old saves)
    const before = this.data.monsters.length;
    this.data.monsters = this.data.monsters.filter(m => getMonsterById(m.id));
    if (this.data.activeMonsterIndex >= this.data.monsters.length) {
      this.data.activeMonsterIndex = this.data.monsters.length > 0 ? 0 : -1;
    }
    if (this.data.monsters.length !== before) this.save();
  }

  handleFirstVisit() {
    if (this.data.firstVisit) {
      this.data.firstVisit = false;
      this.data.elementalEggs.earth = 1;
      this.data.elementalEggs.water = 1;
      this.data.elementalEggs.fire = 1;
      this.data.gems = 20;
      this.save();
    }
  }

  save() {
    saveGame(this.data);
  }

  // --- Player ---
  get playerLevel() { return this.data.playerLevel; }
  get playerXp() { return this.data.playerXp; }
  get gems() { return this.data.gems; }
  get eggs() { return this.data.eggs; }
  get rareEggs() { return this.data.rareEggs; }
  get elementalEggs() { return this.data.elementalEggs; }

  get totalElementalEggs() {
    const e = this.data.elementalEggs;
    return e.earth + e.water + e.cloud + e.sand + e.fire + (e.dino || 0) + (e.dragon || 0);
  }

  getElementalEggCount(element) {
    return this.data.elementalEggs[element] || 0;
  }

  addElementalEgg(element, count = 1) {
    if (this.data.elementalEggs[element] !== undefined) {
      this.data.elementalEggs[element] += count;
      this.save();
    }
  }

  useElementalEgg(element) {
    if ((this.data.elementalEggs[element] || 0) <= 0) return false;
    this.data.elementalEggs[element]--;
    this.save();
    return true;
  }

  playerXpToNextLevel() {
    return this.data.playerLevel * 50;
  }

  addPlayerXp(amount) {
    this.data.playerXp += amount;
    const levelUps = [];
    while (this.data.playerXp >= this.playerXpToNextLevel()) {
      this.data.playerXp -= this.playerXpToNextLevel();
      this.data.playerLevel++;
      levelUps.push(this.data.playerLevel);
    }
    this.save();
    return levelUps;
  }

  addGems(amount) {
    this.data.gems += amount;
    this.save();
  }

  spendGems(amount) {
    if (this.data.gems < amount) return false;
    this.data.gems -= amount;
    this.save();
    return true;
  }

  addEggs(count, type = 'common') {
    if (type === 'rare') {
      this.data.rareEggs += count;
    } else {
      this.data.eggs += count;
    }
    this.save();
  }

  useEgg(type = 'common') {
    if (type === 'rare') {
      if (this.data.rareEggs <= 0) return false;
      this.data.rareEggs--;
    } else {
      if (this.data.eggs <= 0) return false;
      this.data.eggs--;
    }
    this.save();
    return true;
  }

  // --- Monsters ---
  get monsters() { return this.data.monsters; }

  get activeMonster() {
    if (this.data.activeMonsterIndex < 0 || this.data.activeMonsterIndex >= this.data.monsters.length) {
      return null;
    }
    return this.data.monsters[this.data.activeMonsterIndex];
  }

  get activeMonsterIndex() { return this.data.activeMonsterIndex; }

  addMonster(monsterId) {
    const monster = {
      id: monsterId,
      level: 1,
      xp: 0,
      wins: 0,
      losses: 0,
      skins: ['default'],
      activeSkin: 'default'
    };
    this.data.monsters.push(monster);
    if (this.data.activeMonsterIndex < 0) {
      this.data.activeMonsterIndex = 0;
    }
    this.save();
    return monster;
  }

  buySkin(monsterIndex, skinId) {
    const monster = this.data.monsters[monsterIndex];
    if (!monster) return false;
    if (monster.skins.includes(skinId)) return false;
    const cost = skinId === 'gold' ? 150 : 50;
    if (!this.spendGems(cost)) return false;
    monster.skins.push(skinId);
    monster.activeSkin = skinId;
    this.save();
    return true;
  }

  equipSkin(monsterIndex, skinId) {
    const monster = this.data.monsters[monsterIndex];
    if (!monster || !monster.skins.includes(skinId)) return false;
    monster.activeSkin = skinId;
    this.save();
    return true;
  }

  setActiveMonster(index) {
    if (index >= 0 && index < this.data.monsters.length) {
      this.data.activeMonsterIndex = index;
      this.save();
    }
  }

  addMonsterXp(monsterIndex, amount) {
    const monster = this.data.monsters[monsterIndex];
    if (!monster) return [];

    monster.xp += amount;
    const levelUps = [];
    const maxLevel = 20;

    while (monster.level < maxLevel && monster.xp >= this.monsterXpToNextLevel(monster.level)) {
      monster.xp -= this.monsterXpToNextLevel(monster.level);
      monster.level++;
      levelUps.push(monster.level);
    }

    if (monster.level >= maxLevel) {
      monster.xp = 0;
    }

    this.save();
    return levelUps;
  }

  monsterXpToNextLevel(level) {
    return level * 20;
  }

  getMonsterStats(ownedMonster) {
    const base = getMonsterById(ownedMonster.id);
    if (!base) return null;
    const levelBonus = ownedMonster.level - 1;
    return {
      ...base,
      hp: base.baseHp + levelBonus * 5,
      attack: base.baseAttack + levelBonus * 2,
      defense: base.baseDefense + levelBonus * 1,
      level: ownedMonster.level,
      xp: ownedMonster.xp,
      xpToNext: this.monsterXpToNextLevel(ownedMonster.level)
    };
  }

  recordWin(monsterIndex) {
    if (this.data.monsters[monsterIndex]) {
      this.data.monsters[monsterIndex].wins++;
      this.save();
    }
  }

  recordLoss(monsterIndex) {
    if (this.data.monsters[monsterIndex]) {
      this.data.monsters[monsterIndex].losses++;
      this.save();
    }
  }

  // --- Items ---
  get items() { return this.data.items; }

  addItem(itemId) {
    if (this.data.items[itemId] !== undefined) {
      this.data.items[itemId]++;
      this.save();
    }
  }

  useItem(itemId) {
    if (this.data.items[itemId] > 0) {
      this.data.items[itemId]--;
      this.save();
      return true;
    }
    return false;
  }

  getItemCount(itemId) {
    return this.data.items[itemId] || 0;
  }

  // --- World Progress ---
  get worldProgress() { return this.data.worldProgress; }

  getWorldProgress(worldId) {
    return this.data.worldProgress[worldId] || 0;
  }

  completeLevel(worldId, level) {
    const current = this.data.worldProgress[worldId] || 0;
    if (level > current) {
      this.data.worldProgress[worldId] = level;
      this.save();
    }
  }

  isWorldUnlocked(worldId) {
    // Event worlds are always unlocked
    if (worldId === 'primeval' || worldId === 'dragon') return true;
    const order = ['earth', 'water', 'cloud', 'sand', 'fire'];
    const idx = order.indexOf(worldId);
    if (idx === 0) return true;
    const prevWorld = order[idx - 1];
    return (this.data.worldProgress[prevWorld] || 0) >= 5;
  }

  isLevelUnlocked(worldId, level) {
    if (!this.isWorldUnlocked(worldId)) return false;
    const progress = this.data.worldProgress[worldId] || 0;
    return level <= progress + 1;
  }

  // --- Battle Pass ---
  get battlePass() { return this.data.battlePass; }

  initBattlePass() {
    if (!this.data.battlePass.startDate) {
      this.data.battlePass.startDate = this.getTodayString();
      this.save();
    }
  }

  getTodayString() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  getBattlePassDay() {
    if (!this.data.battlePass.startDate) return 1;
    const start = new Date(this.data.battlePass.startDate);
    const now = new Date();
    start.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    return Math.min(diffDays + 1, 30);
  }

  canClaimToday() {
    return this.data.battlePass.lastClaimDate !== this.getTodayString();
  }

  hasClaimedFree(day) {
    return this.data.battlePass.claimedFree.includes(day);
  }

  hasClaimedPremium(day) {
    return this.data.battlePass.claimedPremium.includes(day);
  }

  get hasPremiumPass() {
    return this.data.battlePass.premium;
  }

  buyPremiumPass() {
    if (this.data.battlePass.premium) return false;
    if (!this.spendGems(10000)) return false;
    this.data.battlePass.premium = true;
    this.save();
    return true;
  }

  claimFreeReward(day) {
    if (this.hasClaimedFree(day)) return false;
    if (day > this.getBattlePassDay()) return false;
    this.data.battlePass.claimedFree.push(day);
    this.data.battlePass.lastClaimDate = this.getTodayString();
    this.save();
    return true;
  }

  claimPremiumReward(day) {
    if (!this.data.battlePass.premium) return false;
    if (this.hasClaimedPremium(day)) return false;
    if (day > this.getBattlePassDay()) return false;
    this.data.battlePass.claimedPremium.push(day);
    this.save();
    return true;
  }

  grantReward(reward) {
    if (reward.type === 'gems') {
      this.addGems(reward.amount);
    } else if (reward.type === 'egg') {
      if (reward.element) {
        this.addElementalEgg(reward.element, reward.amount);
      } else {
        this.addEggs(reward.amount, reward.eggType);
      }
    } else if (reward.type === 'item') {
      for (let i = 0; i < reward.amount; i++) {
        this.addItem(reward.itemId);
      }
    }
  }

  // --- Daily Challenges ---
  get challenges() { return this.data.challenges; }

  getDailyChallenges() {
    const today = this.getTodayString();
    // Reset progress if it's a new day
    if (this.data.challenges.date !== today) {
      this.data.challenges.date = today;
      this.data.challenges.progress = {};
      this.data.challenges.claimed = [];
      this.save();
    }
    return getDailyChallenges(today);
  }

  getChallengeProgress(challengeId) {
    return this.data.challenges.progress[challengeId] || 0;
  }

  addChallengeProgress(type, amount = 1) {
    const today = this.getTodayString();
    if (this.data.challenges.date !== today) return;

    const challenges = getDailyChallenges(today);
    for (const c of challenges) {
      if (c.type === type) {
        this.data.challenges.progress[c.id] = (this.data.challenges.progress[c.id] || 0) + amount;
      }
    }
    this.save();
  }

  isChallengeClaimed(challengeId) {
    return this.data.challenges.claimed.includes(challengeId);
  }

  claimChallengeReward(challengeId, gems) {
    if (this.isChallengeClaimed(challengeId)) return false;
    const progress = this.getChallengeProgress(challengeId);
    const challenges = getDailyChallenges(this.getTodayString());
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge || progress < challenge.target) return false;

    this.data.challenges.claimed.push(challengeId);
    this.addGems(gems);
    this.save();
    return true;
  }

  // --- Code Redemption ---
  isCodeRedeemed(code) {
    return (this.data.redeemedCodes || []).includes(code.toUpperCase());
  }

  redeemCode(code) {
    const upper = code.toUpperCase();
    if (this.isCodeRedeemed(upper)) return { success: false, reason: 'already' };

    const codeData = getCode(upper);
    if (!codeData) return { success: false, reason: 'invalid' };

    // Apply all rewards
    const rewardSummary = [];
    for (const reward of codeData.rewards) {
      if (reward.type === 'monster') {
        this.addMonster(reward.monsterId);
        const monster = getMonsterById(reward.monsterId);
        rewardSummary.push(`${monster.name} (monster)`);
      } else if (reward.type === 'gems') {
        this.addGems(reward.amount);
        rewardSummary.push(`${reward.amount} gems`);
      } else if (reward.type === 'eggs') {
        this.addElementalEgg(reward.element, reward.amount);
        rewardSummary.push(`${reward.amount} ${reward.element} egg(s)`);
      } else if (reward.type === 'item') {
        for (let i = 0; i < reward.amount; i++) {
          this.addItem(reward.itemId);
        }
        rewardSummary.push(`${reward.amount}x ${reward.itemId}`);
      }
    }

    if (!this.data.redeemedCodes) this.data.redeemedCodes = [];
    this.data.redeemedCodes.push(upper);
    this.save();

    return { success: true, description: codeData.description, rewards: rewardSummary };
  }
}

export const gameState = new GameState();
