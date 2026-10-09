import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from '../../App'
import { NICKNAME_KEY } from '../nickname/nicknameStorage'
import { saveStats } from './statsStorage'

function renderHome() {
  render(
    <MemoryRouter initialEntries={['/accueil']}>
      <App />
    </MemoryRouter>,
  )
  return userEvent.setup()
}

const welcome = () => screen.getByRole('heading', { level: 1 })

describe("Page d'accueil", () => {
  it('souhaite la bienvenue au joueur avec son pseudo', () => {
    localStorage.setItem(NICKNAME_KEY, 'Evan')
    renderHome()
    expect(welcome()).toHaveTextContent('Bienvenue, Evan')
  })

  it('affiche « Invité » sans pseudo', () => {
    renderHome()
    expect(welcome()).toHaveTextContent('Bienvenue, Invité')
  })

  it('affiche un état vide et le bouton « Nouvelle partie » sans partie jouée', () => {
    renderHome()
    expect(screen.getByText('Aucune partie jouée pour le moment.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Nouvelle partie' })).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Statistiques' })).not.toBeInTheDocument()
  })

  it('affiche les statistiques enregistrées', () => {
    saveStats({ played: 4, wins: 3, bestTimeSeconds: 75 })
    renderHome()
    const list = screen.getByRole('list', { name: 'Statistiques' })
    const items = within(list).getAllByRole('listitem').map((li) => li.textContent)
    expect(items).toEqual([
      'Parties jouées : 4',
      'Victoires : 3',
      'Taux de victoire : 75 %',
      'Meilleur temps : 1 min 15 s',
    ])
    expect(screen.queryByText('Aucune partie jouée pour le moment.')).not.toBeInTheDocument()
  })

  it('affiche « — » quand aucune victoire n\'a de temps', () => {
    saveStats({ played: 2, wins: 0, bestTimeSeconds: null })
    renderHome()
    expect(screen.getByText('Meilleur temps : —')).toBeInTheDocument()
  })

  it('« Nouvelle partie » mène au jeu', async () => {
    const user = renderHome()
    await user.click(screen.getByRole('link', { name: 'Nouvelle partie' }))
    expect(screen.getByRole('heading', { name: 'Jeu' })).toBeInTheDocument()
  })

  it('« Changer de pseudo » ramène à la page de pseudo', async () => {
    const user = renderHome()
    await user.click(screen.getByRole('link', { name: 'Changer de pseudo' }))
    expect(screen.getByLabelText('Pseudo')).toBeInTheDocument()
  })
})
