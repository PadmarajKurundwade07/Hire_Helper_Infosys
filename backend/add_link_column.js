
require('dotenv').config();

const pool = require('./db');

async function run() {
  try {
    await pool.query('ALTER TABLE notification ADD COLUMN link VARCHAR(255)');
    console.log('Success');
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
run();
