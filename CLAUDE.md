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

- `./docs` (in the repo): the project's truth. Setup, architecture, data model, ADRs, environments.
- `~/Documents/Claude Memory` (Obsidian vault, outside the repo): what is not the project's. Session diary, mistakes, concepts learned, Claude Code discoveries, links between projects.
- **Only write to Obsidian when the user explicitly asks.** Never on your own initiative.

### Docs are the source of truth

- For anything about the project, `./docs` is the final word. **Whenever you do not know how to do something, or before deciding anything, check `./docs` first.** Do not guess and do not answer from memory when the docs cover it.
- If the docs do not answer, ask the user, then record the answer in `./docs` (an ADR if it is a decision) so the same question is never asked twice.
- If the docs and the code disagree, tell the user. Do not silently pick one.
- An accepted ADR is not edited. To change a decision, write a new ADR that supersedes the old one.
- ADR files are `docs/adr/NNNN-short-title.md`, numbered in sequence, with Status, Date, Context, Decision, Alternatives considered and Consequences.
- Write `./docs` for an outside reader (a new contributor, or Claude Code itself): describe the project as it is. No instructions to whoever writes the docs and no meta rules (language, naming, ADR upkeep); those live here in CLAUDE.md.

### Docs vs vault

Rule of thumb: would someone who only cloned the repo need this to run, understand or change the project? Then it goes to `./docs`. Is it about the user (what they learned, where they went wrong, how Claude Code behaved)? Then it goes to the vault.

- The repo must stand alone: `./docs` never links to or depends on the vault. The vault may link to `./docs`.
- One event can produce both. The fact that stays true for the project (an ADR, a troubleshooting entry in `docs/setup.md`) goes to `./docs`. The lesson (what was learned, what went wrong) goes to the vault.
- The vault is the single place for learning notes. Do not duplicate them in the git-ignored `./learning` folder.
- The vault is written in English, like everything else in files.

## How to code here

Study project: the user wants to learn by doing.

- Write little code into files. Show code **in the chat**, with explanation, and the user types it.
- The user does the chores, fixes and refactors. Claude is an assistant/guide, not the project's executor.
- **Do not install anything** (dependencies, Docker, tools, configs). Explain the command and why; the user runs it.
- Be didactic: say what each configuration does.
