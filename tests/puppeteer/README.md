# Puppeteer Testbed

A minimal headless-Chrome harness that demonstrates the features added in this engagement:

| Feature | Screenshots folder |
|---------|--------------------|
| Offline Mode (ON by default) | `screenshots/offline-mode/` |
| N6 – Contact + FAQ | `screenshots/n6-contact-faq/` |
| N7 – Telemetry | `screenshots/n7-telemetry/` |
| N8 – Dark Mode | `screenshots/n8-dark-mode/` |

## Why a static testbed?

The full Angular 17 app cannot be built in this environment (no `node_modules`, Angular CLI unavailable). To keep the feedback loop honest, the testbed is a **dependency-free static demo** under `tests/puppeteer/demo/` that:

1. Loads the **real** mock-data fixtures from `src/assets/mock-data/` (the same files the `OfflineHttpInterceptor` returns inside the Angular app).
2. Loads the **real** FAQ data from `src/assets/faq.json` (the same file `FaqComponent` reads).
3. Mirrors the behaviour of `OfflineService`, `TelemetryService`, and `ThemeService` in plain JS so screenshots exercise the intended user flows.

The testbed is NOT a substitute for `ng test` or e2e against the real Angular build. It is a proof-of-work artefact that lets a reviewer:

- See that mock-data fixtures render correctly on every route,
- See that the offline badge toggles,
- See that the FAQ search, expand, and submit flows work,
- See that telemetry events fire on navigation,
- See that dark mode applies to every page.

## Run

```bash
NODE_PATH=$(npm root -g) node tests/puppeteer/run.cjs
```

`NODE_PATH` is set so the runner can `require('puppeteer')` from the global install without a local `node_modules`.

Requires a globally installed `puppeteer` (already present in this environment under `~/.nvm/.../lib/node_modules/puppeteer`). The runner spins up a tiny static HTTP server, then drives the demo through each feature and writes PNG screenshots per step.

## Screenshot naming

Each file is named `NN-short-state.png` so scrolling the folder top-to-bottom tells the story of the feature. Example for Offline Mode:

```
01-default-on-home.png
02-plans-loaded-from-mock.png
03-dashboard-mock-subscription.png
04-profile-mock-user.png
05-badge-toggled-online.png
06-badge-toggled-offline-again.png
```

## Files

```
tests/puppeteer/
├── README.md              ← this file
├── run.cjs                ← puppeteer runner (serves demo/ and snaps screenshots)
├── demo/
│   ├── index.html         ← testbed shell
│   ├── testbed.css        ← styling (light + dark palette via CSS vars)
│   └── testbed.js         ← Offline / Telemetry / Theme mirrors + router + pages
└── screenshots/
    ├── offline-mode/
    ├── n6-contact-faq/
    ├── n7-telemetry/
    └── n8-dark-mode/
```
