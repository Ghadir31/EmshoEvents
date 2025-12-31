import React from 'react';
import { Link } from 'react-router-dom';

const CATEGORY_VISUALS = {
  Technology: {
    image:
      'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=900&q=80',
    accent: '#0d2a4a',
  },
  Wellness: {
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    accent: '#2f7d5a',
  },
  Community: {
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80',
    accent: '#b53030',
  },
  Business: {
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
    accent: '#b2593b',
  },
  Arts: {
    image:
      'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=80',
    accent: '#6a3d6f',
  },
  Education: {
    image:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80',
    accent: '#1f3f64',
  },
  General: {
    image:
      'https://images.unsplash.com/photo-1529333166433-4e0ea59b8b9b?auto=format&fit=crop&w=900&q=80',
    accent: '#d72b2b',
  },
};

const CategoryCard = ({ category, event, total }) => {
  const visual = CATEGORY_VISUALS[category] || CATEGORY_VISUALS.General;
  const photo = visual.image || event?.image;
  const accent = visual.accent || '#d72b2b';

  return (
    <div className="category-card card h-100">
      <div className="category-card__accent" style={{ backgroundColor: accent }} />
      <div className="category-card__body h-100 d-flex flex-column">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <p className="text-uppercase text-muted small mb-1">Category</p>
            <h5 className="mb-0">{category}</h5>
          </div>
          <span className="badge bg-dark bg-opacity-75 text-white">{total} events</span>
        </div>

        <div className="d-flex align-items-center gap-3 mb-3">
          <div
            className="category-card__thumb"
            style={{ backgroundImage: `url(${photo || CATEGORY_VISUALS.General.image})` }}
          />
          {event && (
            <div className="category-card__next">
              <p className="small text-uppercase text-muted mb-1">Next on deck</p>
              <div className="fw-semibold">{event.title}</div>
              <div className="small text-muted">
                {event.date} · {event.location}
              </div>
            </div>
          )}
        </div>

        <div className="mt-auto d-flex align-items-center justify-content-between">
          <div className="category-card__pill" style={{ color: accent }}>
            Fresh picks every week
          </div>
          <Link to="/events/browse" className="btn btn-sm btn-outline-dark">
            Browse {category}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
