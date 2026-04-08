# CCube / SSewa App – Documentation Index

This folder is the authoritative documentation hub for the CCube / SSewa hybrid mobile app. It exists to support the ongoing modernisation effort (Angular 9 → 17, Ionic 5 → 7, baseline regression harness) and to give future contributors a single place to learn **what the app does** and **where the code lives** before changing anything.

## Contents

| Document | Purpose |
|----------|---------|
| [`01-architecture-overview.md`](./01-architecture-overview.md) | High-level architecture, tech stack, modules, routing, build/test wiring |
| [`02-features-catalog.md`](./02-features-catalog.md) | Complete catalog of existing product features with exact file paths |
| [`03-proposed-features.md`](./03-proposed-features.md) | Proposed new features, justifications, and alignment with existing product |
| [`04-testing-strategy.md`](./04-testing-strategy.md) | Baseline regression testing strategy, coverage targets, and harness changes |
| [`05-upgrade-plan.md`](./05-upgrade-plan.md) | Incremental Angular 9 → 17 and Ionic 5 → 7 upgrade plan and rationale |

## Conventions

- All file paths are relative to the repository root (`ui/`).
- "Feature" = a user-visible capability, not a single component.
- "Baseline" = the pre-upgrade state locked in as the regression reference.
- Upgrade tasks must preserve functionality and backward compatibility; see [`05-upgrade-plan.md`](./05-upgrade-plan.md).
