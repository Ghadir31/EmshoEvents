import React from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import EventCard from '../components/EventCard';
import CategoryCard from '../components/CategoryCard';

const getDate = (event) => new Date(`${event.date}T${event.time || '00:00'}`);

const Home = () => {
  const { events } = useEvents();
  const sorted = [...events].sort((a, b) => getDate(b) - getDate(a));
  const featured = sorted.slice(0, 3);
  const categories = Array.from(new Set(events.map((e) => e.category || 'General')));
  const eventsByCategory = categories.map((cat) => {
    const matches = sorted.filter((e) => (e.category || 'General') === cat);
    return {
      category: cat,
      event: matches[0],
      total: matches.length,
    };
  });

  return (
    <>
      <section className="hero-section text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <p className="badge rounded-pill bg-light text-primary mb-3">
                Built for Lebanon's gatherings.
              </p>
              <h1 className="display-5 fw-bold">
                Your home for events across Lebanon.
              </h1>
              <p className="lead mt-3 mb-4">
                From Beirut to Tripoli to the mountains, find concerts, meetups, and community
                moments by category, timing, or location.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/events/browse" className="btn btn-light btn-lg text-primary">
                  Browse events
                </Link>
                <Link to="/events/create" className="btn btn-outline-light btn-lg">
                  Create an event
                </Link>
              </div>
            </div>
            <div className="col-lg-5 mt-4 mt-lg-0">
              <div className="card border-0 clunky-card">
                <div className="card-body">
                  <h6 className="text-uppercase text-muted">Latest arrivals</h6>
                  <div className="d-flex gap-3 flex-column">
                    {featured.map((event) => (
                      <div key={event.id} className="d-flex align-items-start gap-2">
                        <span className="badge bg-primary">{event.category}</span>
                        <div>
                          <div className="fw-bold">{event.title}</div>
                          <small className="text-muted">
                            {event.date} · {event.location}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h3 className="fw-bold mb-1">Featured events</h3>
              <p className="text-muted mb-0">Hand-picked highlights happening soon.</p>
            </div>
            <Link to="/events/browse" className="btn btn-primary">
              See all
            </Link>
          </div>
          <div className="row g-4">
            {featured.map((event) => (
              <div key={event.id} className="col-md-4">
                <EventCard event={event} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4 className="fw-bold mb-1">Explore by category</h4>
              <p className="text-muted mb-0">Quick peeks of what’s trending in each lane.</p>
            </div>
            <Link to="/events/browse" className="btn btn-outline-primary">
              Browse all events
            </Link>
          </div>
          <div className="row g-4">
            {eventsByCategory.map(
              ({ category, event, total }) =>
                event && (
                  <div key={category} className="col-md-4">
                    <CategoryCard category={category} event={event} total={total} />
                  </div>
                )
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
