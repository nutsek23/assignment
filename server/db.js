require("dotenv").config();

const mysql = require("mysql");

const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_PORT } = process.env;

const db = mysql.createPool({
  connectionLimit: 100,
  host: DB_HOST,
  user: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: DB_PORT,
});

exports.db = db;
