# 04 – Testing Strategy (Baseline Regression Harness)

This document explains **how** the baseline regression harness was built, **why** it deviates from Angular's default `ng test`, and **how** to reproduce the baseline numbers published in [`results/`](../results).

The goal at this step is not exhaustive coverage — it is an **objective, fast, repeatable signal** that lets us detect regressions introduced by the incremental Angular 9 → 17 and Ionic 5 → 7 upgrades.

---

## 1. Why not `ng test`?

The project ships with 101 `*.spec.ts` files plus a Karma/Jasmine pipeline (`karma.conf.js`, `@angular-devkit/build-angular:karma`). In principle `npm test` would run them. In practice, on the current toolchain (Node 22 + Angular 9 + deprecated zone.js 0.10) the Karma pipeline has several hard blockers:

1. **Angular 9 CLI + Node 22 is unsupported.** The devkit webpack stack throws during bootstrap because Node 17+ replaced `crypto.createHash('md4')`.
2. **`src/app/app.component.spec.ts` imports packages that don't exist in `package.json`:**
   ```ts
   import { SplashScreen } from '@ionic-native/splash-screen/ngx';
   import { StatusBar }    from '@ionic-native/status-bar/ngx';
   ```
   Those wrappers were never installed. The file has been broken since at least the commit under `Mar 20 13:03`.
3. **`src/app/app.component.ts` imports `from 'vm'` (a Node built-in) and `from 'color-name'`,** along with non-relative `app/common/common.service` paths that need `baseUrl` + Angular's compiler. None of these help at test time.
4. Roughly 90% of the existing spec files are CLI-scaffolded `should create` tests with no real assertions. Even if the pipeline booted, they would tell us nothing about the business logic.

So the strategy is: **leave the legacy specs in place** (Task 5/6 may or may not get them running again – we will re-run `ng test` post-upgrade without modification per the task brief), and **add a parallel, dependency-free baseline** that targets the pure business logic of the app. The baseline is the regression oracle; the legacy specs are fire-and-forget.

## 2. Where the baseline lives

```
tests/baseline/
├── harness.mjs          # Browser globals + @angular/core stub + test data seeds
├── ts-loader.mjs        # Custom Node ESM loader that compiles .ts through the
│                          bundled `typescript` package (so Angular decorators work)
├── run-baseline.mjs     # Entry point: spawns `node --test` with coverage
├── .loader-shim.mjs     # Generated at runtime – do not edit
├── api.service.spec.ts
├── car.service.spec.ts
├── cities.service.spec.ts
├── common.service.spec.ts
├── crypto.service.spec.ts
├── endpoints.spec.ts
├── header.service.spec.ts
├── notification.service.spec.ts
├── plan.service.spec.ts
├── user.service.spec.ts
├── util.spec.ts
└── window-ref.service.spec.ts
```

## 3. How the harness works

1. **`ts-loader.mjs`** – Registers a Node 22 `register()` loader that:
   - resolves the repo's tsconfig `baseUrl: ./src/` aliases (`app/…`, `assets/…`),
   - resolves extensionless relative TS imports,
   - and compiles every `.ts` file through `ts.transpileModule` so Angular's class decorators (`@Injectable`, `@Component`, etc.) are handled correctly. Node's native `--experimental-strip-types` alone can't do that – it rejects anything that isn't pure TS type syntax.

2. **`harness.mjs`** – Installs stubs on `globalThis` so the production source can run outside a browser:
   - `localStorage` / `sessionStorage` backed by in-memory `Map`s,
   - a minimal `window` / `document`,
   - a jQuery `$` stub that returns a fake scrollable container (used by `src/app/util/util.ts`),
   - **virtual modules** for `@angular/core`, `@angular/router`, `@angular/common/http`, `@angular/forms`, and `@ionic/angular`, each reduced to the smallest surface area needed (`@Injectable` → identity decorator, `HttpClient` → call recorder, etc.). This side-steps zone.js entirely.
   - `seedCommonData()` populates `localStorage.commonData` with a deterministic fixture that matches the shape the services expect. Tests call it inside `beforeEach`.

3. **`run-baseline.mjs`** – Delegates to Node 22's built-in `node:test` runner with:
   - `--experimental-test-coverage` (native V8 coverage, no nyc/c8 required)
   - `--test-reporter=tap` → `results/baseline-test-output.txt`
   - `--test-reporter=lcov` → `results/baseline-coverage.lcov`
   - coverage scoped to the source files the baseline is responsible for (`src/app/services/**`, plus a handful of root-level services).

## 4. What the baseline covers

The baseline targets the **pure business-logic** files. UI components, page containers, and anything that actually needs Angular's TestBed are intentionally out of scope – they have no algorithms to regress, they just render. The services below concentrate the risk:

| File (relative to repo root) | LOC | Why it matters |
|-----------------------------|-----|----------------|
| `src/app/services/plan.service.ts`           | 889 | Pricing, upgrade paths, add-on / ad-hoc inclusion, coupon application, order locking. The highest-risk file in the repo. |
| `src/app/services/user.service.ts`           | 217 | Auth state, current user, login/logout events, storage rehydration. |
| `src/app/cities.service.ts`                  | 173 | Serviceable-area lookups and state/society matching. |
| `src/app/services/notification.service.ts`   | 125 | Notification inbox transitions (new → read → historical). |
| `src/app/services/car.service.ts`            | 122 | Selected car, backup/restore, addon context. |
| `src/app/common/common.service.ts`           |  95 | `getConfigValue` + `planData` – the app's config lookup layer. |
| `src/app/util/util.ts`                       |  62 | DOM scroll helpers. |
| `src/app/header.service.ts`                  |  40 | Header state subject for `AppComponent`. |
| `src/app/endpoints.ts`                       |  24 | Endpoint contract for login. |
| `src/app/services/crypto.service.ts`         |  19 | AES encrypt/decrypt + HMAC-SHA256 (used for Razorpay verification). |
| `src/app/window-ref.service.ts`              |  17 | `window` reference for the Razorpay native bridge. |
| `src/app/services/api.service.ts`            |   9 | Placeholder; locked in as "constructible with no args". |
| **Total**                                    | **1,792** | |

## 5. Baseline numbers (pre-upgrade)

From the most recent successful run (see [`results/baseline-summary.txt`](../results/baseline-summary.txt)):

- **Tests executed:** 116
- **Passing:** 116
- **Failing:** 0
- **Line coverage:** **83.29%**
- **Branch coverage:** **76.61%**
- **Function coverage:** **92.73%**

Per-file numbers are published in [`results/baseline-report.md`](../results/baseline-report.md).

Both line and branch coverage are well above the 50% floor in the task brief.

## 6. How to run the baseline

From the repo root:

```bash
node tests/baseline/run-baseline.mjs
```

Outputs (rewritten on every run):

| File | Format | Purpose |
|------|--------|---------|
| `results/baseline-test-output.txt` | TAP 13 | Per-test pass/fail + coverage table |
| `results/baseline-coverage.lcov`   | LCOV   | For downstream tools (CI, Codecov) |
| `results/baseline-summary.txt`     | raw    | Captured stdout/stderr of the run |
| `results/baseline-report.md`       | md     | Human-readable snapshot |

## 7. How the baseline interacts with the upgrade

1. Task 5/6 upgrades Angular and Ionic incrementally. Because the baseline never imports Angular's real decorators or `@ionic/angular`, it does **not** depend on the version of those libraries – only on `typescript` (as a library) and `crypto-js`/`moment`/`rxjs` for the few services that use them.
2. After every major Angular or Ionic step, re-run `node tests/baseline/run-baseline.mjs`. Any regression in the pure logic (off-by-one in `getUpdatePrice`, mutation of `UpgradePlan`, etc.) will show up as a failing assertion.
3. At the end of Task 7, we also re-run the **legacy** `ng test` pipeline to satisfy the task brief – its output is published separately and its assertion failures are intentionally left unfixed.

## 8. Limitations – honestly stated

- The baseline does **not** exercise any Angular component lifecycle, template bindings, change detection, or router navigation. It is a logic regression harness, not an integration test suite.
- Stubbing `@angular/core` hides any regression that would only surface through Angular's DI container. That trade-off is deliberate: the alternative (fixing the legacy Karma pipeline against Angular 9 on Node 22) would spend upgrade time on something that will be wiped out at Angular 14+.
- `crypto-js` is used as the real implementation, not stubbed. If the upgrade accidentally bumps `crypto-js` to a version with different HMAC output, the baseline will catch it.
- The baseline runs in Node, not in a browser. DOM-dependent bits (the few lines of `util.ts` that touch jQuery collections) use a fake `$` and verify only that the production code path doesn't throw – not the visual outcome.
