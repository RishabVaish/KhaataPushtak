# Final Code Review

A candid pass over the codebase as it stands. Nothing here is broken — these are genuine opportunities for a "V3," useful to cite in interviews as evidence of critical self-review.

## Security

| Finding                                      | Detail                                                                                               | Suggested fix                                                                                                         |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| No rate limiting on auth routes              | `/api/auth/login` and `/register` have no brute-force protection                                     | Add `express-rate-limit` (e.g., 5 attempts/15min per IP)                                                              |
| JWT can't be revoked server-side             | 30-day expiry with no blocklist/refresh-token rotation — a leaked token stays valid until it expires | Acceptable for this project's scale; a "V3" could add short-lived access tokens + refresh tokens                      |
| Token stored in `localStorage`               | Vulnerable to XSS (an injected script could read it) vs. an `httpOnly` cookie                        | Standard trade-off for a decoupled SPA + API on different domains; cookie approach would need CSRF protection instead |
| CORS defaults to `"*"` if `CLIENT_URL` unset | Safe only because this is caught during deployment setup, but silently permissive if misconfigured   | Consider failing startup loudly if `CLIENT_URL` is unset in `NODE_ENV=production`                                     |
| No `helmet` middleware                       | Missing standard security headers (X-Content-Type-Options, etc.)                                     | Add `helmet` — a few lines, meaningful hardening                                                                      |

## Performance

| Finding                            | Detail                                                                                       | Suggested fix                                                               |
| ---------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| No pagination on `GET /api/hisaab` | Fine at current scale; a user with thousands of entries would fetch them all in one response | Add `?page=&limit=` with Mongoose `.skip()/.limit()` when this becomes real |
| No response caching                | Every Dashboard load refetches from scratch                                                  | Consider React Query if data volume/complexity grows — not justified yet    |

## Code Quality / Maintainability

| Finding                                                                                       | Detail                                                                                                                                                      |
| --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Home.jsx` is still a placeholder                                                             | Never replaced with real landing-page content — currently just confirms routing works. Low priority since the app is dashboard-first.                       |
| `HisaabForm.jsx` and `Login.jsx`/`Register.jsx` each define their own `inputBaseClass` string | Minor duplication — could be extracted to a shared `Input` component, deferred deliberately in Phase 2.4 to limit scope of auth-page changes                |
| Dashboard owns a lot of state directly                                                        | Reasonable at current size; if it grows further, extracting a `useHisaabs()` custom hook (fetch + CRUD state) would keep the component focused on rendering |
| Manual request validation in controllers                                                      | Works fine; a schema-validation library (`zod`, `express-validator`) would reduce repetitive `if (!field)` checks as the API surface grows                  |

## Naming & Structure

- Consistent conventions throughout: PascalCase components, camelCase functions/files, `use*` hook prefix — no findings here
- Folder responsibilities are clean and consistently followed (verified against `docs/ARCHITECTURE.md`'s stated rules)

## What's Already Solid (worth highlighting, not just criticizing)

- Ownership enforced at the query level, not just the UI — can't be bypassed by a crafted request
- Centralized error handling on both client and server — no scattered try/catch duplication
- Every business-logic file has genuine test coverage for its core paths (see `docs/ARCHITECTURE.md` testing section)
- Zero prop-drilling — Context used exactly where it's needed, nowhere it isn't
- Accessibility treated as a first-class requirement, not an afterthought
