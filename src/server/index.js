import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json()); // read JSON frontend

const secret = process.env.DB_SECRET;

// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_USER_PASS,
//     database: process.env.DB_NAME,
//     port: process.env.DB_PORT
// });
const db = mysql.createPool({//Connection olnly one (trouble if timeout), otherwise pool - is multiple
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_USER_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// db.connect((err) => {
//     if (err)
//         console.error('Помилка підключення до MySQL:', err.message);
//     else
//         console.log('Успішно підключено до бази AlwaysData.');
// });
db.getConnection((err, connection) => {
    if (err)
        console.error('Помилка пулу MySQL:', err.message);
    else {
        console.log('Успішно підключено до пулу бази даних.');
        connection.release(); //ret connection to pool
    }
});


const algorithm = 'aes-256-cbc';
const key = crypto.scryptSync(secret, 'salt', 32);
// const iv = crypto.randomBytes(16);

function encrypt(text) {
    const localIv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, localIv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return localIv.toString('hex') + ':' + encrypted;
}

function decrypt(hash) {
    try {
        if (!hash || !hash.includes(':')) return "";

        const [ivPart, encryptedPart] = hash.split(':');

        if (ivPart.length !== 32) return "";

        const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(ivPart, 'hex'));

        let decrypted = decipher.update(encryptedPart, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (e) {
        console.error("Помилка всередині decrypt:", e.message);
        return "";
    }
}

app.get('/api/store/:userId', (req, res) => {//check & get data fr shop by userId
    const userId = req.params.userId;
    const sql = "SELECT * FROM Stores WHERE UserId = ?";
    db.query(sql, [userId], (err, results) => {
        if (err)
            return res.status(500).json({ error: err.message });
        if (results.length === 0)
            return res.json({ exists: false });
        res.json({ exists: true, store: results[0] });
    });
});

app.post('/api/store', (req, res) => {// create sjop
    const { Name, Description, LogoUrl, userId } = req.body;

    if (!Name || !userId) //because Name & User Id not null
        return res.status(400).json({ error: "Назва та ID користувача обов'язкові" });

    const sql = "INSERT INTO Stores (Name, Description, LogoUrl, UserId) VALUES (?, ?, ?, ?)";
    db.query(sql, [Name, Description, LogoUrl, userId], (err, result) => {
        if (err)
            return res.status(500).json({ error: err.message });
        res.json({ success: true, storeId: result.insertId });
        // console.log("store insert success!");
    });
});

app.put('/api/store/:id', (req, res) => {// edit shop
    const { Name, Description, LogoUrl } = req.body;
    const sql = "UPDATE Stores SET Name = ?, Description = ?, LogoUrl = ? WHERE Id = ?";
    db.query(sql, [Name, Description, LogoUrl, req.params.id], (err) => {
        if (err)
            return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.get('/api/store/:shopId/products', (req, res) => {//get prod fr exact shop
    const sql = "SELECT * FROM Products WHERE ShopId = ?";
    db.query(sql, [req.params.shopId], (err, results) => {
        if (err)
            return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/product/save', (req, res) => {// add/edit prod (universal)
    const { id, Name, Description, Price, ImageUrl, VideoUrl, CC, Weight, HP, NM, shopId } = req.body;

    if (id) {        // UPDATE
        const sql = "UPDATE Products SET Name=?, Description=?, Price=?, ImageUrl=?, VideoUrl=?, CC=?, Weight=?, HP=?, NM=? WHERE Id=?";
        db.query(sql, [Name, Description, Price, ImageUrl, VideoUrl, CC, Weight, HP, NM, id], (err) => {
            if (err)
                return res.status(500).json({ error: err.message });
            res.json({ success: true });
        });
    } else {        // INSERT
        const sql = "INSERT INTO Products (Name, Description, Price, ImageUrl, VideoUrl, CC, Weight, HP, NM, ShopId) VALUES (?,?,?,?,?,?,?,?,?,?)";
        db.query(sql, [Name, Description, Price, ImageUrl, VideoUrl, CC, Weight, HP, NM, shopId], (err) => {
            if (err)
                return res.status(500).json({ error: err.message });
            res.json({ success: true });
        });
    }
});

app.get('/api/profile/:Id', (req, res) => {
    const userId = req.params.Id;

    db.query("SELECT Name, Email FROM Users WHERE Id = ?", [userId], (err, userResults) => {//get fr users
        if (err || userResults.length === 0) return res.status(404).json({ error: "User not found" });

        const userData = userResults[0];
        userData.Email = decrypt(userData.Email);

        const favSql = `
            SELECT p.Id, p.Name, p.Price, p.ImageUrl 
            FROM Favorites f 
            JOIN Products p ON f.ProductId = p.Id 
            WHERE f.UserId = ?`;//get favorites

        db.query(favSql, [userId], (err, favResults) => {

            const cartSql = `
                SELECT p.Id, p.Name, p.Price, p.ImageUrl, c.Quantity 
                FROM CartItems c 
                JOIN Products p ON c.ProductId = p.Id 
                WHERE c.UserId = ?`;//get cart

            db.query(cartSql, [userId], (err, cartResults) => {
                res.json({
                    user: userData,
                    favorites: favResults,
                    cart: cartResults
                });
            });
        });
    });
});

app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;

    /// check email dupl
    db.query("SELECT Email FROM Users", (err, results) => {
        if (err) return res.status(500).json({ error: "Помилка бази даних" });

        const emailExists = results.some(u => {
            try {
                return decrypt(u.Email).toLowerCase() === email.toLowerCase();
            } catch (e) { return false; }
        });

        if (emailExists) {
            return res.status(400).json({ error: "Користувач з таким Email вже зареєстрований" });
        }
        ///

        const encEmail = encrypt(email);
        const encPass = encrypt(password);
        const tempKey = Math.random().toString(36).substring(2, 12); // rand 10 sym

        const sql = "INSERT INTO Users (Name, Email, PassEnc, TempKey) VALUES (?, ?, ?, ?)";
        db.query(sql, [name, encEmail, encPass, tempKey], (err) => {
            if (err) return res.status(500).json({ error: err.message });

            console.log(`Код підтвердження для ${email}: ${tempKey}`);
            res.json({ success: true, message: "Користувача створено, введіть код" });
        });
    });
});

// app.post('/api/confirm', (req, res) => {
//     const { email, code } = req.body;
//     const encEmail = encrypt(email);

//     const sql = "SELECT id FROM Users WHERE Email = ? AND TempKey = ?";
//     db.query(sql, [encEmail, code], (err, results) => {
//         if (err || results.length === 0) return res.status(401).json({ error: "Код невірний" });

//         const userId = results[0].id;
//         // TempKey = NULL if key ==
//         db.query("UPDATE Users SET TempKey = NULL WHERE id = ?", [userId], (err) => {
//             if (err) return res.status(500).json({ error: "Помилка активації" });
//             res.json({ success: true, userId: userId });
//         });
//     });
// });
app.post('/api/confirm', (req, res) => {
    const { email, code } = req.body;
    console.log(`--- Спроба підтвердження для: ${email} ---`);
    const sql = "SELECT Id, Email FROM Users WHERE TempKey = ?";

    db.query(sql, [code], (err, results) => {
        if (err) return res.status(500).json({ error: "Помилка бази даних" });

        if (results.length === 0) {
            return res.status(401).json({ error: "Код невірний або вже використаний" });
        }

        const user = results[0];

        try {
            const decryptedEmail = decrypt(user.Email);
            if (decryptedEmail.trim() !== email.trim()) {
                console.log(`Email не збігається. В базі: ${decryptedEmail}, прийшло: ${email}`);
                return res.status(401).json({ error: "Цей код належить іншому користувачу" });
            }

            db.query("UPDATE Users SET TempKey = NULL WHERE Id = ?", [user.Id], (err) => {
                if (err) return res.status(500).json({ error: "Помилка активації" });

                console.log("Акаунт підтверджено успішно!");
                res.json({ success: true, userId: user.Id });
            });

        } catch (e) {
            console.error("Помилка при дешифруванні емейла під час підтвердження:", e.message);
            res.status(500).json({ error: "Помилка обробки даних" });
        }
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Введіть email та пароль" });
    }

    db.query("SELECT Id, Name, Email, PassEnc FROM Users WHERE TempKey IS NULL", (err, results) => {
        if (err) {
            console.error("Помилка БД при логіні:", err.message);
            return res.status(500).json({ error: "Сервіс тимчасово недоступний" });
        }

        // const user = results.find(u => {
        //     try {
        //         return decrypt(u.Email).trim() === email.trim() && decrypt(u.PassEnc) === password;
        //     } catch (e) { return false; }
        // });

        // if (!user) return res.status(401).json({ error: "Невірний логін або пароль" });

        // console.log("Вхід успішний для:", user.Name); 
        // res.json({ success: true, userId: user.Id }); 
        try {
            const user = results.find(u => {
                const decryptedEmail = decrypt(u.Email);
                const decryptedPass = decrypt(u.PassEnc);
                return decryptedEmail.trim() === email.trim() && decryptedPass === password;
            });

            if (!user) 
                return res.status(401).json({ error: "Невірний логін або пароль" });

            res.json({ success: true, userId: user.Id });
        } catch (e) {
            console.error("Помилка обробки даних юзера:", e.message);
            res.status(500).json({ error: "Помилка авторизації" });
        }
    });

    // const { email, password } = req.body;
    // const encEmail = encrypt(email);
    // const encPass = encrypt(password);

    // // check email & pass & tempK == null 
    // const sql = "SELECT id FROM Users WHERE Email = ? AND PassEnc = ? AND TempKey IS NULL";
    // db.query(sql, [encEmail, encPass], (err, results) => {
    //     if (err || results.length === 0) {
    //         return res.status(401).json({ error: "Невірні дані або акаунт не підтверджено" });
    //     }
    //     res.json({ success: true, userId: results[0].id });
    // });
});

app.use((err, req, res, next) => {
    console.error("Глобальна помилка:", err.stack);
    res.status(500).json({ error: "На сервері сталася помилка. Спробуйте пізніше." });
});
app.listen(3001, () => console.log('Server running on port 3001'));