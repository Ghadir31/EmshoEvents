import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/">
          EmshoEvents
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
          aria-controls="navMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-2">
            <li className="nav-item">
              <NavLink end className="nav-link" to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/services">
                Services
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact">
                Contact
              </NavLink>
            </li>
            <li className="nav-item d-lg-none">
              <NavLink className="nav-link" to="/events/create">
                Create Event
              </NavLink>
            </li>
            <li className="nav-item d-lg-none">
              <NavLink className="nav-link" to="/events/browse">
                Browse Events
              </NavLink>
            </li>
          </ul>
          <div className="d-none d-lg-flex ms-lg-3 gap-2">
            <Link to="/events/create" className="btn btn-outline-primary btn-sm">
              Create event
            </Link>
            <Link to="/events/browse" className="btn btn-primary btn-sm">
              Browse events
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
