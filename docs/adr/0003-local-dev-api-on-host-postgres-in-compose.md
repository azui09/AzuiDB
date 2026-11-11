# 0003. Local dev: API on the host, only Postgres in Compose

- Status: Accepted. **Will be superseded** when the API gets a Dockerfile and moves into Compose.
- Date: 2026-11-11

## Context

During initial setup there is no Dockerfile for the API, and writing one was deliberately postponed. The database still needs to be real PostgreSQL from day one, so that local behavior matches staging.

## Decision

- PostgreSQL runs in Docker Compose (`infra/docker-compose.yml`, service `db`), published on `127.0.0.1:5432` only.
- The Django API runs on the host, inside a virtual environment (`apps/api/.venv`), with `python manage.py runserver`.
- `apps/api/requirements.txt` is the list of dependencies and the bridge to the future image.

## Alternatives considered

- **Everything in Compose from the start:** closer to staging, but needs the Dockerfile first, and the editor would still need a local environment to resolve imports.

## Consequences

- A local `.venv` is required, and its Python can differ from the one a container would use.
- The database port must be published to the host, and it can collide with other local Postgres instances. See troubleshooting in [setup.md](../setup.md).
- Once the API is containerized, a new ADR replaces this one. The `.venv` will then be kept only for the editor and tests.
