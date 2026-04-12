const pool = require('./db');
pool.query('SELECT * FROM users').then(res => {
    console.log(res.rows.map(r => r.email_id));
    process.exit(0);
}).catch(console.error);
