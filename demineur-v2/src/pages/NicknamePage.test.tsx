import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from '../App'
import { NICKNAME_KEY } from '../nickname/nicknameStorage'
import { NICKNAME_ERROR } from '../nickname/validateNickname'

function renderApp() {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  )
  return userEvent.setup()
}

const field = () => screen.getByLabelText('Pseudo')
const submit = () => screen.getByRole('button', { name: 'Valider' })
const guest = () => screen.getByRole('button', { name: 'Jouer en invité' })
const onGamePage = () => screen.queryByRole('heading', { name: 'Jeu' })

describe('Page de pseudo', () => {
  it('enregistre un pseudo valide et redirige vers le jeu', async () => {
    const user = renderApp()
    await user.type(field(), 'Evan')
    await user.click(submit())
    expect(localStorage.getItem(NICKNAME_KEY)).toBe('Evan')
    expect(onGamePage()).toBeInTheDocument()
    expect(screen.getByText('Joueur : Evan')).toBeInTheDocument()
  })

  it('valide avec la touche Entrée', async () => {
    const user = renderApp()
    await user.type(field(), 'Evan{Enter}')
    expect(onGamePage()).toBeInTheDocument()
  })

  it.each(['ab', '   ', 'abcdefghijklmnopq', 'Evan!', 'Ev an', 'Évan'])(
    'refuse "%s" et reste sur la page',
    async (raw) => {
      const user = renderApp()
      await user.type(field(), raw)
      await user.click(submit())
      expect(screen.getByRole('alert')).toHaveTextContent(NICKNAME_ERROR)
      expect(field()).toHaveAttribute('aria-invalid', 'true')
      expect(localStorage.getItem(NICKNAME_KEY)).toBeNull()
      expect(onGamePage()).not.toBeInTheDocument()
    },
  )

  it('refuse un champ vide', async () => {
    const user = renderApp()
    await user.click(submit())
    expect(screen.getByRole('alert')).toHaveTextContent(NICKNAME_ERROR)
    expect(onGamePage()).not.toBeInTheDocument()
  })

  it("supprime le message d'erreur dès que la saisie change", async () => {
    const user = renderApp()
    await user.type(field(), 'ab')
    await user.click(submit())
    expect(screen.getByRole('alert')).toBeInTheDocument()
    await user.type(field(), 'c')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('enregistre le pseudo trimé', async () => {
    const user = renderApp()
    await user.type(field(), '  Evan  ')
    await user.click(submit())
    expect(localStorage.getItem(NICKNAME_KEY)).toBe('Evan')
  })

  it('redirige un invité sans enregistrer de pseudo', async () => {
    const user = renderApp()
    await user.click(guest())
    expect(localStorage.getItem(NICKNAME_KEY)).toBeNull()
    expect(onGamePage()).toBeInTheDocument()
    expect(screen.getByText('Joueur : Invité')).toBeInTheDocument()
  })

  it('pré-remplit le champ avec le pseudo mémorisé', () => {
    localStorage.setItem(NICKNAME_KEY, 'Evan')
    renderApp()
    expect(field()).toHaveValue('Evan')
  })

  it('remplace le pseudo mémorisé par un nouveau', async () => {
    localStorage.setItem(NICKNAME_KEY, 'Evan')
    const user = renderApp()
    await user.clear(field())
    await user.type(field(), 'Marie')
    await user.click(submit())
    expect(localStorage.getItem(NICKNAME_KEY)).toBe('Marie')
    expect(onGamePage()).toBeInTheDocument()
  })

  it('supprime le pseudo mémorisé en mode invité', async () => {
    localStorage.setItem(NICKNAME_KEY, 'Evan')
    const user = renderApp()
    await user.click(guest())
    expect(localStorage.getItem(NICKNAME_KEY)).toBeNull()
    expect(onGamePage()).toBeInTheDocument()
  })

  it('ignore une valeur mémorisée corrompue', () => {
    localStorage.setItem(NICKNAME_KEY, 'x!')
    renderApp()
    expect(field()).toHaveValue('')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
