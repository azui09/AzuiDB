# Documentation

This folder is the project's source of truth. If the code and these docs disagree, one of them is wrong: raise it, do not ignore it.

| Document | What it answers |
| -------- | --------------- |
| [setup.md](setup.md) | How do I run the project on my machine? |
| [architecture.md](architecture.md) | What are the pieces and how do they fit, per environment? |
| [adr/](adr) | Why was each important decision made? |

## Architecture Decision Records

| ADR | Decision | Status |
| --- | -------- | ------ |
| [0001](adr/0001-branching-and-linear-history.md) | Branch flow with rebase-and-merge and a linear history | Accepted |
| [0002](adr/0002-staging-on-vps-with-compose.md) | Staging on a single VPS running Docker Compose | Accepted |
| [0003](adr/0003-local-dev-api-on-host-postgres-in-compose.md) | Local dev: API on the host, only Postgres in Compose | Accepted |
| [0004](adr/0004-configuration-through-environment-variables.md) | Configuration through environment variables | Accepted |

## Writing rules

- English only.
- ADR files are named `NNNN-short-title.md`, numbered in sequence.
- An accepted ADR is not edited. To change a decision, write a new ADR and mark the old one `Superseded by NNNN`.
- `data-model.md` will be added once the models exist.
