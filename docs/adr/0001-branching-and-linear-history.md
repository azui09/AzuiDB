# 0001. Branching and linear history

- Status: Accepted
- Date: 2026-11-11

## Context

AzuiDB is a study project, and the git history is also a record of how it was built. It should read as a straight line, one step after another, not as a tree of merged branches. `main` is the publication branch and should carry as little noise as possible.

## Decision

- Flow: `feat/*` → PR → `development` → PR → `staging` → PR → `main`.
- `main` holds the fewest commits and only what makes the app work in Expo. `development` is where most commits live.
- Each feature gets its own branch (e.g. `feat/home-page`) with several commits in that context.
- Every PR, into any of the three long-lived branches, is merged with **rebase and merge** (fast-forward). No merge commits.
- When a feature is merged, its branch is deleted locally and on the remote.

## Alternatives considered

- **Merge commits:** simplest, but the history becomes a tree of branches.
- **Squash and merge:** linear, but a feature's step-by-step commits are lost, and those commits are the learning record.

## Consequences

- Rebasing rewrites commit hashes. Until the target branch is pulled, Git does not recognize the merged feature branch as merged, so `git branch -d` refuses to delete it.
- Rebasing a branch that was already pushed requires a force push (`--force-with-lease`), which is limited to a contributor's own feature branches.
- The `staging` branch does not exist yet; it will be created together with the VPS ([ADR 0002](0002-staging-on-vps-with-compose.md)).
