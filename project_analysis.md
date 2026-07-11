# 🧠 IntelliView – Full Project Analysis

## 📌 Project Overview

**IntelliView** is a full-stack, real-time **coding interview & practice platform** that combines collaborative coding sessions, a standalone problem-solving environment, competitive programming stats, contests, and AI-powered features — all in one app.

- **Live URL**: https://intelliview-mq2k.onrender.com
- **Deployment**: Render (free tier)
- **Monorepo structure**: `frontend/` + `backend/` under a single root

---

## 🗂️ Project Structure

```
IntelliView/
├── frontend/                  # React + Vite app
│   └── src/
│       ├── api/               # Axios API call wrappers
│       ├── components/        # Reusable UI components
│       │   └── CodeFolio/     # Portfolio feature sub-components
│       ├── data/              # Static problems data (problems.js)
│       ├── hooks/             # Custom React hooks
│       ├── lib/               # Utilities (piston, stream, axios, grok, admin)
│       ├── pages/             # Page-level components
│       ├── App.jsx            # Route definitions
│       └── main.jsx           # App entry point
│
└── backend/                   # Node.js + Express API
    ├── routes/                # Grok AI route (top-level)
    │   └── grok.js
    └── src/
        ├── controllers/       # Business logic
        ├── lib/               # DB, stream, env, inngest, codingPlatforms
        ├── middleware/        # Clerk auth middleware
        ├── models/            # Mongoose schemas
        ├── routes/            # Express route definitions
        └── server.js          # Entry point
```

---

## 🎨 Frontend

### Tech Stack
| Tool | Version | Purpose |
|------|---------|---------|
| React | 19.1.1 | UI framework |
| Vite | 7.1.7 | Build tool & dev server |
| Tailwind CSS | 4.1.18 | Utility-first styling |
| TanStack Query | 5.90 | Server state & caching |
| Clerk (React) | 5.59 | Authentication |
| Stream Video SDK | 1.24 | Real-time video calls |
| Stream Chat React | 13.9 | Real-time chat |
| Monaco Editor | 4.7 | VS Code-like code editor |
| React Router DOM | 7.11 | Client-side routing |
| Recharts | 2.12 | Charts & data visualizations |
| canvas-confetti | 1.9 | Success animations |
| react-resizable-panels | 3.0 | Resizable editor/output layout |
| Lucide React | 0.562 | Icon library |
| date-fns | 4.1 | Date formatting |
| html2canvas | 1.4 | Screenshot capability |

### Pages & Routes

| Route | Component | Access |
|-------|-----------|--------|
| `/` | `HomePage` | Public (redirects signed-in → `/dashboard`) |
| `/dashboard` | `DashboardPage` | 🔒 Protected |
| `/problems` | `ProblemsPage` | 🔒 Protected |
| `/problem/:id` | `ProblemPage` | 🔒 Protected |
| `/session/:id` | `SessionPage` | 🔒 Protected |
| `/contests` | `ContestsPage` | 🔒 Protected |
| `/resources` | `ResourcesPage` | 🔒 Protected |
| `/codefolio` | `CodeFolioPage` | 🔒 Protected |
| `/add-problem` | `AddProblem` | 🔒 Protected |

### Key Components

| Component | Purpose |
|-----------|---------|
| `Navbar.jsx` | Top navigation with user avatar, links |
| `ProblemDescription.jsx` | Renders problem statement, examples, hints, debug, YouTube |
| `CodeEditorPanel.jsx` | Monaco-based code editor with language selector |
| `OutputPanel.jsx` | Shows code execution results |
| `VideoCallUI.jsx` | Stream-powered video call interface |
| `CreateSessionsModal.jsx` | Form to create a new interview session |
| `JoinByCodeModal.jsx` | Join session via 8-character code |
| `JoinSessionModal.jsx` | Join session by browsing active ones |
| `ActiveSessions.jsx` | Lists user's active sessions |
| `RecentSessions.jsx` | Lists past completed sessions |
| `OngoingSession.jsx` | Card showing a live session in progress |
| `SessionPasswordDisplay.jsx` | Displays session invite code |
| `WelcomeSection.jsx` | Dashboard greeting widget |
| `StatsCard.jsx` | Generic stats display card |

### CodeFolio Sub-Components (Portfolio Feature)

| Component | Purpose |
|-----------|---------|
| `CodeFolioCard.jsx` | Main card container (largest file, 20KB) |
| `CodeFolioProfile.jsx` | User profile info across platforms |
| `CodeFolioStats.jsx` | Total questions, active days, streak |
| `CodeFolioProblems.jsx` | Donut chart: Easy/Medium/Hard breakdown |
| `CodeFolioContests.jsx` | Contest count, rating, rankings table |
| `CodeFolioDSA.jsx` | Bar chart of DSA topic-wise progress |
| `CodeFolioHeatmap.jsx` | Activity heatmap calendar |
| `GitHubStats.jsx` | GitHub stats integration (13KB) |
| `ContestRankings.jsx` | Cross-platform contest ranking table |
| `UsernameSetupModal.jsx` | Modal to link coding platform usernames |

### Custom Hooks

| Hook | Purpose |
|------|---------|
| `useSessions.js` | Wraps all session CRUD via TanStack Query |
| `useStreamClient.js` | Initializes Stream video/chat client |
| `useCodeFolio.js` | Fetches multi-platform coding stats |

### Frontend API Layer (`src/api/`)
- `sessions.js` — Create, join, leave, end session calls
- `problems.js` — Get all problems, get problem by ID
- `codefolio.js` — Fetch per-platform & all-platform stats
- `youtube.js` — Search YouTube for problem solutions

### Frontend Lib (`src/lib/`)
- `piston.js` — Code execution via **Piston API** (Python 3.10, Java 15, C++ 10.2)
- `stream.js` — Singleton Stream video client factory
- `grok.js` — Calls backend `/api/grok/hint` for AI hints
- `axios.js` — Configured Axios instance with base URL
- `admin.js` — Admin user check utility
- `utils.js` — `getDifficultyBadgeClass()` helper

---

## ⚙️ Backend

### Tech Stack
| Tool | Version | Purpose |
|------|---------|---------|
| Node.js + Express | 5.2.1 | REST API server |
| Mongoose | 9.0.2 | MongoDB ODM |
| Clerk (Express) | 1.7.60 | Auth middleware (`requireAuth`) |
| Inngest | 3.44.3 | Background job / webhook processing |
| stream-chat | 9.27 | Chat channel management |
| @stream-io/node-sdk | 0.7.32 | Video call management |
| dotenv | 17.2.3 | Environment config |

### Database Models (MongoDB via Mongoose)

#### `User`
```js
{ name, email, profileImage, clerkId, codefolioUsernames: {
    leetcode, codeforces, codechef, location, university, about
  }, timestamps }
```

#### `Session`
```js
{ problem (String), difficulty (easy|medium|hard), host (→User),
  participant (→User), status (active|completed), callId (Stream),
  sessionCode (unique 8-char), timestamps }
```

#### `Problem`
```js
{ id, title, difficulty (Easy|Medium|Hard), category, description: {text, notes[]},
  examples[], constraints[], starterCode: {python,java,cpp},
  expectedOutput: {python,java,cpp}, createdBy (→User), timestamps }
```

### API Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/sessions` | ✅ | Create interview session |
| GET | `/api/sessions/active` | ✅ | Count active sessions |
| GET | `/api/sessions/my-active` | ✅ | Host's active sessions |
| GET | `/api/sessions/my-recent` | ✅ | Past completed sessions |
| POST | `/api/sessions/join/code/:code` | ✅ | Join by 8-char code |
| GET | `/api/sessions/:id` | ✅ | Get session details |
| POST | `/api/sessions/:id/join` | ✅ | Join session by ID |
| POST | `/api/sessions/:id/leave` | ✅ | Participant leaves |
| POST | `/api/sessions/:id/end` | ✅ | Host ends session |
| GET | `/api/problems` | — | List all problems |
| GET | `/api/problems/:id` | — | Get problem by ID |
| POST | `/api/problems` | ✅ | Add new problem (Admin) |
| POST | `/api/grok/hint` | — | AI hint generation |
| GET | `/api/youtube/search` | — | YouTube video search |
| GET | `/api/codefolio/platform` | — | Single platform stats |
| POST | `/api/codefolio/all` | — | All platforms stats |
| GET | `/api/codefolio/usernames` | ✅ | Get user's linked usernames |
| POST | `/api/codefolio/usernames` | ✅ | Save user's linked usernames |
| POST/GET | `/api/chat` | — | Chat token generation |
| POST | `/api/inngest` | — | Inngest webhook receiver |

### Auth Middleware (`protectRoute`)
Two-step guard:
1. `requireAuth()` from `@clerk/express` validates the JWT
2. Custom middleware looks up the MongoDB `User` by `clerkId` and attaches `req.user`

### Background Jobs (Inngest)
Event-driven functions triggered by Clerk webhooks:
- **`clerk/user.created`** → Create MongoDB `User` + upsert Stream user
- **`clerk/user.deleted`** → Delete MongoDB `User` + delete Stream user

### External Platform Integrations (`codingPlatforms.js`)
| Platform | Method | Notes |
|----------|--------|-------|
| **LeetCode** | GraphQL API (2 queries) | Stats + contest ranking |
| **Codeforces** | REST API (3 endpoints) | Rating, solved problems, active days |
| **CodeChef** | REST API (placeholder) | Needs API key |
| **GeeksforGeeks** | REST API | Needs auth token |

---

## 🔌 Third-Party Integrations

| Service | Role |
|---------|------|
| **Clerk** | Full authentication (sign-up, sign-in, session management, webhooks) |
| **Stream.io** | Real-time video calls (`StreamVideoClient`) + chat channels (`StreamChat`) |
| **Inngest** | Background job runner for Clerk webhooks → DB + Stream sync |
| **Piston API** | Sandboxed code execution (Python, Java, C++) |
| **Groq API** | AI hint generation (model: `openai/gpt-oss-120b`) |
| **YouTube Data API v3** | Search and embed tutorial videos per problem |
| **MongoDB Atlas** | Primary database |
| **Render** | Production hosting (both frontend served as static from backend) |

---

## 🔄 Data Flow Diagrams

### New User Registration
```
User signs up on Clerk
    → Clerk fires webhook → Inngest
        → Inngest: creates MongoDB User
        → Inngest: upserts Stream user (chat + video)
```

### Interview Session Lifecycle
```
Host creates session (POST /api/sessions)
    → MongoDB Session created (status: active)
    → Stream video call created
    → Stream chat channel created

Participant joins (POST /api/sessions/:id/join OR /join/code/:code)
    → Session.participant updated
    → Participant added to Stream chat channel

Session live:
    → Video: @stream-io/video-react-sdk
    → Chat: stream-chat-react
    → Code sync: Stream chat messages (code_sync events)

Host ends session (POST /api/sessions/:id/end)
    → Stream video call deleted (hard)
    → Stream chat channel deleted
    → Session.status = "completed"
```

### Code Execution Flow
```
User clicks "Run" in ProblemPage or SessionPage
    → executeCode(language, code) called
        → POST https://emkc.org/api/v2/piston/execute
        → Returns { output, stderr }
    → Output displayed in OutputPanel
    → If output matches expectedOutput → success + confetti
```

### AI Hint Flow
```
User clicks "Get Hint" in ProblemDescription
    → POST /api/grok/hint { prompt: problemTitle + description }
        → Groq API: generates 3 progressive hints
        → Parsed with regex → returned as hints[]
    → Hints revealed progressively in UI
```

---

## 📊 Feature Matrix

| Feature | Status | Notes |
|---------|--------|-------|
| Authentication (Clerk) | ✅ Complete | Sign up/in, session protection |
| Dashboard | ✅ Complete | Stats, active/recent sessions |
| Problem Listing | ✅ Complete | Filter by difficulty, category |
| Problem Solving Page | ✅ Complete | Monaco editor, Piston execution, test validation |
| YouTube Video Solutions | ✅ Complete | Embedded via YouTube API |
| AI Hints (Groq) | ✅ Complete | 3 progressive hints per problem |
| Admin Add Problem | ✅ Complete | Protected admin-only route |
| Live Interview Sessions | ✅ Complete | Stream video + chat + code sync |
| Join by Code | ✅ Complete | 8-char unique session code |
| CodeFolio (Portfolio) | ✅ Complete | LeetCode, CF stats; GFG/CodeChef placeholder |
| GitHub Stats | ✅ Complete | GitHub API integration in GitHubStats |
| Contests Page | ✅ Complete | Upcoming contest listing |
| Resources Page | ✅ Complete | Curated article library |
| Background Jobs | ✅ Complete | Inngest sync on user create/delete |
| Production Deployment | ✅ Complete | Render with static frontend serving |
| AI Mock Interviews | 🚧 Planned | Not yet implemented |
| Performance Analytics | 🚧 Planned | Not yet implemented |
| Redis Caching | 🚧 Planned | Not yet implemented |

---

## 🐛 Observations & Potential Issues

> [!WARNING]
> **Grok route placement**: `backend/routes/grok.js` lives outside `backend/src/` — inconsistent with all other routes in `backend/src/routes/`. This is a minor structural inconsistency.

> [!WARNING]
> **CodeChef & GFG APIs**: Both are placeholders — CodeChef points to `/api/contests/:username` (wrong endpoint), and GFG endpoint may not return structured data reliably.

> [!NOTE]
> **Code sync via Stream chat**: Real-time collaborative code editing is implemented by sending code as chat messages (not via CRDT/OT). Works for two users but may have race conditions with simultaneous edits.

> [!NOTE]
> **Static problems in `/src/data/problems.js`**: Problems exist both as static JS data AND in MongoDB. SessionPage merges both sources; consistency should be monitored.

> [!NOTE]
> **Session code uniqueness**: Loop-retry approach for generating unique 8-char codes works but could be replaced with UUID for robustness at scale.

> [!TIP]
> **No rate limiting**: The backend has no rate limiting middleware (e.g., express-rate-limit). The Groq and YouTube API endpoints are especially vulnerable to abuse.

> [!TIP]
> **TanStack Query caching**: `useSessionById` refetches every 5 seconds — works for real-time status detection but is polling-based. WebSockets (already available via Stream) could replace this.

---

## 📦 Root-Level Build Script

The root `package.json` contains a deployment-oriented build script to:
1. Install backend `node_modules`
2. Install frontend `node_modules`
3. Build the React app (`vite build`)

In production, Express serves the built frontend from `../frontend/dist`.

---

## 🏗️ Architecture Summary

```
┌─────────────────────────────────────────┐
│              CLIENT (React)              │
│  Clerk Auth │ TanStack Query │ Stream SDK│
└──────────────────┬──────────────────────┘
                   │ REST API
┌──────────────────▼──────────────────────┐
│           BACKEND (Express 5)            │
│  Clerk Middleware │ Inngest │ Controllers│
└────────┬─────────┴─────┬────────────────┘
         │               │
┌────────▼──┐    ┌───────▼──────┐
│  MongoDB  │    │  Stream.io   │
│ (Mongoose)│    │ Video + Chat │
└───────────┘    └──────────────┘
         │
┌────────▼──────────────────────────────┐
│         External APIs                  │
│  Groq │ YouTube │ Piston │ LeetCode   │
│  CodeForces │ GitHub │ Inngest Cloud  │
└────────────────────────────────────────┘
```
