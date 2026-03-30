// import { useState } from 'react'
// import reactLogo from '../assets/vite.svg'
// import viteLogo from '../assets/react.svg'
import { Routes, Route } from 'react-router-dom'
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
import MainStore from '../pages/MainStore.tsx'

function App() {
  const [userId, setUserId] = useState<number>(-1);
  // const auth_nav = '/auth';
  const profile_nav = '/profile';
  const store_prof_nav = '/store_profile';
  const settings_nav = '/settings';
  const game_nav = '/game';

  return (
    <Routes>
      <Route path="/" element={<>
        {/* <h1>Головна сторінка</h1> */}
        {/* <button onClick={() => navigate('/auth')}>
          Авторизація
        </button> */}
        {/* <button onClick={() => navigate('/profile')}>
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
        </button> */}
        {userId === -1 ? (
          <AuthPopup onLoginSuccess={(id) => setUserId(id)} />
        ) : (
          <div className="welcome-screen">
            <MainStore OnLogout={() => setUserId(-1)} /*auth_nav={auth_nav}*/ profile_nav={profile_nav} store_prof_nav={store_prof_nav} settings_nav={settings_nav} game_nav={game_nav} stores_nav='' item_nav='' />
          //   <h1>Ви успішно увійшли!</h1>
          //   <p>Ваш ID користувача в базі: <strong>{userId}</strong></p>
            <button onClick={() => setUserId(-1)}>Вийти</button>
          </div>
        )}
      </>} />
      {/* <Route path="/auth" element={<AuthPopup />} /> */}
      <Route path={profile_nav} element={<ProfilePage userId={userId} />} />
      <Route path={store_prof_nav} element={<StoreManager userId={userId} />} />
      <Route path={settings_nav} element={<SettingsPage />} />
      <Route path={game_nav} element={<GamePage />} />

    </Routes>
  )
}

export default App
