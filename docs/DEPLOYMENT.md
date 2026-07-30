# Deployment Guide

## 1. MongoDB Atlas Setup

1. Create a free account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free **M0** cluster
3. Database Access → add a database user (username/password — not your Atlas login)
4. Network Access → add IP `0.0.0.0/0` (allow from anywhere — required since Render's IPs aren't static on free tier)
5. Connect → "Drivers" → copy the connection string, replace `<username>`/`<password>`, add your database name before the `?`:
   ```
   mongodb+srv://user:pass@cluster0.mongodb.net/khaatapushtak?retryWrites=true&w=majority
   ```

## 2. Backend — Render

1. New → Web Service → connect your GitHub repo
2. **Root directory**: `server`
3. **Build command**: `npm install`
4. **Start command**: `npm start`
5. Environment variables (Settings → Environment):
   | Key | Value |
   |---|---|
   | `MONGO_URI` | your Atlas connection string |
   | `JWT_SECRET` | a long random string (see README) |
   | `NODE_ENV` | `production` |
   | `CLIENT_URL` | your Vercel URL (add after step 3, then redeploy) |
6. Deploy. Confirm `https://<your-app>.onrender.com/` returns `{"message": "KhaataPushtak API is running 🚀"}`

## 3. Frontend — Vercel

1. New Project → import your GitHub repo
2. **Root directory**: `client`
3. Framework preset: Vite (auto-detected)
4. Environment variables:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://<your-app>.onrender.com/api` |
5. Deploy. `vercel.json` (already in the repo) handles SPA routing so refreshing on `/dashboard` doesn't 404.
6. Copy your Vercel URL → go back to Render → update `CLIENT_URL` → redeploy the backend

## 4. Verify End-to-End

1. Visit your Vercel URL
2. Register a new account
3. Create, edit, delete a Hisaab
4. Refresh on `/dashboard` — should stay on the page, not 404
5. Toggle dark mode, refresh — should persist with no flash

---

## Common Deployment Issues

| Symptom                                                  | Cause                                                                                                           | Fix                                                                                                     |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Frontend shows "Network error" for every request         | `VITE_API_URL` missing or wrong                                                                                 | Check Vercel env vars, redeploy after changing                                                          |
| CORS error in browser console                            | `CLIENT_URL` on Render doesn't match your Vercel domain exactly                                                 | Must match exactly (including `https://`, no trailing slash); comma-separate multiple origins if needed |
| Refreshing `/dashboard` shows 404                        | Missing/misconfigured `vercel.json`                                                                             | Ensure `vercel.json` exists in `client/` with the SPA rewrite rule                                      |
| Backend "MongoDB Connection Error"                       | IP not whitelisted, or wrong credentials in `MONGO_URI`                                                         | Re-check Atlas Network Access and the connection string                                                 |
| Render free tier: first request after inactivity is slow | Free tier spins down after ~15 min idle                                                                         | Expected behavior on free tier; upgrade for always-on, or accept the cold-start delay                   |
| Login works but immediately logs out                     | `JWT_SECRET` differs between what signed the token and what's verifying it (e.g., redeployed with a new secret) | Keep `JWT_SECRET` stable across deploys; changing it invalidates all existing tokens                    |
| Environment variable changes not taking effect           | Vercel/Render caches the build                                                                                  | Trigger a fresh deploy, not just a restart, after changing env vars                                     |

---

## Rollback

- **Vercel**: Deployments tab → previous deployment → "Promote to Production"
- **Render**: Deploys tab → previous deploy → "Redeploy"
