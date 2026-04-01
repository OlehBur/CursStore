import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StoresList.css';
import BackButton from '../components/BackToMainButton';

type StoresListProps = {
    setStore: (id: number) => void;
    storeProfNav: string;
}

const StoresList = ({ setStore, storeProfNav: storeNavPath }: StoresListProps) => {
    const [stores, setStores] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:3001/api/stores/all')
            .then(res => res.json())
            .then(data => {
                setStores(data);
                setLoading(false);
            })
            .catch(err => console.error("Помилка завантаження магазинів:", err));
    }, []);

    if (loading)
        return <div className="loader">Завантаження брендів...</div>;

    return (
        <div className="stores-page">
            <h1 className="page-title">Наші Партнери та Бренди</h1>
            <div className="stores-grid">
                {stores.map(store => (
                    <div key={store.Id} className="store-card">
                        <div className="store-card-logo-wrapper">
                            <img
                                src={store.LogoUrl || 'default-store.png'}
                                alt={store.Name}
                                className="store-card-logo"
                            />
                        </div>
                        <div className="store-card-info">
                            <h3>{store.Name}</h3>
                            <p className="product-count">
                                📦 Товарів: <span>{store.ProductCount}</span>
                            </p>
                            <button className="btn-visit"
                                onClick={() => {
                                    setStore(store.Id);
                                    navigate(storeNavPath);
                                }}>Відвідати магазин</button>
                        </div>
                    </div>
                ))}
            </div>
            <BackButton />
        </div>
    );
};

export default StoresList;