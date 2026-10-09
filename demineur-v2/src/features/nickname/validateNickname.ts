export const NICKNAME_ERROR =
  'Le pseudo doit contenir 3 à 16 caractères : lettres, chiffres, _ et -.'

const NICKNAME_PATTERN = /^[A-Za-z0-9_-]{3,16}$/

export type NicknameValidation =
  | { valid: true; nickname: string }
  | { valid: false; error: string }

export function validateNickname(raw: string): NicknameValidation {
  const nickname = raw.trim()
  return NICKNAME_PATTERN.test(nickname)
    ? { valid: true, nickname }
    : { valid: false, error: NICKNAME_ERROR }
}
