import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  clearNickname,
  loadNickname,
  saveNickname,
} from './nicknameStorage'
import { validateNickname } from './validateNickname'

export function NicknamePage() {
  const navigate = useNavigate()
  const [value, setValue] = useState(() => loadNickname() ?? '')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = validateNickname(value)
    if (!result.valid) {
      setError(result.error)
      return
    }
    saveNickname(result.nickname)
    navigate('/jeu')
  }

  function handleGuest() {
    clearNickname()
    navigate('/jeu')
  }

  return (
    <main className="nickname-page">
      <h1>Démineur</h1>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="nickname">Pseudo</label>
        <input
          id="nickname"
          name="nickname"
          type="text"
          autoComplete="nickname"
          value={value}
          aria-invalid={error !== null}
          aria-describedby={error ? 'nickname-error' : undefined}
          onChange={(event) => {
            setValue(event.target.value)
            setError(null)
          }}
        />
        {error && (
          <p id="nickname-error" role="alert" className="error">
            {error}
          </p>
        )}
        <button type="submit">Valider</button>
      </form>
      <button type="button" className="secondary" onClick={handleGuest}>
        Jouer en invité
      </button>
    </main>
  )
}
