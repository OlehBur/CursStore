import React, { useState } from "react";
import "./AuthPopup.css";

type Mode = "login" | "register" | "confirm";

const AuthPopup = () => {
  const [mode, setMode] = useState<Mode>("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", code: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <div className="tabs">
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            Логін
          </button>
          <button
            className={mode === "register" ? "active" : ""}
            onClick={() => setMode("register")}
          >
            Реєстрація
          </button>
        </div>

        {mode === "login" && (
          <div className="form">
            <input name="email" placeholder="Email" onChange={handleChange} />
            <input name="password" type="password" placeholder="Пароль" onChange={handleChange} />
            <button>Увійти</button>
          </div>
        )}

        {mode === "register" && (
          <div className="form">
            <input name="name" placeholder="Ім’я" onChange={handleChange} />
            <input name="email" placeholder="Email" onChange={handleChange} />
            <input name="password" type="password" placeholder="Пароль" onChange={handleChange} />
            <button>Зареєструватись</button>
          </div>
        )}

        {mode === "confirm" && (
          <div className="form">
            <p>
              Введіть код, надісланий на{" "}
              {form.email.replace(/(.{3}).+(@.+)/, "$1***$2")}
            </p>
            <input name="code" placeholder="Код" onChange={handleChange} />
            <button>Підтвердити</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPopup;
