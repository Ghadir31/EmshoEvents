const initialEvents = [
  {
    id: 1,
    title: 'Downtown Tech Meetup',
    date: '2025-04-05',
    time: '18:30',
    location: 'Innovation Hub, City Center',
    capacity: 60,
    description:
      'An evening of lightning talks and hands-on demos with local tech builders.',
    attendees: [
      { name: 'Alex Johnson', email: 'alex@example.com' },
      { name: 'Priya Singh', email: 'priya@example.com' },
    ],
  },
  {
    id: 2,
    title: 'Wellness in the Workplace',
    date: '2025-04-12',
    time: '10:00',
    location: 'Civic Green Hall',
    capacity: 80,
    description:
      'Guided workshops on mindfulness, ergonomics, and healthy team rituals.',
    attendees: [{ name: 'Marco Lee', email: 'marco@example.com' }],
  },
  {
    id: 3,
    title: 'Community Hack Day',
    date: '2025-04-19',
    time: '09:00',
    location: 'Makerspace District',
    capacity: 120,
    description:
      'Build small, impactful projects for local non-profits in a friendly sprint.',
    attendees: [],
  },
];

export default initialEvents;
