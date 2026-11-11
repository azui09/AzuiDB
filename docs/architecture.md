# Architecture

Status: early setup. Anything marked *planned* does not exist yet. The product description and roadmap live in the [README](../README.md).

## Components

| Component | Tech | Where | Status |
| --------- | ---- | ----- | ------ |
| App | Expo (React Native + TypeScript) | `apps/mobile` | Planned, not created yet |
| API | Django + Django REST Framework | `apps/api` | Health endpoint only (`GET /api/health/`) |
| Database | PostgreSQL 17 | `db` service in `infra/docker-compose.yml` | Running locally |
| Reverse proxy | Caddy | Staging VPS | Planned |
| Collectors, AI, Kafka, Kubernetes | see README roadmap | - | Planned |

## Local development

```
Your machine
├─ .venv  →  Django API   (python manage.py runserver, port 8000)
└─ Docker →  PostgreSQL   (127.0.0.1:5432, volume db-data)
```

| Port | Used by | Reachable from |
| ---- | ------- | -------------- |
| 8000 | Django `runserver` | your machine |
| 5432 | PostgreSQL container | your machine only (bound to `127.0.0.1`) |

Why the API is not in Compose yet: [ADR 0003](adr/0003-local-dev-api-on-host-postgres-in-compose.md). How configuration is passed: [ADR 0004](adr/0004-configuration-through-environment-variables.md).

## Environments

| | Local | Staging | Main |
| - | ----- | ------- | ---- |
| Purpose | Daily development | Test deploy before publishing | Publication |
| Backend | Django in `.venv`, Postgres in Compose | One VPS running Docker Compose: API, Postgres, Caddy (HTTPS) | Not decided yet |
| App | Expo dev | EAS Update channel `staging`, pointing at the staging API | EAS build (APK) |
| Deploy | none | SSH with key auth | - |
| Status | Working | Planned: VPS not provisioned, API Dockerfile not written | Planned |

Staging decision and alternatives: [ADR 0002](adr/0002-staging-on-vps-with-compose.md). Branch flow between environments: [ADR 0001](adr/0001-branching-and-linear-history.md).
