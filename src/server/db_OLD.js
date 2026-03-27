require('dotenv').config();
const sql = require("mssql");

const config = {
  user: process.env.DB_CLIET_LOG,
  password: process.env.DB_CLIENT_PASS,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    trustServerCertificate: true
  }
};

async function getPool() {
  return await sql.connect(config);
}

module.exports = { getPool };
