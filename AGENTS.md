# AGENTS.md

## Cursor Cloud specific instructions

### Overview

STARCARE is a React 19 + TypeScript + Vite 8 frontend for an elderly care home management system. The backend is cloud-hosted Supabase (PostgreSQL, Auth, Edge Functions). When `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are not set, the app runs in **demo mode** with a TeamLead role and in-memory data — no backend needed.

### Quick reference

| Task | Command |
|------|---------|
| Dev server | `npm run dev` |
| Lint | `npm run lint` |
| Typecheck | `npm run typecheck` |
| Unit tests | `npm run test` |
| E2E smoke (demo mode) | `npm run test:e2e` |
| Full CI pipeline | `npm run ci` |
| Build | `npm run build` |

See `package.json` scripts and `README.md` for the full list.

### Non-obvious caveats

- **Node.js >= 22 required.** The project uses TypeScript ~6.0, Vite 8, and ESLint 10 which need a modern Node runtime. nvm is installed at `$HOME/.nvm`; source it before running any commands: `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"`.
- **Demo mode is the default.** Without Supabase env vars the app uses in-memory repositories. All E2E smoke tests (`npm run test:e2e`) run against this demo build and do not require network access.
- **Playwright needs Chromium installed.** Run `npx playwright install --with-deps chromium` if the E2E tests fail with a missing-browser error.
- **No Docker or local Supabase required.** The project has no docker-compose; everything runs as a single Vite process in development.
- **Chunk size warning is expected.** The production build emits a single JS chunk >500 KB. This is a known warning, not an error.
