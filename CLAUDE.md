# AzuiDB

Steam game radar: shows the top 10 games by concurrent players right now and the top 10 releases of the last 30 days. On the game page, an AI explains why the game is trending using only collected evidence (player curve, patch news, discounts, weekly chart movement).
Stack: Expo (React Native + TS) · Django + DRF · PostgreSQL · Docker Compose. Planned: Pydantic AI, Kafka, local Kubernetes.
Layout: `apps/api`, `apps/mobile`, `infra/`, `docs/`. Details in README.md.

## Language

- Chat in the session: Portuguese (pt-BR).
- Everything written to files: English. This covers code, comments, commit messages, PRs, docs and ADRs.

## Branches

- `main`: publication. Fewest commits; only what makes the app work in Expo. The app is built with EAS (APK) and points to the production API. Where the production backend runs is **still undefined** (same VPS as staging or a second one); do not write code or docs about it until we confirm.
- `staging`: intermediate, test deploy. Backend on a single VPS (Oracle Cloud Free Tier, or a Student Pack alternative) running Docker Compose: Django API + PostgreSQL behind Caddy (automatic HTTPS, needs a domain). Deploy over SSH with key auth. The app side uses an EAS Update channel named `staging` pointing to the staging API. The Compose files live in `infra/`; secrets stay in `.env` (ignored), only `.env.example` is committed. A Dockerfile for the API is needed before the first deploy (not written yet).
- `development`: where most commits live.
- Each feature gets its own branch (e.g. `feat/home-page`), with several commits in that context.
- When a feature is done and merged, delete its branch (local and remote), so the git history stays a clean line instead of a tree of branches.
- History must stay linear: rebase the branch onto its target, then merge as fast-forward ("rebase and merge" on GitHub). No merge commits, for every PR into `development`, `staging` and `main`.
- Flow: `feat/*` → PR → `development` → PR → `staging` (test) → PR → `main`.

## Docs and memory

Two context sources, working as a second brain (zettelkasten):

- `./docs` (in the repo): the project's truth. Architecture, data model, ADRs. Consult before deciding.
- `~/Documents/Claude Memory` (Obsidian, outside the repo): what is not the project's. Session diary, mistakes, concepts learned, Claude Code discoveries, links between projects.
- **Only write to Obsidian when the user explicitly asks.** Never on your own initiative.

## How to code here

Study project: the user wants to learn by doing.

- Write little code into files. Show code **in the chat**, with explanation, and the user types it.
- The user does the chores, fixes and refactors. Claude is an assistant/guide, not the project's executor.
- **Do not install anything** (dependencies, Docker, tools, configs). Explain the command and why; the user runs it.
- Be didactic: say what each configuration does.
