import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEvents } from '../context/EventContext';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events, registerForEvent, updateEvent, deleteEvent } = useEvents();

  const [form, setForm] = useState({ name: '', email: '' });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [editMode, setEditMode] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSaved, setEditSaved] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    capacity: 0,
    category: 'General',
    image: '',
    description: '',
  });

  const event = events.find((item) => item.id === Number(id));

  useEffect(() => {
    if (event) {
      setEditForm({
        title: event.title || '',
        date: event.date || '',
        time: event.time || '',
        location: event.location || '',
        capacity: event.capacity || 0,
        category: event.category || 'General',
        image: event.image || '',
        description: event.description || '',
      });
    }
  }, [event]);

  if (!event) {
    return (
      <section className="py-5">
        <div className="container text-center">
          <h4 className="fw-bold">Event not found</h4>
          <Link to="/events/browse" className="btn btn-primary mt-3">
            Back to events
          </Link>
        </div>
      </section>
    );
  }

  const capacity = event.capacity || 1;
  const percent = Math.min((event.attendees.length / capacity) * 100, 100);
  const isFull = capacity > 0 && event.attendees.length >= capacity;
  const imageUrl = (event.image || '').trim();

  const onRegister = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    if (isFull) {
      setError('This event is full');
      return;
    }
    setError('');
    const result = await registerForEvent(event.id, form);
    if (!result?.ok) {
      setError(result?.error || 'Registration failed');
      return;
    }
    setForm({ name: '', email: '' });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const onSaveEdit = async (e) => {
    e.preventDefault();
    setEditError('');
    const payload = {
      ...editForm,
      capacity: Number(editForm.capacity) || 0,
      image: (editForm.image || '').trim(),
    };
    if (!payload.title || !payload.date || !payload.time) {
      setEditError('Title, date, and time are required');
      return;
    }
    const result = await updateEvent(event.id, payload);
    if (!result?.ok) {
      setEditError(result?.error || 'Update failed');
      return;
    }
    setEditSaved(true);
    setTimeout(() => setEditSaved(false), 2000);
    setEditMode(false);
  };

  const onDelete = async () => {
    const ok = window.confirm('Delete this event? This action cannot be undone.');
    if (!ok) return;
    const result = await deleteEvent(event.id);
    if (!result?.ok) {
      setEditError(result?.error || 'Delete failed');
      return;
    }
    navigate('/events/browse');
  };

  return (
    <>
      <section
        className="text-white py-5"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.3), rgba(0,0,0,0.65)), url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
            <div>
              <span className="badge bg-light text-dark">{event.category}</span>
              <h1 className="fw-bold mt-2 mb-1">{event.title}</h1>
              <div>
                {event.date} · {event.time} · {event.location}
              </div>
            </div>
            <div className="d-flex flex-wrap gap-2">
              <Link to="/events/browse" className="btn btn-light text-primary fw-bold">
                Back to browse
              </Link>
              <button
                type="button"
                className="btn btn-outline-light"
                onClick={() => {
                  setEditMode((v) => !v);
                  setEditError('');
                }}
              >
                {editMode ? 'Cancel edit' : 'Edit event'}
              </button>
              <button type="button" className="btn btn-danger" onClick={onDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-4">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="card shadow-sm border-0 mb-3 clunky-card">
                <div className="card-body">
                  <h5 className="fw-bold mb-2">Overview</h5>
                  {editMode ? (
                    <form onSubmit={onSaveEdit} className="mt-3">
                      <div className="row g-2">
                        <div className="col-md-8">
                          <label className="form-label">Title</label>
                          <input
                            type="text"
                            className="form-control"
                            value={editForm.title}
                            onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Category</label>
                          <input
                            type="text"
                            className="form-control"
                            value={editForm.category}
                            onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="row g-2 mt-1">
                        <div className="col-md-4">
                          <label className="form-label">Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={editForm.date}
                            onChange={(e) => setEditForm((f) => ({ ...f, date: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Time</label>
                          <input
                            type="time"
                            className="form-control"
                            value={editForm.time}
                            onChange={(e) => setEditForm((f) => ({ ...f, time: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Capacity</label>
                          <input
                            type="number"
                            min="0"
                            className="form-control"
                            value={editForm.capacity}
                            onChange={(e) => setEditForm((f) => ({ ...f, capacity: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="row g-2 mt-1">
                        <div className="col-md-6">
                          <label className="form-label">Location</label>
                          <input
                            type="text"
                            className="form-control"
                            value={editForm.location}
                            onChange={(e) => setEditForm((f) => ({ ...f, location: e.target.value }))}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Image URL</label>
                          <input
                            type="url"
                            className="form-control"
                            value={editForm.image}
                            onChange={(e) => setEditForm((f) => ({ ...f, image: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="mt-2">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          value={editForm.description}
                          onChange={(e) =>
                            setEditForm((f) => ({ ...f, description: e.target.value }))
                          }
                        />
                      </div>
                      <div className="d-flex gap-2 mt-3">
                        <button type="submit" className="btn btn-primary">
                          Save changes
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => {
                            setEditMode(false);
                            setEditError('');
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                      {editError && (
                        <div className="alert alert-danger mt-3 py-2 mb-0">{editError}</div>
                      )}
                      {editSaved && (
                        <div className="alert alert-success mt-3 py-2 mb-0">
                          Changes saved
                        </div>
                      )}
                    </form>
                  ) : (
                    <p className="lead mb-0">{event.description}</p>
                  )}
                </div>
              </div>
              <div className="card shadow-sm border-0 clunky-card">
                <div className="card-body">
                  <h6 className="text-uppercase text-muted mb-2">Attendees</h6>
                  {event.attendees.length === 0 && (
                    <div className="text-muted">No registrations yet.</div>
                  )}
                  <ul className="list-group list-group-flush">
                    {event.attendees.map((attendee) => (
                      <li key={attendee.email} className="list-group-item">
                        <div className="fw-bold">{attendee.name}</div>
                        <small className="text-muted">{attendee.email}</small>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card shadow-sm border-0 clunky-card">
                <div className="card-body">
                  <h6 className="text-uppercase text-muted">Status</h6>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-bold">Capacity</div>
                      <div className="text-muted small">
                        {event.attendees.length} of {event.capacity} registered
                      </div>
                    </div>
                    <span className="badge bg-primary">{Math.round(percent)}%</span>
                  </div>
                  <div className="progress my-3" style={{ height: '6px' }}>
                    <div
                      className="progress-bar bg-primary"
                      role="progressbar"
                      style={{
                        width: `${percent}%`,
                      }}
                      aria-valuenow={event.attendees.length}
                      aria-valuemin="0"
                      aria-valuemax={event.capacity}
                    />
                  </div>
                  <div className="mt-2">
                    <div className="fw-bold mb-1">Location</div>
                    <div className="text-muted">{event.location}</div>
                  </div>
                  {isFull && (
                    <div className="alert alert-warning mt-3 py-2 mb-0">
                      This event is full
                    </div>
                  )}
                  <hr />
                  <h6 className="fw-bold mb-2">Register</h6>
                  <form onSubmit={onRegister} className="row g-2">
                    <div className="col-12">
                      <input
                        type="text"
                        className={`form-control${isFull ? ' input-disabled' : ''}`}
                        placeholder="Name"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        required
                        disabled={isFull}
                      />
                    </div>
                    <div className="col-12">
                      <input
                        type="email"
                        className={`form-control${isFull ? ' input-disabled' : ''}`}
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        required
                        disabled={isFull}
                      />
                    </div>
                    <div className="col-12 d-grid">
                      <button
                        type="submit"
                        className={`btn ${isFull ? 'btn-secondary' : 'btn-primary'}`}
                        disabled={isFull}
                      >
                        Register
                      </button>
                    </div>
                  </form>
                  {error && (
                    <div className="alert alert-danger mt-2 py-2 mb-0">
                      {error}
                    </div>
                  )}
                  {saved && (
                    <div className="alert alert-success mt-2 py-2 mb-0">
                      Registered! See your name in the list.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EventDetail;
