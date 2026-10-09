import { Link } from 'react-router-dom'
import { loadNickname } from '../nickname/nicknameStorage'
import { computeWinRate } from './gameStats'
import { loadStats } from './statsStorage'

function formatTime(seconds: number | null): string {
  if (seconds === null) return '—'
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return minutes > 0 ? `${minutes} min ${rest} s` : `${rest} s`
}

export function HomePage() {
  const nickname = loadNickname() ?? 'Invité'
  const stats = loadStats()

  return (
    <main className="home-page">
      <h1>Bienvenue, {nickname}</h1>
      <Link to="/jeu" className="button">
        Nouvelle partie
      </Link>
      <section aria-labelledby="stats-title">
        <h2 id="stats-title">Mes statistiques</h2>
        {stats.played === 0 ? (
          <p>Aucune partie jouée pour le moment.</p>
        ) : (
          <ul aria-label="Statistiques">
            <li>Parties jouées : {stats.played}</li>
            <li>Victoires : {stats.wins}</li>
            <li>Taux de victoire : {computeWinRate(stats)} %</li>
            <li>Meilleur temps : {formatTime(stats.bestTimeSeconds)}</li>
          </ul>
        )}
      </section>
      <Link to="/">Changer de pseudo</Link>
    </main>
  )
}
