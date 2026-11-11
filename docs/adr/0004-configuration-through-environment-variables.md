# 0004. Configuration through environment variables

- Status: Accepted
- Date: 2026-11-11

## Context

The same code must run locally, on staging and in production with different secrets and endpoints. Secrets must never enter the git history.

## Decision

- Anything that differs between environments or is secret comes from environment variables.
- Django reads `apps/api/.env` through `django-environ`: `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`, `DATABASE_URL`.
- Docker Compose reads `infra/.env`: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`.
- Every `.env` is git-ignored. A matching `.env.example` with fake values is committed.
- Required variables have no default, so a missing one fails loudly. `DEBUG` defaults to `False`, the safe value.
- `DATABASE_URL` is required: there is no silent fallback to another database.

## Alternatives considered

- **Hard-coded values in `settings.py`:** leaks secrets and cannot differ per environment.
- **A single root `.env` passed with `--env-file`:** avoids duplication, but makes every Compose command longer.

## Consequences

- The database password appears in two files (`infra/.env` and inside `DATABASE_URL`). Changing it means changing both.
- Passwords in `DATABASE_URL` must avoid characters such as `@`, `:`, `/` and `#`.
- Follow-up: `apps/api/config/settings.py` still has `default="sqlite:///db.sqlite3"` in `DATABASES`. It hid a missing `DATABASE_URL` once (`migrate` ran against SQLite). Removing that default makes the code match this decision.
