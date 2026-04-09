#!/usr/bin/env node

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const DATABASE_URL = 'postgresql://hirehelper_db_k78r_user:sh6qpwrSeAby4J4fedfaauBmUbxaBH5Z@dpg-d7agj5dm5p6s73a8i77g-a.oregon-postgres.render.com/hirehelper_db_k78r';

async function createTables() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔄 Connecting to Render PostgreSQL...');
    await pool.query('SELECT NOW()');
    console.log('✅ Connected!\n');

    console.log('📖 Reading schema...');
    const schemaPath = path.join(__dirname, 'backend', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    console.log('✅ Schema loaded\n');

    console.log('⚙️  Creating tables...');
    await pool.query(schema);
    console.log('✅ All tables created successfully!\n');

    // Verify
    console.log('🔍 Verifying tables...');
    const result = await pool.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' ORDER BY table_name
    `);

    console.log('✅ Tables in database:');
    result.rows.forEach(row => console.log(`   • ${row.table_name}`));

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

createTables();
