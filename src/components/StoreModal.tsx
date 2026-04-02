// import { useState } from "react";
import "./Modal.css"

type StoreForm = {
    Name: string;
    Description: string;
    LogoUrl: string;
};

type SM_prop = {
    store: any;
    storeForm: StoreForm;
    setStoreForm: React.Dispatch<React.SetStateAction<StoreForm>>;
    handleStoreSubmit: () => Promise<void>;
    setStoreModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const StoreModal = (prop: SM_prop) => {

    return (<div className="modal-overlay">
        <div className="modal-content">
            <h2>{prop.store ? "Редагувати магазин" : "Новий магазин"}</h2>
            <input value={prop.storeForm.Name} placeholder="Назва магазину"
                onChange={e => prop.setStoreForm({ ...prop.storeForm, Name: e.target.value })} />
            <textarea value={prop.storeForm.Description} placeholder="Опис"
                onChange={e => prop.setStoreForm({ ...prop.storeForm, Description: e.target.value })} />
            <input value={prop.storeForm.LogoUrl} placeholder="URL Логотипу"
                onChange={e => prop.setStoreForm({ ...prop.storeForm, LogoUrl: e.target.value })} />
            <div className="modal-actions">
                <button className="btn-cancel" onClick={() => prop.setStoreModalOpen(false)}>Скасувати</button>
                <button className="btn-save" onClick={prop.handleStoreSubmit}>Зберегти</button>
            </div>
        </div>
    </div>);
};

export default StoreModal;