const { Pool } = require('pg');
require('dotenv').config();

const sslConfig = (process.env.DB_HOST && (process.env.DB_HOST.includes('127.0.0.1') || process.env.DB_HOST.includes('localhost'))) ? false : { rejectUnauthorized: false };

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: sslConfig
});

module.exports = pool;
