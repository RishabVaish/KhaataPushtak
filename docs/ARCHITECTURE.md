# Architecture Documentation

## Overview

KhaataPushtak V2 is a 3-tier MERN application: React SPA → Express REST API → MongoDB. The frontend and backend are fully decoupled — they only communicate over HTTP/JSON, deployed independently (Vercel / Render).

```
┌──────────────┐   HTTPS/REST    ┌──────────────┐   Mongoose    ┌───────────────┐
│  React SPA    │ ─────────────▶ │  Express API  │ ─────────────▶│ MongoDB Atlas │
│  (Vercel)     │ ◀───────────── │   (Render)    │ ◀──────────────│   (Cloud)     │
└──────────────┘      JSON        └──────────────┘    Documents    └───────────────┘
```

---

## Backend Architecture (MVC)

| Layer      | Responsibility                        | Location              |
| ---------- | ------------------------------------- | --------------------- |
| Model      | Data shape + validation               | `server/models/`      |
| Controller | Business logic                        | `server/controllers/` |
| Routes     | URL → controller mapping only         | `server/routes/`      |
| Middleware | Cross-cutting concerns (auth, errors) | `server/middleware/`  |

**Request flow for a protected endpoint** (e.g., `GET /api/hisaab`):

```
Request → cors → express.json() → morgan (logging)
        → hisaabRoutes → protect (verifies JWT, attaches req.user)
        → hisaabController.getHisaabs (queries scoped to req.user._id)
        → response
        (any thrown error → notFound/errorHandler middleware)
```

---

## Authentication & JWT Flow

1. **Register/Login**: password is hashed with `bcryptjs` in a Mongoose `pre("save")` hook (never in the controller) → a JWT is signed containing only `{ id: userId }`, expiring in 30 days
2. **Client stores** the token + user object in `localStorage`
3. **Every subsequent request**: an Axios request interceptor (`services/api.js`) automatically attaches `Authorization: Bearer <token>` — no component ever sets this header manually
4. **Backend verifies**: `authMiddleware.protect` decodes and verifies the JWT signature, fetches the user, attaches it as `req.user`
5. **Expiry handling**: client-side, `utils/jwt.js` decodes (not verifies) the token's `exp` claim on app load to avoid restoring a dead session; server-side, an expired/invalid token triggers a `401`, which the Axios response interceptor catches to auto-clear the session and redirect to `/login`

## User Ownership Model

Every `Hisaab` document has a required `user: ObjectId` field (`ref: "User"`). All controller queries are compound-filtered: `{ _id, user: req.user._id }` — never `user` alone from the request body. This means:

- A user can never view, edit, or delete another user's data, even by guessing a valid ID
- Attempting to do so returns `404`, not `403` — existence of another user's data is never confirmed

---

## Frontend Architecture

### Folder Responsibilities

| Folder        | Purpose                                                                                            |
| ------------- | -------------------------------------------------------------------------------------------------- |
| `services/`   | The **only** place Axios is imported; one file per resource (`authService.js`, `hisaabService.js`) |
| `context/`    | Global state needed across unrelated parts of the tree (`AuthContext`, `ThemeContext`)             |
| `hooks/`      | Reusable stateful logic with no rendering output (`useDebounce`, `useDocumentTitle`)               |
| `components/` | Small, reusable, presentational pieces — receive data via props, report events via callbacks       |
| `pages/`      | Route-level screens that own business logic and orchestrate components                             |
| `layouts/`    | Persistent page shells (`MainLayout` wraps every route with the Navbar)                            |
| `routes/`     | Centralized URL → page mapping, including lazy-loading and route guards                            |
| `utils/`      | Pure functions with no side effects (`formatDate`, `getErrorMessage`, `jwt.js`)                    |

### Data Flow Rule (strictly enforced throughout)

```
Page  →  Service  →  api.js (Axios + interceptors)  →  Backend
  ↑
Components (props down, callbacks up — never call services directly)
```

### State Management

No external state library (Redux, Zustand) — deliberately. State is split by scope:

- **Local component state** (`useState`) — form inputs, modal visibility
- **Context** — auth session and theme, needed by many unrelated components
- **Server state** — fetched into Dashboard's local state on demand, no caching layer; simple enough at this scale that a library like React Query wasn't justified

### Component Hierarchy (Dashboard, as an example)

```
App
 └─ ThemeProvider → AuthProvider → RouterProvider
     └─ MainLayout (Navbar + Outlet)
         └─ ProtectedRoute
             └─ Dashboard (owns all state + service calls)
                 ├─ StatsCard
                 ├─ SearchBar, FilterBar (controlled, no internal state)
                 ├─ HisaabCard × N (React.memo, receives onEdit/onDelete callbacks)
                 ├─ HisaabForm (inside Modal)
                 └─ DeleteModal (inside Modal)
```

### Route Protection

`ProtectedRoute` wraps any route requiring auth. It reads `isAuthenticated`/`loading` from `AuthContext` (never `localStorage` directly) and either renders a `FullPageLoader` (while session is being checked), redirects to `/login`, or renders the requested page. Route-level code splitting (`React.lazy`) means each page's JS is only downloaded when actually visited.

---

## Database Design

**User**

```
{ name, email (unique), password (hashed, select:false), avatar, timestamps }
```

**Hisaab**

```
{ user (ref: User, required), title, content, category (enum), timestamps }
```

No joins in MongoDB — `Hisaab.user` is populated on read via Mongoose's `.populate()` when the frontend needs the owner's display info.

---

## Key Design Trade-offs

| Decision                                                  | Reasoning                                                                                          |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| No Redux/state library                                    | App's state needs are simple enough that Context + local state is clearer and has less boilerplate |
| No React Query/SWR                                        | Dashboard refetches explicitly after mutations; caching complexity wasn't justified at this scale  |
| JWT over sessions                                         | Stateless backend (Render), decoupled frontend (Vercel) — no shared server memory for sessions     |
| Manual `.dark` class over CSS-only `prefers-color-scheme` | Needed persistence + explicit user override, not just following the OS                             |
