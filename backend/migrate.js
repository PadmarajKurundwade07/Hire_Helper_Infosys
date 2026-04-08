const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runMigrations() {
  let pool;

  if (process.env.DATABASE_URL) {
      // Render typically provides DATABASE_URL
      pool = new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false }
      });
  } else {
      // Local fallback
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

  try {
    console.log('Running database migrations...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    await pool.query(schema);
    console.log('✓ Database schema initialized successfully');
    return true;
  } catch (err) {
    console.error('✗ Error running migrations:', err.message);
    return { success: false, error: err.message, stack: err.stack };
  } finally {
    await pool.end();
  }
}

module.exports = { runMigrations };
