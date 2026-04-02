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
    enableKeepAlive: true,//!!!!
    queueLimit: 0
});
db.on('error', (err) => {// \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
    console.error('Непередбачена помилка пулу БД:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
        console.log('З’єднання з БД втрачено. Пул спробує відновитись при наступному запиті.');
    } else {
        throw err;
    }
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

app.get('/api/products/limits', (req, res) => {// get max \min values for filters
    // const sql = `
    //     SELECT 
    //         MAX(Price) as maxPrice, 
    //         MAX(CC) as maxCC, 
    //         MAX(Weight) as maxWeight, 
    //         MAX(HP) as maxHP, 
    //         MAX(NM) as maxNM 
    //     FROM Products`;
    const sql = `
        SELECT 
            MIN(Price) as minPrice, MAX(Price) as maxPrice, 
            MIN(CC) as minCC, MAX(CC) as maxCC, 
            MIN(Weight) as minWeight, MAX(Weight) as maxWeight, 
            MIN(HP) as minHP, MAX(HP) as maxHP, 
            MIN(NM) as minNM, MAX(NM) as maxNM 
        FROM Products`;
    db.query(sql, (err, results) => {
        if (err)
            return res.status(500).json({ error: err.message });
        res.json(results[0]);
    });
});


app.get('/api/products/search', (req, res) => {
    let {
        q = '',//all prods
        sortBy = 'Popularity',
        order = 'DESC',
        page = 1,
        minPrice, maxPrice,
        minCC, maxCC,
        minWeight, maxWeight,
        minHP, maxHP,
        minNM, maxNM
    } = req.query;

    const limit = 20;
    const offset = (page - 1) * limit;

    let sql = "SELECT * FROM Products WHERE Name LIKE ?";// def
    let params = [`%${q}%`];

    const addRangeFilter = (field, min, max) => {// filters if exist
        if (min !== undefined) { sql += ` AND ${field} >= ?`; params.push(min); }
        if (max !== undefined) { sql += ` AND ${field} <= ?`; params.push(max); }
    };

    addRangeFilter('Price', minPrice, maxPrice);
    addRangeFilter('CC', minCC, maxCC);
    addRangeFilter('Weight', minWeight, maxWeight);
    addRangeFilter('HP', minHP, maxHP);
    addRangeFilter('NM', minNM, maxNM);

    ////
    const allowedSort = ['Popularity', 'Price', 'Name'];//avoidance SQL injection) 
    if (!allowedSort.includes(sortBy)) sortBy = 'Popularity';
    sql += ` ORDER BY ${sortBy} ${order === 'ASC' ? 'ASC' : 'DESC'}`;

    sql += ` LIMIT ? OFFSET ?`;// separate viewed items 
    params.push(limit, offset);

    ////
    db.query(sql, params, (err, results) => {
        if (err)
            return res.status(500).json({ error: err.message });

        // const totalPages = Math.ceil(results[0].total / limit);
        db.query("SELECT COUNT(*) as total FROM Products WHERE Name LIKE ?", [`%${q}%`], (err, countRes) => {//main qnt for separate
            res.json({
                products: results,
                total: countRes[0].total,
                totalPages: Math.ceil(countRes[0].total / limit)//Math.ceil(countRes[0].total / limit)//totalPages||1 
            });
        });
    });
});

app.get('/api/products/:id', (req, res) => {
    const productId = req.params.id;

    db.query("UPDATE Products SET Popularity = Popularity + 1 WHERE Id = ?", [productId]);// upd popular
    db.query("SELECT * FROM Products WHERE Id = ?", [productId], (err, results) => {// get prod data
        if (err || results.length === 0) return res.status(404).json({ error: "Товар не знайдено" });
        res.json(results[0]);
    });
});


app.post('/api/cart/toggle', (req, res) => {//cart
    const { userId, productId } = req.body;
    // check if exist
    db.query("SELECT * FROM CartItems WHERE UserId = ? AND ProductId = ?", [userId, productId], (err, results) => {
        if (results.length > 0) {
            db.query("DELETE FROM CartItems WHERE UserId = ? AND ProductId = ?", [userId, productId]);
            res.json({ action: 'removed' });
        } else {
            db.query("INSERT INTO CartItems (UserId, ProductId, Quantity) VALUES (?, ?, 1)", [userId, productId]);
            res.json({ action: 'added' });
        }
    });
});

app.post('/api/fav/toggle', (req, res) => {//fav
    const { userId, productId } = req.body;
    // check if exist
    db.query("SELECT * FROM Favorites WHERE UserId = ? AND ProductId = ?", [userId, productId], (err, results) => {
        if (results.length > 0) {
            db.query("DELETE FROM Favorites WHERE UserId = ? AND ProductId = ?", [userId, productId]);
            res.json({ action: 'removed' });
        } else {
            db.query("INSERT INTO Favorites (UserId, ProductId) VALUES (?, ?)", [userId, productId]);
            res.json({ action: 'added' });
        }
    });
});

app.get('/api/user-status', (req, res) => {
    const { userId, prodId } = req.query;

    if (!userId || !prodId)
        return res.status(400).json({ error: "Відсутні параметри userId або prodId" });

    const cartSql = "SELECT COUNT(*) as count FROM CartItems WHERE UserId = ? AND ProductId = ?";
    const favSql = "SELECT COUNT(*) as count FROM Favorites WHERE UserId = ? AND ProductId = ?";

    db.query(cartSql, [userId, prodId], (err, cartResults) => {
        if (err) return res.status(500).json({ error: err.message });

        db.query(favSql, [userId, prodId], (err, favResults) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
                inCart: cartResults[0].count > 0,
                inFavorites: favResults[0].count > 0
            });
        });
    });
});

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

app.get('/api/store/details/:id', (req, res) => {//get
    const { id } = req.params;
    const sql = "SELECT * FROM Stores WHERE Id = ?";
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.json({ exists: false });
        res.json({ exists: true, store: results[0] });
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

app.get('/api/store/short-details/:shopId', (req, res) => {
    const shopId = req.params.shopId;
    const sql = "SELECT Id, Name, LogoUrl FROM Stores WHERE Id = ?";
    db.query(sql, [shopId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: "Магазин не знайдено" });
        res.json(results[0]);
    });
});

app.get('/api/stores/all', (req, res) => {
    //get prod cnt fr p.Id for every store by s.Id
    const sql = `
        SELECT s.Id, s.Name, s.LogoUrl, COUNT(p.Id) as ProductCount
        FROM Stores s
        LEFT JOIN Products p ON s.Id = p.ShopId
        GROUP BY s.Id
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
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

app.delete('/api/product/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM Products WHERE Id = ?";
    db.query(sql, [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
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