import React, { useMemo, useState } from 'react';
import EventCard from '../components/EventCard';
import { useEvents } from '../context/EventContext';

const getDate = (event) => new Date(`${event.date}T${event.time || '00:00'}`);

const timelineOptions = [
  { value: 'all', label: 'All dates' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'next7', label: 'Next 7 days' },
  { value: 'next30', label: 'Next 30 days' },
  { value: 'past', label: 'Past' },
];

const BrowseEvents = () => {
  const { events } = useEvents();
  const categories = ['All', ...new Set(events.map((e) => e.category || 'General'))];
  const [filters, setFilters] = useState({
    category: 'All',
    timeline: 'all',
    location: '',
  });

  const filteredEvents = useMemo(() => {
    const now = new Date();
    return [...events]
      .filter((event) => {
        const eventDate = getDate(event);
        const daysDiff = (eventDate - now) / (1000 * 60 * 60 * 24);
        const matchesCategory =
          filters.category === 'All' || (event.category || 'General') === filters.category;
        const locationValue = (event.location || '').toLowerCase();
        const matchesLocation =
          !filters.location || locationValue.includes(filters.location.toLowerCase());

        let matchesTimeline = true;
        switch (filters.timeline) {
          case 'upcoming':
            matchesTimeline = eventDate >= now;
            break;
          case 'next7':
            matchesTimeline = daysDiff >= 0 && daysDiff <= 7;
            break;
          case 'next30':
            matchesTimeline = daysDiff >= 0 && daysDiff <= 30;
            break;
          case 'past':
            matchesTimeline = eventDate < now;
            break;
          default:
            matchesTimeline = true;
        }

        return matchesCategory && matchesLocation && matchesTimeline;
      })
      .sort((a, b) => getDate(a) - getDate(b));
  }, [events, filters]);

  return (
    <section className="py-5">
      <div className="container">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-3">
          <div>
            <p className="badge bg-primary bg-opacity-10 text-primary">Browse</p>
            <h2 className="fw-bold mb-1">Find the right event</h2>
            <p className="text-muted mb-0">
              Filter by category, time window, or location. Click a card to see details.
            </p>
          </div>
        </div>

        <div className="card clunky-card mb-4">
          <div className="card-body">
            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={filters.category}
                  onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Timeline</label>
                <select
                  className="form-select"
                  value={filters.timeline}
                  onChange={(e) => setFilters((f) => ({ ...f, timeline: e.target.value }))}
                >
                  {timelineOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="City, venue, or keyword"
                  value={filters.location}
                  onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {filteredEvents.map((event) => (
            <div key={event.id} className="col-md-4">
              <EventCard event={event} />
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="alert alert-light border mt-3 clunky-card">
            Nothing matches those filters yet. Try expanding your search or switching timeline.
          </div>
        )}
      </div>
    </section>
  );
};

export default BrowseEvents;
