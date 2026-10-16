# AzuiDB

A Steam game radar. It shows which games have the most players right now, which recent releases are taking off, and uses collected data to explain why a game is trending.

## What it does

- **Top 10 by concurrent players**, right now.
- **Top 10 recent releases** (last 30 days), ordered by players right now.
- **Game page**, where an AI assistant explains why the game is trending. It only uses evidence the system actually collected: the player curve, patch news, discounts and movement in the weekly chart. If there is no evidence, it says so.

A game can show up in both tables. That is fine.

## Stack

| Layer | Tech | What it does here | Status |
| ----- | ---- | ----------------- | ------ |
| App | React Native (Expo) + TypeScript | Shows the two tables and the game page | In progress |
| API | Django + Django REST Framework | Data model, endpoints, admin | In progress |
| Database | PostgreSQL | Stores player counts over time | In progress |
| Containers | Docker Compose | Runs Postgres locally | In progress |
| AI | Pydantic AI + free LLM providers | Explains why a game is trending | Planned |
| Streaming | Kafka | Decouples collectors, writer and trend detector | Planned |
| Orchestration | Kubernetes (local) | Runs and scales the services | Planned |

## Repository layout

```
apps/
  api/        Django + DRF
  mobile/     Expo app
infra/        docker-compose and, later, Kubernetes manifests
docs/         setup guide, architecture, data model, ADRs
```

## Getting started

Step by step instructions are in [docs/setup.md](docs/setup.md).

## Roadmap

- [ ] **v1**: collectors write straight to Postgres, API serves the two tables, Expo app shows them
- [ ] **v1.5**: editable watchlist, AI explanations
- [ ] **v2**: Kafka between collectors and database, trend detector, history replay
- [ ] **v3**: everything running on local Kubernetes

## Known limitations

- Steam only returns the player count **right now**, with no history. Peaks shown are the **peak observed** since collection started.
- The recent releases table only includes games the radar can see (top charts and featured lists), not every release on Steam.

## Documentation

Start at [docs/README.md](docs/README.md). Architecture decisions are recorded in [docs/adr](docs/adr).
