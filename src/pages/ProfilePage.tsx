import { useNavigate } from "react-router-dom"

const ProfilePage = () => {
    const navigate = useNavigate();

    return (<div style={{ padding: '2rem', border: '2px solid silver', borderRadius: '15px' }}>
        <h1>Settings Page</h1>
        <button onClick={() => navigate('/')} style={{ background: '#35ff32' }}>
            ← Повернутися на головну
        </button>
    </div>)
}

export default ProfilePage;