# Portfolio & Interview Assets

## Portfolio Project Description (long form)

**KhaataPushtak V2** is a full-stack MERN ledger application that evolved from a file-system-based Node.js learning project into a production-deployed, multi-user app. Users register, log in via JWT authentication, and manage private, category-organized ledger entries with live search, filtering, and sorting.

The project was deliberately built in phases mirroring real software development practice: backend foundation → authentication → user ownership → frontend foundation → auth UI → CRUD dashboard → UI/UX polish (responsive design, dark mode, accessibility) → production hardening (error boundaries, code splitting, logging, deployment configuration) → documentation and testing.

Notable architectural decisions: strict separation of concerns (components never call APIs directly — everything flows through a dedicated service layer), database-level ownership enforcement (not just UI-level access control), and a from-scratch design system using CSS custom properties for theming, avoiding unnecessary dependencies throughout.

**Live**: `<your-vercel-url>` · **Code**: `<your-github-url>`

---

## Resume Project Description (bullet form, ~3 lines)

> **KhaataPushtak — Full-Stack Ledger App** _(React, Node.js, Express, MongoDB)_
> Built and deployed a production multi-user MERN application with JWT authentication, database-enforced per-user data ownership, and a fully responsive dashboard (search/filter/sort, dark mode, skeleton loading states). Implemented route-level code splitting, centralized error handling, and automated tests (Vitest, Supertest, React Testing Library) across both frontend and backend.

---

## LinkedIn Project Description

> 🚀 Just shipped **KhaataPushtak V2** — a full-stack personal ledger app, rebuilt from the ground up.
>
> What started as a simple Node.js file-system project (V1) became a production MERN application: JWT auth, MongoDB with per-user data ownership enforced at the query level, a React 19 dashboard with live search/filter/sort, dark mode with zero flash-of-wrong-theme, and full accessibility support.
>
> Also spent real time on the "invisible" production work: error boundaries, route-level code splitting, centralized logging, and a documented, testable architecture — not just features, but a system I'd be comfortable handing off to another engineer.
>
> Stack: React · Vite · Tailwind CSS v4 · Node.js · Express · MongoDB Atlas · deployed on Vercel + Render.
>
> 🔗 Live demo: `<your-vercel-url>`
> 💻 Code: `<your-github-url>`

---

## Elevator Pitch (~30 seconds)

> "KhaataPushtak is a full-stack ledger app I built to track personal expenses — think a simpler, private Notion for your day-to-day spending. It started as a basic Node.js project storing data in text files, and I rebuilt it into a production MERN app with real authentication, a MongoDB database, and a React dashboard with search, filtering, and dark mode. It's deployed live, has automated tests, and every user's data is isolated at the database level, not just hidden in the UI."

---

## Interview Explanation (~2–3 minutes)

**What it is:**
"KhaataPushtak is a personal ledger app — users register, log in, and manage private notes/expense entries organized by category, with search, filtering, and sorting."

**Why I built it this way:**
"It's actually a rebuild. Version 1 was a learning project using Express, EJS, and the Node file-system module — I stored each entry as a `.txt` file. That taught me the fundamentals, but when I tried deploying it, I hit a wall: serverless platforms like Vercel have ephemeral file systems, so writes don't persist. That pushed me to rebuild it properly with a real database and a decoupled frontend."

**Architecture:**
"It's a standard 3-tier setup — React SPA, Express REST API, MongoDB — deployed independently on Vercel and Render. On the backend I followed MVC strictly: models own validation, controllers own logic, routes are just URL mappings. On the frontend, I enforced a rule that pages never call Axios directly — everything goes through a service layer, so if an API contract changes, I'm editing one file, not hunting through components."

**The part I'm most proud of:**
"Probably the ownership model. Every ledger entry has a required `user` reference, and every single database query — read, update, delete — is compound-filtered by both the entry ID _and_ the logged-in user's ID. So even if someone guesses a valid entry ID that isn't theirs, the query simply returns nothing — a 404, not a 403 — so it doesn't even confirm that another user's data exists. That's enforced at the data layer, not just hidden in the UI, which is the difference between 'looks secure' and 'is secure.'"

**What I'd do differently / next:**
"Token revocation is the honest gap — I'm using long-lived JWTs with no refresh-token rotation, so a leaked token stays valid until it expires. For this project's scale that's a reasonable trade-off, but in a real production system I'd add short-lived access tokens with refresh rotation. I've documented that and a few other trade-offs explicitly in the repo's code review notes rather than pretending they don't exist."

---

## Suggested GitHub Repository Metadata

**About / description**:

> Full-stack MERN ledger app — JWT auth, per-user data ownership, dark mode, responsive dashboard. React 19 + Express + MongoDB, deployed on Vercel/Render.

**Topics** (GitHub tags):
`mern-stack` `react` `nodejs` `express` `mongodb` `jwt-authentication` `tailwindcss` `vite` `full-stack` `rest-api` `dark-mode` `responsive-design` `portfolio-project`
