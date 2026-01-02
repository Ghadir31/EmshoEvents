import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const fallbackImages = {
  Technology:
    'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1200&q=80',
  Wellness:
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
  Community:
    'https://images.unsplash.com/photo-1515165562835-c4c1b572ef1b?auto=format&fit=crop&w=1200&q=80',
  Business:
    'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80',
  Arts:
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  Education:
    'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80',
  General:
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
};

const EventContext = createContext();
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const withFallbacks = (event) => {
  const category = event.category || 'General';
  return {
    attendees: [],
    ...event,
    attendees: event.attendees || [],
    category,
    image: event.image || fallbackImages[category] || fallbackImages.General,
  };
};

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/events`);
        if (!res.ok) throw new Error(`Failed to load events: ${res.status}`);
        const data = await res.json();
        if (isMounted) {
          setEvents(Array.isArray(data) ? data.map(withFallbacks) : []);
        }
      } catch (err) {
        console.error('Error fetching events', err);
        if (isMounted) setEvents([]);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const createEvent = async (payload) => {
    const category = payload.category || 'General';
    try {
      const res = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Failed to create event: ${res.status}`);
      const created = await res.json();
      const normalized = withFallbacks({ ...created, category });
      setEvents((prev) => [...prev, normalized]);
      return { ok: true, data: normalized };
    } catch (err) {
      console.error('Error creating event', err);
      return { ok: false, error: err.message };
    }
  };

  const registerForEvent = async (id, attendee) => {
    const event = events.find((ev) => ev.id === Number(id));
    const capacity = event?.capacity ?? 0;
    const attendeeCount = event?.attendees?.length ?? 0;

    if (capacity > 0 && attendeeCount >= capacity) {
      return { ok: false, error: 'Event is full' };
    }

    try {
      const res = await fetch(`${API_URL}/events/${id}/attendees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attendee),
      });
      if (res.status === 409) {
        return { ok: false, error: 'Already registered' };
      }
      if (res.status === 404) {
        return { ok: false, error: 'Event not found' };
      }
      if (!res.ok) throw new Error(`Failed to register: ${res.status}`);

      setEvents((prev) =>
        prev.map((event) => {
          if (event.id !== Number(id)) return event;
          const exists = event.attendees.some(
            (person) => person.email.toLowerCase() === attendee.email.toLowerCase()
          );
          if (exists) return event;
          return { ...event, attendees: [...event.attendees, attendee] };
        })
      );
      return { ok: true };
    } catch (err) {
      console.error('Error registering attendee', err);
      return { ok: false, error: err.message };
    }
  };

  const updateEvent = async (id, payload) => {
    const category = payload.category || 'General';
    try {
      const res = await fetch(`${API_URL}/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.status === 404) return { ok: false, error: 'Event not found' };
      if (!res.ok) throw new Error(`Failed to update event: ${res.status}`);
      const updated = await res.json();
      const normalized = withFallbacks({ ...updated, category });
      setEvents((prev) =>
        prev.map((event) => {
          if (event.id !== Number(id)) return event;
          const existingAttendees = event.attendees || [];
          return { ...event, ...normalized, attendees: existingAttendees };
        })
      );
      return { ok: true, data: normalized };
    } catch (err) {
      console.error('Error updating event', err);
      return { ok: false, error: err.message };
    }
  };

  const deleteEvent = async (id) => {
    try {
      const res = await fetch(`${API_URL}/events/${id}`, { method: 'DELETE' });
      if (res.status === 404) return { ok: false, error: 'Event not found' };
      if (!res.ok) throw new Error(`Failed to delete event: ${res.status}`);
      setEvents((prev) => prev.filter((event) => event.id !== Number(id)));
      return { ok: true };
    } catch (err) {
      console.error('Error deleting event', err);
      return { ok: false, error: err.message };
    }
  };

  const value = useMemo(
    () => ({ events, createEvent, registerForEvent, updateEvent, deleteEvent }),
    [events]
  );

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};
