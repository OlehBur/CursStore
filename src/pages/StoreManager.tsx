import { useEffect, useState } from 'react';
import './StoreManager.css';
import ProductModal from '../components/ProductModal';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../core/types/Product';
import Loader from '../components/Loader';


type SM_prop = {
    userId: number;
    storeId: number;
    itemPage_nav: string;
    TIMEOUT_DELAY: number;
    SetProductId: (id: number) => void;
}

const StoreManager = (prop: SM_prop) => {
    const navigate = useNavigate();
    const [store, setStore] = useState<any>(null);
    const [products, setProducts] = useState<Product[]>([]);
    // const [loading, setLoading] = useState(true);
    const [allowLoader, setAllowLoader] = useState(true);

    const isOwner = store && store.UserId === prop.userId;//is curr user Owner

    // modals
    const [isStoreModalOpen, setStoreModalOpen] = useState(false);
    const [isProductModalOpen, setProductModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const [storeForm, setStoreForm] = useState({ Name: '', Description: '', LogoUrl: '' });

    // useEffect(() => {
    //     // if storeId not ex, get sh by user 
    //     const fetchUrl = prop.storeId
    //         ? `http://localhost:3001/api/store/details/${prop.storeId}`
    //         : `http://localhost:3001/api/store/${prop.userId}`;

    //     const fetchStoreData = async () => {
    //         const res = await fetch(fetchUrl);
    //         const data = await res.json();
    //         if (data.exists) {
    //             setStore(data.store);
    //             fetchProducts(data.store.Id);
    //         }
    //     };
    //     fetchStoreData();
    // }, [prop.userId, prop.storeId]);
    const loadData = async () => {
        setAllowLoader(true);
        // setLoading(true);

        // if storeId  != -1 -> get by ID. 
        // else -search user shop
        const hasValidStoreId = typeof prop.storeId === 'number' && prop.storeId > 0;
        const fetchUrl = hasValidStoreId ?//(prop.storeId !== -1)
            `http://localhost:3001/api/store/details/${prop.storeId}`
            : `http://localhost:3001/api/store/${prop.userId}`;
        // console.log("Fetching store from:", fetchUrl); 

        try {
            const res = await fetch(fetchUrl);
            const data = await res.json();

            if (data.exists) {
                setStore(data.store);
                setStoreForm({
                    Name: data.store.Name,
                    Description: data.store.Description,
                    LogoUrl: data.store.LogoUrl
                });
                fetchProducts(data.store.Id);
            } else {
                setStore(null);
            }
        } catch (e) {
            console.error("Помилка завантаження:", e);
        } finally {
            // setLoading(false);
            setTimeout(() => setAllowLoader(false), prop.TIMEOUT_DELAY);
        }
    };

    // Викликаємо при монтуванні або зміні ID
    useEffect(() => {
        loadData();
    }, [prop.storeId, prop.userId]);
    // useEffect(() => {
    //     const loadData = async () => {
    //         setLoading(true);
    //         //get URL by ID store or userId (if own)
    //         const fetchUrl = prop.storeId
    //             ? `http://localhost:3001/api/store/details/${prop.storeId}`
    //             : `http://localhost:3001/api/store/${prop.userId}`;

    //         try {
    //             const res = await fetch(fetchUrl);
    //             const data = await res.json();

    //             if (data.exists) {
    //                 setStore(data.store);
    //                 setStoreForm({
    //                     Name: data.store.Name,
    //                     Description: data.store.Description,
    //                     LogoUrl: data.store.LogoUrl
    //                 });
    //                 fetchProducts(data.store.Id);
    //             } else {
    //                 setStore(null); // store doenst exist yet
    //             }
    //         } catch (e) {
    //             console.error("Помилка завантаження магазину:", e);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     loadData();
    // }, [prop.userId, prop.storeId]);

    // const fetchStoreData = async () => {
    //     try {
    //         const res = await fetch(`http://localhost:3001/api/store/${prop.userId}`);
    //         const data = await res.json();
    //         if (data.exists) {
    //             setStore(data.store);
    //             setStoreForm({
    //                 Name: data.store.Name,
    //                 Description: data.store.Description,
    //                 LogoUrl: data.store.LogoUrl
    //             });
    //             fetchProducts(data.store.Id);
    //         }
    //     } catch (e) { console.error(e); }
    //     setLoading(false);
    // };

    const fetchProducts = async (shopId: number) => {
        const res = await fetch(`http://localhost:3001/api/store/${shopId}/products`);
        const data = await res.json();
        setProducts(data);
    };

    // const handleStoreSubmit = async () => {
    //     const method = store ? 'PUT' : 'POST';
    //     const url = store ? `http://localhost:3001/api/store/${store.Id}` : `http://localhost:3001/api/store`;

    //     await fetch(url, {
    //         method,
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ ...storeForm, userId: prop.userId })
    //     });
    //     fetchStoreData();
    //     setStoreModalOpen(false);
    // };
    const handleStoreSubmit = async () => {
        const method = store ? 'PUT' : 'POST';
        const url = store ? `http://localhost:3001/api/store/${store.Id}` : `http://localhost:3001/api/store`;

        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...storeForm, userId: prop.userId })
        });

        loadData(); //!
        setStoreModalOpen(false);
    };

    if (allowLoader)//loading
        return <Loader />;
    //  <div className="loader">Завантаження...</div>;

    // console.log("Current store state:", store, "isOwner:", isOwner);
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
                <div>{ /*className="store-dashboard"*/}
                    <header className="store-header">
                        <div className="header-content">
                            <img src={store.LogoUrl} alt="Logo" className="store-logo-main" />
                            <div className="store-info">
                                <h1>{isOwner ? "Профіль " : "Магазин "} "{store.Name}"</h1>
                                <p>{store.Description}</p>
                                {isOwner && (
                                    <button className="btn-edit-store" onClick={() => setStoreModalOpen(true)}>
                                        Редагувати дані
                                    </button>)
                                }
                            </div>
                        </div>
                    </header>

                    <div className="store-products-grid">
                        {/* add new prod block*/}
                        {isOwner && (<div className="product-card add-new" onClick={() => {
                            setSelectedProduct(null);
                            setProductModalOpen(true);
                        }}>
                            <div className="plus-wrapper">
                                <span className="plus-icon">+</span>
                                <p>Додати продукт</p>
                            </div>
                        </div>)}

                        {/* prods blocks */}
                        {products.map((p) => (
                            <div key={p.Id}
                                onClick={() => {
                                    setSelectedProduct(p);
                                    prop.SetProductId(p.Id);//for prod page
                                    navigate(prop.itemPage_nav);
                                }}
                                className="product-card">
                                <img src={p.ImageUrl} alt={p.Name} className="card-product-img" />
                                <div className='card-content'>
                                    <h3>{p.Name}</h3>
                                    <span className="product-price">${p.Price}</span>
                                    {isOwner && (
                                        <button className="btn-edit-prod" onClick={(е) => {
                                            е.stopPropagation(); // ban parent events
                                            setSelectedProduct(p);
                                            setProductModalOpen(true);
                                        }}>
                                            Редагувати
                                        </button>)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
            }

            {
                isStoreModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h2>{store ? "Редагувати магазин" : "Новий магазин"}</h2>
                            <input value={storeForm.Name} placeholder="Назва магазину"
                                onChange={e => setStoreForm({ ...storeForm, Name: e.target.value })} />
                            <textarea value={storeForm.Description} placeholder="Опис"
                                onChange={e => setStoreForm({ ...storeForm, Description: e.target.value })} />
                            <input value={storeForm.LogoUrl} placeholder="URL Логотипу"
                                onChange={e => setStoreForm({ ...storeForm, LogoUrl: e.target.value })} />
                            <div className="modal-actions">
                                <button onClick={() => setStoreModalOpen(false)}>Скасувати</button>
                                <button className="btn-save" onClick={handleStoreSubmit}>Зберегти</button>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                isProductModalOpen && (
                    <ProductModal
                        product={selectedProduct}
                        shopId={store?.Id}
                        onClose={() => setProductModalOpen(false)}
                        onSave={() => fetchProducts(store.Id)}
                    />
                )
            }
            <button className="btn-main" onClick={() => navigate('/')}>
                ← Повернутися на головну
            </button>
        </div >
    );
};

export default StoreManager;