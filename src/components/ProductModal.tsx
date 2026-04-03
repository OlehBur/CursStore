import { useState } from "react";
import "./Modal.css"
// import "../pages/StoreManager.css"

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
        await fetch('/api/product/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, id: product?.Id, shopId })
        });
        onSave();
        onClose();
    };
    const handleDelete = async () => {
        if (!window.confirm(`Ви впевнені, що хочете видалити ${product.Name}?`)) return;

        await fetch(`/api/product/${product.Id}`, {
            method: 'DELETE'
        });
        onSave(); // upd lst
        onClose(); // close modal
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content wide">
                <h2>{product ? `Edit ${product.Name}` : "Add New Product"}</h2>
                <div className="form-grid">
                    <div className="form-left">
                        <input placeholder="Name" value={form.Name}
                            title="Product Name"
                            onChange={e => setForm({ ...form, Name: e.target.value })} />
                        <textarea placeholder="Description" value={form.Description}
                            title="Product Description"
                            onChange={e => setForm({ ...form, Description: e.target.value })} />
                        <input type="number" placeholder="Price ($)" value={form.Price}
                            title="Enter the price in USD (smallest unit is cent)"
                            onChange={e => setForm({ ...form, Price: e.target.value === "" ? undefined : Number(e.target.value) })} />
                        <input placeholder="Image URL" value={form.ImageUrl}
                            title="Image URL (Clicking on the image in the product page will open it in full size)"
                            onChange={e => setForm({ ...form, ImageUrl: e.target.value })} />
                        <input placeholder="Video URL" value={form.VideoUrl}
                            title="Video URL (YouTube or direct link)"
                            onChange={e => setForm({ ...form, VideoUrl: e.target.value })} />
                    </div>
                    <div className="form-right stats">
                        <label>Characteristics</label>
                        <input type="number" placeholder="Displacement (CC)" value={form.CC}
                            title="Enter the engine displacement in cubic centimeters (CC)"
                            onChange={e => setForm({ ...form, CC: e.target.value === "" ? undefined : Number(e.target.value) })} />
                        <input type="number" placeholder="Weight (kg)" value={form.Weight}
                            title="Enter the actual dry weight of the vehicle in kilograms (kg)"
                            onChange={e => setForm({ ...form, Weight: e.target.value === "" ? undefined : Number(e.target.value) })} />
                        <input type="number" placeholder="Horsepower (HP)" value={form.HP}
                            title="Enter the horsepower of the engine (HP)"
                            onChange={e => setForm({ ...form, HP: e.target.value === "" ? undefined : Number(e.target.value) })} />
                        <input type="number" placeholder="Torque (NM)" value={form.NM}
                            title="Enter the torque of the engine (NM)"
                            onChange={e => setForm({ ...form, NM: e.target.value === "" ? undefined : Number(e.target.value) })} />
                    </div>
                </div>
                <div className="modal-actions">
                    <div className="left-actions">
                        {product && (                    /* if prod exist*/
                            <button className="btn-delete" onClick={handleDelete}>
                                🗑️ Delete Product
                            </button>
                        )}
                    </div>
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="btn-save" onClick={handleSave}>Save Product</button>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;