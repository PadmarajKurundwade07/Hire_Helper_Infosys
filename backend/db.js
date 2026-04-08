const { Pool } = require('pg');
require('dotenv').config();

let pool;

if (process.env.DATABASE_URL) {
    // Render typically provides DATABASE_URL
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
} else {
    // Local / detailed fallback
    const sslConfig = (process.env.DB_HOST && (process.env.DB_HOST.includes('127.0.0.1') || process.env.DB_HOST.includes('localhost'))) ? false : { rejectUnauthorized: false };

    pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        ssl: sslConfig
    });
}

module.exports = pool;
