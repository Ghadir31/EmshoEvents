import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';

const categories = ['Technology', 'Wellness', 'Community', 'Business', 'Arts', 'Education', 'General'];

const defaultForm = {
  title: '',
  date: '',
  time: '',
  location: '',
  capacity: 50,
  category: 'General',
  image: '',
  description: '',
};

const CreateEvent = () => {
  const { createEvent } = useEvents();
  const { isAuthenticated } = useAuth();
  const [form, setForm] = useState(defaultForm);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.time) return;
    setError("");
    const result = await createEvent({
      ...form,
      capacity: Number(form.capacity) || 0,
    });
    if (!result?.ok) {
      setError(result?.error || "Could not create event");
      return;
    }
    setForm(defaultForm);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (!isAuthenticated) {
    return (
      <section className="py-5">
        <div className="container text-center">
          <h2 className="fw-bold mb-2">Admin access required</h2>
          <p className="text-muted">
            Log in to create, edit, or delete events. Guests can still browse and register.
          </p>
          <Link to="/login" className="btn btn-primary">
            Go to login
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="mb-3">
              <p className="badge bg-primary bg-opacity-10 text-primary">Create</p>
              <h2 className="fw-bold mb-2">Craft a new event</h2>
              <p className="text-muted">
                Set your details, pick a category, and drop in an image URL.
              </p>
            </div>
            <div className="card clunky-card">
              <div className="card-body">
                <form onSubmit={onSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      required
                      type="text"
                      className="form-control"
                      value={form.title}
                      onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                      placeholder="Community Meetup"
                    />
                  </div>
                  <div className="row g-2">
                    <div className="col-md-4">
                      <label className="form-label">Category</label>
                      <select
                        className="form-select"
                        value={form.category}
                        onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Date</label>
                      <input
                        required
                        type="date"
                        className="form-control"
                        value={form.date}
                        onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Time</label>
                      <input
                        required
                        type="time"
                        className="form-control"
                        value={form.time}
                        onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="mb-3 mt-3">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.location}
                      onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                      placeholder="Main Hall, Downtown"
                    />
                  </div>
                  <div className="row g-2">
                    <div className="col-md-6">
                      <label className="form-label">Capacity</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.capacity}
                        onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
                        min="1"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Image URL (optional)</label>
                      <input
                        type="url"
                        className="form-control"
                        value={form.image}
                        onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                  </div>
                  <div className="mb-3 mt-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={form.description}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      placeholder="What should attendees expect?"
                    />
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">
                      Add event
                    </button>
                    <Link to="/events/browse" className="btn btn-outline-primary">
                      Go to browse
                    </Link>
                  </div>
                  {error && (
                    <div className="alert alert-danger mt-3 mb-0 py-2">
                      {error}
                    </div>
                  )}
                  {saved && (
                    <div className="alert alert-success mt-3 mb-0 py-2">
                      Event drafted! Check it out under Browse.
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
          {/* <div className="col-lg-5">
            <div className="card clunky-card">
              <div className="card-body">
                <h6 className="text-uppercase text-muted">Tips</h6>
                <ul className="mb-0 small text-muted">
                  <li>Use categories to make filtering easier on the browse page.</li>
                  <li>Paste any public image URL; Unsplash links work great.</li>
                  <li>Keep descriptions short - attendees can click into the detail view.</li>
                </ul>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default CreateEvent;
