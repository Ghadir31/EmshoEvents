# EmshoEvents

EmshoEvents is a full-stack event management app. Users can browse events, view details, and register as attendees. Admins can log in to create, update, or delete events. The frontend is a React single-page app, and the backend exposes REST endpoints backed by MySQL.

## Features
- Browse and filter events by category, timeline, and location.
- View event details with capacity status and attendee list.
- Self-registration for events with duplicate and capacity checks.
- Admin authentication (JWT) for creating, editing, and deleting events.
- Image/category fallbacks to keep cards looking complete.

## Tech stack
- Frontend: React (react-router, Context API), Bootstrap 5, fetch for API calls.
- Backend: Node.js + Express with JWT auth, bcrypt, CORS, and MySQL queries.
- Database: MySQL.
- Deployment: Railway (backend and database).

## Project structure
- `frontend/` React SPA (this folder).
- `backend/index.js` Express API (auth, events, attendees).
- `postrgres-converted-data/data.sql` sample dataset.

## Prerequisites
- Node.js 18+ and npm.
- MySQL instance (local or hosted). Create a database (e.g., `emshoevents`) and import `postrgres-converted-data/data.sql` if desired.

## Environment variables
- Frontend: `REACT_APP_API_URL` (defaults to `http://localhost:3001`).
- Backend (see `backend/index.js`): `JWT_SECRET`, DB connection settings (`host`, `user`, `password`, `database`).

## Setup
```bash
# from repo root
cd backend
npm install

cd ../frontend
npm install
```

## Running locally
Backend (port 3001):
```bash
cd backend
npm run dev   # or npm start
```

Frontend (port 3000):
```bash
cd frontend
npm start
```
The frontend points at `REACT_APP_API_URL`; make sure it matches your backend URL.

## Key scripts (frontend)
- `npm start` — run the React dev server.
- `npm run build` — production build to `build/`.
- `npm test` — CRA test runner (none added yet).

## Notable flows to reference
- Auth context and API calls: `src/context/AuthContext.js`
- Event data fetch/create/update/delete: `src/context/EventContext.js`
- Event browsing and card rendering: `src/pages/BrowseEvents.js`, `src/components/EventCard.js`
- Event detail + registration UI: `src/pages/EventDetail.js`
