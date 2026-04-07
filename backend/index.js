const express = require('express');
const authRoutes = require('./routes/auth.routes');
const cors = require('cors');
const { Pool } = require('pg');
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
    "https://hire-helper-infosys.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use('/uploads', express.static('uploads'));

/*
=================================
DATABASE CONNECTION
=================================
*/
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

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

app.get('/', (req, res) => {
  res.send('HireHelper API is running...');
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
