import React, { useEffect, useState } from "react";
import "./AuthPopup.css";

type Mode = "login" | "register" | "confirm";

interface AuthProps {
    onLoginSuccess: (userId: number) => void;
}

const AuthPopup = ({ onLoginSuccess }: AuthProps) => {
    const [mode, setMode] = useState<Mode>("login");
    const [form, setForm] = useState({ name: "", email: "", password: "", code: "" });
    const [timeLeft, setTimeLeft] = useState<number>(0);

    useEffect(() => {
        let timer: any;
        if (mode === "confirm" && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && mode === "confirm") {
            setMode("register");
            alert("Confirmation time expired. Please register again.");
        }

        return () => clearInterval(timer);
    }, [timeLeft, mode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAction = async () => {
        if (mode !== "confirm") {//email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(form.email)) {
                alert("Please enter a valid email address (for example, user@example.com).");
                return; //stop
            }
        }

        if (mode === "register" && form.password.length < 6) {//pass validation
            alert("Password must be at least 6 characters long.");
            return;
        }

        let url = "";
        let body = {};

        if (mode === "register") {
            url = "/api/register";
            body = { name: form.name, email: form.email, password: form.password };
        } else if (mode === "confirm") {
            url = "/api/confirm";
            body = { email: form.email, code: form.code };
        } else {
            url = "/api/login";
            body = { email: form.email, password: form.password };
        }

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await res.json();

            if (!res.ok)
                throw new Error(data.error);

            if (mode === "register") {
                setForm(prev => ({ ...prev, password: "", code: "" }));
                setMode("confirm");
                setTimeLeft(59);
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
                    <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Login</button>
                    <button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>Register</button>
                </div>

                <div className="form">
                    {mode === "register" && <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />}

                    {mode !== "confirm" ? (
                        <>
                            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
                            <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
                        </>
                    ) : (
                        <div className="timer-section">
                            <p>Enter the code received at {form.email}</p>
                            <input name="code" type="password" placeholder="Confirmation Code" value={form.code} onChange={handleChange} />
                            <p className={`timer ${timeLeft < 10 ? 'urgent' : ''}`}>Time remaining: 0:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</p>
                        </div>
                    )}

                    <button onClick={handleAction}>
                        {mode === "login" ? "Login" : mode === "register" ? "Register" : "Confirm Code"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthPopup;