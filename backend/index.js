const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret-in-prod";
const TOKEN_EXPIRES_IN = "7d";

app.use(cors());
app.use(express.json());

// ---------------- MYSQL CONNECTION (Railway-ready) ----------------
const pool = mysql.createPool({
  host: process.env.DB_HOST,           // e.g. turntable.proxy.rlwy.net
  port: process.env.DB_PORT || 3306,   // Railway port
  user: process.env.DB_USER,           // root
  password: process.env.DB_PASSWORD,   // Railway password
  database: process.env.DB_NAME,       // railway
  dateStrings: true,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Log MySQL connection issues early (VERY helpful on Railway)
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
  } else {
    console.log("✅ MySQL connected");
    connection.release();
  }
});

// --- auth helpers ---
const normalizeEmail = (email = "") => email.trim().toLowerCase();

const generateToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRES_IN,
  });

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.replace("Bearer ", "").trim()
    : null;

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Ensure users table exists
const ensureUsersTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  pool.query(sql, (err) => {
    if (err) {
      console.error("Failed to ensure users table exists", err);
    }
  });
};

ensureUsersTable();

// --- helpers ---
const mapEventRow = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description || "",
  date: row.event_date || null,
  time: row.event_time ? String(row.event_time).slice(0, 5) : null,
  location: row.location || "",
  capacity: row.capacity ?? 0,
  category: row.category || "General",
  image: row.image_url || "",
  createdAt: row.created_at,
  attendees: [],
});

const attachAttendees = (events, attendees) => {
  const byId = new Map(events.map((ev) => [ev.id, { ...ev, attendees: [] }]));
  attendees.forEach((att) => {
    const event = byId.get(att.event_id);
    if (event) {
      event.attendees.push({ name: att.name, email: att.email });
    }
  });
  return Array.from(byId.values());
};

// ---------------- HEALTH ----------------
app.get("/", (req, res) => {
  res.send("Backend running for EmshoEvents");
});

// ---------------- AUTH ----------------
app.post("/auth/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const normalizedEmail = normalizeEmail(email);
  const hashed = bcrypt.hashSync(password, 10);

  const sql = `
    INSERT INTO users (name, email, password_hash)
    VALUES (?, ?, ?)
  `;

  pool.query(sql, [name || null, normalizedEmail, hashed], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "Email already registered" });
      }
      console.error("Error POST /auth/register", err);
      return res.status(500).json({ error: "Database error" });
    }

    const user = { id: result.insertId, name: name || "", email: normalizedEmail };
    const token = generateToken(user);
    res.status(201).json({ token, user });
  });
});

app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const normalizedEmail = normalizeEmail(email);
  const sql = `
    SELECT id, name, email, password_hash
    FROM users
    WHERE email = ?
    LIMIT 1
  `;

  pool.query(sql, [normalizedEmail], (err, rows) => {
    if (err) {
      console.error("Error POST /auth/login", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (!rows || rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = rows[0];
    const matches = bcrypt.compareSync(password, user.password_hash);
    if (!matches) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name || "",
        email: user.email,
      },
    });
  });
});

app.get("/auth/me", authenticate, (req, res) => {
  const sql = `
    SELECT id, name, email, created_at
    FROM users
    WHERE id = ?
    LIMIT 1
  `;
  pool.query(sql, [req.user.id], (err, rows) => {
    if (err) {
      console.error("Error GET /auth/me", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user: rows[0] });
  });
});

// ---------------- EVENTS ----------------
app.get("/events", (req, res) => {
  const eventsSql = `
    SELECT id, title, description, event_date, event_time, location, capacity, category, image_url, created_at
    FROM events
    ORDER BY event_date, event_time
  `;
  const attendeesSql = `
    SELECT event_id, name, email
    FROM event_attendees
    ORDER BY registered_at
  `;

  pool.query(eventsSql, (err, eventRows) => {
    if (err) {
      console.error("Error GET /events (events)", err);
      return res.status(500).json({ error: "Database error" });
    }
    pool.query(attendeesSql, (attErr, attendeeRows) => {
      if (attErr) {
        console.error("Error GET /events (attendees)", attErr);
        return res.status(500).json({ error: "Database error" });
      }
      const events = eventRows.map(mapEventRow);
      res.json(attachAttendees(events, attendeeRows));
    });
  });
});

// ---------------- START SERVER ----------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
