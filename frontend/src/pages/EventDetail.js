import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useEvents } from '../context/EventContext';

const EventDetail = () => {
  const { id } = useParams();
  const { events, registerForEvent } = useEvents();
  const [form, setForm] = useState({ name: '', email: '' });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const event = events.find((item) => item.id === Number(id));

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

  const onRegister = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
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

  return (
    <>
      <section
        className="text-white py-5"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.3), rgba(0,0,0,0.65)), url(${event.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <span className="badge bg-light text-dark">{event.category}</span>
              <h1 className="fw-bold mt-2 mb-1">{event.title}</h1>
              <div>
                {event.date} · {event.time} · {event.location}
              </div>
            </div>
            <Link to="/events/browse" className="btn btn-light text-primary fw-bold">
              Back to browse
            </Link>
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
                  <p className="lead mb-0">{event.description}</p>
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
                  <hr />
                  <h6 className="fw-bold mb-2">Register</h6>
                  <form onSubmit={onRegister} className="row g-2">
                    <div className="col-12">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="col-12 d-grid">
                      <button type="submit" className="btn btn-primary">
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
