import React, { useState } from "react";
import "./AuthPopup.css";

type Mode = "login" | "register" | "confirm";

interface AuthProps {
    onLoginSuccess: (userId: number) => void;
}

const AuthPopup = ({ onLoginSuccess }: AuthProps) => {
    const [mode, setMode] = useState<Mode>("login");
    const [form, setForm] = useState({ name: "", email: "", password: "", code: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAction = async () => {
        if (mode !== "confirm") {//email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(form.email)) {
                alert("Будь ласка, введіть коректну адресу електронної пошти (наприклад, user@example.com).");
                return; //stop
            }
        }

        if (mode === "register" && form.password.length < 6) {//pass validation
            alert("Пароль має бути не менше 6 символів.");
            return;
        }

        let url = "";
        let body = {};

        if (mode === "register") {
            url = "http://localhost:3001/api/register";
            body = { name: form.name, email: form.email, password: form.password };
        } else if (mode === "confirm") {
            url = "http://localhost:3001/api/confirm";
            body = { email: form.email, code: form.code };
        } else {
            url = "http://localhost:3001/api/login";
            body = { email: form.email, password: form.password };
        }

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            if (mode === "register") {
                setForm(prev => ({ ...prev, password: "", code: "" }));
                setMode("confirm");
            }
            else if (data.userId)
                onLoginSuccess(data.userId);

        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup">
                <div className="tabs">
                    <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Логін</button>
                    <button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>Реєстрація</button>
                </div>

                <div className="form">
                    {mode === "register" && <input name="name" placeholder="Ім’я" value={form.name} onChange={handleChange} />}

                    {mode !== "confirm" ? (
                        <>
                            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
                            <input name="password" type="password" placeholder="Пароль" value={form.password} onChange={handleChange} />
                        </>
                    ) : (
                        <>
                            <p>Введіть код отриманий {form.email}</p>
                            <input name="code" type="password" placeholder="Код підтвердження" value={form.code} onChange={handleChange} />
                        </>
                    )}

                    <button onClick={handleAction}>
                        {mode === "login" ? "Увійти" : mode === "register" ? "Зареєструватись" : "Підтвердити код"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthPopup;