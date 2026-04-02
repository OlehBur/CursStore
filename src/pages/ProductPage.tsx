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
        fetch(`http://localhost:3001/api/products/${prop.prodId}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                if (data.ShopId) {
                    fetch(`http://localhost:3001/api/store/short-details/${data.ShopId}`)
                        .then(res => res.json())
                        // .then(storeData => prop.SetStore(storeData));
                        .then(storeData => { setLocalStoreInfo(storeData); });
                }
            });

        // check stats (Cart/Favorites)
        fetch(`http://localhost:3001/api/user-status?userId=${prop.userId}&prodId=${prop.prodId}`)
            .then(res => res.json())
            .then(status => {
                setIsInCart(status.inCart);
                setIsFavorite(status.inFavorites);
            });

        setTimeout(() => setAllowLoader(false), prop.TIMEOUT_DELAY);
    }, [prop.prodId, prop.userId]);

    const handleToggle = async (type: 'c' | 'f') => {
        const endpoint = type === 'c' ? '/api/cart/toggle' : '/api/fav/toggle';
        const res = await fetch(`http://localhost:3001${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: prop.userId, productId: prop.prodId })
        });
        const data = await res.json();

        if (type === 'c') setIsInCart(data.action === 'added');
        else setIsFavorite(data.action === 'added');
    };

    if (/*prop.prodId === -1 || !product*/isAllowLoader)
        return <>
            <Loader />
            {/* <div className="loader">Завантаження...</div> */}
            {/* <BackButton /> */}
        </>;

    // get video ID from yt
    const getYouTubeId = (url: string) => {
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|\/embed\/))([^?&"'>]+)/);
        return match ? match[1] : null;
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
                                src={`https://www.youtube.com/embed/${getYouTubeId(product.VideoUrl)}`}
                                title="YouTube video"
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
                        <span className="price-label">Ціна:</span>
                        <span className="price-value">${product.Price}</span>
                    </div>
                    <button className={`btn-action ${isInCart ? 'active' : ''}`} onClick={() => handleToggle('c')}>
                        {isInCart ? '❌ Видалити з кошика' : '🛒 Додати в кошик'}
                    </button>
                    <button className={`btn-action ${isFavorite ? 'active' : ''}`} onClick={() => handleToggle('f')}>
                        {isFavorite ? '❤️ В обраному' : '🤍 Додати в обране'}
                    </button>
                </div>
            </div>

            <div className="product-details">
                <h3>Опис товару</h3>
                <p className="description-text">{product.Description}</p>

                <table className="specs-table">
                    <thead>
                        <tr><th colSpan={2}>Технічні характеристики</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>Об'єм двигуна</td><td>{product.CC} см³</td></tr>
                        <tr><td>Вага</td><td>{product.Weight} кг</td></tr>
                        <tr><td>Потужність</td><td>{product.HP} к.с.</td></tr>
                        <tr><td>Крутний момент</td><td>{product.NM} Нм</td></tr>
                    </tbody>
                </table>
            </div>
            <BackButton></BackButton>
        </div>
    );
};

export default ProductPage;