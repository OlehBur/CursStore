import BackButton from '../components/BackToMainButton';
import './InfoPages.css';
// import humEng from '../assets/humEngineLogo.jpg';



const ContactsPage = () => {
    const SUPPORT_EMAIL = import.meta.env.VITE_EMAIL_SP || "support@example.com";
    const socialLinks = [
        { label: "GitHub", url: "https://github.com/OlehBur", icon: "💻", color: "#cecece" },
        { label: "Telegram Group", url: "https://t.me/HumEngine", /*source: {humEng},*/icon: "✈️",  color: "#4295be" },
        { label: "YouTube Channel", url: "https://www.youtube.com/@Oleh_Bur", icon: "🎬", color: "#c70202" }
    ];

    return (
        <div className="info-page-container">
            <h1 className="page-title">Our Contacts</h1>
            <p className="subtitle">We are always available to connect with our community</p>
            
            <div className="contacts-grid">
                {socialLinks.map((link, i) => (
                    <a key={i} href={link.url} target="_blank" rel="noreferrer" className="contact-card">
                        <span className="contact-icon" style={{ textShadow: `0 0 20px ${link.color}` }}>
                            {link.icon}
                        </span>
                        <span className="contact-label">{link.label}</span>
                    </a>
                ))}
            </div>

            <div className="support-box">
                <h3>Technical Support</h3>
                <p>Email: {SUPPORT_EMAIL}</p>
            </div>
            
            <BackButton />
        </div>
    );
};

export default ContactsPage;