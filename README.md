# Music Streaming App (MERN + TailwindCSS)

This project is a full-stack starter for a music streaming app with:
- music discovery and search
- playlist management
- streaming player UI
- likes/comments
- download endpoint for offline listening

## Tech Stack
- MongoDB + Mongoose
- Express.js + Node.js
- React (Vite) + React Router
- TailwindCSS

## Project Structure
- `backend/` - API, auth, tracks, playlists, static audio hosting
- `frontend/` - UI for browse/search/playlists/player interactions

## Backend Setup
1. Copy `backend/.env.example` to `backend/.env`
2. Update values in `.env` (especially `MONGO_URI` and `JWT_SECRET`)
3. Start backend:
   - `cd backend`
   - `npm run dev`

## Frontend Setup
1. Start frontend:
   - `cd frontend`
   - `npm run dev`
2. Open the URL shown by Vite (default `http://localhost:5173`)

## Core Implemented APIs
- Auth:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
- Tracks:
  - `GET /api/tracks?q=&genre=`
  - `GET /api/tracks/recommendations`
  - `POST /api/tracks` (auth + audio upload)
  - `PUT /api/tracks/:id/like` (auth)
  - `POST /api/tracks/:id/comments` (auth)
  - `GET /api/download/:filename`
- Playlists:
  - `GET /api/playlists` (auth)
  - `POST /api/playlists` (auth)
  - `PUT /api/playlists/:id` (auth)
  - `DELETE /api/playlists/:id` (auth)
  - `PUT /api/playlists/:id/like` (auth)
  - `POST /api/playlists/:id/comments` (auth)

## Current Frontend Capabilities
- Track listing and search (song/artist/album/movie text + genre filter)
- Playback using `react-h5-audio-player` (with skip controls)
- Likes/comments and music download action
- Playlist create/list screen
- Social links (Facebook, Twitter, Instagram)

## Next Improvements Recommended
- Add proper auth UI (register/login pages and route guards)
- Add playlist track add/remove from track cards
- Add upload UI for admin/creator track publishing
- Add persistent recommendation logic based on user behavior
- Add streaming quality selector (bitrate variants) and analytics
