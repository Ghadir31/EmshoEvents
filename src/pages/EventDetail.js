import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useEvents } from '../context/EventContext';

const EventDetail = () => {
  const { id } = useParams();
  const { events } = useEvents();
  const event = events.find((item) => item.id === Number(id));

  if (!event) {
    return (
      <section className="py-5">
        <div className="container text-center">
          <h4 className="fw-bold">Event not found</h4>
          <Link to="/events" className="btn btn-primary mt-3">
            Back to events
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h3 className="fw-bold">{event.title}</h3>
                    <div className="text-muted">
                      {event.date} · {event.time} · {event.location}
                    </div>
                  </div>
                  <Link to="/events" className="btn btn-outline-primary btn-sm">
                    Back to list
                  </Link>
                </div>
                <p className="lead">{event.description}</p>
              </div>
            </div>
            <div className="card shadow-sm border-0">
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
          <div className="col-lg-4 mt-4 mt-lg-0">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h6 className="text-uppercase text-muted">Status</h6>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-bold">Capacity</div>
                    <div className="text-muted small">
                      {event.attendees.length} of {event.capacity} registered
                    </div>
                  </div>
                  <span className="badge bg-primary">
                    {Math.round(
                      Math.min((event.attendees.length / event.capacity) * 100, 100)
                    )}
                    %
                  </span>
                </div>
                <div className="progress my-3" style={{ height: '6px' }}>
                  <div
                    className="progress-bar bg-primary"
                    role="progressbar"
                    style={{
                      width: `${Math.min(
                        (event.attendees.length / event.capacity) * 100,
                        100
                      )}%`,
                    }}
                    aria-valuenow={event.attendees.length}
                    aria-valuemin="0"
                    aria-valuemax={event.capacity}
                  />
                </div>
                <div>
                  <div className="fw-bold mb-1">Location</div>
                  <div className="text-muted">{event.location}</div>
                </div>
                <hr />
                <div className="fw-bold mb-1">Need to edit?</div>
                <p className="text-muted small mb-3">
                  Event updates will be available in the next iteration. For now,
                  create a new event with the updated details.
                </p>
                <Link to="/events" className="btn btn-primary w-100">
                  Create another event
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventDetail;
