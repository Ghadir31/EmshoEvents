import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event, compact = false }) => {
  const capacity = event.capacity || 1;
  const percent = Math.min(((event.attendees?.length || 0) / capacity) * 100, 100);

  return (
    <div
      className={`event-card card text-white border-0 clunky-card ${
        compact ? 'event-card-compact' : ''
      }`}
      style={{ backgroundImage: `url(${event.image})` }}
    >
      <div className="event-card__overlay">
        <div className="d-flex justify-content-between align-items-start">
          <span className="badge bg-light text-dark">{event.category}</span>
          <span className="badge bg-dark bg-opacity-50">
            {event.date} · {event.time}
          </span>
        </div>
        <h5 className="fw-bold mt-3 mb-1">{event.title}</h5>
        <div className="small mb-2">
          {event.location} · {event.attendees?.length || 0}/{event.capacity} seats
        </div>
        {!compact && <p className="mb-3 small">{event.description}</p>}
        <div className="progress mb-3" style={{ height: '5px' }}>
          <div
            className="progress-bar bg-success"
            role="progressbar"
            style={{ width: `${percent}%` }}
            aria-valuenow={percent}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>
        <div className="d-flex gap-2">
          <Link to={`/events/${event.id}`} className="btn btn-light btn-sm text-primary fw-bold">
            View details
          </Link>
          <Link to="/events/browse" className="btn btn-outline-light btn-sm">
            Browse more
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
