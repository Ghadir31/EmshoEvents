import React, { createContext, useContext, useMemo, useState } from 'react';
import initialEvents from '../data/events';

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState(initialEvents);

  const createEvent = (payload) => {
    setEvents((prev) => {
      const nextId = (prev[prev.length - 1]?.id || 0) + 1;
      return [
        ...prev,
        {
          id: nextId,
          attendees: [],
          ...payload,
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
