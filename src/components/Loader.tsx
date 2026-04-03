import React, { useEffect, useState } from 'react';
import './Loader.css';

import fTireImg from '../assets/fr_tire_logo.png';
import rTireImg from '../assets/rr_tire_logo.png';
import motorcycleImg from '../assets/moto_base_logo.png';
import BackButton from './BackToMainButton';

const Loader: React.FC = () => {
    const [isLongLoad, setLongLoad] = useState(false);
    const LONG_LOAD_TIME = 3000;//S

    useEffect(() => {
        setTimeout(() => setLongLoad(true), LONG_LOAD_TIME);
    }, []);//awake

    return (
        <>
            <div className="gear-loader-container">
                <h2 className="loader-brand">HUM ENGINE</h2>
                <div className="engine-block">
                    <img
                        src={fTireImg}
                        alt="front-wheel"
                        className="logo-part front-wheel"
                    />
                    <img
                        src={rTireImg}
                        alt="rear-wheel"
                        className="logo-part rear-wheel"
                    />
                    <img
                        src={motorcycleImg}
                        alt="motorcycle"
                        className="logo-part motorcycle"
                    />
                </div>

                <p className="loader-text">Loading...</p>
                {isLongLoad && <BackButton />}
            </div>
        </>
    );
};

export default Loader;