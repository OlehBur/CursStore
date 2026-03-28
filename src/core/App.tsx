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
import { useState } from 'react'
import StoreManager from '../pages/StoreManager.tsx'

function App() {
  const [userId, setUserId] = useState<number>(-1);
  const navigate = useNavigate()

  return (
    <Routes>
      <Route path="/" element={<>
        <h1>Головна сторінка</h1>
        {/* <button onClick={() => navigate('/auth')}>
          Авторизація
        </button> */}
        <button onClick={() => navigate('/profile')}>
          Профіль
        </button>
        <button onClick={() => navigate('/store_profile')}>
          Профіль Магазину
        </button>
        <button onClick={() => navigate('/settings')}>
          Налаштування
        </button>
        <button onClick={() => navigate('/ttt')}>
          Tic Tac Toe
        </button>
        {userId === -1 ? (
          <AuthPopup onLoginSuccess={(id) => setUserId(id)} />
        ) : (
          <div className="welcome-screen">
            <h1>Ви успішно увійшли!</h1>
            <p>Ваш ID користувача в базі: <strong>{userId}</strong></p>
            <button onClick={() => setUserId(-1)}>Вийти</button>
          </div>
        )}
      </>} />
      {/* <Route path="/auth" element={<AuthPopup />} /> */}
      <Route path="/profile" element={<ProfilePage userId={userId} />} />
      <Route path="/store_profile" element={<StoreManager userId={userId} />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/ttt" element={<GamePage />} />

    </Routes>
  )
}

export default App
