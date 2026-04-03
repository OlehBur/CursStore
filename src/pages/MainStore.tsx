import { useEffect, useState } from 'react';
import './MainStore.css';
import type { Product } from '../core/types/Product';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

// import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import RangeFilter from '../components/RangeFilter';

interface Limits {
    minPrice: number; maxPrice: number;
    minCC: number; maxCC: number;
    minWeight: number; maxWeight: number;
    minHP: number; maxHP: number;
    minNM: number; maxNM: number;
}

type MS_prop = {
    // auth_nav: string;
    profile_nav: string;
    store_prof_nav: string;
    stores_nav: string;
    settings_nav: string;
    game_nav: string;
    item_nav: string;
    contacts_nav: string;
    faq_nav: string;

    TIMEOUT_DELAY: number;

    OnLogout: () => void;
    OnProductSelect: (id: number) => void;
    OnStoreSelect: (id: number) => void;
}
//  <button onClick={() => navigate('/auth')}>
//           Authorization
//         </button> */}
// {/* <button onClick={() => navigate('/profile')}>
//   Profile
// </button>
// <button onClick={() => navigate('/store_profile')}>
//   Store Profile
// </button>
// <button onClick={() => navigate('/settings')}>
//   Settings
// </button>
// <button onClick={() => navigate('/ttt')}>
//   Tic Tac Toe

const MainStore = (prop: MS_prop) => {
    const FILTERS_APPLY_DELAY = 100;
    const [products, setProducts] = useState<Product[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    // const [viewedProduct, setViewedProucts] = useState(0);
    const [limits, setLimits] = useState<Limits | null>(null);
    const [loaderAllow, setLoaderAllow] = useState<boolean>(true);
    // const TIMEOUT_DELAY = 1000;
    const navigate = useNavigate()

    const savedFilters = sessionStorage.getItem('store_filters');
    const initialFilters = savedFilters ?
        JSON.parse(savedFilters)
        : {
            sortBy: 'Popularity',
            order: 'DESC' as 'ASC' | 'DESC',
            page: 1,
            price: [0, 0],// !!! 0 limits not loaded yet
            cc: [0, 0],         //      //100 for avoid crash if limits not loaded yet
            weight: [0, 0],
            hp: [0, 0],
            nm: [0, 0]
        };

    // const [filters, setFilters] = useState({
    //     sortBy: 'Popularity',
    //     order: 'DESC' as 'ASC' | 'DESC',
    //     page: 1,
    //     price: [0, 0],
    //     cc: [0, 0],
    //     weight: [0, 0],
    //     hp: [0, 0],
    //     nm: [0, 0]
    // });
    const [filters, setFilters] = useState(() => {
        const saved = sessionStorage.getItem('store_filters');
        if (saved)
            return JSON.parse(saved);

        return initialFilters;
    });
    // const [search, setSearch] = useState('');
    const [search, setSearch] = useState(() => sessionStorage.getItem('store_search') || '');

    useEffect(() => {// load limits range
        fetch('http://localhost:3001/api/products/limits')
            .then(res => res.json())
            .then((data: Limits) => {
                setLimits(data);

                setFilters((prev: typeof filters): typeof filters => { // upd only if filters are default (price[1] === 0)
                    if (prev.price[1] !== 0)
                        return prev; // otherwise
                    return {
                        ...prev,
                        price: [data.minPrice, data.maxPrice],
                        cc: [data.minCC, data.maxCC],
                        weight: [data.minWeight, data.maxWeight],
                        hp: [data.minHP, data.maxHP],
                        nm: [data.minNM, data.maxNM]
                    };
                });
            })
            .catch(err => console.error("Limits load error:", err));
    }, []);


    // useEffect(() => {// load if any filters changed
    //     if (limits) {
    //         fetchProducts();

    //         //save Filters
    //         sessionStorage.setItem('store_filters', JSON.stringify(filters));
    //         sessionStorage.setItem('store_search', search);

    //         setTimeout(() => setLoaderAllow(false), prop.TIMEOUT_DELAY);
    //     }
    //     // else
    //     //     setLoaderAllow(true);
    // }, [filters, search]);

    useEffect(() => {// load if any filters changed
        if (!limits)
            return;

        const delayFetchDeag = setTimeout(() => {
            const loadData = async () => {
                try {
                    await fetchProducts();

                    // save Filters
                    // setTimeout(()=>{
                    sessionStorage.setItem('store_filters', JSON.stringify(filters));
                    sessionStorage.setItem('store_search', search);
                } catch (e) {
                    console.error("Failed to fetch products", e);
                } finally {
                    setTimeout(() => setLoaderAllow(false), prop.TIMEOUT_DELAY);
                }
            };
            loadData();
        }, FILTERS_APPLY_DELAY);

        return () => clearTimeout(delayFetchDeag);
    }, [filters, search, limits]);

    const fetchProducts = async () => {
        const query = new URLSearchParams({
            q: search,
            sortBy: filters.sortBy,
            order: filters.order,
            page: filters.page.toString(),
            minPrice: filters.price[0].toString(),
            maxPrice: filters.price[1].toString(),
            minCC: filters.cc[0].toString(),
            maxCC: filters.cc[1].toString(),
            minWeight: filters.weight[0].toString(),
            maxWeight: filters.weight[1].toString(),
            minHP: filters.hp[0].toString(),
            maxHP: filters.hp[1].toString(),
            minNM: filters.nm[0].toString(),
            maxNM: filters.nm[1].toString()
        });

        const res = await fetch(`http://localhost:3001/api/products/search?${query}`);
        const data = await res.json();
        setProducts(data.products);
        setTotalPages(data.totalPages);
        // setViewedProucts(data.total.length);
    };

    const resetFilters = () => {
        sessionStorage.removeItem('store_filters');
        sessionStorage.removeItem('store_search');
        window.location.reload();
    };

    if (loaderAllow)
        return <Loader />;

    return (
        <div className="main-layout">
            <header className="main-header">
                <div className="logo-section">
                    <span className="brand" onClick={() => resetFilters()}>HUM ENGINE</span>
                </div>
                <nav className="top-nav">
                    <button onClick={() => navigate(prop.stores_nav)}>Stores</button>
                    <button onClick={() => navigate(prop.profile_nav)}>Profile</button>
                    <button>Favorites</button>
                    <button>Cart</button>
                    <button onClick={() => navigate(prop.game_nav)}>Game</button>
                    <button onClick={() => {
                        prop.OnStoreSelect(-1);
                        navigate(prop.store_prof_nav);
                    }}>Partnership</button>
                    <button onClick={() => navigate(prop.faq_nav)}>FAQ</button>
                    <button onClick={() => navigate(prop.contacts_nav)}>Contacts</button>
                    <button onClick={prop.OnLogout}>Logout</button>
                </nav>
            </header>

            <div className="content-wrapper">
                {/*extnd filters */}
                <aside className="filters-sidebar">
                    <h3>Advanced filter</h3>

                    <div className="filters-body">
                        {/* render pnly when limits loaded */}
                        {limits && limits.maxPrice !== undefined ? (
                            <>
                                <RangeFilter
                                    // title="Ціна, $ " 
                                    title={<span>Price<br /> </span>}
                                    field="price"
                                    min={limits.minPrice} max={limits.maxPrice} unit="$"
                                    filters={filters} setFilters={setFilters}
                                />
                                <RangeFilter
                                    title={<span>Engine Volume<br /> </span>} field="cc"
                                    min={limits.minCC} max={limits.maxCC} unit="cm³"
                                    filters={filters} setFilters={setFilters}
                                />
                                <RangeFilter
                                    title={<span>Weight<br /> </span>} field="weight"
                                    min={limits.minWeight} max={limits.maxWeight} unit="kg"
                                    filters={filters} setFilters={setFilters}
                                />
                                <RangeFilter
                                    title={<span>Power<br /> </span>} field="hp"
                                    min={limits.minHP} max={limits.maxHP} unit="hp"
                                    filters={filters} setFilters={setFilters}
                                />
                                <RangeFilter
                                    title={<span>Torque<br /> </span>} field="nm"
                                    min={limits.minNM} max={limits.maxNM} unit="Nm"
                                    filters={filters} setFilters={setFilters}
                                />
                            </>
                        ) : (
                            <div className="filters-loading">Loading filters...</div>
                        )}</div>

                    {/* <div className="filter-item">
                        <label>Price: ${filters.price[0]} — ${filters.price[1]}</label>
                        <input type="range" min="0" max={limits?.maxPrice} value={filters.price[1]}
                            onChange={e => setFilters({ ...filters, price: [filters.price[0], Number(e.target.value)], page: 1 })} />
                    </div>

                    <div className="filter-item">
                        <label>Engine Volume: {filters.cc[0]} — {filters.cc[1]} cm³</label>
                        <input type="range" min="0" max={limits?.maxCC} value={filters.cc[1]}
                            onChange={e => setFilters({ ...filters, cc: [filters.cc[0], Number(e.target.value)], page: 1 })} />
                    </div>

                    <div className="filter-item">
                        <label>Weight: {filters.weight[0]} — {filters.weight[1]} kg</label>
                        <input type="range" min="0" max={limits?.maxWeight} value={filters.weight[1]}
                            onChange={e => setFilters({ ...filters, weight: [filters.weight[0], Number(e.target.value)], page: 1 })} />
                    </div>

                    <div className="filter-item">
                        <label>Power (HP): {filters.hp[0]} — {filters.hp[1]}</label>
                        <input type="range" min="0" max={limits?.maxHP} value={filters.hp[1]}
                            onChange={e => setFilters({ ...filters, hp: [filters.hp[0], Number(e.target.value)], page: 1 })} />
                    </div>

                    <div className="filter-item">
                        <label>Torque (NM): {filters.nm[0]} — {filters.nm[1]}</label>
                        <input type="range" min="0" max={limits?.maxNM} value={filters.nm[1]}
                            onChange={e => setFilters({ ...filters, nm: [filters.nm[0], Number(e.target.value)], page: 1 })} />
                    </div> */}
                </aside>

                <main className="store-body">
                    <div className="search-section">
                        <div className="search-input-wrapper">
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <div className="search-btn">🔍</div>
                            {/* <button className="search-btn">🔍</button> */}
                        </div>
                    </div>

                    <div className="sorting-bar">
                        <span>Sort by:</span>
                        <div className="sort-buttons">
                            {['Popularity', 'Price', 'Name'].map(s => (
                                <button
                                    key={s}
                                    className={filters.sortBy === s ? 'active' : ''}
                                    onClick={() => setFilters({ ...filters, sortBy: s, page: 1 })}
                                >
                                    {s === 'Popularity' ? 'Popularity' : s === 'Price' ? 'Price' : 'Name'}
                                </button>
                            ))}
                            <button className="order-btn" onClick={() => setFilters({ ...filters, order: filters.order === 'ASC' ? 'DESC' : 'ASC' })}>
                                {filters.order === 'ASC' ? '▲ Ascending' : '▼ Descending'}
                            </button>
                        </div>
                    </div>

                    <div className="products-grid">
                        {products.map((p: Product) => (
                            <div key={p.Id} className="product-item-card" onClick={() => {
                                prop.OnProductSelect(p.Id);
                                navigate(prop.item_nav);
                            }}>
                                {/* <div className="img-container">
                                    <img src={p.ImageUrl} alt={p.Name} onError={(e) => e.currentTarget.src = 'placeholder.jpg'} />
                                </div>
                                <div className="card-footer">
                                    <h4 className='product-name'>{p.Name}</h4>
                                    <span className="price">${p.Price}</span> */}
                                {/* <button className="add-to-cart" onClick={(e) => { e.stopPropagation(); console.log('Add to cart', p.Id) }}>🛒</button> */}
                                {/* </div> */}
                                <div className="img-container">
                                    <img src={p.ImageUrl} alt={p.Name} onError={(e) => e.currentTarget.src = 'placeholder.jpg'} />
                                </div>
                                <div className="card-info-wrapper">
                                    <div className="product-name-container">
                                        <h4 className='product-name'>{p.Name}</h4>
                                    </div>
                                    <div className="price-container">
                                        <span className="price">${p.Price}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            {[...Array(totalPages)].map((_, i) => (//(totalPages)products.length
                                <button
                                    key={i}
                                    className={filters.page === i + 1 ? 'active' : ''}
                                    onClick={() => {
                                        setFilters({ ...filters, page: i + 1 });
                                    }}>
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </main>
            </div >
        </div >
    );
};

export default MainStore;