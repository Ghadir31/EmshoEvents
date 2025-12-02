import React from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../context/EventContext';

const Home = () => {
  const { events } = useEvents();
  const totalAttendees = events.reduce(
    (sum, event) => sum + event.attendees.length,
    0
  );

  return (
    <>
      <section className="hero-section text-center text-lg-start bg-gradient-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <p className="badge rounded-pill bg-light text-primary mb-3">
                Event creation, registrations, and updates—no fuss.
              </p>
              <h1 className="display-4 fw-bold">
                Launch events in minutes. Fill seats without the stress.
              </h1>
              <p className="lead mt-3 mb-4">
                EmshoEvents keeps planning simple with ready-made forms,
                attendee tracking, and effortless updates for every gathering.
              </p>
              <div className="d-flex gap-3 justify-content-center justify-content-lg-start">
                <Link to="/events" className="btn btn-light btn-lg text-primary">
                  Create an Event
                </Link>
                <Link
                  to="/services"
                  className="btn btn-outline-light btn-lg text-white"
                >
                  See Features
                </Link>
              </div>
            </div>
            <div className="col-lg-5 mt-4 mt-lg-0">
              <div className="card border-0 shadow-lg">
                <div className="card-body">
                  <h5 className="card-title fw-bold text-primary mb-3">
                    Live dashboard
                  </h5>
                  <ul className="list-group list-group-flush">
                    {events.slice(0, 3).map((event) => (
                      <li key={event.id} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <div className="fw-bold">{event.title}</div>
                            <small className="text-muted">
                              {event.date} · {event.location}
                            </small>
                          </div>
                          <span className="badge bg-primary">
                            {event.attendees.length}/{event.capacity}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row text-center mb-4">
            <div className="col">
              <h2 className="fw-bold">Why teams choose EmshoEvents</h2>
              <p className="text-muted">
                Built for quick launches and clear registration flows.
              </p>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <div className="icon-circle bg-primary text-white mb-3">
                    ✓
                  </div>
                  <h5 className="fw-bold">No login to start</h5>
                  <p className="text-muted">
                    Get moving fast—create and share events without any auth
                    setup yet.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <div className="icon-circle bg-primary text-white mb-3">
                    ⚡
                  </div>
                  <h5 className="fw-bold">Built-in forms</h5>
                  <p className="text-muted">
                    Ready-made creation and registration forms powered by
                    Bootstrap components.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <div className="icon-circle bg-primary text-white mb-3">
                    📈
                  </div>
                  <h5 className="fw-bold">Clear tracking</h5>
                  <p className="text-muted">
                    Know capacity and signups at a glance with clean progress
                    badges.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <h3 className="fw-bold mb-3">Recent momentum</h3>
              <p className="text-muted">
                Watch interest grow across your events. Share updates instantly
                and keep everyone in the loop.
              </p>
              <div className="d-flex gap-4">
                <div>
                  <div className="display-5 fw-bold text-primary">
                    {events.length}
                  </div>
                  <div className="text-muted">Active events</div>
                </div>
                <div>
                  <div className="display-5 fw-bold text-primary">
                    {totalAttendees}
                  </div>
                  <div className="text-muted">Registered attendees</div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h6 className="text-uppercase text-muted mb-3">
                    Upcoming focus
                  </h6>
                  {events.slice(0, 3).map((event) => (
                    <div key={event.id} className="mb-3">
                      <div className="d-flex justify-content-between">
                        <div className="fw-bold">{event.title}</div>
                        <span className="text-muted">{event.date}</span>
                      </div>
                      <div className="progress" style={{ height: '6px' }}>
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
                    </div>
                  ))}
                  <Link to="/events" className="btn btn-primary w-100">
                    View all events
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
