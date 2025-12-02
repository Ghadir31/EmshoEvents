import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../context/EventContext';

const defaultForm = {
  title: '',
  date: '',
  time: '',
  location: '',
  capacity: 50,
  description: '',
};

const Events = () => {
  const { events, createEvent, registerForEvent } = useEvents();
  const [eventForm, setEventForm] = useState(defaultForm);
  const [registerForms, setRegisterForms] = useState({});

  const onCreateEvent = (e) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.date || !eventForm.time) return;
    createEvent({
      ...eventForm,
      capacity: Number(eventForm.capacity) || 0,
    });
    setEventForm(defaultForm);
  };

  const onRegister = (eventId, e) => {
    e.preventDefault();
    const form = registerForms[eventId] || {};
    if (!form.name || !form.email) return;
    registerForEvent(eventId, { name: form.name, email: form.email });
    setRegisterForms((prev) => ({ ...prev, [eventId]: { name: '', email: '' } }));
  };

  const updateRegisterField = (eventId, field, value) => {
    setRegisterForms((prev) => ({
      ...prev,
      [eventId]: { ...prev[eventId], [field]: value },
    }));
  };

  return (
    <section className="py-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="card shadow-sm border-0 sticky-lg-top" style={{ top: '96px' }}>
              <div className="card-body">
                <h5 className="fw-bold mb-3">Create a new event</h5>
                <form onSubmit={onCreateEvent} className="needs-validation">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      required
                      type="text"
                      className="form-control"
                      value={eventForm.title}
                      onChange={(e) =>
                        setEventForm((f) => ({ ...f, title: e.target.value }))
                      }
                      placeholder="Community Meetup"
                    />
                  </div>
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label">Date</label>
                      <input
                        required
                        type="date"
                        className="form-control"
                        value={eventForm.date}
                        onChange={(e) =>
                          setEventForm((f) => ({ ...f, date: e.target.value }))
                        }
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label">Time</label>
                      <input
                        required
                        type="time"
                        className="form-control"
                        value={eventForm.time}
                        onChange={(e) =>
                          setEventForm((f) => ({ ...f, time: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                  <div className="mb-3 mt-3">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      value={eventForm.location}
                      onChange={(e) =>
                        setEventForm((f) => ({ ...f, location: e.target.value }))
                      }
                      placeholder="Main Hall"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Capacity</label>
                    <input
                      type="number"
                      className="form-control"
                      value={eventForm.capacity}
                      onChange={(e) =>
                        setEventForm((f) => ({
                          ...f,
                          capacity: e.target.value,
                        }))
                      }
                      min="1"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={eventForm.description}
                      onChange={(e) =>
                        setEventForm((f) => ({ ...f, description: e.target.value }))
                      }
                      placeholder="What should attendees expect?"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Add event
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold mb-0">Upcoming events</h4>
              <span className="text-muted small">
                {events.length} active · click a card for details
              </span>
            </div>
            <div className="row g-4">
              {events.map((event) => {
                const registered = event.attendees.length;
                const percent = Math.min((registered / event.capacity) * 100, 100);
                const form = registerForms[event.id] || { name: '', email: '' };

                return (
                  <div key={event.id} className="col-12">
                    <div className="card shadow-sm border-0 h-100">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h5 className="fw-bold mb-1">{event.title}</h5>
                            <div className="text-muted small">
                              {event.date} · {event.time} · {event.location}
                            </div>
                          </div>
                          <Link to={`/events/${event.id}`} className="btn btn-outline-primary btn-sm">
                            Details
                          </Link>
                        </div>
                        <p className="mt-3 mb-2">{event.description}</p>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div className="text-muted small">
                            {registered} registered / {event.capacity} capacity
                          </div>
                          <span className="badge bg-primary">{Math.round(percent)}%</span>
                        </div>
                        <div className="progress mb-3" style={{ height: '6px' }}>
                          <div
                            className="progress-bar bg-primary"
                            role="progressbar"
                            style={{ width: `${percent}%` }}
                            aria-valuenow={registered}
                            aria-valuemin="0"
                            aria-valuemax={event.capacity}
                          />
                        </div>
                        <form onSubmit={(e) => onRegister(event.id, e)} className="row g-2">
                          <div className="col-md-4">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Name"
                              value={form.name}
                              onChange={(e) =>
                                updateRegisterField(event.id, 'name', e.target.value)
                              }
                              required
                            />
                          </div>
                          <div className="col-md-4">
                            <input
                              type="email"
                              className="form-control"
                              placeholder="Email"
                              value={form.email}
                              onChange={(e) =>
                                updateRegisterField(event.id, 'email', e.target.value)
                              }
                              required
                            />
                          </div>
                          <div className="col-md-4 d-grid">
                            <button type="submit" className="btn btn-outline-primary">
                              Register
                            </button>
                          </div>
                        </form>
                        {event.attendees.length > 0 && (
                          <div className="mt-3">
                            <div className="text-muted small mb-2">Attendees</div>
                            <div className="d-flex flex-wrap gap-2">
                              {event.attendees.map((attendee) => (
                                <span key={attendee.email} className="badge bg-light text-dark border">
                                  {attendee.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Events;
