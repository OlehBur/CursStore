const express = require("express");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { getPool } = require("./db");
require('dotenv').config(); 
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());

// просте симетричне шифрування (масочка)
const secret = "mySecretKey123"; // ключ для шифрування

function encrypt(text) {
    const cipher = crypto.createCipher("aes-256-ctr", secret);
    return cipher.update(text, "utf8", "hex") + cipher.final("hex");
}

function decrypt(hash) {
    const decipher = crypto.createDecipher("aes-256-ctr", secret);
    return decipher.update(hash, "hex", "utf8") + decipher.final("utf8");
}

//  (Gmail SMTP)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // App Password in Gmail
    }
});

app.post("/api/register", async (req, res) => {
    const { email, password } = req.body;
    const pool = await getPool();

    const encryptedPass = encrypt(password);
    const tempKey = crypto.randomBytes(3).toString("hex");

    await pool.request()
        .input("Email", email)
        .input("Password", encryptedPass)
        .input("TempKey", tempKey)
        .query(`
      INSERT INTO Users (Email, Password, TempKey)
      VALUES (@Email, @Password, @TempKey)
    `);

    //snd code
    await transporter.sendMail({
        from: '"MotoShop No-Reply" <noreply@hum.engine.shop.com>',
        to: email,
        subject: "Підтвердження реєстрації",
        text: `Ваш код: ${tempKey}`
    });


    res.json({ message: "User created, check email for code" });
});

app.post("/api/confirm", async (req, res) => {
    const { email, code } = req.body;
    const pool = await getPool();

    const result = await pool.request()
        .input("Email", email)
        .query("SELECT TempKey FROM Users WHERE Email=@Email");

    if (result.recordset.length === 0) return res.status(400).json({ error: "User not found" });

    if (result.recordset[0].TempKey === code) {
        await pool.request()
            .input("Email", email)
            .query("UPDATE Users SET TempKey=NULL WHERE Email=@Email");
        res.json({ message: "Confirmed!" });
    } else {
        res.status(400).json({ error: "Invalid code" });
    }
});

app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    const pool = await getPool();

    const result = await pool.request()
        .input("Email", email)
        .query("SELECT Password, TempKey FROM Users WHERE Email=@Email");

    if (result.recordset.length === 0) return res.status(400).json({ error: "User not found" });

    const user = result.recordset[0];
    const decryptedPass = decrypt(user.Password);

    if (decryptedPass !== password) return res.status(400).json({ error: "Wrong password" });
    if (user.TempKey !== null) return res.status(400).json({ error: "User not confirmed" });

    res.json({ message: "Login successful" });
});

app.listen(3001, () => {
    console.log("API running on http://localhost:3001");
});
