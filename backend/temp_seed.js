require('dotenv').config();


const pool = require('./db');

async function seed() {
  try {
    // Insert a dummy user
    const userRes = await pool.query(`
      INSERT INTO users (first_name, last_name, email_id, password, is_verified) 
      VALUES ('Alice', 'Smith', 'alice@test.com', 'hashed_pw', true) 
      RETURNING id
    `);
    const userId = userRes.rows[0].id;

    // Insert task for that user
    await pool.query(`
      INSERT INTO task (user_id, title, description, location, status) 
      VALUES ($1, 'Help Moving Furniture', 'Need strong hands to move a couch from the 2nd floor.', 'Downtown Appt', 'open')
    `, [userId]);

    console.log('Test user and task seeded successfully!');
  } catch(err) {
    if(err.code === '23505') {
       console.log('Test user already exists.');
    } else {
       console.error(err);
    }
  } finally {
    process.exit(0);
  }
}

seed();
