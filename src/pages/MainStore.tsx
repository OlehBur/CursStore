import { useEffect, useState } from 'react';
import './MainStore.css';
import type { Product } from '../core/types/Product';
import { useNavigate } from 'react-router-dom';

interface Limits {
    maxPrice: number;
    maxCC: number;
    maxWeight: number;
    maxHP: number;
    maxNM: number;
}

type MS_prop = {
    // auth_nav: string;
    profile_nav: string;
    store_prof_nav: string;
    stores_nav: string;
    settings_nav: string;
    game_nav: string;
    item_nav: string;

    OnLogout: () => void;
}
//  <button onClick={() => navigate('/auth')}>
//           Авторизація
//         </button> */}
// {/* <button onClick={() => navigate('/profile')}>
//   Профіль
// </button>
// <button onClick={() => navigate('/store_profile')}>
//   Профіль Магазину
// </button>
// <button onClick={() => navigate('/settings')}>
//   Налаштування
// </button>
// <button onClick={() => navigate('/ttt')}>
//   Tic Tac Toe

const MainStore = (prop: MS_prop) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [limits, setLimits] = useState<Limits | null>(null);
    const navigate = useNavigate()

    const [filters, setFilters] = useState({
        sortBy: 'Popularity',
        order: 'DESC' as 'ASC' | 'DESC',
        page: 1,
        price: [0, 0],
        cc: [0, 0],
        weight: [0, 0],
        hp: [0, 0],
        nm: [0, 0]
    });

    useEffect(() => {// load limits range
        fetch('http://localhost:3001/api/products/limits')
            .then(res => res.json())
            .then((data: Limits) => {
                setLimits(data);
                setFilters(prev => ({
                    ...prev,
                    price: [0, data.maxPrice],
                    cc: [0, data.maxCC],
                    weight: [0, data.maxWeight],
                    hp: [0, data.maxHP],
                    nm: [0, data.maxNM]
                }));
            });
    }, []);

    useEffect(() => {// load if any filters changed
        if (limits) fetchProducts();
    }, [filters, search]);

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
    };

    if (!limits) return <div className="loader">Завантаження бази даних...</div>;

    return (
        <div className="main-layout">
            <header className="main-header">
                <div className="logo-section">
                    <span className="brand">HUM ENGINE</span>
                </div>
                <nav className="top-nav">
                    <button onClick={() => navigate(prop.stores_nav)}>Магазини</button>
                    <button onClick={() => navigate(prop.profile_nav)}>Профіль</button>
                    <button>Обране</button>
                    <button>Кошик</button>
                    <button onClick={() => navigate(prop.store_prof_nav)}>Партнерство</button>
                    <button>FAQ</button>
                    <button>Контакти</button>
                    <button onClick={prop.OnLogout}>Вийти з Акаунту</button>
                </nav>
            </header>

            <div className="content-wrapper">
                {/*extnd filters */}
                <aside className="filters-sidebar">
                    <h3>Додатковий фільтр</h3>

                    <div className="filter-item">
                        <label>Ціна: ${filters.price[0]} — ${filters.price[1]}</label>
                        <input type="range" min="0" max={limits.maxPrice} value={filters.price[1]}
                            onChange={e => setFilters({ ...filters, price: [filters.price[0], Number(e.target.value)], page: 1 })} />
                    </div>

                    <div className="filter-item">
                        <label>Кубатура: {filters.cc[0]} — {filters.cc[1]} CC</label>
                        <input type="range" min="0" max={limits.maxCC} value={filters.cc[1]}
                            onChange={e => setFilters({ ...filters, cc: [filters.cc[0], Number(e.target.value)], page: 1 })} />
                    </div>

                    <div className="filter-item">
                        <label>Вага: {filters.weight[0]} — {filters.weight[1]} кг</label>
                        <input type="range" min="0" max={limits.maxWeight} value={filters.weight[1]}
                            onChange={e => setFilters({ ...filters, weight: [filters.weight[0], Number(e.target.value)], page: 1 })} />
                    </div>

                    <div className="filter-item">
                        <label>Потужність (HP): {filters.hp[0]} — {filters.hp[1]}</label>
                        <input type="range" min="0" max={limits.maxHP} value={filters.hp[1]}
                            onChange={e => setFilters({ ...filters, hp: [filters.hp[0], Number(e.target.value)], page: 1 })} />
                    </div>

                    <div className="filter-item">
                        <label>Крутний момент (NM): {filters.nm[0]} — {filters.nm[1]}</label>
                        <input type="range" min="0" max={limits.maxNM} value={filters.nm[1]}
                            onChange={e => setFilters({ ...filters, nm: [filters.nm[0], Number(e.target.value)], page: 1 })} />
                    </div>
                </aside>

                <main className="store-body">
                    <div className="search-section">
                        <div className="search-input-wrapper">
                            <input
                                type="text"
                                placeholder="Пошук за назвою..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <button className="search-btn">🔍</button>
                        </div>
                    </div>

                    <div className="sorting-bar">
                        <span>Сортувати по:</span>
                        <div className="sort-buttons">
                            {['Popularity', 'Price', 'Name'].map(s => (
                                <button
                                    key={s}
                                    className={filters.sortBy === s ? 'active' : ''}
                                    onClick={() => setFilters({ ...filters, sortBy: s, page: 1 })}
                                >
                                    {s === 'Popularity' ? 'Популярності' : s === 'Price' ? 'Ціні' : 'Назві'}
                                </button>
                            ))}
                            <button className="order-btn" onClick={() => setFilters({ ...filters, order: filters.order === 'ASC' ? 'DESC' : 'ASC' })}>
                                {filters.order === 'ASC' ? '▲ Зростання' : '▼ Спадання'}
                            </button>
                        </div>
                    </div>

                    <div className="products-grid">
                        {products.map((p: Product) => (
                            <div key={p.Id} className="product-item-card" onClick={() => console.log('Open product', p.Id)}>
                                <div className="img-container">
                                    <img src={p.ImageUrl} alt={p.Name} onError={(e) => e.currentTarget.src = 'placeholder.jpg'} />
                                </div>
                                <h4>{p.Name}</h4>
                                <div className="card-footer">
                                    <span className="price">${p.Price}</span>
                                    <button className="add-to-cart" onClick={(e) => { e.stopPropagation(); console.log('Add to cart', p.Id) }}>🛒 </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    className={filters.page === i + 1 ? 'active' : ''}
                                    onClick={() => setFilters({ ...filters, page: i + 1 })}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default MainStore;