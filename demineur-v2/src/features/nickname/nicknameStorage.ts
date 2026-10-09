import { validateNickname } from './validateNickname'

export const NICKNAME_KEY = 'demineur.nickname'

export function loadNickname(): string | null {
  try {
    const stored = localStorage.getItem(NICKNAME_KEY)
    if (stored === null) return null
    const result = validateNickname(stored)
    return result.valid ? result.nickname : null
  } catch {
    return null
  }
}

export function saveNickname(nickname: string): void {
  try {
    localStorage.setItem(NICKNAME_KEY, nickname)
  } catch {
    // localStorage indisponible : on continue sans mémoriser le pseudo
  }
}

export function clearNickname(): void {
  try {
    localStorage.removeItem(NICKNAME_KEY)
  } catch {
    // localStorage indisponible : rien à effacer
  }
}
