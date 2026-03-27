const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to PostgreSQL (Render)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // IMPORTANT for Render
  },
});

// ✅ Auto-create table when server starts
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT,
        subject TEXT,
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Table ready");
  } catch (err) {
    console.error("❌ DB Error:", err);
  }
}

initDB();

// ✅ Test route
app.get("/", (req, res) => {
  res.send("🚀 Backend is running");
});

// ✅ Save contact form
app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    await pool.query(
      "INSERT INTO contacts(name, email, subject, message) VALUES($1,$2,$3,$4)",
      [name, email, subject, message]
    );

    res.json({ success: true, message: "Saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// ✅ Get all messages (for admin panel)
app.get("/api/contacts", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM contacts ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching data" });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));