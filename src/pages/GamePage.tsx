import { useNavigate } from "react-router-dom"
import SticksArena from "../components/SticksArena.tsx";
import "./GamePage.css"
import { useState } from "react";

const TTT_Page = () => {
    const navigate = useNavigate();
    const [score1, setScore1] = useState(0);
    const [score2, setScore2] = useState(0);
    const [isFirstPlayer, setIsFirstPlayer] = useState(true);
    // const [isFin, setFin] = useState<boolean>(false);
    const maxStepsCnt = 100;

    function setScore(score: number) {
        if (isFirstPlayer)
            setScore1(score1 + score); // передавай setter з батька
        else
            setScore2(score2 + score);
    }

    let isFin = score1 + score2 >= maxStepsCnt;
    const winnerStr = score1 > score2 ? "Pl1" : "Pl2";

    return (
        <div className="mainFrame">
            <div className="arena">
                {isFin && (<div className="winnerOverlay">
                    <div className="winnerCard">
                        <div className="winnerText">{winnerStr} Переміг</div>
                        <button
                            className="restartBtn"
                            onClick={() => window.location.reload()}                        >
                            Перезапустити гру
                        </button>
                    </div>
                </div>)}

                {/* l bl */}
                <div style={{ textAlign: 'center' }}>
                    <div className={isFirstPlayer ? "scoreBlock player1 selectScoreBlock" : "scoreBlock player1"}>
                        {score1}
                    </div>
                    <div className={isFirstPlayer ? "ytTxt" : "emptyTxt"}>
                        Your turn
                    </div>
                </div>

                <h1 style={{ margin: 0 }}>Sticks</h1>

                {/* r bl */}
                <div style={{ textAlign: 'center' }}>
                    <div className={isFirstPlayer ? "scoreBlock player2" : "scoreBlock player2 selectScoreBlock"}>
                        {score2}
                    </div>
                    <div className={isFirstPlayer ? "emptyTxt" : "ytTxt"}>
                        Your turn
                    </div>
                </div>
            </div>

            <SticksArena
                setMainScore={setScore}
                setPlayer={setIsFirstPlayer}
            /* onUpdate={(newScore1, newScore2, newIsFirstPlayer) => {
                setScore1(newScore1);
                setScore2(newScore2);
                setIsFirstPlayer(newIsFirstPlayer);
    }} */ />
            <button onClick={() => navigate('/')} style={{ background: '#646cff' }}>
                ← Повернутися на головну
            </button>
        </div>
    )
}

export default TTT_Page;