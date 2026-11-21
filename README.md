# Bloglist — own CI/CD pipeline

Full Stack Open part 11, exercises **11.20** (your own pipeline) and
**11.21** (protect the main branch and ask for a pull request review).

The app is the bloglist built in parts 4 (backend) and 5 (frontend), copied
into a fresh repository and restructured so that one repo holds the whole app:

```
.                  Express + Mongoose backend (part 4)
├── tests/         backend unit + API tests (node:test, supertest)
├── frontend/      React + Vite frontend (part 5)
│   ├── src/       components + vitest unit tests
│   └── e2e/       Playwright end-to-end tests
├── Dockerfile     builds the frontend, serves it from the backend
└── fly.toml       Fly.io app nerovkha-bloglist-cicd
```

- Live app: https://nerovkha-bloglist-cicd.fly.dev
- The other part 11 repository (pokedex, exercises 11.1–11.19):
  https://github.com/nerovkha/part-11

## Run locally

No database needed: without `MONGODB_URI` the backend starts an in-memory
MongoDB.

```bash
npm install && (cd frontend && npm install)
npm run dev                    # backend  http://localhost:3003
cd frontend && npm run dev     # frontend http://localhost:5173 (proxies /api)
```

In production (`NODE_ENV=production`) `MONGODB_URI` is required and the
backend serves the built frontend from `frontend/dist`.

## Test

```bash
npm run lint && npm test                          # backend
cd frontend && npm run lint && npm test           # frontend unit tests
cd frontend && npx playwright install chromium && npm run e2e
```

The e2e suite builds the frontend and runs it served by the backend in test
mode on :3003, like it runs in production.

## Pipeline

`.github/workflows/pipeline.yml` runs on every push to `main` and on every
pull request to `main`:

| Job | What it does |
| --- | --- |
| `test` | lint backend + frontend, backend tests, frontend tests, frontend build |
| `e2e` | Playwright tests against the built app |
| `deploy` | pushes to `main` only: `flyctl deploy`, then a `/health` check |
| `tag_release` | after a deploy: bumps the patch version tag (`v0.0.1`, `v0.0.2`, …) |

Pull requests only run `test` and `e2e`. Put `#skip` in a commit message to
skip deploying and tagging for that push.

`.github/workflows/health_check.yml` pings `/health` once a day, and can
also be started by hand from the Actions tab.

Secrets: the GitHub repo has only `FLY_API_TOKEN`, a deploy token for this
one app. `MONGODB_URI` and `SECRET` (the JWT key) are Fly secrets and never
in git.
