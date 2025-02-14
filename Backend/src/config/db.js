const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 20,
});


const db = pool.promise();

pool.getConnection((err, connection) => {
  if (err) {
    console.error(" Database connection failed:", err.message);
  } else {
    console.log(" Connected to MySQL database");
    connection.release();
  }
});


setInterval(() => {
  db.query("SELECT 1")
    .then(() => console.log("MySQL connection active"))
    .catch((err) => console.error(" MySQL connection lost, attempting to reconnect:", err.message));
}, 30000);

module.exports = db;  