import "./ProfilePage.css";
import { useEffect, useState } from "react";
import type { Product } from "../core/types/Product";
import BackButton from "../components/BackToMainButton";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

interface UserInfo {
    Name: string;
    Email: string;
}

type PP_prop = {
    userId: number;
    itemPageNav: string;
    TIMEOUT_DELAY: number;
    NavigateGame: () => void | Promise<void>;

    OnProductSelect: (id: number) => void;
}

const ProfilePage = (prop: PP_prop) => {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [favorites, setFavorites] = useState<Product[]>([]);
    const [cart, setCart] = useState<Product[]>([]);
    const navigate = useNavigate();

    const [favPage, setFavPage] = useState(1);
    const [cartPage, setCartPage] = useState(1);
    const [isAllowLoader, setAllowLoader] = useState(true);
    const itemsPerPage = 5;

    useEffect(() => {
        if (prop.userId === -1)
             return;

        // load prod data, fav & cart
        const fetchProfileData = async () => {
            try {
                const res = await fetch(`/api/profile/${prop.userId}`);
                const data = await res.json();
                setUser(data.user);
                setFavorites(data.favorites);
                setCart(data.cart);
            } catch (err) {
                console.error("Profile loading error:", err);
            }
        };

        fetchProfileData();
        setTimeout(()=> setAllowLoader(false), prop.TIMEOUT_DELAY);
    }, [prop.userId]);

    if (/*prop.userId === -1*/isAllowLoader)
        return <Loader NavigateGame={prop.NavigateGame} />
    // return <div className="profile-container"><h1>Please, log in</h1>
    //     <BackButton />
    // </div>;

    // Summ
    const totalAmount = cart.reduce((sum, item) => sum + Number(item.Price) * (item.Quantity || 1), 0);
    const totalItems = cart.reduce((sum, item) => sum + (item.Quantity || 1), 0);

    // get curr ind elems on page
    const paginate = (items: any[], currentPage: number) => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return items.slice(indexOfFirstItem, indexOfLastItem);
    };

    const renderPagination = (totalItems: number, currentPage: number, setPage: (p: number) => void) => {
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
            pageNumbers.push(i);
        }
        if (pageNumbers.length <= 1) return null;
        return (
            <div className="pagination">
                {pageNumbers.map(num => (
                    <button key={num} className={num === currentPage ? "active" : ""}
                        onClick={() => setPage(num)}>
                        {num}
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="user-icon">👤</div>
                <h1>Hello, {user?.Name || "User"}!</h1>
                <div className="user-details">
                    <p><strong>Email:</strong> {user?.Email}</p>
                    <p><strong>User ID:</strong> {prop.userId}</p>
                </div>
            </div>

            <section className="profile-section">
                <h2>Favorite</h2>
                {favorites.length > 0 ? (
                    <>
                        <div className="product-list">
                            {paginate(favorites, favPage).map((item) => (
                                <div key={item.Id}
                                    onClick={() => {
                                        prop.OnProductSelect(item.Id);
                                        navigate(prop.itemPageNav);
                                    }}
                                    className="product-card">
                                    <img src={item.ImageUrl} alt={item.Name} />
                                    <h3>{item.Name}</h3>
                                    <p>{item.Price} $</p>
                                </div>
                            ))}
                        </div>
                        {renderPagination(favorites.length, favPage, setFavPage)}
                    </>
                ) : <p className="empty-msg">Favorite list is empty</p>}
            </section>

            <section className="profile-section">
                <h2>Shopping Cart</h2>
                {cart.length > 0 ? (
                    <>
                        <div className="cart-summary">
                            <p>Total Items: <strong>{totalItems}</strong></p>
                            <p>Total Amount: <strong>{totalAmount} $</strong></p>
                        </div>
                        <div className="product-list">
                            {paginate(cart, cartPage).map((item) => (
                                <div key={item.Id}
                                    onClick={() => {
                                        prop.OnProductSelect(item.Id);
                                        navigate(prop.itemPageNav);
                                    }}
                                    className="product-card">
                                    <img src={item.ImageUrl} alt={item.Name} />
                                    <h3>{item.Name}</h3>
                                    <p>{item.Price} $ (x{item.Quantity})</p>
                                </div>
                            ))}
                        </div>
                        {renderPagination(cart.length, cartPage, setCartPage)}
                    </>
                ) : <p className="empty-msg">Shopping cart is empty</p>}
            </section>

            <BackButton />
        </div>
    );
};

export default ProfilePage;