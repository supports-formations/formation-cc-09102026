import { describe, expect, it } from 'vitest'
import { NICKNAME_ERROR, validateNickname } from './validateNickname'

describe('validateNickname', () => {
  it.each(['Evan', 'abc', 'abcdefghijklmnop', 'Evan_42-b'])(
    'accepte "%s"',
    (raw) => {
      expect(validateNickname(raw)).toEqual({ valid: true, nickname: raw })
    },
  )

  it('supprime les espaces autour du pseudo', () => {
    expect(validateNickname('  Evan  ')).toEqual({
      valid: true,
      nickname: 'Evan',
    })
  })

  it.each([
    ['trop court', 'ab'],
    ['trop long', 'abcdefghijklmnopq'],
    ['vide', ''],
    ['espaces seuls', '   '],
    ['caractère interdit', 'Evan!'],
    ['espace interne', 'Ev an'],
    ['accent', 'Évan'],
  ])('refuse un pseudo %s', (_label, raw) => {
    expect(validateNickname(raw)).toEqual({
      valid: false,
      error: NICKNAME_ERROR,
    })
  })
})
