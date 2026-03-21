const sql = require("mssql");

const config = {
  user: "defUser",          
  password: "resUfed",
  server: ".\\SQLEXPRESS",
  database: "MotoShopDB",
  options: {
    trustServerCertificate: true
  }
};

async function getPool() {
  return await sql.connect(config);
}

module.exports = { getPool };
