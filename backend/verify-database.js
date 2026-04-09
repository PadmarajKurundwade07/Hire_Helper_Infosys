#!/usr/bin/env node

/**
 * Database Verification Script
 * Usage: node verify-database.js
 *
 * This script verifies that all required tables exist
 * and checks their structure.
 */

const { Pool } = require('pg');
require('dotenv').config();

async function verifyDatabase() {
  let pool;

  // Initialize connection pool
  if (process.env.DATABASE_URL) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
  } else if (process.env.DB_HOST) {
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
    console.error('❌ No database configuration found!');
    process.exit(1);
  }

  try {
    console.log('🔄 Connecting to database...\n');
    await pool.query('SELECT NOW()');

    // Check for required tables
    const requiredTables = ['users', 'task', 'accepted_tasks', 'requests', 'notification'];
    console.log('📋 Checking for required tables:\n');

    for (const tableName of requiredTables) {
      const result = await pool.query(`
        SELECT EXISTS (
          SELECT 1 FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = $1
        )
      `, [tableName]);

      const exists = result.rows[0].exists;
      const symbol = exists ? '✅' : '❌';
      console.log(`${symbol} Table "${tableName}": ${exists ? 'EXISTS' : 'MISSING'}`);
    }

    // Check users table structure
    console.log('\n🔍 Users table columns:\n');
    const columnsResult = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);

    if (columnsResult.rows.length === 0) {
      console.error('❌ Users table not found!\n');
      return false;
    }

    columnsResult.rows.forEach(col => {
      const nullable = col.is_nullable === 'YES' ? 'allows NULL' : 'NOT NULL';
      const defaultVal = col.column_default ? ` (default: ${col.column_default})` : '';
      console.log(`  • ${col.column_name.padEnd(20)} ${col.data_type.padEnd(15)} ${nullable}${defaultVal}`);
    });

    // Check row count
    console.log('\n📊 Data summary:\n');
    const countResult = await pool.query('SELECT COUNT(*) as count FROM users');
    console.log(`  Users in database: ${countResult.rows[0].count}`);

    console.log('\n✅ Database verification complete!\n');
    return true;

  } catch (err) {
    console.error('\n❌ Error during verification:');
    console.error('Error:', err.message);
    if (err.detail) console.error('Detail:', err.detail);
    return false;

  } finally {
    await pool.end();
  }
}

// Run verification
(async () => {
  const success = await verifyDatabase();
  process.exit(success ? 0 : 1);
})();
