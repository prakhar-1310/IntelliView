# IntelliView — Backend System Architecture

> A comprehensive architectural breakdown of the IntelliView backend: a Node.js/Express platform powering real-time coding interviews, AI-assisted practice, and competitive coding portfolio analytics.

---

## 1. High-Level Architecture Overview

```mermaid
graph TB
    subgraph Client["Client Layer"]
        FE["React Frontend<br/>(Vite + TailwindCSS)"]
    end

    subgraph Gateway["API Gateway Layer"]
        EXP["Express.js Server<br/>(Port 3000)"]
        CORS["CORS Middleware"]
        CLERK_MW["Clerk Auth Middleware"]
        PROTECT["protectRoute Middleware"]
    end

    subgraph Services["Service / Domain Layer"]
        SESS["Session Service"]
        PROB["Problem Service"]
        CHAT["Chat Service"]
        GROK_SVC["AI / Grok Service"]
        EXEC["Code Execution Service"]
        CODEFOLIO["CodeFolio Service"]
        INTERVIEW["Mock Interview Service"]
        YT["YouTube Service"]
    end

    subgraph External["External Services"]
        CLERK["Clerk<br/>(Auth Provider)"]
        STREAM_VID["Stream Video<br/>(Video Calls)"]
        STREAM_CHAT["Stream Chat<br/>(Messaging)"]
        GROQ["Groq API<br/>(LLM Inference)"]
        GEMINI["Google Gemini<br/>(Visual Analysis)"]
        INNGEST_SVC["Inngest<br/>(Background Jobs)"]
        YTAPI["YouTube Data API v3"]
        LC["LeetCode GraphQL"]
        CF["Codeforces API"]
        CC["CodeChef API"]
        GFG["GeeksforGeeks API"]
    end

    subgraph Data["Data Layer"]
        MONGO[("MongoDB Atlas<br/>(Mongoose ODM)")]
    end

    FE <-->|"REST API + JWT"| EXP
    EXP --> CORS
    EXP --> CLERK_MW
    CLERK_MW --> PROTECT
    PROTECT --> Services

    SESS --> STREAM_VID
    SESS --> STREAM_CHAT
    CHAT --> STREAM_CHAT
    GROK_SVC --> GROQ
    GROK_SVC --> GEMINI
    YT --> YTAPI
    CODEFOLIO --> LC
    CODEFOLIO --> CF
    CODEFOLIO --> CC
    CODEFOLIO --> GFG
    INNGEST_SVC --> CLERK

    Services --> MONGO
```

---

## 2. Layer-by-Layer Breakdown

### 2.1 Entry Point & Server Bootstrap

```mermaid
flowchart LR
    A["server.js"] --> B["dotenv.config()"]
    B --> C["connectDB()"]
    C --> D["Register Middleware"]
    D --> E["Mount Routes"]
    E --> F["app.listen(PORT)"]
    D --> G["Serve Static<br/>(Production Only)"]
```

| File | Purpose |
|------|---------|
| [server.js](file:///d:/project/IntelliView/backend/src/server.js) | Application entry point — bootstraps Express, connects to MongoDB, registers all middleware and routes |
| [env.js](file:///d:/project/IntelliView/backend/src/lib/env.js) | Centralised environment variable accessor (PORT, DB_URL, NODE_ENV, keys) |
| [db.js](file:///d:/project/IntelliView/backend/src/lib/db.js) | Mongoose connection to MongoDB Atlas with graceful exit on failure |

---

### 2.2 Middleware Pipeline

Every incoming request passes through this pipeline:

```mermaid
flowchart LR
    REQ["Incoming Request"] --> JSON["express.json()"]
    JSON --> CORS["CORS<br/>(All Origins)"]
    CORS --> CLERK["clerkMiddleware()<br/>(Attaches req.auth)"]
    CLERK --> ROUTE["Route Handler"]
    ROUTE -->|"Protected?"| PROTECT["protectRoute"]
    PROTECT --> P1["requireAuth()<br/>(Clerk)"]
    P1 --> P2["Lookup User<br/>in MongoDB"]
    P2 --> P3["Attach req.user"]
    P3 --> CTRL["Controller"]
```

| Middleware | File | Description |
|------------|------|-------------|
| `express.json()` | Built-in | Parses JSON request bodies |
| `cors()` | Built-in | Currently allows all origins for dev flexibility |
| `clerkMiddleware()` | [server.js#L37](file:///d:/project/IntelliView/backend/src/server.js#L37) | Attaches `req.auth()` with Clerk session data |
| `protectRoute` | [protectRoute.js](file:///d:/project/IntelliView/backend/src/middleware/protectRoute.js) | Composed middleware: `requireAuth()` → DB user lookup → `req.user` attachment |

> [!IMPORTANT]
> The `protectRoute` middleware is a **two-step composed array**: first Clerk's `requireAuth()` validates the JWT, then a custom function resolves the Clerk ID to a MongoDB User document and attaches it as `req.user`.

---

### 2.3 Route Registry

All routes are mounted on the Express app in [server.js](file:///d:/project/IntelliView/backend/src/server.js):

| Prefix | Route File | Auth | Domain |
|--------|-----------|------|--------|
| `/api/inngest` | Inngest Serve | — | Webhook handler for Inngest events |
| `/api/chat` | [chatRoutes.js](file:///d:/project/IntelliView/backend/src/routes/chatRoutes.js) | ✅ Protected | Stream chat token generation |
| `/api/sessions` | [sessionRoutes.js](file:///d:/project/IntelliView/backend/src/routes/sessionRoutes.js) | ✅ Protected | Live interview room management |
| `/api/problems` | [problemRoutes.js](file:///d:/project/IntelliView/backend/src/routes/problemRoutes.js) | Mixed | Coding problem CRUD |
| `/api/youtube` | [youtubeRoutes.js](file:///d:/project/IntelliView/backend/src/routes/youtubeRoutes.js) | ❌ Public | YouTube video search proxy |
| `/api/grok` | [grok.js](file:///d:/project/IntelliView/backend/routes/grok.js) | ❌ Public | AI hints, problem generation, interview Q&A |
| `/api/codefolio` | [codefolioRoutes.js](file:///d:/project/IntelliView/backend/src/routes/codefolioRoutes.js) | Mixed | Coding platform stats aggregation |
| `/api/interview` | [interviewRoutes.js](file:///d:/project/IntelliView/backend/src/routes/interviewRoutes.js) | ✅ Protected | Mock interview history & reports |
| `/api/execute` | [executeRoutes.js](file:///d:/project/IntelliView/backend/routes/executeRoutes.js) | ❌ Public | Local code execution engine |

> [!NOTE]
> Two route files (`grok.js`, `executeRoutes.js`) live in `backend/routes/` (outside `src/`), while the rest live in `backend/src/routes/`. This is an inconsistency worth noting.

---

## 3. Domain Services — Detailed Architecture

### 3.1 Authentication & User Management

```mermaid
sequenceDiagram
    participant Clerk
    participant Inngest
    participant MongoDB
    participant Stream

    Clerk->>Inngest: clerk/user.created webhook
    Inngest->>MongoDB: Create User document
    Inngest->>Stream: Upsert Stream user (chat + video)

    Clerk->>Inngest: clerk/user.deleted webhook
    Inngest->>MongoDB: Delete User by clerkId
    Inngest->>Stream: Delete Stream user
```

| Component | Details |
|-----------|---------|
| **Auth Provider** | [Clerk](https://clerk.com) — handles signup, login, session tokens, JWT verification |
| **User Sync** | [inngest.js](file:///d:/project/IntelliView/backend/src/lib/inngest.js) — Inngest functions react to Clerk webhooks to sync users to MongoDB + Stream |
| **User Model** | [User.js](file:///d:/project/IntelliView/backend/src/models/User.js) — `name`, `email`, `profileImage`, `clerkId`, `codefolioUsernames` |

**Data Flow:**
1. User signs up via Clerk on frontend
2. Clerk fires `clerk/user.created` webhook → Inngest endpoint
3. Inngest function creates MongoDB User + Stream user
4. On deletion, reverse sync cleans up both stores

---

### 3.2 Live Interview Session System

```mermaid
flowchart TB
    subgraph Create["Create Session"]
        C1["POST /api/sessions"] --> C2["Validate input"]
        C2 --> C3["Check no active session"]
        C3 --> C4["Generate callId + sessionCode"]
        C4 --> C5["Save Session to MongoDB"]
        C5 --> C6["Create Stream Video Call"]
        C6 --> C7["Create Stream Chat Channel"]
    end

    subgraph Join["Join Session"]
        J1["POST /api/sessions/:id/join<br/>POST /api/sessions/join/code/:code"] --> J2["Validate session active"]
        J2 --> J3["Check not host"]
        J3 --> J4["Check not full (max 2)"]
        J4 --> J5["Set participant"]
        J5 --> J6["Add to Stream Chat"]
    end

    subgraph End["End Session"]
        E1["POST /api/sessions/:id/end"] --> E2["Verify host"]
        E2 --> E3["Delete Stream Video Call"]
        E3 --> E4["Delete Stream Chat Channel"]
        E4 --> E5["Mark status = completed"]
    end
```

| Resource | Endpoint | Method | Auth |
|----------|----------|--------|------|
| Create session | `/api/sessions` | POST | ✅ |
| Active sessions count | `/api/sessions/active` | GET | ✅ |
| My active sessions | `/api/sessions/my-active` | GET | ✅ |
| My recent sessions | `/api/sessions/my-recent` | GET | ✅ |
| Join by code | `/api/sessions/join/code/:code` | POST | ✅ |
| Get session | `/api/sessions/:id` | GET | ✅ |
| Join session | `/api/sessions/:id/join` | POST | ✅ |
| Leave session | `/api/sessions/:id/leave` | POST | ✅ |
| End session | `/api/sessions/:id/end` | POST | ✅ |

**Key Design Decisions:**
- Sessions have a strict **2-participant limit** (host + 1 participant)
- Each session generates a unique **8-character alphanumeric code** for easy sharing
- Stream Video + Chat are created/destroyed with the session lifecycle
- Only the **host** can end a session; only **participants** can leave

**Session Model** ([Session.js](file:///d:/project/IntelliView/backend/src/models/Session.js)):
- `problem` (String), `difficulty` (enum), `host` (User ref), `participant` (User ref), `status` (active/completed), `callId` (Stream), `sessionCode` (unique index)

---

### 3.3 Coding Problem System

```mermaid
flowchart LR
    subgraph CRUD["Problem CRUD"]
        P1["POST /api/problems"] -->|"protectRoute"| CREATE["Create Problem"]
        P2["GET /api/problems"] --> LIST["List All (public)"]
        P3["GET /api/problems/:id"] --> GET["Get by ID (public)"]
        P4["PUT /api/problems/:id"] -->|"protectRoute"| UPDATE["Update"]
        P5["DELETE /api/problems/:id"] -->|"protectRoute"| DELETE["Delete"]
    end

    subgraph AI["AI Problem Generation"]
        G1["POST /api/grok/problem/generate"] --> GROQ["Groq API<br/>llama-3.3-70b"]
        GROQ --> PARSE["Parse JSON Response"]
        PARSE --> RES["Return Problem Object"]
    end
```

**Problem Model** ([Problem.js](file:///d:/project/IntelliView/backend/src/models/Problem.js)):

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (unique) | Custom problem identifier |
| `title` | String | Display title |
| `difficulty` | Enum: Easy/Medium/Hard | Difficulty level |
| `category` | String | Topic category |
| `description` | `{ text, notes[] }` | Problem statement |
| `examples` | Array of `{ input, output, explanation }` | Sample test cases |
| `constraints` | String[] | Problem constraints |
| `starterCode` | `{ python, java, cpp }` | Per-language starter code |
| `expectedOutput` | `{ python, java, cpp }` | Per-language expected output |
| `createdBy` | User ObjectId | Author reference |

---

### 3.4 Code Execution Engine

```mermaid
flowchart TB
    REQ["POST /api/execute"] --> VAL["Validate input"]
    VAL --> TEMP["Create temp dir<br/>(os.tmpdir/intelliview_exec/UUID)"]

    TEMP --> PY{"Python?"}
    TEMP --> JAVA{"Java?"}
    TEMP --> CPP{"C++?"}

    PY -->|"Yes"| PY1["Write main.py"]
    PY1 --> PY2["exec: python main.py"]

    JAVA -->|"Yes"| J1["Extract class name"]
    J1 --> J2["Write ClassName.java"]
    J2 --> J3["exec: javac ClassName.java"]
    J3 -->|"Success"| J4["exec: java -cp . ClassName"]

    CPP -->|"Yes"| C1["Write main.cpp"]
    C1 --> C2["exec: g++ main.cpp -o main.exe"]
    C2 -->|"Success"| C3["exec: ./main.exe"]

    PY2 --> CLEANUP["Cleanup temp dir"]
    J4 --> CLEANUP
    C3 --> CLEANUP
    CLEANUP --> RESPONSE["Return {run: {success, output, error}}"]
```

> [!WARNING]
> The code execution engine uses `child_process.exec()` directly on the server. This is a **significant security concern** in production — arbitrary code execution without sandboxing. A containerised execution environment (e.g., Docker, Firecracker) is strongly recommended.

**Features:**
- **15-second timeout** on all executions
- **Compiler availability check** via `GET /api/execute/compilers`
- Supports **Python, Java, C++**
- Temporary files are cleaned up in `finally` block

---

### 3.5 AI Services (Grok/Groq + Gemini)

```mermaid
flowchart TB
    subgraph Hints["AI Hint Generation"]
        H1["POST /api/grok/hint"] --> H2["Construct multi-hint prompt"]
        H2 --> H3["Groq API<br/>openai/gpt-oss-120b"]
        H3 --> H4["Parse 3 progressive hints"]
    end

    subgraph ProbGen["Problem Generation"]
        PG1["POST /api/grok/problem/generate"] --> PG2["Construct problem prompt"]
        PG2 --> PG3["Groq API<br/>llama-3.3-70b-versatile"]
        PG3 --> PG4["Parse JSON problem"]
    end

    subgraph Interview["Mock Interview AI"]
        IQ["POST /api/grok/interview/questions"] --> IQ2["Generate N questions"]
        IQ2 --> IQ3["Groq API<br/>openai/gpt-oss-120b"]

        IE["POST /api/grok/interview/evaluate"] --> IE2["Evaluate answers<br/>(parallel)"]
        IE2 --> IE3["Groq API<br/>(Text Evaluation)"]
        IE2 --> IE4["Gemini 2.5 Flash<br/>(Visual Analysis)"]
        IE3 --> IE5["Merge Results"]
        IE4 --> IE5
    end
```

| Endpoint | AI Model | Purpose |
|----------|----------|---------|
| `POST /api/grok/hint` | `openai/gpt-oss-120b` (Groq) | Generate 3 progressive coding hints |
| `POST /api/grok/problem/generate` | `llama-3.3-70b-versatile` (Groq) | Generate complete coding problems |
| `POST /api/grok/interview/questions` | `openai/gpt-oss-120b` (Groq) | Generate interview questions with ideal answers |
| `POST /api/grok/interview/evaluate` | `openai/gpt-oss-120b` (Groq) + `gemini-2.5-flash` (Google) | Evaluate answers + visual analysis of video frames |

**Interview Evaluation — Dual AI Pipeline:**
1. **Groq** evaluates text answers → scores, feedback, strengths, improvements
2. **Gemini** (optional) analyses video frames → nervousness, eye contact, attire assessment
3. Results are merged via `Promise.all()` for parallel execution

---

### 3.6 Mock Interview Persistence

```mermaid
flowchart LR
    SAVE["POST /api/interview/save"] --> CREATE["Create MockInterview<br/>with merged analysis"]
    HIST["GET /api/interview/history"] --> FIND["Find by user<br/>(last 20, sorted)"]
    DETAIL["GET /api/interview/:id"] --> ONE["Find by ID + user"]
```

**MockInterview Model** ([MockInterview.js](file:///d:/project/IntelliView/backend/src/models/MockInterview.js)):

| Field | Type | Notes |
|-------|------|-------|
| `user` | User ObjectId | Owner |
| `topic`, `topicLabel` | String | Interview topic |
| `difficulty` | Enum | Easy/Medium/Hard |
| `questionCount` | Number | Total questions |
| `questions[]` | `{id, question, idealAnswer}` | Generated questions |
| `answers[]` | String[] | Candidate responses |
| `overallScore` | Number (0-100) | AI-evaluated score |
| `grade` | String | A+ through F |
| `summary` | String | Overall assessment |
| `strengths[]`, `areasToImprove[]` | String[] | Categorised feedback |
| `questionAnalysis[]` | Embedded schema | Per-question deep analysis |
| `visualAnalysis` | `{nervousness, eyeContact, attire, feedback}` | Gemini visual assessment |

---

### 3.7 CodeFolio — Multi-Platform Stats Aggregator

```mermaid
flowchart TB
    subgraph API["CodeFolio API"]
        S1["GET /api/codefolio/platform?platform=X&username=Y"]
        S2["POST /api/codefolio/all"]
        S3["POST /api/codefolio/usernames"]
        S4["GET /api/codefolio/usernames"]
    end

    subgraph Platforms["External Platform APIs"]
        LC["LeetCode<br/>(GraphQL)"]
        CF["Codeforces<br/>(REST)"]
        CC["CodeChef<br/>(REST)"]
        GFG["GeeksforGeeks<br/>(REST)"]
    end

    S1 --> LC
    S1 --> CF
    S1 --> CC
    S1 --> GFG
    S2 --> LC
    S2 --> CF
    S2 --> CC
    S2 --> GFG
```

**Platform Integration Details:**

| Platform | API Type | Data Retrieved |
|----------|----------|---------------|
| **LeetCode** | GraphQL (`leetcode.com/graphql/`) | Solved problems (Easy/Medium/Hard), ranking, contest rating, badges, activity calendar, streak |
| **Codeforces** | REST (`codeforces.com/api/`) | Rating, max rating, rank, contests count, unique problems solved, active days |
| **CodeChef** | REST (placeholder) | Contest data (needs API key — currently a stub) |
| **GeeksforGeeks** | REST (placeholder) | Profile data (basic implementation) |

---

### 3.8 Real-Time Communication (Stream)

```mermaid
flowchart TB
    subgraph StreamSDK["Stream Integration"]
        SC["StreamChat.getInstance()"]
        SV["new StreamClient()"]
    end

    subgraph Usage["Used By"]
        TOKEN["GET /api/chat/token<br/>(Generate user token)"]
        CREATE_S["Create Session<br/>(Video Call + Chat Channel)"]
        JOIN_S["Join Session<br/>(Add to Chat Channel)"]
        LEAVE_S["Leave Session<br/>(Remove from Chat)"]
        END_S["End Session<br/>(Delete Call + Channel)"]
        UPSERT["User Sync<br/>(Upsert/Delete Stream User)"]
    end

    TOKEN --> SC
    CREATE_S --> SC
    CREATE_S --> SV
    JOIN_S --> SC
    LEAVE_S --> SC
    END_S --> SC
    END_S --> SV
    UPSERT --> SC
```

| Client | Purpose | Initialised In |
|--------|---------|---------------|
| `chatClient` (StreamChat) | Chat messaging, token generation, user management | [stream.js](file:///d:/project/IntelliView/backend/src/lib/stream.js) |
| `streamClient` (StreamClient) | Video call creation/deletion | [stream.js](file:///d:/project/IntelliView/backend/src/lib/stream.js) |

---

## 4. Data Model — Entity Relationship Diagram

```mermaid
erDiagram
    USER {
        ObjectId _id PK
        String name
        String email UK
        String profileImage
        String clerkId UK
        Object codefolioUsernames
        Date createdAt
        Date updatedAt
    }

    PROBLEM {
        ObjectId _id PK
        String id UK
        String title
        String difficulty
        String category
        Object description
        Array examples
        Array constraints
        Object starterCode
        Object expectedOutput
        ObjectId createdBy FK
        Date createdAt
    }

    SESSION {
        ObjectId _id PK
        String problem
        String difficulty
        ObjectId host FK
        ObjectId participant FK
        String status
        String callId
        String sessionCode UK
        Date createdAt
    }

    MOCK_INTERVIEW {
        ObjectId _id PK
        ObjectId user FK
        String topic
        String difficulty
        Number questionCount
        Array questions
        Array answers
        Number overallScore
        String grade
        String summary
        Array questionAnalysis
        Object visualAnalysis
        Date createdAt
    }

    USER ||--o{ PROBLEM : "creates"
    USER ||--o{ SESSION : "hosts"
    USER ||--o{ SESSION : "joins"
    USER ||--o{ MOCK_INTERVIEW : "takes"
```

---

## 5. Complete API Endpoint Reference

### Authentication & Chat
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/chat/token` | ✅ | Get Stream chat/video token |

### Sessions (Live Interview Rooms)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/sessions` | ✅ | Create a new interview session |
| GET | `/api/sessions/active` | ✅ | Get count of active sessions |
| GET | `/api/sessions/my-active` | ✅ | Get user's active sessions |
| GET | `/api/sessions/my-recent` | ✅ | Get user's completed sessions (last 20) |
| POST | `/api/sessions/join/code/:code` | ✅ | Join session via 8-char code |
| GET | `/api/sessions/:id` | ✅ | Get session details |
| POST | `/api/sessions/:id/join` | ✅ | Join session by ID |
| POST | `/api/sessions/:id/leave` | ✅ | Leave session (participant only) |
| POST | `/api/sessions/:id/end` | ✅ | End session (host only) |

### Problems (Coding Challenges)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/problems` | ✅ | Create a new problem |
| GET | `/api/problems` | ❌ | List all problems |
| GET | `/api/problems/:id` | ❌ | Get problem by ID |
| PUT | `/api/problems/:id` | ✅ | Update a problem |
| DELETE | `/api/problems/:id` | ✅ | Delete a problem |

### AI Services
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/grok/hint` | ❌ | Generate 3 progressive coding hints |
| POST | `/api/grok/problem/generate` | ❌ | AI-generate a full problem |
| POST | `/api/grok/interview/questions` | ❌ | Generate interview questions |
| POST | `/api/grok/interview/evaluate` | ❌ | Evaluate interview with text + visual AI |

### Mock Interviews
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/interview/save` | ✅ | Save completed interview report |
| GET | `/api/interview/history` | ✅ | Get interview history (last 20) |
| GET | `/api/interview/:id` | ✅ | Get specific interview details |

### Code Execution
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/execute/compilers` | ❌ | Check available compilers |
| POST | `/api/execute` | ❌ | Execute code (Python/Java/C++) |

### CodeFolio
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/codefolio/platform` | ❌ | Get stats for one platform |
| POST | `/api/codefolio/all` | ❌ | Get stats for all platforms |
| POST | `/api/codefolio/usernames` | ✅ | Save platform usernames |
| GET | `/api/codefolio/usernames` | ✅ | Get saved usernames |

### YouTube
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/youtube/search?q=QUERY` | ❌ | Search YouTube videos (proxy) |

### Background Jobs (Inngest)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/inngest` | Webhook | Inngest event handler (Clerk webhooks) |

---

## 6. External Service Dependency Map

```mermaid
flowchart LR
    subgraph Core["IntelliView Backend"]
        SERVER["Express Server"]
    end

    subgraph Auth["Authentication"]
        CLERK["Clerk<br/>JWT + Webhooks"]
    end

    subgraph Realtime["Real-Time"]
        STREAM["Stream<br/>Video + Chat"]
    end

    subgraph AI["AI / ML"]
        GROQ["Groq Cloud<br/>LLM Inference"]
        GEMINI["Google Gemini<br/>Vision AI"]
    end

    subgraph Data["Data"]
        MONGO["MongoDB Atlas<br/>Primary DB"]
    end

    subgraph Jobs["Background"]
        INNGEST["Inngest<br/>Event-driven Jobs"]
    end

    subgraph Content["Content"]
        YOUTUBE["YouTube Data API"]
        LEETCODE["LeetCode GraphQL"]
        CODEFORCES["Codeforces REST"]
    end

    SERVER --- CLERK
    SERVER --- STREAM
    SERVER --- GROQ
    SERVER --- GEMINI
    SERVER --- MONGO
    SERVER --- INNGEST
    SERVER --- YOUTUBE
    SERVER --- LEETCODE
    SERVER --- CODEFORCES
```

| Service | Purpose | Env Variables |
|---------|---------|---------------|
| **Clerk** | Authentication, user management, JWT | `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` |
| **MongoDB Atlas** | Primary data store | `DB_URL` |
| **Stream** | Video calls + real-time chat | `STREAM_API_KEY`, `STREAM_API_SECRET` |
| **Inngest** | Background job orchestration | `INNGEST_EVENT_KEY`, `INNGEST_SIGNING_KEY` |
| **Groq** | LLM inference (hints, questions, evaluation) | `GROK_API_KEY` |
| **Google Gemini** | Vision AI (interview visual analysis) | `GEMINI_API_KEY` |
| **YouTube Data API** | Video solution search | `YOUTUBE_API_KEY` |
| **LeetCode** | Profile stats (GraphQL) | None (public API) |
| **Codeforces** | Profile stats (REST) | None (public API) |

---

## 7. Directory Structure

```
backend/
├── .env                          # Environment variables (secrets)
├── .env.example                  # Template for env vars
├── package.json                  # Dependencies & scripts
│
├── routes/                       # ⚠️ Legacy route location
│   ├── executeRoutes.js          # Code execution engine
│   └── grok.js                   # AI service routes (hints, generation, evaluation)
│
└── src/
    ├── server.js                 # Entry point — Express app bootstrap
    │
    ├── controllers/              # Business logic handlers
    │   ├── chatController.js     # Stream token generation
    │   ├── codefolioController.js # Multi-platform stats aggregation
    │   ├── interviewController.js # Mock interview report management
    │   ├── problemController.js  # Problem CRUD operations
    │   └── sessionController.js  # Live interview session lifecycle
    │
    ├── lib/                      # Shared utilities & integrations
    │   ├── codingPlatforms.js    # LeetCode, Codeforces, CodeChef, GFG API clients
    │   ├── db.js                 # MongoDB connection
    │   ├── env.js                # Centralised env config
    │   ├── inngest.js            # Background job definitions (user sync)
    │   └── stream.js             # Stream Chat + Video client initialisation
    │
    ├── middleware/                # Express middleware
    │   └── protectRoute.js       # Auth guard (Clerk + DB user lookup)
    │
    ├── models/                   # Mongoose schemas
    │   ├── MockInterview.js      # Interview reports with embedded analysis
    │   ├── Problem.js            # Coding problems with multi-language support
    │   ├── Session.js            # Live interview sessions
    │   └── User.js               # User profiles with platform usernames
    │
    └── routes/                   # Route definitions
        ├── chatRoutes.js         # /api/chat
        ├── codefolioRoutes.js    # /api/codefolio
        ├── interviewRoutes.js    # /api/interview
        ├── problemRoutes.js      # /api/problems
        ├── sessionRoutes.js      # /api/sessions
        └── youtubeRoutes.js      # /api/youtube
```

---

## 8. Key Architectural Patterns

| Pattern | Where Used | Details |
|---------|-----------|---------|
| **MVC (Controller-Route-Model)** | Throughout | Routes delegate to controllers that interact with Mongoose models |
| **Composed Middleware** | `protectRoute` | Array of middleware functions executed sequentially |
| **Event-Driven User Sync** | Inngest + Clerk | Webhooks trigger background functions for cross-service sync |
| **Proxy Pattern** | YouTube, CodeFolio | Backend proxies external APIs to hide keys from the client |
| **Parallel AI Execution** | Interview evaluation | `Promise.all()` runs Groq text + Gemini vision analysis concurrently |
| **Static Serving** | Production mode | Express serves compiled React app as static assets |

---

## 9. Identified Architecture Observations

> [!TIP]
> **Strengths of the current architecture:**
> - Clean separation of concerns with MVC pattern
> - Effective use of Inngest for event-driven user synchronisation
> - Smart parallel AI pipeline for interview evaluation (Groq + Gemini)
> - Multi-language code execution support
> - Comprehensive CodeFolio integration with 4+ platforms

> [!WARNING]
> **Areas that could be improved:**
> 1. **Code Execution Security** — `child_process.exec()` without sandboxing is dangerous. Consider Docker containers or a dedicated judge service.
> 2. **Inconsistent Route Location** — `grok.js` and `executeRoutes.js` are in `backend/routes/` while others are in `backend/src/routes/`.
> 3. **Missing Rate Limiting** — AI endpoints (`/api/grok/*`) and execution endpoints have no rate limiting.
> 4. **No Input Validation Layer** — Controllers validate inline rather than using a schema validation library (e.g., Joi, Zod).
> 5. **CORS Wide Open** — All origins are allowed, which should be locked down for production.
> 6. **AI Routes Unprotected** — `/api/grok/*` and `/api/execute` are publicly accessible.
> 7. **No Caching** — Coding platform stats (LeetCode, Codeforces) are fetched fresh every time. Redis caching would reduce external API calls.
> 8. **Error Handling** — Generic `console.log` + 500 responses. A centralised error handler with structured logging would be beneficial.
