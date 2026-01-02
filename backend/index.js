const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const PORT = 3001;

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

// ---------------- HEALTH ----------------
app.get("/", (req, res) => {
  res.send("Backend running for EmshoEvents");
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
app.post("/events", (req, res) => {
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
app.put("/events/:id", (req, res) => {
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
app.delete("/events/:id", (req, res) => {
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
  console.log(`Server running at http://localhost:${PORT}`);
});
