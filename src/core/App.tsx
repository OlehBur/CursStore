// import { useState } from 'react'
// import reactLogo from '../assets/vite.svg'
// import viteLogo from '../assets/react.svg'
import { Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
// import BurButt from '../components/BurButt.tsx'
// import BurList from '../components/BurList.tsx'
// import CartButtons from '../components/CartButtons.tsx'
import GamePage from '../pages/GamePage.tsx'
import SettingsPage from '../pages/SettingsPage.tsx'
import ProfilePage from '../pages/ProfilePage.tsx'
import AuthPopup from '../components/AuthWnd.tsx'

function App() {
  const navigate = useNavigate()

  return (
    <Routes>
      <Route path="/" element={<>
        <h1>Головна сторінка</h1>
        <button onClick={() => navigate('/auth')}>
          Авторизація
        </button>
        <button onClick={() => navigate('/profile')}>
          Профіль
        </button>
        <button onClick={() => navigate('/settings')}>
          Налаштування
        </button>
        <button onClick={() => navigate('/ttt')}>
          Tic Tac Toe
        </button>
        <AuthPopup />
      </>} />
      <Route path="/auth" element={<AuthPopup />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/ttt" element={<GamePage />} />

    </Routes>
  )
}

export default App
