# MovieWatcher 🎬

A premium, modern OTT (Over-The-Top) streaming web application. Built entirely on the frontend using React and Vite, this platform offers a seamless, Netflix-style experience with zero backend infrastructure required.

## 🌟 Key Features
- **Premium Glassmorphic UI**: High-end interface featuring horizontal scrolling tabs, dynamic hero banners, and smooth CSS micro-animations.
- **Auto-Probing Streaming Engine**: Dynamically queries a list of 35+ streaming servers in real-time, automatically bypassing dead links to find the fastest, highest-quality stream.
- **Smart "Continue Watching"**: Automatically tracks playback progress, saving the exact season, episode, and preferred streaming server to local storage.
- **Multi-Profile Support**: Built-in profile management system allowing multiple users to maintain independent watchlists and watch histories on a single device.
- **100% Serverless**: Operates purely in the browser by leveraging the TMDB API for metadata and direct iframe embedding for video delivery.

---

## 🛠️ Tech Stack & Architecture
- **Framework**: React 18
- **Build Tool**: Vite (Lightning fast HMR)
- **Routing**: React Router DOM (v6)
- **Styling**: Vanilla CSS (CSS Variables, Flexbox/Grid, Glassmorphism)
- **Icons**: Lucide React
- **Data Source**: TMDB (The Movie Database) API V3

### Directory Structure
```
src/
├── components/    # Reusable UI (MovieCard, Row, Banner, LiveTVCard)
├── context/       # Global State (UserContext for Profiles & History)
├── pages/         # Route Views (Home, Player, Profiles, LiveTV)
├── services/      # Core Logic
│   ├── tmdb.js      # TMDB API fetching and formatting
│   ├── providers.js # The Auto-Probing Engine & Server List
│   └── storage.js   # LocalStorage data persistence layer
└── index.css      # Global design tokens and styles
```

---

## 🚀 Developer Setup

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 2. Clone & Install
```bash
git clone https://github.com/yourusername/moviewatcher.git
cd moviewatcher
npm install
```

### 3. Environment Variables
The application requires a free TMDB API key to fetch movie/TV metadata, posters, and trending lists.
1. Create a TMDB account at [themoviedb.org](https://www.themoviedb.org/).
2. Navigate to Settings > API and generate a Read Access Token (V3).
3. Create a `.env` file in the root directory:
```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

### 4. Run the Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

---

## 🧠 How the Auto-Probing Engine Works
Unlike traditional apps that hardcode a single video iframe, MovieWatcher uses an intelligent fallback system located in `src/services/providers.js`. 

When a user clicks a movie:
1. The app maps over an array of known streaming providers (e.g., Vidsrc, SuperStream, 2Embed).
2. It constructs the URL for each provider using the movie's TMDB/IMDB ID.
3. It performs a lightweight `fetch()` or iframe `onload` check against the servers in parallel.
4. The first server to return a successful `200 OK` response is immediately locked in, and the video begins playing.
5. If the user manually changes the server via the UI dropdown, their preference is saved to `localStorage` and prioritized for future streams.

To add a new server, simply append it to the `STREAM_PROVIDERS` array in `providers.js` with its URL schema!

---

## 🌍 Deployment

This app is a Single Page Application (SPA) that can be hosted entirely for free on platforms like Vercel or Netlify.

### Vercel (Highly Recommended)
Vercel is optimized for Vite and handles SPA routing out of the box using the included `vercel.json` file.
1. Install the Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the root directory.
3. Add your `VITE_TMDB_API_KEY` when prompted for Environment Variables.

### Netlify
The repository includes a `public/_redirects` file which tells Netlify to redirect all 404s to `index.html`, ensuring React Router works perfectly.
1. Connect your GitHub repository to Netlify.
2. Set the Build Command to `npm run build` and the Publish Directory to `dist`.
3. Add `VITE_TMDB_API_KEY` to the Environment Variables settings.

---
*Made with ❤️ for S.*
