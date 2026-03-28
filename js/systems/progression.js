export function getBattleRewards(levelData, won) {
  if (won) {
    return {
      monsterXp: levelData.xp,
      playerXp: levelData.xp,
      gems: levelData.gems
    };
  }
  return {
    monsterXp: Math.floor(levelData.xp * 0.25),
    playerXp: Math.floor(levelData.xp * 0.25),
    gems: 0
  };
}
