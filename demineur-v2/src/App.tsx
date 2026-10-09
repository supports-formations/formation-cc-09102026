import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { GamePage } from './pages/GamePage'
import { NicknamePage } from './pages/NicknamePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<NicknamePage />} />
      <Route path="/jeu" element={<GamePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
