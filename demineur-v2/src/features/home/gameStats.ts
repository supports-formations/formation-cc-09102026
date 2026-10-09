export interface GameStats {
  played: number
  wins: number
  bestTimeSeconds: number | null
}

export interface GameResult {
  won: boolean
  seconds: number
}

export const EMPTY_STATS: GameStats = { played: 0, wins: 0, bestTimeSeconds: null }

export function computeWinRate(stats: GameStats): number {
  if (stats.played === 0) return 0
  return Math.round((stats.wins / stats.played) * 100)
}

export function recordGame(stats: GameStats, result: GameResult): GameStats {
  const bestTimeSeconds =
    result.won && (stats.bestTimeSeconds === null || result.seconds < stats.bestTimeSeconds)
      ? result.seconds
      : stats.bestTimeSeconds
  return {
    played: stats.played + 1,
    wins: stats.wins + (result.won ? 1 : 0),
    bestTimeSeconds,
  }
}
