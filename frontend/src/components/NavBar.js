import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

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
              <NavLink className="nav-link" to="/events/browse">
                Browse Events
              </NavLink>
            </li>
            {isAuthenticated && (
              <li className="nav-item d-lg-none">
                <NavLink className="nav-link" to="/events/create">
                  Create Event
                </NavLink>
              </li>
            )}
            <li className="nav-item d-lg-none">
              {isAuthenticated ? (
                <button type="button" className="nav-link btn btn-link" onClick={logout}>
                  Log out
                </button>
              ) : (
                <NavLink className="nav-link" to="/login">
                  Log in
                </NavLink>
              )}
            </li>
          </ul>
          <div className="d-none d-lg-flex ms-lg-3 gap-2 align-items-center">
            <Link to="/events/browse" className="btn btn-primary btn-sm">
              Browse events
            </Link>
            {isAuthenticated && (
              <Link to="/events/create" className="btn btn-outline-primary btn-sm">
                Create event
              </Link>
            )}
            {isAuthenticated ? (
              <div className="position-relative">
                <button
                  type="button"
                  className="btn auth-pill d-flex align-items-center gap-2"
                  onClick={() => setMenuOpen((v) => !v)}
                >
                  <span className="auth-pill__avatar">
                    {(user?.name || user?.email || 'A').slice(0, 1).toUpperCase()}
                  </span>
                  <span className="auth-pill__name">
                    {user?.name || user?.email || 'Admin'}
                  </span>
                  <span className="auth-pill__caret">▾</span>
                </button>
                {menuOpen && (
                  <div className="card shadow-sm auth-menu">
                    <button
                      type="button"
                      className="dropdown-item text-danger"
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                      }}
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-outline-secondary btn-sm">
                Log in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
