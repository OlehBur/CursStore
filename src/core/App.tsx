import { Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import GamePage from '../pages/GamePage.tsx'
import SettingsPage from '../pages/SettingsPage.tsx'
import ProfilePage from '../pages/ProfilePage.tsx'
import AuthPopup from '../components/AuthWnd.tsx'
import { useEffect, useState } from 'react'
import StoreManager from '../pages/StoreManager.tsx'
import MainStore from '../pages/MainStore.tsx'
import ProductPage from '../pages/ProductPage.tsx'
import StoresList from '../pages/StoresList.tsx'
import FAQ_Page from '../pages/FAQ_Page.tsx'
import ContactsPage from '../pages/ContactsPage.tsx'

function App() {
  const [userId, setUserId] = useState<number | null>(null);
  const [prodId, setProdId] = useState<number>(-1);
  const [storeId, setStoreId] = useState<number>(-1);//selectedStoreId
  const profile_nav = '/profile';
  const product_nav = '/product';
  const store_prof_nav = '/store_profile';
  const stores_nav = "/stores_list";
  const settings_nav = '/settings';
  const faq_nav = '/faq';
  const contacts_nav = '/contacts';
  const game_nav = '/game';

  const navigate = useNavigate();

  const TIMEOUT_DELAY = 400;

  useEffect(() => {// get saved userId from sessionStorage on app load
    const savedId = sessionStorage.getItem("userId");
    if (savedId) {
      setUserId(parseInt(savedId));
    }
  }, []);

  const handleLoginSuccess = (id: number) => {
    sessionStorage.setItem("userId", id.toString()); // save
    setUserId(id);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("userId"); // Видаляємо
    setUserId(null);
  };

  return (
    <Routes>
      <Route path="/" element={<>
        {userId === null && <AuthPopup onLoginSuccess={(id) => handleLoginSuccess(id)} />}
        <div className="welcome-screen">
          <MainStore
            userId={userId}
            OnLogout={() => handleLogout()}
            OnProductSelect={(id) => setProdId(id)}
            OnStoreSelect={(id) => setStoreId(id)}
            TIMEOUT_DELAY={TIMEOUT_DELAY}
            /*auth_nav={auth_nav}*/ profile_nav={profile_nav}
            store_prof_nav={store_prof_nav} settings_nav={settings_nav}
            game_nav={game_nav} stores_nav={stores_nav}
            item_nav={product_nav}
            contacts_nav={contacts_nav} faq_nav={faq_nav}
          />
        </div>
      </>} />
      <Route path={product_nav}
        element={
          <ProductPage
            TIMEOUT_DELAY={TIMEOUT_DELAY}
            userId={userId} prodId={prodId} store_prof_nav={store_prof_nav}
            SetStore={(id) => setStoreId(id)} /*storeData={storeId}*/
            NavigateGame={() => navigate(game_nav)}
          />}
      />
      <Route path={profile_nav}
        element={<ProfilePage
          TIMEOUT_DELAY={TIMEOUT_DELAY}
          userId={userId}
          itemPageNav={product_nav}
          OnProductSelect={(id) => setProdId(id)}
          NavigateGame={() => navigate(game_nav)}
        />} />
      {/* <Route path={store_prof_nav} element={<StoreManager userId={userId} itemPage_nav={product_nav} storeId={store} />} /> */}
      <Route
        path={store_prof_nav}
        element={
          <StoreManager
            TIMEOUT_DELAY={TIMEOUT_DELAY}
            userId={userId}
            itemPage_nav={product_nav}
            storeId={storeId}//fr prodPage - setScore dataid | from Parthnersgip - stor may be null
            SetProductId={(id) => setProdId(id)}
            NavigateGame={() => navigate(game_nav)}
          />
        } />
      <Route
        path="/stores_list"
        element={
          <StoresList
            setStore={setStoreId}
            storeProfNav={store_prof_nav}
          />
        }
      />
      <Route path={faq_nav} element={<FAQ_Page />} />
      <Route path={contacts_nav} element={<ContactsPage />} />
      <Route path={settings_nav} element={<SettingsPage />} />
      <Route path={game_nav} element={<GamePage />} />

    </Routes>
  )
}

export default App
