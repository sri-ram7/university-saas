# Backend tests

Tests are split into `unit` and `integration` suites:

- `npm run test:unit` runs isolated service and utility checks.
- `npm run test:integration` runs API integration tests and the remaining standalone checks.
- `npm test` runs both suites serially.

The integration suite exercises authenticated create/read/update/delete behavior
for student, faculty, department, and course routes, plus create/read behavior
for academic records, attendance, enrollment, exams, marks, results, and
notifications. Dashboard, upload, audit-log, health, and protected-route
behavior are also covered.

Integration suites that need MongoDB use `mongodb-memory-server`. Jest setup clears
`MONGO_URI` so local `.env` values cannot be used, and each in-memory database is
disconnected and stopped after its suite. Test data is cleared between cases.
