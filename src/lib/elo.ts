type Difficulty = 'easy' | 'medium' | 'hard';

export function calcElo(myRating: number, oppRating: number, won: boolean, K = 32): number {
  const expected = 1 / (1 + Math.pow(10, (oppRating - myRating) / 400));
  return Math.round(K * (won ? 1 - expected : 0 - expected));
}

export function calcXP(
  won: boolean,
  timeTaken: number,
  totalTime: number,
  difficulty: Difficulty,
): number {
  const base = won ? 150 : 30;
  const normalizedTime = totalTime > 0 ? Math.min(Math.max(timeTaken / totalTime, 0), 1) : 1;
  const speedBonus = won ? Math.round((1 - normalizedTime) * 50) : 0;
  const diffMultiplier = { easy: 1, medium: 1.5, hard: 2.5 }[difficulty];
  return Math.round((base + speedBonus) * diffMultiplier);
}
