import { describe, expect, it } from 'vitest'
import { EMPTY_STATS, computeWinRate, recordGame } from './gameStats'

describe('computeWinRate', () => {
  it('vaut 0 sans partie jouée', () => {
    expect(computeWinRate(EMPTY_STATS)).toBe(0)
  })

  it('arrondit le pourcentage de victoires', () => {
    expect(computeWinRate({ played: 3, wins: 1, bestTimeSeconds: 10 })).toBe(33)
    expect(computeWinRate({ played: 4, wins: 4, bestTimeSeconds: 10 })).toBe(100)
  })
})

describe('recordGame', () => {
  it('compte une victoire et retient le temps', () => {
    expect(recordGame(EMPTY_STATS, { won: true, seconds: 42 })).toEqual({
      played: 1,
      wins: 1,
      bestTimeSeconds: 42,
    })
  })

  it('compte une défaite sans toucher au meilleur temps', () => {
    const stats = { played: 1, wins: 1, bestTimeSeconds: 42 }
    expect(recordGame(stats, { won: false, seconds: 5 })).toEqual({
      played: 2,
      wins: 1,
      bestTimeSeconds: 42,
    })
  })

  it('ne garde que le meilleur temps', () => {
    const stats = { played: 1, wins: 1, bestTimeSeconds: 42 }
    expect(recordGame(stats, { won: true, seconds: 30 }).bestTimeSeconds).toBe(30)
    expect(recordGame(stats, { won: true, seconds: 50 }).bestTimeSeconds).toBe(42)
  })

  it('ne modifie pas l\'objet d\'origine', () => {
    const stats = { ...EMPTY_STATS }
    recordGame(stats, { won: true, seconds: 1 })
    expect(stats).toEqual(EMPTY_STATS)
  })
})
