import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { GamePage } from './features/game/GamePage'
import { HomePage } from './features/home/HomePage'
import { NicknamePage } from './features/nickname/NicknamePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<NicknamePage />} />
      <Route path="/accueil" element={<HomePage />} />
      <Route path="/jeu" element={<GamePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
