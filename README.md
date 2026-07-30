# KhaataPushtak V2

A modern, full-stack personal ledger application — track your everyday expenses and notes, organized by category, with a clean, secure, multi-user dashboard.

> **KhaataPushtak** (खाता-पुस्तक) means "ledger book" in Hindi.

This is a complete rebuild of a file-system-based (`.txt` files + Node's `fs` module) V1 learning project into a production-grade **MERN** application — built to demonstrate real-world full-stack architecture, not just CRUD basics.

![Status](https://img.shields.io/badge/status-production--ready-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18-green)
![React](https://img.shields.io/badge/react-19-61DAFB)

---

## Live Demo

|                 |                                       |
| --------------- | ------------------------------------- |
| **Frontend**    | `https://<your-app>.vercel.app`       |
| **Backend API** | `https://<your-app>.onrender.com/api` |

_(Replace with your actual deployed URLs before publishing.)_

---

## Features

- 🔐 **JWT Authentication** — register, login, persistent sessions with expiry detection
- 👤 **User Ownership** — every Hisaab entry is private to its creator, enforced at the database query level
- 📝 **Full CRUD** — create, read, update, delete ledger entries
- 🔍 **Search, Filter & Sort** — debounced live search, category filtering, newest/oldest sort
- 🌓 **Dark / Light Theme** — persisted, respects system preference, zero flash on load
- 📱 **Fully Responsive** — mobile, tablet, and desktop
- ⚡ **Route-Level Code Splitting** — each page loads as its own chunk
- 💀 **Skeleton Loading States** — no jarring spinner-to-content jumps
- 🛡️ **Error Boundaries & 404 Handling** — graceful failure states throughout
- ♿ **Accessible** — ARIA labels, keyboard navigation, focus management, `prefers-reduced-motion` support

---

## Tech Stack

**Frontend**

- React 19 (Vite)
- Tailwind CSS v4
- React Router DOM v7
- Axios
- React Hot Toast
- React Icons

**Backend**

- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT (`jsonwebtoken`) + `bcryptjs`
- Morgan (request logging)

**Testing**

- Vitest + Supertest (backend)
- Vitest + React Testing Library (frontend)

**Deployment**

- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

---

## Folder Structure

```
khaatapushtak-v2/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable presentational components
│   │   ├── context/        # AuthContext, ThemeContext
│   │   ├── hooks/          # useDebounce, useDocumentTitle
│   │   ├── layouts/        # MainLayout
│   │   ├── pages/          # Route-level screens
│   │   ├── routes/         # Centralized route config
│   │   ├── services/       # All Axios/API calls
│   │   └── utils/          # Pure helper functions
│   └── vercel.json
├── server/                 # Express backend
│   ├── config/              # DB connection
│   ├── controllers/         # Business logic
│   ├── middleware/          # Auth guard, error handling
│   ├── models/               # Mongoose schemas
│   ├── routes/                # URL → controller mapping
│   ├── utils/                  # asyncHandler, logger, generateToken
│   └── index.js
├── docs/                    # Architecture, API, deployment docs
└── README.md
```

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full explanation of data flow and design decisions.

---

## Screenshots

| Dashboard (Light) | Dashboard (Dark) |
| ----------------- | ---------------- |
| _add screenshot_  | _add screenshot_ |

| Login            | Mobile View      |
| ---------------- | ---------------- |
| _add screenshot_ | _add screenshot_ |

---

## Installation

### Prerequisites

- Node.js ≥ 18
- A MongoDB Atlas account (free tier is sufficient)

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/khaatapushtak-v2.git
cd khaatapushtak-v2
```

### 2. Backend setup

```bash
cd server
npm install
cp .env.example .env   # fill in your real values
npm run dev
```

### 3. Frontend setup

```bash
cd client
npm install
cp .env.example .env   # fill in your real values
npm run dev
```

The app will be running at `http://localhost:5173`, talking to the API at `http://localhost:5000`.

---

## Environment Variables

**`server/.env`**

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/khaatapushtak
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=<generate with the command below>
```

Generate a secure secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**`client/.env`**

```
VITE_API_URL=http://localhost:5000/api
```

---

## Deployment

Full step-by-step guide in [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md). Quick summary:

1. **MongoDB Atlas** — create a free cluster, whitelist `0.0.0.0/0` (or Render's static IPs), copy the connection string
2. **Render** (backend) — connect the repo, set root directory to `server`, add env vars, deploy
3. **Vercel** (frontend) — connect the repo, set root directory to `client`, add `VITE_API_URL` pointing to your Render URL, deploy

---

## Testing

```bash
# Backend
cd server && npm test

# Frontend
cd client && npm test
```

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for what's covered and why.

---

## API Documentation

Full endpoint reference (request/response shapes, auth requirements, error codes) in [`docs/API.md`](docs/API.md).

---

## Future Improvements

See [`docs/ROADMAP.md`](docs/ROADMAP.md) for the full list — profile pictures, monthly analytics, PDF/Excel export, budget planning, email verification, forgot password, 2FA, PWA/offline support, and more.

---

## Contributing

This is primarily a personal learning/portfolio project, but suggestions are welcome:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Open a Pull Request

---

## License

MIT — see [`LICENSE`](LICENSE).

---

## Author

Built by **[Your Name]** as a full-stack learning project, evolving from a file-system-based Node.js app (V1) into a production-grade MERN application (V2).

- GitHub: `https://github.com/<your-username>`
- LinkedIn: `https://linkedin.com/in/<your-profile>`
