import React, { createContext, useContext, useMemo, useState } from 'react';
import initialEvents from '../data/events';

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

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState(initialEvents);

  const createEvent = (payload) => {
    setEvents((prev) => {
      const nextId = (prev[prev.length - 1]?.id || 0) + 1;
      const category = payload.category || 'General';
      return [
        ...prev,
        {
          id: nextId,
          attendees: [],
          image: payload.image || fallbackImages[category] || fallbackImages.General,
          ...payload,
          category,
        },
      ];
    });
  };

  const registerForEvent = (id, attendee) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (event.id !== id) return event;
        const existing = event.attendees.some(
          (person) => person.email.toLowerCase() === attendee.email.toLowerCase()
        );
        if (existing) return event;
        return {
          ...event,
          attendees: [...event.attendees, attendee],
        };
      })
    );
  };

  const value = useMemo(
    () => ({ events, createEvent, registerForEvent }),
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
