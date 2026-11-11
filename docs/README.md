# Documentation

How to run AzuiDB, how it is put together, and why it is built that way.

| Document | What it covers |
| -------- | -------------- |
| [setup.md](setup.md) | Running the project locally |
| [architecture.md](architecture.md) | Components and environments |
| [adr/](adr) | Architecture Decision Records |

## Architecture Decision Records

Each ADR records one decision: its context, what was decided, the alternatives considered and the consequences.

| ADR | Decision | Status |
| --- | -------- | ------ |
| [0001](adr/0001-branching-and-linear-history.md) | Branch flow with rebase-and-merge and a linear history | Accepted |
| [0002](adr/0002-staging-on-vps-with-compose.md) | Staging on a single VPS running Docker Compose | Accepted |
| [0003](adr/0003-local-dev-api-on-host-postgres-in-compose.md) | Local dev: API on the host, only Postgres in Compose | Accepted |
| [0004](adr/0004-configuration-through-environment-variables.md) | Configuration through environment variables | Accepted |
