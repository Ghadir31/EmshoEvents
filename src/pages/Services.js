import React from 'react';
import { Link } from 'react-router-dom';

const Services = () => {
  const services = [
    {
      title: 'Event creation',
      description: 'Set title, date, time, capacity, and location in one pass.',
      icon: '🗓️',
    },
    {
      title: 'Registration intake',
      description: 'Collect attendee names and emails with a clear, compact form.',
      icon: '✍️',
    },
    {
      title: 'Capacity tracking',
      description: 'Know how close you are to full with live counts.',
      icon: '📊',
    },
    {
      title: 'Attendee view',
      description: 'See who registered and keep their contact info handy.',
      icon: '👥',
    },
    {
      title: 'Responsive design',
      description: 'Bootstrap-powered layouts that read well on any device.',
      icon: '📱',
    },
    {
      title: 'Future integrations',
      description: 'Ready to plug into auth and real data sources next.',
      icon: '🔌',
    },
  ];

  return (
    <section className="py-5">
      <div className="container">
        <div className="row mb-4 text-center">
          <div className="col">
            <span className="badge bg-primary bg-opacity-10 text-primary mb-3">
              Services & Features
            </span>
            <h2 className="fw-bold">Everything you need to open the doors</h2>
            <p className="text-muted">
              Start with our built-in toolkit, then extend as your events grow.
            </p>
          </div>
        </div>
        <div className="row g-4">
          {services.map((service) => (
            <div key={service.title} className="col-md-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <div className="icon-circle bg-primary text-white mb-3">
                    {service.icon}
                  </div>
                  <h5 className="fw-bold">{service.title}</h5>
                  <p className="text-muted">{service.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-5">
          <Link to="/events" className="btn btn-primary btn-lg">
            Try the event workspace
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;
