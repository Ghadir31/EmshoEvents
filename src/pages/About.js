import React from 'react';

const About = () => {
  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <span className="badge bg-primary bg-opacity-10 text-primary mb-3">
              About EmshoEvents
            </span>
            <h2 className="fw-bold">Simple, confident event launches.</h2>
            <p className="text-muted">
              EmshoEvents was created to make event planning approachable. We
              focus on the essentials: building a clear event page, opening a
              registration form, and seeing who is attending—all without heavy
              setup.
            </p>
            <p className="text-muted">
              Today the product runs on straightforward React + Bootstrap. As we
              add authentication and real data sources later, the core UX stays
              clean and predictable.
            </p>
          </div>
          <div className="col-lg-5 offset-lg-1">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h6 className="text-uppercase text-muted">Principles</h6>
                <ul className="list-unstyled mb-0">
                  <li className="d-flex align-items-start gap-2 mb-2">
                    <span className="text-primary fw-bold">1.</span>
                    Keep organizers in control with clear actions.
                  </li>
                  <li className="d-flex align-items-start gap-2 mb-2">
                    <span className="text-primary fw-bold">2.</span>
                    Make registration frictionless for guests.
                  </li>
                  <li className="d-flex align-items-start gap-2">
                    <span className="text-primary fw-bold">3.</span>
                    Build a foundation ready for future integrations.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
