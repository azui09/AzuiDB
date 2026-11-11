# 0002. Staging on a single VPS running Docker Compose

- Status: Accepted
- Date: 2026-11-11

## Context

The `staging` branch needs a real, temporary deploy where changes are tested before reaching `main`. The project already uses Docker Compose, and learning SSH, reverse proxies, TLS and deployment hands-on is part of the project's purpose. Kubernetes is planned for later (see the README roadmap), not now.

## Decision

- **Backend:** one VPS, Oracle Cloud Free Tier or an alternative from the GitHub Student Pack, running Docker Compose with three services: the Django API, PostgreSQL and Caddy.
- **HTTPS:** Caddy obtains and renews certificates automatically. This requires a domain (a free one from the Student Pack, or DuckDNS).
- **Deploy:** over SSH with key authentication; no passwords.
- **Config and secrets:** Compose files live in `infra/`. Secrets stay in a git-ignored `.env`; only `.env.example` is committed ([ADR 0004](0004-configuration-through-environment-variables.md)).
- **App side:** an EAS Update channel named `staging`, pointing at the staging API.

## Alternatives considered

| Option | Why not |
| ------ | ------- |
| PaaS (Railway, Render, Fly.io) | Fastest, but hides the infrastructure the project is meant to teach, and does not lead to Kubernetes. Free tiers change and may sleep. |
| Own machine plus a tunnel (Cloudflare Tunnel, ngrok) | Free and good for testing the app on a phone, but it is not a deploy: it only works while the machine is on. |
| Local Kubernetes (k3s, kind) | Premature. It fits better when Kafka arrives. |

## Consequences

- A Dockerfile for the API must exist before the first deploy. It is not written yet; it will also supersede [ADR 0003](0003-local-dev-api-on-host-postgres-in-compose.md).
- The server must be maintained: OS updates, firewall, backups.
- The same VPS can later host k3s.
- Free-tier limits and Student Pack offers change over time and need to be verified at provisioning. Oracle sign-up can reject some cards, and ARM capacity can be out of stock in a region.
- Not decided here: where the production backend (`main`) runs.
- Status of the work: the VPS is not provisioned yet.
