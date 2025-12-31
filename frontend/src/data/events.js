// Dates are relative to "today" so the list always spans roughly the next two months.
const formatDate = (offsetDays) => {
  const base = new Date();
  base.setHours(12, 0, 0, 0); // anchor midday to avoid timezone drift
  base.setDate(base.getDate() + offsetDays);
  return base.toISOString().slice(0, 10);
};

const dateOffsets = [
  -5, -1, 0, 2, 4, 6, 8, 10, 12, 14,
  16, 18, 19, 21, 23, 24, 26, 28, 30, 31,
  33, 35, 36, 38, 40, 42, 43, 45, 47, 48,
  50, 52, 53, 55, 56, 58, 59, 60, 61, 62,
];

const initialEvents = [
  {
    id: 1,
    title: 'Downtown Tech Meetup',
    date: formatDate(dateOffsets[0]),
    time: '18:30',
    location: 'Beirut Digital District, Bashoura',
    capacity: 60,
    category: 'Technology',
    image:
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
    description:
      'Lightning talks and hands-on demos with local tech builders to swap ideas and prototypes.',
    attendees: [
      { name: 'Alex Johnson', email: 'alex@example.com' },
      { name: 'Priya Singh', email: 'priya@example.com' },
    ],
  },
  {
    id: 2,
    title: 'Wellness in the Workplace',
    date: formatDate(dateOffsets[1]),
    time: '10:00',
    location: 'Sursock Gardens, Achrafieh',
    capacity: 80,
    category: 'Wellness',
    image:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    description:
      'Guided workshops on mindfulness, ergonomics, and healthy team rituals with guest coaches.',
    attendees: [{ name: 'Marco Lee', email: 'marco@example.com' }],
  },
  {
    id: 3,
    title: 'Community Hack Day',
    date: formatDate(dateOffsets[2]),
    time: '09:00',
    location: 'Tripoli Makers Lab, Mina',
    capacity: 120,
    category: 'Community',
    image:
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    description:
      'Build small, impactful projects for local non-profits with friendly sprint teams.',
    attendees: [],
  },
  {
    id: 4,
    title: 'Product Strategy Roundtable',
    date: formatDate(dateOffsets[3]),
    time: '17:30',
    location: 'Zaitunay Bay Pavilion, Beirut',
    capacity: 40,
    category: 'Business',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    description:
      'Founders and PMs gather to discuss roadmap tradeoffs and GTM lessons over coffee.',
    attendees: [],
  },
  {
    id: 5,
    title: 'Open Air Art Walk',
    date: formatDate(dateOffsets[4]),
    time: '15:00',
    location: 'Mar Mikhael Arts Lane, Beirut',
    capacity: 150,
    category: 'Arts',
    image:
      'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80',
    description:
      'Guided stroll through pop-up galleries and street murals with live sketch stations.',
    attendees: [],
  },
  {
    id: 6,
    title: 'Learning Futures Summit',
    date: formatDate(dateOffsets[5]),
    time: '09:30',
    location: 'AUB Hostler Auditorium, Beirut',
    capacity: 90,
    category: 'Education',
    image:
      'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80',
    description:
      'Panels on micro-credentials, AI tutors, and modern classrooms with educators and students.',
    attendees: [],
  },
  {
    id: 7,
    title: 'AI for Good Lab',
    date: formatDate(dateOffsets[6]),
    time: '13:00',
    location: 'Berytech Innovation Park, Mkalles',
    capacity: 70,
    category: 'Technology',
    image:
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
    description:
      'Designing responsible AI prototypes to help local services with fairness and transparency.',
    attendees: [],
  },
  {
    id: 8,
    title: 'Sunrise Yoga on the Lawn',
    date: formatDate(dateOffsets[7]),
    time: '07:00',
    location: 'Horsh Beirut Park, Tahouitet El Ghadir',
    capacity: 50,
    category: 'Wellness',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
    description:
      'Gentle flow with live acoustic music and herbal tea afterward to start the day grounded.',
    attendees: [],
  },
  {
    id: 9,
    title: 'Neighborhood Cleanup Sprint',
    date: formatDate(dateOffsets[8]),
    time: '08:30',
    location: 'Saida Corniche, Sidon',
    capacity: 100,
    category: 'Community',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
    description:
      'Teams spread out with supplies to refresh local parks and walkways followed by brunch.',
    attendees: [],
  },
  {
    id: 10,
    title: 'Founder Office Hours',
    date: formatDate(dateOffsets[9]),
    time: '16:00',
    location: 'Beirut Digital District, Bashoura',
    capacity: 35,
    category: 'Business',
    image:
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
    description:
      '1:1 slots with mentors covering fundraising decks, pricing, and early hiring patterns.',
    attendees: [],
  },
  {
    id: 11,
    title: 'Printmaking Night',
    date: formatDate(dateOffsets[10]),
    time: '18:00',
    location: 'Gemmayzeh Studio 44, Beirut',
    capacity: 40,
    category: 'Arts',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    description:
      'Hands-on block printing workshop with local artists; materials provided, all levels welcome.',
    attendees: [],
  },
  {
    id: 12,
    title: 'Career Switchers Q&A',
    date: formatDate(dateOffsets[11]),
    time: '17:00',
    location: 'Sodeco Learning Loft, Beirut',
    capacity: 90,
    category: 'Education',
    image:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
    description:
      'Panel of professionals who pivoted into tech, design, and teaching sharing real talk stories.',
    attendees: [],
  },
  {
    id: 13,
    title: 'Frontend Performance Clinic',
    date: formatDate(dateOffsets[12]),
    time: '18:30',
    location: 'Hamra Digital Crafts Lab, Beirut',
    capacity: 65,
    category: 'Technology',
    image:
      'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1200&q=80',
    description:
      'Deep dive on Core Web Vitals with live audits of volunteer projects and practical fixes.',
    attendees: [],
  },
  {
    id: 14,
    title: 'Mindful Leadership Circle',
    date: formatDate(dateOffsets[13]),
    time: '11:00',
    location: 'Beit Misk Garden Terrace',
    capacity: 30,
    category: 'Wellness',
    image:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    description:
      'Leaders share how they integrate mindfulness, boundaries, and rest into fast-paced roles.',
    attendees: [],
  },
  {
    id: 15,
    title: 'Neighborhood Potluck & Story Swap',
    date: formatDate(dateOffsets[14]),
    time: '16:00',
    location: 'Byblos Old Souks Courtyard',
    capacity: 120,
    category: 'Community',
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    description:
      'Bring a dish from your culture and a story to share; family-friendly with kids activities.',
    attendees: [],
  },
  {
    id: 16,
    title: 'Small Biz Finance Basics',
    date: formatDate(dateOffsets[15]),
    time: '18:00',
    location: 'Chiyah Chamber Hall, Beirut',
    capacity: 75,
    category: 'Business',
    image:
      'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80',
    description:
      'CPA-led primer on bookkeeping, taxes, and cashflow habits for indie founders and shops.',
    attendees: [],
  },
  {
    id: 17,
    title: 'Night at the Museum Sketch',
    date: formatDate(dateOffsets[16]),
    time: '19:00',
    location: 'Sursock Museum, Achrafieh',
    capacity: 80,
    category: 'Arts',
    image:
      'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80',
    description:
      'After-hours museum access with sketch prompts, charcoal provided, quiet music throughout.',
    attendees: [],
  },
  {
    id: 18,
    title: 'Scholarship Application Lab',
    date: formatDate(dateOffsets[17]),
    time: '14:00',
    location: 'Dekwaneh Learning Loft',
    capacity: 60,
    category: 'Education',
    image:
      'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80',
    description:
      'Hands-on help with essay drafts, recommendation requests, and financial aid forms.',
    attendees: [],
  },
  {
    id: 19,
    title: 'Serverless Saturday',
    date: formatDate(dateOffsets[18]),
    time: '10:00',
    location: 'Antelias Cloud Garage',
    capacity: 70,
    category: 'Technology',
    image:
      'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1200&q=80',
    description:
      'Hands-on labs deploying APIs and jobs without servers; bring a laptop and curiosity.',
    attendees: [],
  },
  {
    id: 20,
    title: 'Trail Run & Breathwork',
    date: formatDate(dateOffsets[19]),
    time: '08:00',
    location: 'Baabdat Pine Trails',
    capacity: 40,
    category: 'Wellness',
    image:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    description:
      'Guided 5k run with pacing groups followed by a 20-minute breathwork cool-down.',
    attendees: [],
  },
  {
    id: 21,
    title: 'Civic Design Jam',
    date: formatDate(dateOffsets[20]),
    time: '12:00',
    location: 'Beirut Public Library Atrium',
    capacity: 90,
    category: 'Community',
    image:
      'https://images.unsplash.com/photo-1529333166433-4e0ea59b8b9b?auto=format&fit=crop&w=1200&q=80',
    description:
      'Designers, policy makers, and residents co-create service ideas for local needs.',
    attendees: [],
  },
  {
    id: 22,
    title: 'Pitch Practice Night',
    date: formatDate(dateOffsets[21]),
    time: '18:30',
    location: 'Beirut Digital District, Bashoura',
    capacity: 45,
    category: 'Business',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    description:
      'Founders practice 3-minute pitches with live feedback from peers and mentors.',
    attendees: [],
  },
  {
    id: 23,
    title: 'Indie Film Screening',
    date: formatDate(dateOffsets[22]),
    time: '20:00',
    location: 'Beit El Cinema Rooftop, Gemmayzeh',
    capacity: 110,
    category: 'Arts',
    image:
      'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1200&q=80',
    description:
      'Outdoor screening of emerging filmmakers with director Q&A and local snacks.',
    attendees: [],
  },
  {
    id: 24,
    title: 'STEM Family Fair',
    date: formatDate(dateOffsets[23]),
    time: '10:00',
    location: 'Beirut Science Pavilion, Hadath',
    capacity: 200,
    category: 'Education',
    image:
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    description:
      'Kid-friendly experiments, robotics demos, and astronomy pop-ups for curious families.',
    attendees: [],
  },
  {
    id: 25,
    title: 'Data Viz Storytelling',
    date: formatDate(dateOffsets[24]),
    time: '17:30',
    location: 'Hamra Analytics Loft, Beirut',
    capacity: 55,
    category: 'Technology',
    image:
      'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1200&q=80',
    description:
      'Workshop on crafting narratives with charts, dashboards, and ethical data framing.',
    attendees: [],
  },
  {
    id: 26,
    title: 'Sound Bath & Journaling',
    date: formatDate(dateOffsets[25]),
    time: '19:30',
    location: 'Badaro Lotus Studio, Beirut',
    capacity: 45,
    category: 'Wellness',
    image:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    description:
      'Crystal bowls, gentle breathwork, and reflective prompts to reset after a long week.',
    attendees: [],
  },
  {
    id: 27,
    title: 'Community Garden Day',
    date: formatDate(dateOffsets[26]),
    time: '09:00',
    location: 'Bikfaya Community Garden',
    capacity: 80,
    category: 'Community',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
    description:
      'Planting, mulching, and sharing harvest tips; tools provided, bring gloves if you have them.',
    attendees: [],
  },
  {
    id: 28,
    title: 'Women in Leadership Breakfast',
    date: formatDate(dateOffsets[27]),
    time: '08:00',
    location: 'Zalka Skyline Club',
    capacity: 90,
    category: 'Business',
    image:
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
    description:
      'Fireside chat with leaders across sectors on advocacy, sponsorship, and bold career moves.',
    attendees: [],
  },
  {
    id: 29,
    title: 'Street Photography Walk',
    date: formatDate(dateOffsets[28]),
    time: '17:00',
    location: 'Hamra to Manara Corniche, Beirut',
    capacity: 60,
    category: 'Arts',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
    description:
      'Golden-hour walk with composition prompts; any camera welcome, phones too.',
    attendees: [],
  },
  {
    id: 30,
    title: 'Teacher Tech Toolkit',
    date: formatDate(dateOffsets[29]),
    time: '15:00',
    location: 'Fanar District Training Center',
    capacity: 120,
    category: 'Education',
    image:
      'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80',
    description:
      'Try classroom-ready tools for engagement and assessment; leave with templates to reuse.',
    attendees: [],
  },
  {
    id: 31,
    title: 'Backend Reliability Meetup',
    date: formatDate(dateOffsets[30]),
    time: '18:30',
    location: 'Dbayeh Ops Garage',
    capacity: 70,
    category: 'Technology',
    image:
      'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1200&q=80',
    description:
      'Incident postmortems, SLO setting, and alert hygiene shared by SREs from local teams.',
    attendees: [],
  },
  {
    id: 32,
    title: 'Midtown Meditation Meetup',
    date: formatDate(dateOffsets[31]),
    time: '12:00',
    location: 'Martyrs Square, Downtown Beirut',
    capacity: 100,
    category: 'Wellness',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
    description:
      'Drop-in guided meditation with cushions provided and a short mindful walking loop.',
    attendees: [],
  },
  {
    id: 33,
    title: 'Block Party Build Crew',
    date: formatDate(dateOffsets[32]),
    time: '10:00',
    location: 'Achrafieh St. Nicolas Stairs',
    capacity: 140,
    category: 'Community',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
    description:
      'Set up stages, lights, and kid zones for the neighborhood summer block party.',
    attendees: [],
  },
  {
    id: 34,
    title: 'Customer Journey Mapping',
    date: formatDate(dateOffsets[33]),
    time: '17:00',
    location: 'Sin El Fil Design Hub',
    capacity: 55,
    category: 'Business',
    image:
      'https://images.unsplash.com/photo-1529333166433-4e0ea59b8b9b?auto=format&fit=crop&w=1200&q=80',
    description:
      'Workshop to map real customer paths and spot friction; bring a recent user story.',
    attendees: [],
  },
  {
    id: 35,
    title: 'Gallery Opening: New Voices',
    date: formatDate(dateOffsets[34]),
    time: '18:00',
    location: 'Saifi Village Canvas Collective',
    capacity: 130,
    category: 'Arts',
    image:
      'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80',
    description:
      'Emerging artists present mixed media works exploring identity, place, and rhythm.',
    attendees: [],
  },
  {
    id: 36,
    title: 'University Prep Bootcamp',
    date: formatDate(dateOffsets[35]),
    time: '09:00',
    location: 'Kaslik Scholars Hall',
    capacity: 160,
    category: 'Education',
    image:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
    description:
      'Essay polish, interview practice, and study planning for rising seniors and families.',
    attendees: [],
  },
  {
    id: 37,
    title: 'Quantum Computing 101',
    date: formatDate(dateOffsets[36]),
    time: '13:30',
    location: 'Hadat Tech Annex',
    capacity: 80,
    category: 'Technology',
    image:
      'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1200&q=80',
    description:
      'Intro session demystifying qubits, gates, and practical horizons with live simulators.',
    attendees: [],
  },
  {
    id: 38,
    title: 'Forest Bathing Retreat',
    date: formatDate(dateOffsets[37]),
    time: '08:30',
    location: 'Chouf Cedar Reserve Trailhead',
    capacity: 50,
    category: 'Wellness',
    image:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    description:
      'Slow guided walk through cedar trails with sensory prompts and quiet reflection.',
    attendees: [],
  },
  {
    id: 39,
    title: 'Civic Grants Workshop',
    date: formatDate(dateOffsets[38]),
    time: '11:00',
    location: 'Baabda City Hall Annex',
    capacity: 70,
    category: 'Community',
    image:
      'https://images.unsplash.com/photo-1529333166433-4e0ea59b8b9b?auto=format&fit=crop&w=1200&q=80',
    description:
      'Learn how to apply for city microgrants, with sample budgets and narrative templates.',
    attendees: [],
  },
  {
    id: 40,
    title: 'Scaling Operations Forum',
    date: formatDate(dateOffsets[39]),
    time: '16:30',
    location: 'Dbayeh Harborview Lounge',
    capacity: 90,
    category: 'Business',
    image:
      'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80',
    description:
      'Ops leaders trade notes on hiring, vendor stacks, and playbooks for predictable delivery.',
    attendees: [],
  },
];

export default initialEvents;
