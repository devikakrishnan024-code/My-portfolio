const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ── Middleware ──
app.use(cors());
app.use(express.json());

// ── PostgreSQL Connection ──
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }  // Required for Render.com
});

// ── Create Table on Startup ──
pool.query(`
  CREATE TABLE IF NOT EXISTS contacts (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100)  NOT NULL,
    email      VARCHAR(100)  NOT NULL,
    subject    VARCHAR(200),
    message    TEXT          NOT NULL,
    created_at TIMESTAMP     DEFAULT NOW()
  )
`).then(() => {
  console.log('✅ contacts table ready');
}).catch(err => {
  console.error('❌ Table creation error:', err.message);
});

// ── Routes ──

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Devika Backend API is running 🚀' });
});

// POST /api/contact — Save contact form submission
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO contacts (name, email, subject, message)
       VALUES ($1, $2, $3, $4)
       RETURNING id, created_at`,
      [name, email, subject || 'No subject', message]
    );

    res.status(201).json({
      success: true,
      message: 'Message saved successfully!',
      id: result.rows[0].id,
      created_at: result.rows[0].created_at
    });

  } catch (err) {
    console.error('DB Error:', err.message);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// GET /api/contacts — View all submissions (for your own use)
app.get('/api/contacts', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM contacts ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Start Server ──
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
