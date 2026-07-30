# Future Roadmap

Grouped by rough effort/impact, not commitment order.

## Account & Security

- [ ] Email verification on registration
- [ ] Forgot / reset password flow (email-based token)
- [ ] Two-factor authentication (TOTP)
- [ ] Profile picture upload (Cloudinary or S3)
- [ ] Account deletion / data export (GDPR-style)

## Core Features

- [ ] Monthly/yearly analytics dashboard (charts by category, spend over time)
- [ ] Budget planning — set monthly limits per category, warn on overspend
- [ ] Export entries to PDF
- [ ] Export entries to Excel/CSV
- [ ] Recurring entries (e.g., monthly rent)
- [ ] Attachments/receipts per entry (image upload)

## UX & Platform

- [ ] Email/browser notifications (budget alerts, reminders)
- [ ] Multi-language support (i18n)
- [ ] PWA support — installable, offline-capable shell
- [ ] Offline mode with local queue + sync on reconnect
- [ ] Bulk actions (multi-select delete/categorize)

## Engineering

- [ ] Expand automated test coverage (current suite is a meaningful starting baseline, not exhaustive)
- [ ] Error tracking integration (Sentry) replacing console-only logging
- [ ] Rate limiting on auth endpoints
- [ ] Pagination for large Hisaab lists (currently loads all of a user's entries at once)
- [ ] API response caching / React Query if data volume grows
