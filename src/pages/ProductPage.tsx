import { useEffect, useState } from 'react';
import './ProductPage.css';
import BackButton from '../components/BackToMainButton';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';


type PP_prop = {
    userId: number;
    prodId: number;
    // storeData: any;
    store_prof_nav: string;
    TIMEOUT_DELAY: number;

    SetStore: (id: number) => void;
    NavigateGame: () => void | Promise<void>;
}

const ProductPage = (prop: PP_prop) => {
    const [product, setProduct] = useState<any>(null);
    const [isInCart, setIsInCart] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    // const [store, setStore] = useState<any>(null);
    const [localStoreInfo, setLocalStoreInfo] = useState<any>(null);
    const [isAllowLoader, setAllowLoader] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);//[] exec once in first launch

    useEffect(() => {
        if (prop.prodId === -1)
            return;

        // load data & +1 to Popularity 
        fetch(`/api/products/${prop.prodId}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                if (data.ShopId) {
                    fetch(`/api/store/short-details/${data.ShopId}`)
                        .then(res => res.json())
                        // .then(storeData => prop.SetStore(storeData));
                        .then(storeData => { setLocalStoreInfo(storeData); });
                }
            });

        // check stats (Cart/Favorites)
        fetch(`/api/user-status?userId=${prop.userId}&prodId=${prop.prodId}`)
            .then(res => res.json())
            .then(status => {
                setIsInCart(status.inCart);
                setIsFavorite(status.inFavorites);
            });

        setTimeout(() => setAllowLoader(false), prop.TIMEOUT_DELAY);
    }, [prop.prodId, prop.userId]);

    const handleToggle = async (type: 'c' | 'f') => {
        const endpoint = type === 'c' ? '/api/cart/toggle' : '/api/fav/toggle';
        const res = await fetch(`${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: prop.userId, productId: prop.prodId })
        });
        const data = await res.json();

        if (type === 'c')
            setIsInCart(data.action === 'added');
        else
            setIsFavorite(data.action === 'added');
    };

    if (/*prop.prodId === -1 || !product*/isAllowLoader)
        return <>
            <Loader NavigateGame={prop.NavigateGame} />
            {/* <div className="loader">Loading...</div> */}
            {/* <BackButton /> */}
        </>;

    // get video ID from yt
    // const getYouTubeId = (url: string) => {
    //     const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|\/embed\/))([^?&"'>]+)/);
    //     return match ? match[1] : null;
    // };

    const formatVideoUrl = (url: string) => {
        if (!url) return '';

        // reg for search ID vid in diff formats YouTube
        const ytRegex = /(?:youtu\.be\/|youtube\.com\/(?:.*v=|\/embed\/))([^?&"'>]+)/;
        const match = url.match(ytRegex);

        if (match && match[1]) // if yt
            return `https://www.youtube.com/embed/${match[1]}`;

        return url;//otherwise
    };

    return (
        <div className="product-page-container">
            <h1 className="product-title">{product.Name}</h1>

            <div className="media-and-actions">
                <div className="media-block">
                    <div className="aspect-ratio-box" onClick={() => window.open(product.ImageUrl)/* with opportun to opem (Lightbox) */}>
                        <img src={product.ImageUrl} alt="Product" className="media-content" />
                    </div>

                    {product.VideoUrl && (
                        <div className="aspect-ratio-box">
                            <iframe
                                className="media-content"
                                src={formatVideoUrl(product.VideoUrl)}//'https://youtu.be/TVjAF7tvGdk?si=K3dfojJNZXfIa1aM'}//`https://www.youtube.com/embed/${getYouTubeId(product.VideoUrl)}`
                                title='Video Preview'// title="YouTube video"
                                style={{ border: "none" }}
                                allowFullScreen
                            ></iframe>
                        </div>
                    )}
                </div>

                <div className="action-sidebar">
                    {localStoreInfo && (
                        <div className="store-info-badge" onClick={() => {
                            // console.log("Curr Store ID:", localStoreInfo.Id);
                            prop.SetStore(localStoreInfo.Id);
                            navigate(prop.store_prof_nav);
                        }}>
                            <img src={localStoreInfo.LogoUrl || 'default-store.png'} alt="Store Logo" className="store-logo-mini" />
                            <span className="store-name-mini">{localStoreInfo.Name}</span>
                        </div>
                    )}
                    <div className="product-price-section">
                        <span className="price-label">Price:</span>
                        <span className="price-value">${product.Price}</span>
                    </div>
                    <button className={`btn-action ${isInCart ? 'active' : ''}`} onClick={() => handleToggle('c')}>
                        {isInCart ? '❌ Remove from cart' : '🛒 Add to cart'}
                    </button>
                    <button className={`btn-action ${isFavorite ? 'active' : ''}`} onClick={() => handleToggle('f')}>
                        {isFavorite ? '❤️ In favorites' : '🤍 Add to favorites'}
                    </button>
                </div>
            </div>

            <div className="product-details">
                <h3>Description</h3>
                <p className="description-text">{product.Description}</p>

                <table className="specs-table">
                    <thead>
                        <tr><th colSpan={2}>Technical Specifications</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>Engine Volume</td><td>{product.CC} cm³</td></tr>
                        <tr><td>Weight</td><td>{product.Weight} kg</td></tr>
                        <tr><td>Power</td><td>{product.HP} hp</td></tr>
                        <tr><td>Torque</td><td>{product.NM} Nm</td></tr>
                    </tbody>
                </table>
            </div>
            <BackButton></BackButton>
        </div>
    );
};

export default ProductPage;