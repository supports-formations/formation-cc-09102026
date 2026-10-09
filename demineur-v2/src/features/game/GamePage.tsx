import { loadNickname } from '../nickname/nicknameStorage'

// Placeholder : le démineur sera implémenté dans une issue ultérieure.
export function GamePage() {
  const nickname = loadNickname() ?? 'Invité'

  return (
    <main>
      <h1>Jeu</h1>
      <p>Joueur : {nickname}</p>
    </main>
  )
}
