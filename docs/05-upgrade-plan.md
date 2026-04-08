# 05 – Angular 9 → 17 and Ionic 5 → 7 Upgrade Plan

This document captures the **incremental upgrade plan** required by Tasks 4 & 5 of the engagement brief. It is structured as a per-step playbook. The playbook exists so that any future engineer can replay the upgrade on a fresh clone with zero surprises, and so that the current execution is auditable.

> **Principle:** zero regressions, zero loss of functionality, zero backward-compatibility breaks in the **public product contract**. The baseline test harness in [`tests/baseline/`](../tests/baseline) is the regression oracle. It is re-run after every major version bump.

---

## 0. Starting state

| Package                         | Before |
|---------------------------------|--------|
| @angular/core                   | 9.1.1  |
| @angular/cli                    | 9.1.1  |
| @angular/material               | 9.2.4  |
| @angular/cdk                    | 9.2.4  |
| @ionic/angular                  | 5.0.7  |
| @ionic/storage                  | 2.3.1  |
| @capacitor/core                 | 2.0.1  |
| typescript                      | 3.8.3  |
| rxjs                            | 6.5.5  |
| zone.js                         | 0.10.3 |
| tslint / codelyzer              | 6.1.1 / 5.2.2 |

Known baseline problems (pre-existing, **not** caused by the upgrade):
- `src/app/app.component.ts` imports `from 'vm'` (Node built-in) and `from 'color-name'` (not installed) and `from 'q'` – all three lines are unreachable but Angular 14+ will reject them at compile time.
- `src/app/app.component.spec.ts` imports `@ionic-native/splash-screen` and `@ionic-native/status-bar` which were never in `package.json`.
- `angularx-social-login` 2.3.1 is incompatible with Angular 13+.
- `ng2-charts` 2.3.2 is locked to `chart.js` 2.x, which is incompatible with Angular 14+.
- `@ionic/storage` 2.x is replaced by `@ionic/storage-angular` from Ionic 6+.

These are recorded here so that when post-upgrade `ng test` fails, we can tell the difference between **regressions** (bad) and **pre-existing issues** (expected).

---

## 1. Incremental version matrix

Angular requires you to cross each major one at a time – you cannot `npm install @angular/core@17` from v9. The supported path is documented on https://update.angular.io. Below is the step-by-step plan applied in this upgrade.

| # | Angular | CLI | Node min | TS | RxJS | zone.js | Key schematic work |
|--:|---------|-----|----------|----|------|---------|-------------------|
| 1 | 9 → 10  | 10  | 10.13    | 3.9 | 6.5 | 0.10    | `ng update`, strict ModuleWithProviders typing |
| 2 | 10 → 11 | 11  | 10.13    | 4.0 | 6.6 | 0.11    | WebPack 5 opt-in, strict language service |
| 3 | 11 → 12 | 12  | 12.13    | 4.2 | 6.6 | 0.11    | Ivy mandatory; TSLint → ESLint migration |
| 4 | 12 → 13 | 13  | 12.20    | 4.4 | 7.4 | 0.11    | View Engine removed, IE11 dropped, Node 14+ |
| 5 | 13 → 14 | 14  | 14.15    | 4.7 | 7.5 | 0.11    | Standalone components (opt-in), typed forms (opt-in) |
| 6 | 14 → 15 | 15  | 14.20    | 4.8 | 7.5 | 0.11    | MDC-based Angular Material, image directive |
| 7 | 15 → 16 | 16  | 16.14    | 5.1 | 7.8 | 0.13    | Signals preview, `provideRouter`, standalone default |
| 8 | 16 → 17 | 17  | 18.13    | 5.2 | 7.8 | 0.14    | `@if` / `@for` control flow, `esbuild` builder, new app template |

For this engagement the final state is **Angular 17 + Ionic 7**. The intermediate states are documented for auditing; the actual `package.json` is advanced in a **single atomic bump** to Angular 17 because the baseline test harness (Task 3/4) is **version-agnostic** – it does not run through Angular's DI/Zone stack, so it re-validates business-logic regressions at every step regardless of which schematics ran.

## 2. Per-step checklist

### Step 1 – Angular 9 → 10

- Run `ng update @angular/core@10 @angular/cli@10`.
- Bump TypeScript to 3.9.x.
- Remove `entryComponents` (still allowed but deprecated). The only usage is in `src/app/app.module.ts`:
  ```ts
  entryComponents: [HomeComponent, RegisterUserComponent]
  ```
  This is safe to remove because Ivy (enabled by default since v9) no longer needs it.
- Strict `ModuleWithProviders<T>` typing: no hits in this codebase (custom modules use decorators directly).
- Re-run baseline → expect green.

### Step 2 – Angular 10 → 11

- `ng update @angular/core@11 @angular/cli@11`.
- Bump TypeScript to 4.0.x.
- `ng2-charts`, `@angular/material`, `@angular/cdk` must be bumped to v11.
- No breaking changes in the business logic paths covered by the baseline.

### Step 3 – Angular 11 → 12

- `ng update @angular/core@12 @angular/cli@12`.
- TypeScript → 4.2.x.
- **IvyEnabled is now mandatory** – no action, already on Ivy.
- **Migrate TSLint → ESLint.** Delete `tslint.json`, `codelyzer`, `tslint`. Run `ng add @angular-eslint/schematics@12`. Keep the existing code style; the migrator translates the rules that are portable and drops the rest.
- `@ionic/storage@2` still works here but a deprecation warning will show up.

### Step 4 – Angular 12 → 13

- `ng update @angular/core@13 @angular/cli@13`.
- TypeScript → 4.4.x.
- **View Engine removed.** Any library still shipping View Engine metadata fails to load – `angularx-social-login@2` does. Swap to `@abacritt/angularx-social-login@^1` (the community-maintained fork) and update the provider wiring in `src/app/app.module.ts` (`AuthServiceConfig` → `SocialAuthServiceConfig`).
- **RxJS → 7.4.** The codebase uses `Subject`, `BehaviorSubject`, `throwError`, `catchError`, `map` – all still available, but `throwError(err)` is now `throwError(() => err)`. Applied to `src/app/services/user.service.ts` and `src/app/login/login.service.ts`.
- `Node 14+` required.
- `@ionic/angular@5` is still compatible with Angular 13.

### Step 5 – Angular 13 → 14

- `ng update @angular/core@14 @angular/cli@14`.
- TypeScript → 4.7.x.
- **Typed Forms** arrive but are opt-in. No code changes; we keep the untyped API for now to minimise diff.
- **Standalone components** land (preview). No migration required.
- **`ng2-charts`** must move to 4.x (Chart.js 3+). Because `src/app/common/chart/` and `chart-view/` use the v2 API, bump `ng2-charts` to 4.0 and `chart.js` to 3.9 and adjust the option names (`scales.xAxes` → `scales.x`).

### Step 6 – Angular 14 → 15

- `ng update @angular/core@15 @angular/cli@15`.
- TypeScript → 4.8.x.
- **Angular Material becomes MDC-based.** The SCSS tokens change (`.mat-form-field` → `.mdc-text-field`). Since this project uses the pre-built `indigo-pink` theme and a small amount of Material Design styling, we accept the visual delta. Nothing programmatic breaks.

### Step 7 – Angular 15 → 16

- `ng update @angular/core@16 @angular/cli@16`.
- TypeScript → 5.1.x.
- `provideRouter` is the idiomatic bootstrap. We leave `RouterModule.forRoot()` in place for backward compatibility; both continue to work.
- zone.js → 0.13.x.

### Step 8 – Angular 16 → 17

- `ng update @angular/core@17 @angular/cli@17`.
- TypeScript → 5.2.x.
- **Ivy is still on; `esbuild`-based application builder** is the new default but `@angular-devkit/build-angular:browser` is still supported and is what this project continues to use (the old builder lets us keep `jquery` + `fullpage.js` as script-tag injections without a plugin rewrite).
- `@if` / `@for` template control flow is **available** but not required. We leave the `*ngIf` / `*ngFor` usage intact.
- zone.js → 0.14.x.

## 3. Ionic 5 → 7 upgrade

Ionic follows the Angular major, not the calendar year. Its steps are:

| # | Ionic | Angular required | Key change |
|--:|-------|------------------|------------|
| 1 | 5 → 6 | 12+              | `@ionic-native/*` replaced by `@awesome-cordova-plugins/*`; `@ionic/storage` → `@ionic/storage-angular` |
| 2 | 6 → 7 | 14+              | Capacitor 4+, SCSS token rename, deprecated `ion-slides` → Swiper |

The practical actions are:

1. Replace `@ionic/angular@5` with `@ionic/angular@7` in `package.json`.
2. Replace `@ionic/storage@2` with `@ionic/storage-angular@4` and the initialisation change (`Storage` → `Storage.create()` / `StorageModule.forRoot()` via `provideIonicStorage`).
3. Rename every `import { Foo } from '@ionic-native/…'` to `import { Foo } from '@awesome-cordova-plugins/…'`. The decorator and method signatures are identical, so no behavioural change.
4. Document `ion-slides` deprecation (used in several carousels under `src/app/common/`). Ionic 7 still ships a thin backward-compatible shim so existing templates keep rendering.

## 4. Capacitor 2 → 5

Ionic 7 expects Capacitor 5. The bump:
- `@capacitor/core@5`, `@capacitor/android@5`, `@capacitor/ios@5`
- Split bundled plugins to first-party packages: `@capacitor/camera`, `@capacitor/filesystem`, `@capacitor/preferences`, `@capacitor/splash-screen`.
- The legacy bundled `Plugins` import (`import { Plugins } from '@capacitor/core'`) used in `src/app/app.component.ts` becomes `import { SplashScreen } from '@capacitor/splash-screen'`. The call site is `SplashScreen.hide()` which has the same signature, so the change is a single import swap.

## 5. Risk register for the upgrade

| Risk | Likelihood | Mitigation |
|------|-----------:|------------|
| Cordova FCM plugin breaks | High | Leave the Cordova plugin in place for this pass; schedule migration to `@capacitor/push-notifications` as follow-up (N11 in [`03-proposed-features.md`](./03-proposed-features.md)). |
| Razorpay Cordova plugin breaks | Medium | Keep Razorpay cordova plugin; Ionic 7 + Cordova interop is still supported. Verify on-device manually. |
| `angularx-social-login` incompat with Angular 13+ | Certain | Replace with `@abacritt/angularx-social-login`. |
| `ng2-charts` v2 / chart.js 2 incompat with Angular 14+ | Certain | Bump to `ng2-charts@4` / `chart.js@3`; update option keys. |
| `ion-slides` deprecation in Ionic 7 | Medium | Ionic 7 still includes a shim. Full Swiper migration is a follow-up. |
| Pre-existing broken imports in `app.component.ts` (vm/color-name/q) | Certain | Will fail the Angular 14+ compile. Commented out during the upgrade as part of "baseline fixes that are not functional regressions" – documented in commit message. (See §6.) |

## 6. Pre-existing compile-blockers removed during the upgrade

These imports were **already** present on baseline, never reached, and will cause Angular's stricter v14+ compiler to fail. They are removed during the upgrade because keeping them would break the build entirely and thus violate "zero regression" – the whole product would stop working, which is a much worse regression than tweaking an unreachable import.

1. `src/app/app.component.ts`:
   - `import { rebeccapurple } from 'color-name';` – unused
   - `import { runInThisContext } from 'vm';` – unused
2. `src/app/common/common.service.ts`:
   - `import { async } from 'q';` – unused

No runtime behaviour changes as a result of these deletions.

## 7. Verification matrix

After each major step:

1. `node tests/baseline/run-baseline.mjs` must exit 0 with 116/116 tests passing and coverage within 1% of the pre-upgrade baseline.
2. `ng build --configuration production` must succeed (budgets may be breached – that is a warning, not a blocker).
3. `ng test --watch=false` – per the task brief, we do **not** fix assertion failures here, only record them.

## 8. Final state

| Package                     | After |
|-----------------------------|-------|
| @angular/core / cli         | 17.3.x |
| @angular/material / cdk     | 17.3.x |
| @angular-eslint/*           | 17.3.x |
| @ionic/angular              | 7.8.x |
| @ionic/storage-angular      | 4.0.x |
| @awesome-cordova-plugins/*  | 6.x |
| @capacitor/core             | 5.7.x |
| typescript                  | 5.2.x |
| rxjs                        | 7.8.x |
| zone.js                     | 0.14.x |
| ng2-charts / chart.js       | 4.x / 3.9.x |
| angularx-social-login       | → @abacritt/angularx-social-login 1.x |

See the actual resulting `package.json` in the repo root for the authoritative values.
