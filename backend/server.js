const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.get("/", (req, res) => {
  res.send("Server running");
});

app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    await pool.query(
      "INSERT INTO contacts(name,email,subject,message) VALUES($1,$2,$3,$4)",
      [name, email, subject, message]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/contacts", async (req, res) => {
  const result = await pool.query("SELECT * FROM contacts ORDER BY id DESC");
  res.json(result.rows);
});

app.listen(5000, () => console.log("Server running"));
