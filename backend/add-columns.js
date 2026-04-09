const pool = require('./db');
require('dotenv').config();

async function addMissingColumns() {
  try {
    console.log('Adding missing columns to existing tables...\n');

    // Add pay column to task table
    console.log('📝 Adding pay column to task table...');
    await pool.query(`
      ALTER TABLE task
      ADD COLUMN IF NOT EXISTS pay VARCHAR(255)
    `);
    console.log('✅ pay column added to task table\n');

    // Add email_notifications column to users table
    console.log('📝 Adding email_notifications column to users table...');
    await pool.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT TRUE
    `);
    console.log('✅ email_notifications column added to users table\n');

    // Add message and reply_message columns to requests table
    console.log('📝 Adding message columns to requests table...');
    await pool.query(`
      ALTER TABLE requests
      ADD COLUMN IF NOT EXISTS message TEXT
    `);
    console.log('✅ message column added to requests table');

    await pool.query(`
      ALTER TABLE requests
      ADD COLUMN IF NOT EXISTS reply_message TEXT
    `);
    console.log('✅ reply_message column added to requests table\n');

    console.log('✨ All missing columns added successfully!');
    process.exit(0);

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

addMissingColumns();
