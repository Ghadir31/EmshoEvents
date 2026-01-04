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


console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_NAME:", process.env.DB_NAME);

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

// Ensure events + attendees tables exist
const ensureEventsTables = () => {
  const createEvents = `
    CREATE TABLE IF NOT EXISTS events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      event_date DATE NOT NULL,
      event_time TIME NULL,
      location VARCHAR(255),
      capacity INT DEFAULT 0,
      category VARCHAR(100),
      image_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createAttendees = `
    CREATE TABLE IF NOT EXISTS event_attendees (
      id INT AUTO_INCREMENT PRIMARY KEY,
      event_id INT NOT NULL,
      name VARCHAR(255),
      email VARCHAR(255) NOT NULL,
      registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_attendee_event (event_id, email),
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    )
  `;

  pool.query(createEvents, (err) => {
    if (err) {
      console.error("Failed to ensure events table exists", err);
      return;
    }
    pool.query(createAttendees, (attErr) => {
      if (attErr) {
        console.error("Failed to ensure event_attendees table exists", attErr);
      }
    });
  });
};

ensureEventsTables();

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

app.get("/events/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Invalid event id" });
  }

  const eventSql = `
    SELECT id, title, description, event_date, event_time, location, capacity, category, image_url, created_at
    FROM events
    WHERE id = ?
    LIMIT 1
  `;
  const attendeesSql = `
    SELECT event_id, name, email
    FROM event_attendees
    WHERE event_id = ?
    ORDER BY registered_at
  `;

  pool.query(eventSql, [id], (err, eventRows) => {
    if (err) {
      console.error("Error GET /events/:id (event)", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (!eventRows || eventRows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    pool.query(attendeesSql, [id], (attErr, attendeeRows) => {
      if (attErr) {
        console.error("Error GET /events/:id (attendees)", attErr);
        return res.status(500).json({ error: "Database error" });
      }
      const event = mapEventRow(eventRows[0]);
      event.attendees = attendeeRows.map((att) => ({
        name: att.name,
        email: att.email,
      }));
      res.json(event);
    });
  });
});

app.post("/events", authenticate, (req, res) => {
  const { title, description, date, time, location, capacity, category, image } = req.body;

  if (!title || !date) {
    return res.status(400).json({ error: "Title and date are required" });
  }

  const normalizedCapacity = Number.isFinite(Number(capacity)) ? Number(capacity) : 0;
  const sql = `
    INSERT INTO events (title, description, event_date, event_time, location, capacity, category, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    title,
    description || null,
    date,
    time || null,
    location || null,
    normalizedCapacity,
    category || "General",
    image || "",
  ];

  pool.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error POST /events", err);
      return res.status(500).json({ error: "Database error" });
    }
    const newEvent = mapEventRow({
      id: result.insertId,
      title,
      description: description || "",
      event_date: date,
      event_time: time || null,
      location: location || "",
      capacity: normalizedCapacity,
      category: category || "General",
      image_url: image || "",
      created_at: new Date(),
    });
    res.status(201).json(newEvent);
  });
});

app.put("/events/:id", authenticate, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Invalid event id" });
  }

  const { title, description, date, time, location, capacity, category, image } = req.body;
  if (!title || !date) {
    return res.status(400).json({ error: "Title and date are required" });
  }

  const normalizedCapacity = Number.isFinite(Number(capacity)) ? Number(capacity) : 0;
  const sql = `
    UPDATE events
    SET title = ?, description = ?, event_date = ?, event_time = ?, location = ?, capacity = ?, category = ?, image_url = ?
    WHERE id = ?
    LIMIT 1
  `;
  const values = [
    title,
    description || null,
    date,
    time || null,
    location || null,
    normalizedCapacity,
    category || "General",
    image || "",
    id,
  ];

  pool.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error PUT /events/:id", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    const updatedEvent = mapEventRow({
      id,
      title,
      description: description || "",
      event_date: date,
      event_time: time || null,
      location: location || "",
      capacity: normalizedCapacity,
      category: category || "General",
      image_url: image || "",
      created_at: new Date(),
    });
    res.json(updatedEvent);
  });
});

app.delete("/events/:id", authenticate, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Invalid event id" });
  }

  const sql = `DELETE FROM events WHERE id = ? LIMIT 1`;
  pool.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error DELETE /events/:id", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(204).send();
  });
});

app.post("/events/:id/attendees", (req, res) => {
  const id = Number(req.params.id);
  const { name, email } = req.body || {};

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Invalid event id" });
  }
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const normalizedEmail = normalizeEmail(email);
  const checkEventSql = `
    SELECT id, capacity FROM events WHERE id = ? LIMIT 1
  `;
  pool.query(checkEventSql, [id], (eventErr, eventRows) => {
    if (eventErr) {
      console.error("Error POST /events/:id/attendees (event lookup)", eventErr);
      return res.status(500).json({ error: "Database error" });
    }
    if (!eventRows || eventRows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    const event = eventRows[0];
    const countSql = `SELECT COUNT(*) AS count FROM event_attendees WHERE event_id = ?`;
    pool.query(countSql, [id], (countErr, countRows) => {
      if (countErr) {
        console.error("Error POST /events/:id/attendees (count)", countErr);
        return res.status(500).json({ error: "Database error" });
      }

      const attendeeCount = countRows?.[0]?.count || 0;
      if (event.capacity > 0 && attendeeCount >= event.capacity) {
        return res.status(409).json({ error: "Event is full" });
      }

      const insertSql = `
        INSERT INTO event_attendees (event_id, name, email)
        VALUES (?, ?, ?)
      `;
      pool.query(insertSql, [id, name || null, normalizedEmail], (insertErr) => {
        if (insertErr) {
          if (insertErr.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ error: "Already registered" });
          }
          console.error("Error POST /events/:id/attendees (insert)", insertErr);
          return res.status(500).json({ error: "Database error" });
        }
        res.status(201).json({ ok: true });
      });
    });
  });
});

// ---------------- START SERVER ----------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
