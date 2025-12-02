import React from 'react';

const Contact = () => {
  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h2 className="fw-bold">Let’s plan your next event</h2>
            <p className="text-muted">
              Tell us what you want to achieve—format, size, or style—and we’ll
              set you up with an event template inside EmshoEvents.
            </p>
            <div className="d-flex flex-column gap-2">
              <div>
                <span className="fw-bold">Email: </span>
                hello@emshoevents.test
              </div>
              <div>
                <span className="fw-bold">Phone: </span>
                +1 (555) 123-4567
              </div>
              <div>
                <span className="fw-bold">Hours: </span>
                Mon–Fri, 9am–6pm
              </div>
            </div>
          </div>
          <div className="col-lg-5 offset-lg-1 mt-4 mt-lg-0">
            <div className="card shadow-sm border-0 clunky-card">
              <div className="card-body">
                <h5 className="fw-bold">Quick message</h5>
                <p className="text-muted small">
                  This demo form does not send data yet—feel free to outline
                  your needs.
                </p>
                <form>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" placeholder="Your name" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Message</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="What kind of event are you planning?"
                    />
                  </div>
                  <button type="button" className="btn btn-primary w-100" disabled>
                    Send (placeholder)
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
