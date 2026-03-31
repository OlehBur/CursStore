import { useNavigate } from "react-router-dom";


const BackButton = () => {
    const navigate = useNavigate()

    return <button style={{
        backgroundColor: "gray",
        margin: "20px"
    }} onClick={() => navigate('/')}>
        ← Повернутися на головну
    </button >;
}

export default BackButton;