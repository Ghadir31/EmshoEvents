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

// MySQL connection
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "emshoevents",
  dateStrings: true, // keep DATE/TIME as strings to avoid timezone shifts
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

// Ensure users table exists (idempotent for local dev)
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

// --- helpers to map DB rows to the shape the frontend uses ---
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

// ---------------- HEALTH ---------------- adding comment for deployment purpose
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
    const user = rows[0];
    res.json({ user });
  });
});

// ---------------- GET ALL EVENTS (+ attendees) ----------------
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
      const combined = attachAttendees(events, attendeeRows);
      res.json(combined);
    });
  });
});

// ---------------- GET SINGLE EVENT ----------------
app.get("/events/:id", (req, res) => {
  const { id } = req.params;
  const eventSql = `
    SELECT id, title, description, event_date, event_time, location, capacity, category, image_url, created_at
    FROM events
    WHERE id = ?
  `;
  const attendeesSql = `
    SELECT name, email
    FROM event_attendees
    WHERE event_id = ?
    ORDER BY registered_at
  `;

  pool.query(eventSql, [id], (err, rows) => {
    if (err) {
      console.error("Error GET /events/:id (event)", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    const event = mapEventRow(rows[0]);
    pool.query(attendeesSql, [id], (attErr, attendeeRows) => {
      if (attErr) {
        console.error("Error GET /events/:id (attendees)", attErr);
        return res.status(500).json({ error: "Database error" });
      }
      event.attendees = attendeeRows.map((a) => ({ name: a.name, email: a.email }));
      res.json(event);
    });
  });
});

// ---------------- CREATE EVENT ----------------
app.post("/events", authenticate, (req, res) => {
  const { title, description, date, time, location, capacity, category, image } = req.body;

  if (!title || !date || !time) {
    return res.status(400).json({ error: "Title, date, and time are required" });
  }

  const sql = `
    INSERT INTO events (title, description, event_date, event_time, location, capacity, category, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const payload = [
    title,
    description || "",
    date,
    time,
    location || "",
    Number.isFinite(Number(capacity)) ? Number(capacity) : 0,
    category || "General",
    image || "",
  ];

  pool.query(sql, payload, (err, result) => {
    if (err) {
      console.error("Error POST /events", err);
      return res.status(500).json({ error: "Database error" });
    }

    const newEvent = {
      id: result.insertId,
      title,
      description: description || "",
      date,
      time,
      location: location || "",
      capacity: Number.isFinite(Number(capacity)) ? Number(capacity) : 0,
      category: category || "General",
      image: image || "",
      attendees: [],
    };

    res.status(201).json(newEvent);
  });
});

// ---------------- UPDATE EVENT ----------------
app.put("/events/:id", authenticate, (req, res) => {
  const { id } = req.params;
  const { title, description, date, time, location, capacity, category, image } = req.body;

  if (!title || !date || !time) {
    return res.status(400).json({ error: "Title, date, and time are required" });
  }

  const sql = `
    UPDATE events
    SET title = ?, description = ?, event_date = ?, event_time = ?, location = ?, capacity = ?, category = ?, image_url = ?
    WHERE id = ?
  `;

  const payload = [
    title,
    description || "",
    date,
    time,
    location || "",
    Number.isFinite(Number(capacity)) ? Number(capacity) : 0,
    category || "General",
    image || "",
    id,
  ];

  pool.query(sql, payload, (err, result) => {
    if (err) {
      console.error("Error PUT /events/:id", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({
      id: Number(id),
      title,
      description: description || "",
      date,
      time,
      location: location || "",
      capacity: Number.isFinite(Number(capacity)) ? Number(capacity) : 0,
      category: category || "General",
      image: image || "",
    });
  });
});

// ---------------- DELETE EVENT ----------------
app.delete("/events/:id", authenticate, (req, res) => {
  const { id } = req.params;
  const sql = `
    DELETE FROM events
    WHERE id = ?
  `;

  pool.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error DELETE /events/:id", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json({ message: "Event deleted", id: Number(id) });
  });
});

// ---------------- REGISTER ATTENDEE ----------------
app.post("/events/:id/attendees", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  const capacitySql = `
    SELECT e.capacity, COUNT(a.id) AS attendeeCount
    FROM events e
    LEFT JOIN event_attendees a ON e.id = a.event_id
    WHERE e.id = ?
    GROUP BY e.id, e.capacity
  `;

  pool.query(capacitySql, [id], (capacityErr, rows) => {
    if (capacityErr) {
      console.error("Error checking capacity", capacityErr);
      return res.status(500).json({ error: "Database error" });
    }

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    const { capacity, attendeeCount } = rows[0];
    if (Number(capacity) > 0 && Number(attendeeCount) >= Number(capacity)) {
      return res.status(409).json({ error: "Event is full" });
    }

    const sql = `
      INSERT INTO event_attendees (event_id, name, email)
      VALUES (?, ?, ?)
    `;

    pool.query(sql, [id, name, email], (err, result) => {
      if (err) {
        if (err.code === "ER_NO_REFERENCED_ROW_2") {
          return res.status(404).json({ error: "Event not found" });
        }
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ error: "Email already registered for this event" });
        }
        console.error("Error POST /events/:id/attendees", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.status(201).json({
        id: result.insertId,
        event_id: Number(id),
        name,
        email,
      });
    });
  });
});

// ---------------- START SERVER ----------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});