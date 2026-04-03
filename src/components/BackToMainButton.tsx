import { useNavigate } from "react-router-dom";
import "./BackToMainButton.css";

const BackButton = () => {
    const navigate = useNavigate()

    return <button className="back-button" onClick={() => navigate('/')}>
        ← Back To Main Page
    </button >;
}

export default BackButton;