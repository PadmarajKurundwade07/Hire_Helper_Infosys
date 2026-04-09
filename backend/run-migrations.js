#!/usr/bin/env node

/**
 * Standalone Migration Script
 * Usage: node run-migrations.js
 *
 * This script connects directly to the PostgreSQL database
 * and executes the schema.sql file to create all required tables.
 *
 * Ensure environment variables are set:
 * - DATABASE_URL (for Render) OR
 * - DB_HOST, DB_USER, DB_PASSWORD, DB_PORT, DB_NAME (for local/custom)
 */

const { Pool, Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runMigrations() {
  let pool;

  // Initialize connection pool
  if (process.env.DATABASE_URL) {
    console.log('📡 Using DATABASE_URL for connection...');
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
  } else if (process.env.DB_HOST) {
    console.log('📡 Using individual environment variables for connection...');
    const sslConfig = (process.env.DB_HOST.includes('127.0.0.1') || process.env.DB_HOST.includes('localhost'))
      ? false
      : { rejectUnauthorized: false };

    pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      ssl: sslConfig
    });
  } else {
    console.error('❌ Error: No database configuration found!');
    console.error('Please set either DATABASE_URL or DB_HOST, DB_USER, DB_PASSWORD, DB_PORT, DB_NAME');
    process.exit(1);
  }

  try {
    console.log('🔄 Testing database connection...');
    const testResult = await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful!');
    console.log(`   Timestamp: ${testResult.rows[0].now}`);

    // Read schema file
    console.log('\n📖 Reading schema.sql...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    console.log('✅ Schema file loaded');

    // Execute schema
    console.log('\n⚙️  Executing schema migrations...');
    await pool.query(schema);
    console.log('✅ Schema executed successfully!');

    // Verify tables were created
    console.log('\n🔍 Verifying tables...');
    const tablesResult = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    if (tablesResult.rows.length > 0) {
      console.log('✅ Successfully created tables:');
      tablesResult.rows.forEach(row => {
        console.log(`   • ${row.table_name}`);
      });
    } else {
      console.warn('⚠️  Warning: No tables found in database');
    }

    // Verify users table structure
    console.log('\n🔍 Verifying users table structure...');
    const columnsResult = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);

    if (columnsResult.rows.length > 0) {
      console.log('✅ Users table structure:');
      columnsResult.rows.forEach(col => {
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
        console.log(`   • ${col.column_name}: ${col.data_type} (${nullable})`);
      });
    } else {
      console.error('❌ Users table not found or is empty');
      process.exit(1);
    }

    console.log('\n✨ Migration completed successfully!');
    return true;

  } catch (err) {
    console.error('\n❌ Migration failed!');
    console.error('Error:', err.message);
    if (err.detail) console.error('Detail:', err.detail);
    if (err.hint) console.error('Hint:', err.hint);
    console.error('\nFull error stack:');
    console.error(err.stack);
    return false;

  } finally {
    console.log('\n🔌 Closing database connection...');
    await pool.end();
  }
}

// Run migrations
(async () => {
  const success = await runMigrations();
  process.exit(success ? 0 : 1);
})();
