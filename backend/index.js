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
HEALTH CHECK / DIAGNOSTIC ENDPOINT
=================================
*/
app.get('/api/health', async (req, res) => {
  const diagnostics = {
    status: 'running',
    timestamp: new Date().toISOString(),
    node_env: process.env.NODE_ENV,
    port: PORT,
    database: {
      configured: false,
      connected: false,
      details: {}
    }
  };

  // Check if DATABASE_URL is set
  if (process.env.DATABASE_URL) {
    diagnostics.database.configured = true;
    diagnostics.database.details.method = 'DATABASE_URL';
  } else if (process.env.DB_HOST) {
    diagnostics.database.configured = true;
    diagnostics.database.details.method = 'Individual env vars';
    diagnostics.database.details.host = process.env.DB_HOST;
    diagnostics.database.details.database = process.env.DB_NAME;
    diagnostics.database.details.user = process.env.DB_USER ? 'set' : 'not set';
    diagnostics.database.details.port = process.env.DB_PORT;
  }

  // Try to connect to database
  try {
    const result = await pool.query('SELECT NOW()');
    diagnostics.database.connected = true;
    diagnostics.database.details.timestamp = result.rows[0].now;
  } catch (err) {
    diagnostics.database.connected = false;
    diagnostics.database.details.error = err.message;
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
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { pool };
