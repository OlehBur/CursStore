import { useState } from "react";
import "../pages/StoreManager.css"

const ProductModal = ({ product, shopId, onClose, onSave }: any) => {
    const [form, setForm] = useState({
        Name: product?.Name || '',
        Description: product?.Description || '',
        Price: product?.Price || '',
        ImageUrl: product?.ImageUrl || '',
        VideoUrl: product?.VideoUrl || '',
        CC: product?.CC || '',
        Weight: product?.Weight || '',
        HP: product?.HP || '',
        NM: product?.NM || ''
    });

    const handleSave = async () => {
        await fetch('http://localhost:3001/api/product/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, id: product?.Id, shopId })
        });
        onSave();
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content wide">
                <h2>{product ? `Редагувати ${product.Name}` : "Додати новий продукт"}</h2>
                <div className="form-grid">
                    <div className="form-left">
                        <input placeholder="Назва" value={form.Name} onChange={e => setForm({ ...form, Name: e.target.value })} />
                        <textarea placeholder="Опис" value={form.Description} onChange={e => setForm({ ...form, Description: e.target.value })} />
                        <input type="number" placeholder="Ціна ($)" value={form.Price} onChange={e => setForm({ ...form, Price: Number(e.target.value) })} />
                        <input placeholder="Image URL" value={form.ImageUrl} onChange={e => setForm({ ...form, ImageUrl: e.target.value })} />
                        <input placeholder="Video URL" value={form.VideoUrl} onChange={e => setForm({ ...form, VideoUrl: e.target.value })} />
                    </div>
                    <div className="form-right stats">
                        <label>Характеристики</label>
                        <input type="number" placeholder="Кубатура (CC)" value={form.CC} onChange={e => setForm({ ...form, CC: Number(e.target.value) })} />
                        <input type="number" placeholder="Вага (кг)" value={form.Weight} onChange={e => setForm({ ...form, Weight: Number(e.target.value) })} />
                        <input type="number" placeholder="Кінські сили (HP)" value={form.HP} onChange={e => setForm({ ...form, HP: Number(e.target.value) })} />
                        <input type="number" placeholder="Ньютон-метри (NM)" value={form.NM} onChange={e => setForm({ ...form, NM: Number(e.target.value) })} />
                    </div>
                </div>
                <div className="modal-actions">
                    <button onClick={onClose}>Закрити</button>
                    <button className="btn-save" onClick={handleSave}>Зберегти продукт</button>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;