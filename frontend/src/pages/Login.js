import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, register, isAuthenticated, loading } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/events/browse" replace />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const action = mode === 'login' ? login : register;
    const payload = mode === 'login' ? [form.email, form.password] : [form];

    const result = await action(...payload);
    setSubmitting(false);

    if (!result?.ok) {
      setError(result?.error || 'Something went wrong');
      return;
    }
    navigate('/events/browse');
  };

  const toggleMode = () => {
    setError('');
    setMode((m) => (m === 'login' ? 'register' : 'login'));
  };

  return (
    <section className="py-5">
      <div className="container" style={{ maxWidth: '540px' }}>
        <div className="text-center mb-4">
          <p className="badge bg-primary bg-opacity-10 text-primary">Access</p>
          <h2 className="fw-bold">Admin access</h2>
          <p className="text-muted mb-0">
            Log in to create, edit, or delete events. Registrations stay open to everyone.
          </p>
        </div>
        <div className="card shadow-sm border-0 clunky-card">
          <div className="card-body">
            {loading ? (
              <div className="text-center text-muted py-3">Checking session...</div>
            ) : (
              <form onSubmit={onSubmit} className="d-flex flex-column gap-3">
                {mode === 'register' && (
                  <div>
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Admin name"
                    />
                  </div>
                )}
                <div>
                  <label className="form-label">Email</label>
                  <input
                    required
                    type="email"
                    className="form-control"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="admin@example.com"
                  />
                </div>
                <div>
                  <label className="form-label">Password</label>
                  <input
                    required
                    type="password"
                    className="form-control"
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    minLength={6}
                    placeholder="••••••••"
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
                  {submitting
                    ? 'Working...'
                    : mode === 'login'
                    ? 'Log in'
                    : 'Create admin account'}
                </button>
                <div className="d-flex justify-content-between align-items-center">
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    onClick={toggleMode}
                    disabled={submitting}
                  >
                    {mode === 'login'
                      ? "Don't have an account? Register"
                      : 'Already registered? Log in'}
                  </button>
                  <Link to="/events/browse" className="text-decoration-none">
                    Back to events
                  </Link>
                </div>
                {error && (
                  <div className="alert alert-danger py-2 mb-0" role="alert">
                    {error}
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
