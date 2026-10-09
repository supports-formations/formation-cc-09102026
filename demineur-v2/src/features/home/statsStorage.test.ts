import { describe, expect, it } from 'vitest'
import { EMPTY_STATS } from './gameStats'
import { STATS_KEY, clearStats, loadStats, saveStats } from './statsStorage'

describe('statsStorage', () => {
  it('renvoie des stats vides par défaut', () => {
    expect(loadStats()).toEqual(EMPTY_STATS)
  })

  it('relit les stats sauvegardées', () => {
    const stats = { played: 5, wins: 3, bestTimeSeconds: 61 }
    saveStats(stats)
    expect(loadStats()).toEqual(stats)
  })

  it('accepte un meilleur temps nul', () => {
    const stats = { played: 2, wins: 0, bestTimeSeconds: null }
    saveStats(stats)
    expect(loadStats()).toEqual(stats)
  })

  it.each([
    'pas du json',
    '{"played":"x"}',
    '{"played":1,"wins":2,"bestTimeSeconds":null}',
    '{"played":-1,"wins":0,"bestTimeSeconds":null}',
    '{"played":1,"wins":1,"bestTimeSeconds":-3}',
    'null',
  ])('ignore une valeur corrompue : %s', (raw) => {
    localStorage.setItem(STATS_KEY, raw)
    expect(loadStats()).toEqual(EMPTY_STATS)
  })

  it('efface les stats', () => {
    saveStats({ played: 1, wins: 1, bestTimeSeconds: 9 })
    clearStats()
    expect(loadStats()).toEqual(EMPTY_STATS)
  })
})
