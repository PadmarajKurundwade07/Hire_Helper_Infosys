
require('dotenv').config();
const pool = require('./db');
pool.query('SELECT id, first_name, last_name, email_id FROM users')
  .then(r => {
    console.log('Users in DB:');
    r.rows.forEach(u => {
      console.log(JSON.stringify(u));
    });
    process.exit(0);
  })
  .catch(e => { console.error(e.message); process.exit(1); });
