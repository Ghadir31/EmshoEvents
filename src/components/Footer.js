import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        <div>
          <div className="fw-bold">EmshoEvents</div>
          <small className="text-secondary">
            Crafted for effortless event creation and smooth registrations.
          </small>
        </div>
        <div className="d-flex gap-3 mt-3 mt-md-0">
          <Link className="text-decoration-none text-secondary" to="/about">
            About
          </Link>
          <Link className="text-decoration-none text-secondary" to="/services">
            Services
          </Link>
          <Link className="text-decoration-none text-secondary" to="/events">
            Events
          </Link>
          <Link className="text-decoration-none text-secondary" to="/contact">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
