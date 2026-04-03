import BackButton from '../components/BackToMainButton';
import './InfoPages.css';

const FAQ_Page = () => {
    const questions = [
        { q: "What is HUM ENGINE?", a: "It is a platform for motorcycle enthusiasts where you can view specifications, compare models, and find the best offers from partner stores using convenient filters." },
        {q:"How to add a product to the Cart or Favorites?", a:"Click on the product card to go to its page, where you will find the 'Add to Cart' and 'Add to Favorites' buttons. After adding, you can view the cart and favorites list in the Profile tab."},
        {q:"How to view the list of available products from a specific store?", a:"Use the 'Stores' tab to view all partner stores. Select an interesting store to see its profile with all available products and their specifications. Or navigate to the store through the mini-profile on the product page."},
        // {q:"", a:""},
        { q: "How to add your product?", a: "Navigate to the 'Partnership' section and register your store if you haven't done so already. After moderation, you will be able to add products through the management panel." },
        { q: "What is the 'Game' in the menu?", a: "It is an embedded mini-game (Sticks), so you can relax between searching for the perfect engine." },
        { q: "Is there delivery?", a: "Delivery conditions depend on the specific store-owner. Details can be found in the store profile. However, at the moment any delivery method is not implemented on the website." }
    ];

    return (
        <div className="info-page-container">
            <h1 className="page-title">FAQ</h1>
            <div className="faq-list">
                {questions.map((item, i) => (
                    <div key={i} className="faq-card">
                        <h3 className="faq-question"><span>?</span> {item.q}</h3>
                        <p className="faq-answer">{item.a}</p>
                    </div>
                ))}
            </div>
            <BackButton />
        </div>
    );
};

export default FAQ_Page;