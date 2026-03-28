import { useEffect, useState } from 'react';
import './StoreManager.css';
import ProductModal from '../components/ProductModal';
import { useNavigate } from 'react-router-dom';

interface Product {
    Id?: number;
    Name: string;
    Description: string;
    Price: number;
    ImageUrl: string;
    VideoUrl: string;
    CC: number;
    Weight: number;
    HP: number;
    NM: number;
    ShopId: number;
}

const StoreManager = ({ userId }: { userId: number }) => {
    const navigate = useNavigate();
    const [store, setStore] = useState<any>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // modals
    const [isStoreModalOpen, setStoreModalOpen] = useState(false);
    const [isProductModalOpen, setProductModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const [storeForm, setStoreForm] = useState({ Name: '', Description: '', LogoUrl: '' });

    useEffect(() => {
        fetchStoreData();
    }, [userId]);

    const fetchStoreData = async () => {
        try {
            const res = await fetch(`http://localhost:3001/api/store/${userId}`);
            const data = await res.json();
            if (data.exists) {
                setStore(data.store);
                setStoreForm({
                    Name: data.store.Name,
                    Description: data.store.Description,
                    LogoUrl: data.store.LogoUrl
                });
                fetchProducts(data.store.Id);
            }
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const fetchProducts = async (shopId: number) => {
        const res = await fetch(`http://localhost:3001/api/store/${shopId}/products`);
        const data = await res.json();
        setProducts(data);
    };

    const handleStoreSubmit = async () => {
        const method = store ? 'PUT' : 'POST';
        const url = store ? `http://localhost:3001/api/store/${store.Id}` : `http://localhost:3001/api/store`;

        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...storeForm, userId })
        });
        fetchStoreData();
        setStoreModalOpen(false);
    };

    if (loading) return <div className="loader">Завантаження...</div>;

    return (
        <div className="store-container">
            {!store ? (
                <div className="no-store-view">
                    <h1>Ваш бізнес починається тут</h1>
                    <button className="btn-main" onClick={() => setStoreModalOpen(true)}>
                        Зареєструйте свій брендовий магазин
                    </button>
                </div>
            ) : (
                <div className="store-dashboard">
                    <header className="store-header">
                        <div className="header-content">
                            <img src={store.LogoUrl} alt="Logo" className="store-logo-main" />
                            <div className="store-info">
                                <h1>Профіль "{store.Name}"</h1>
                                <p>{store.Description}</p>
                                <button className="btn-edit-store" onClick={() => setStoreModalOpen(true)}>
                                    Редагувати дані
                                </button>
                            </div>
                        </div>
                    </header>

                    <div className="products-grid">
                        {/* add new prod block*/}
                        <div className="product-card add-new" onClick={() => { setSelectedProduct(null); setProductModalOpen(true); }}>
                            <div className="plus-wrapper">
                                <span className="plus-icon">+</span>
                                <p>Додати продукт</p>
                            </div>
                        </div>

                        {/* prods blocks */}
                        {products.map((p) => (
                            <div key={p.Id} className="product-card">
                                <img src={p.ImageUrl} alt={p.Name} className="product-img" />
                                <div className="product-details">
                                    <h3>{p.Name}</h3>
                                    <span className="product-price">${p.Price}</span>
                                    <button className="btn-edit-prod" onClick={() => { setSelectedProduct(p); setProductModalOpen(true); }}>
                                        Редагувати
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {isStoreModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{store ? "Редагувати магазин" : "Новий магазин"}</h2>
                        <input value={storeForm.Name} placeholder="Назва магазину" onChange={e => setStoreForm({ ...storeForm, Name: e.target.value })} />
                        <textarea value={storeForm.Description} placeholder="Опис" onChange={e => setStoreForm({ ...storeForm, Description: e.target.value })} />
                        <input value={storeForm.LogoUrl} placeholder="URL Логотипу" onChange={e => setStoreForm({ ...storeForm, LogoUrl: e.target.value })} />
                        <div className="modal-actions">
                            <button onClick={() => setStoreModalOpen(false)}>Скасувати</button>
                            <button className="btn-save" onClick={handleStoreSubmit}>Зберегти</button>
                        </div>
                    </div>
                </div>
            )}

            {isProductModalOpen && (
                <ProductModal
                    product={selectedProduct}
                    shopId={store?.Id}
                    onClose={() => setProductModalOpen(false)}
                    onSave={() => fetchProducts(store.Id)}
                />
            )}
            <button className="btn-main" onClick={() => navigate('/')}>
                ← Повернутися на головну
            </button>
        </div>
    );
};

export default StoreManager;