const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.query(`
  CREATE TABLE IF NOT EXISTS contacts (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100)  NOT NULL,
    email      VARCHAR(100)  NOT NULL,
    subject    VARCHAR(200),
    message    TEXT          NOT NULL,
    created_at TIMESTAMP     DEFAULT NOW()
  )
`).then(() => console.log('✅ contacts table ready'))
  .catch(err => console.error('❌ Table error:', err.message));

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Devika Backend API is running 🚀' });
});

// POST — Save contact form message
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  try {
    const result = await pool.query(
      `INSERT INTO contacts (name, email, subject, message) VALUES ($1,$2,$3,$4) RETURNING id, created_at`,
      [name, email, subject || 'No subject', message]
    );
    res.status(201).json({ success: true, message: 'Message saved!', id: result.rows[0].id, created_at: result.rows[0].created_at });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

// GET — View all messages (admin panel)
app.get('/api/contacts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE — Delete a message by ID (admin panel)
app.delete('/api/contact/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM contacts WHERE id = $1 RETURNING id', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Message not found.' });
    res.json({ success: true, message: `Message ${id} deleted.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
