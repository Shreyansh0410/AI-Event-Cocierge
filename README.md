# ✦ AI Event Concierge

A full-stack AI-powered platform that takes a natural language description of a corporate event and returns a structured venue proposal — powered by **Google Gemini**, stored in **Supabase**, and built with **React + Express**.

---

## Live Demo
🔗 [your-deployed-url.vercel.app](#) ← replace after deployment

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| AI | Google Gemini 1.5 Flash |
| Database | Supabase (PostgreSQL) |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Step-by-Step Local Setup

### STEP 1 — Prerequisites
Make sure you have installed:
- Node.js v18+ → https://nodejs.org
- Git → https://git-scm.com

---

### STEP 2 — Get a Gemini API Key (Free)
1. Go to https://aistudio.google.com
2. Sign in with your Google account
3. Click **"Get API Key"** → **"Create API key"**
4. Copy and save the key — you'll need it in Step 4

---

### STEP 3 — Set Up Supabase (Free)
1. Go to https://supabase.com and create a free account
2. Click **"New Project"** — give it a name, choose a region, set a password
3. Wait ~2 minutes for the project to provision
4. Go to **SQL Editor** (left sidebar) and run this SQL to create the table:

```sql
CREATE TABLE searches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_query TEXT NOT NULL,
  venue_name TEXT NOT NULL,
  location TEXT NOT NULL,
  estimated_cost TEXT NOT NULL,
  why_it_fits TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

5. Go to **Settings → API** (left sidebar)
6. Copy:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **anon/public** key (under "Project API keys")

---

### STEP 4 — Clone & Configure

```bash
git clone https://github.com/YOUR_USERNAME/ai-event-concierge.git
cd ai-event-concierge
```

**Configure the backend:**
```bash
cd server
cp .env.example .env
```

Open `server/.env` and fill in:
```
GEMINI_API_KEY=your_gemini_key_here
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
PORT=5000
```

**Configure the frontend:**
```bash
cd ../client
cp .env.example .env
```

Leave `client/.env` as-is for local dev (Vite's proxy handles routing to the backend).

---

### STEP 5 — Install Dependencies

```bash
# Install backend deps
cd server
npm install

# Install frontend deps
cd ../client
npm install
```

---

### STEP 6 — Run Locally

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# Server running on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# App running on http://localhost:5173
```

Open http://localhost:5173 in your browser. Type an event description and click "Plan Event →".

---

## Deployment

### Deploy Backend to Render (Free)

1. Push your code to GitHub (make sure repo is public)
2. Go to https://render.com → **New → Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
5. Under **Environment Variables**, add:
   - `GEMINI_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
6. Click **Deploy** — copy the live URL (e.g. `https://ai-event-concierge.onrender.com`)

### Deploy Frontend to Vercel (Free)

1. Go to https://vercel.com → **New Project** → Import your GitHub repo
2. Configure:
   - **Root Directory:** `client`
   - **Framework Preset:** Vite
3. Under **Environment Variables**, add:
   - `VITE_API_URL` = your Render backend URL (e.g. `https://ai-event-concierge.onrender.com`)
4. Click **Deploy** — your live URL is ready!

---

## Project Structure

```
ai-event-concierge/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.jsx      # Text input + example prompts
│   │   │   ├── ProposalCard.jsx   # Venue result display card
│   │   │   └── LoadingState.jsx   # Animated spinner + shimmer
│   │   ├── App.jsx                # Main app, state management
│   │   ├── main.jsx               # React entry point
│   │   └── index.css              # Tailwind + custom styles
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── server/                    # Express backend
    ├── routes/
    │   └── api.js                 # POST /api/suggest, GET /api/history
    ├── lib/
    │   └── supabase.js            # Supabase client
    └── index.js                   # Express server entry
```

---

## API Reference

### `POST /api/suggest`
Generate a venue proposal.

**Request body:**
```json
{ "query": "10-person leadership retreat in the mountains, 3 days, $4k budget" }
```

**Response:**
```json
{
  "id": "uuid",
  "user_query": "...",
  "venue_name": "The Lodge at Vail",
  "location": "Vail, Colorado, USA",
  "estimated_cost": "$3,500 – $4,000 total",
  "why_it_fits": "...",
  "created_at": "2025-01-01T00:00:00Z"
}
```

### `GET /api/history`
Returns all past searches, newest first.
