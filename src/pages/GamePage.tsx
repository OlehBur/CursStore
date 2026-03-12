import { useNavigate } from "react-router-dom"
import SticksArena from "../components/SticksArena.tsx";

const TTT_Page = () => {
    const navigate = useNavigate();
    return (
        <div style={{ padding: '0em 2rem', border: '2px solid gold', borderRadius: '15px' }}>
            <h1>Sticks</h1>
            <SticksArena />
            <button onClick={() => navigate('/')} style={{ background: '#646cff' }}>
                ← Повернутися на головну
            </button>
        </div>
    )
}

export default TTT_Page;