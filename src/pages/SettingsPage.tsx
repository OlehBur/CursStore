import { useNavigate } from "react-router-dom"

const SettingsPage = () => {
    const navigate = useNavigate();

    return (<div style={{ padding: '2rem', border: '2px solid purple', borderRadius: '15px' }}>
        <h1>Settings Page</h1>
        <button onClick={() => navigate('/')} style={{ background: '#ffa564' }}>
            ← Повернутися на головну
        </button>
    </div>)
}

export default SettingsPage;