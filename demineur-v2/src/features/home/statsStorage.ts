import { EMPTY_STATS, type GameStats } from './gameStats'

export const STATS_KEY = 'demineur.stats'

function isCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0
}

function isValidStats(value: unknown): value is GameStats {
  if (typeof value !== 'object' || value === null) return false
  const { played, wins, bestTimeSeconds } = value as Record<string, unknown>
  return (
    isCount(played) &&
    isCount(wins) &&
    wins <= played &&
    (bestTimeSeconds === null || (typeof bestTimeSeconds === 'number' && bestTimeSeconds >= 0))
  )
}

export function loadStats(): GameStats {
  try {
    const stored = localStorage.getItem(STATS_KEY)
    if (stored === null) return EMPTY_STATS
    const parsed: unknown = JSON.parse(stored)
    return isValidStats(parsed) ? parsed : EMPTY_STATS
  } catch {
    return EMPTY_STATS
  }
}

export function saveStats(stats: GameStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats))
  } catch {
    // localStorage indisponible : on continue sans mémoriser les stats
  }
}

export function clearStats(): void {
  try {
    localStorage.removeItem(STATS_KEY)
  } catch {
    // localStorage indisponible : rien à effacer
  }
}
