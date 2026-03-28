export const CHALLENGE_TEMPLATES = [
  { id: 'win_1', description: 'Win 1 battle', type: 'wins', target: 1, gems: 10 },
  { id: 'win_3', description: 'Win 3 battles', type: 'wins', target: 3, gems: 30 },
  { id: 'hatch_1', description: 'Hatch 1 egg', type: 'hatches', target: 1, gems: 10 },
  { id: 'hatch_3', description: 'Hatch 3 eggs', type: 'hatches', target: 3, gems: 25 },
  { id: 'correct_5', description: 'Answer 5 questions correctly', type: 'correct', target: 5, gems: 15 },
  { id: 'correct_15', description: 'Answer 15 questions correctly', type: 'correct', target: 15, gems: 40 },
  { id: 'battle_2', description: 'Fight 2 battles', type: 'battles', target: 2, gems: 10 },
  { id: 'battle_5', description: 'Fight 5 battles', type: 'battles', target: 5, gems: 30 },
  { id: 'no_miss', description: 'Win a battle without missing', type: 'perfectBattle', target: 1, gems: 35 },
  { id: 'beat_boss', description: 'Defeat a boss', type: 'bossWins', target: 1, gems: 50 },
  { id: 'win_5', description: 'Win 5 battles', type: 'wins', target: 5, gems: 50 },
];

// Pick 3 random challenges for the day, seeded by date so everyone gets the same set
export function getDailyChallenges(dateString) {
  let seed = 0;
  for (let i = 0; i < dateString.length; i++) {
    seed = ((seed << 5) - seed) + dateString.charCodeAt(i);
    seed = seed & seed;
  }

  const shuffled = [...CHALLENGE_TEMPLATES];
  for (let i = shuffled.length - 1; i > 0; i--) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const j = seed % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, 3);
}
