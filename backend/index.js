const express = require('express');
const authRoutes = require('./routes/auth.routes');
const cors = require('cors');

require('dotenv').config();

const app = express();

/*
=================================
CORS CONFIGURATION (UPDATED)
=================================
Allow frontend from:
1. Local Angular dev server
2. Vercel deployed frontend
*/

app.use(cors({
  origin: [
    "http://localhost:4200",
    "https://hire-helper-infosys.vercel.app",
    "https://hire-helper-infosys-crmiu7fwc.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use('/uploads', express.static('uploads'));

/*
=================================
DATABASE CONNECTION & MIGRATIONS
=================================
*/
const pool = require('./db');
const { runMigrations } = require('./migrate');

// Run migrations on startup
(async () => {
  await runMigrations();
})();

pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client (DB Authentication failed?):', err.message);
    console.log('Server is running without DB connection...');
    return;
  }
  console.log('Database connected successfully');
  release();
});

/*
=================================
ROUTES
=================================
*/

const usersRoutes = require('./routes/users.routes');
const tasksRoutes = require('./routes/tasks.routes');
const notificationsRoutes = require('./routes/notifications.routes');

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/notifications', notificationsRoutes);

/*
=================================
TEST ROUTE
=================================
*/

app.get('/', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({ msg: 'HireHelper API is running... DB IS CONNECTED!' });
  } catch (err) {
    res.json({ msg: 'HireHelper API is running... BUT DB IS BROKEN or DISCONNECTED! Error: ' + err.message, stack: err.stack });
  }
});

/*
=================================
MIGRATION DEBUG ENDPOINT
=================================
*/
app.get('/api/migrate', async (req, res) => {
  try {
    const result = await runMigrations();
    res.json({ success: result, msg: 'Migration triggered. Check console for internal logs if success is false, or wait! I should modify runMigrations to return the error!' });
  } catch(e) {
    res.status(500).json({ error: e.message, stack: e.stack });
  }
});

/*
=================================
ENVIRONMENT DIAGNOSTICS ENDPOINT
=================================
*/
app.get('/api/diagnostics', async (req, res) => {
  const diagnostics = {
    status: 'running',
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT
    },
    database: {
      configured: !!process.env.DATABASE_URL || !!process.env.DB_HOST,
      method: process.env.DATABASE_URL ? 'DATABASE_URL' : 'Individual env vars'
    },
    email: {
      service: 'Resend',
      resend_api_key_set: !!process.env.RESEND_API_KEY,
      resend_api_key_length: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.length : 0,
      email_from_set: !!process.env.EMAIL_FROM,
      email_from_value: process.env.EMAIL_FROM || 'NOT SET',
      fallback_sendgrid_key_set: !!process.env.SENDGRID_API_KEY,
      smtp_host: process.env.SMTP_HOST || 'NOT SET'
    },
    jwt: {
      jwt_secret_set: !!process.env.JWT_SECRET,
      jwt_secret_length: process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0
    }
  };

  // Try database connection
  try {
    const result = await pool.query('SELECT NOW()');
    diagnostics.database.connected = true;
    diagnostics.database.timestamp = result.rows[0].now;
  } catch (err) {
    diagnostics.database.connected = false;
    diagnostics.database.error = err.message;
  }

  res.json(diagnostics);
});

/*
=================================
SERVER
=================================
*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 HireHelper Backend Running on Port ${PORT}`);
  console.log(`📧 Email Service: Gmail SMTP`);
  console.log(`🗄️  Database: Connected`);
});

module.exports = { pool };
