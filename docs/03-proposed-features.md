# 03 – Proposed New Features

This document proposes a set of new capabilities that **extend, harden, or modernise** the existing CCube / SSewa product **without displacing** any of the baseline features listed in [`02-features-catalog.md`](./02-features-catalog.md). Each proposal includes intent, justification, alignment with existing features, and a sketch of the integration touch-points.

The criteria used for selecting proposals:

1. **Aligns with an existing feature area** – no "new product" suggestions.
2. **Compatible with the upgrade target** (Angular 17 / Ionic 7 standalone components, Capacitor 5+).
3. **Pays down a real baseline risk** listed in [`01-architecture-overview.md`](./01-architecture-overview.md#10-known-baseline-risks) where possible.
4. **Deliverable incrementally** after the upgrade finishes, without a rewrite.

Priorities: **P0** = addresses a security or correctness risk, **P1** = direct user value, **P2** = developer productivity / longevity.

---

## N1. Configurable Environment & Secret Hygiene  `[P0]`

**Aligns with**: F1 (Auth), F7 (Checkout), F11 (Notifications), F17 (Utilities).

**What**
- Move all hard-coded secrets (Razorpay live keys in `user.service.ts`, Google/Facebook OAuth client IDs in `app.module.ts`, crypto salt in `crypto.service.ts`, `rootkey.csv`) into `src/environments/environment*.ts`.
- Add a lightweight `ConfigService` that reads from `environment` at bootstrap and is the single source of truth for those values.
- Gate `environment.prod.ts` keys behind CI secret injection.

**Why**
- Today, committing the Razorpay live API key or the crypto salt is a genuine security risk. It also blocks multi-environment (dev/staging/prod) deploys.
- Angular 17 standalone bootstrapping (`bootstrapApplication`) makes this a natural refactor point.

**Justification / intent**
- Unblocks proper staging environments.
- Prepares the app for any future pen-test or compliance audit.
- Removes one of the main reasons the repo cannot currently be open-sourced or shared with contractors.

**Touch-points**
- `src/environments/*.ts`
- `src/app/services/user.service.ts`
- `src/app/services/crypto.service.ts`
- `src/app/app.module.ts` (`socialConfigs` factory)

---

## N2. Centralised `ApiClient` with HTTP Interceptor Re-activation  `[P0]`

**Aligns with**: F17 (Utilities), every feature that calls the backend (F1, F3, F4, F6, F7, F9, F11).

**What**
- Promote `src/app/services/api.service.ts` from a placeholder into a strongly-typed `ApiClient` that centralises base URL, headers, error handling, and retry.
- Re-enable `TokenInterceptor` (currently commented out in `app.module.ts`) to inject the bearer token, handle 401 → logout, and normalise errors.
- Define typed endpoint descriptors in `src/app/endpoints.ts` so every service calls `api.call(Endpoints.plans.common)` instead of embedding URL strings.

**Why**
- The codebase today calls `https://api-ccube.herokuapp.com/api/...` in multiple services with ad-hoc error handling. That fan-out is the main reason duplicated retry logic exists.
- A single interceptor is also where we will add CSRF / correlation IDs once the backend exposes them.

**Justification / intent**
- Immediate: reduces copy/paste bugs and makes network errors observable.
- Upgrade-friendly: in Angular 17, `provideHttpClient(withInterceptors([...]))` replaces the `HTTP_INTERCEPTORS` token – the refactor happens for free if we do it during the upgrade.

**Touch-points**
- `src/app/services/api.service.ts`
- `src/app/services/tokenInterceptor.ts`
- `src/app/endpoints.ts`
- All feature services under `src/app/services/`

---

## N3. Offline / Retry Queue for Document Uploads  `[P1]`

**Aligns with**: F10 (Documents), F12 (Photos).

**What**
- Introduce a small `OfflineQueueService` backed by `@ionic/storage-angular` (Ionic 7 API) that:
  - Captures document uploads when offline or the upload fails.
  - Flushes them when connectivity returns, with exponential backoff.
  - Exposes a status badge in F11 (notification menu) so the user sees pending uploads.

**Why**
- The app is a hybrid mobile app, and documents (RC, insurance, PUC, licence) are captured on the road where connectivity is patchy. Losing an upload today means the user has to redo the whole flow.

**Justification / intent**
- Direct user value; reduces support tickets about "I uploaded but it doesn't show".
- Aligns with the existing `DocumentService` + `@ionic/storage` usage in F10.

**Touch-points**
- `src/app/services/document.service.ts`
- New `src/app/services/offline-queue.service.ts`
- `src/app/common/document-uploader/document-uploader.component.ts`
- `src/app/services/notification.service.ts` (status surfacing)

---

## N4. Biometric / Device-PIN Re-authentication  `[P1]`

**Aligns with**: F1 (Auth), F8 (Profile).

**What**
- Add a `BiometricAuthService` that wraps `@capacitor-community/biometric-auth` (Capacitor 5 plugin).
- After a successful OTP login, opt-in store a short-lived auth token in `@capacitor/preferences` and require FaceID / fingerprint / device PIN on subsequent launches, instead of requiring OTP every time.

**Why**
- OTP-only auth is high-friction. Users routinely drop off between "Send OTP" and "Verify OTP".
- iOS and Android both expose first-class biometric APIs via Capacitor 5 – the upgrade to Ionic 7 / Capacitor 5 makes this a drop-in.

**Justification / intent**
- Reduces login friction without weakening security (biometrics never leave the device).
- Keeps the F1 OTP flow as the fallback.

**Touch-points**
- `src/app/services/user.service.ts`
- `src/app/login/*`
- New `src/app/services/biometric-auth.service.ts`

---

## N5. Service Appointment Reminders via Local Notifications  `[P1]`

**Aligns with**: F6 (Dashboard), F11 (Notifications).

**What**
- Use `@capacitor/local-notifications` to schedule reminders for upcoming services in the user's own timezone, so the user is reminded even when offline or when FCM is throttled.
- Hook into the existing `WeeklyScheduleComponent` to schedule/cancel reminders when a schedule changes.

**Why**
- The current notification flow (F11) is 100% server-driven via FCM. Mobile OSes aggressively throttle FCM for low-priority notifications, so users miss reminders.

**Justification / intent**
- Improves a core value proposition of the product (reliable service).
- Reinforces the existing notification inbox (`notif-menu`) without duplicating it.

**Touch-points**
- `src/app/services/notification.service.ts`
- `src/app/common/weekly-schedule/weekly-schedule.component.ts`
- `src/app/common/reschedule/reschedule.component.ts`

---

## N6. In-App Contact & FAQ Section  `[P1]`

**Aligns with**: F8 (Profile / Contact / About).

**What**
- `/contact` currently reuses `ProfileComponent` with a context switch. Replace the context switch with dedicated standalone components:
  - `ContactComponent` – phone / email / WhatsApp deeplink / form to backend.
  - `FaqComponent` – static JSON-driven FAQ with `accordion` widget.
- Keep the backward-compatible route so existing deep links keep working.

**Why**
- `ProfileComponent` is currently overloaded; four unrelated routes render the same component and branch internally. That is a regression waiting to happen.
- Standalone components ship natively in Angular 17, so the split is cheap.

**Justification / intent**
- Developer productivity (simpler components), zero breaking changes for users.
- Enables feature-specific analytics per route.

**Touch-points**
- `src/app/profile/profile.component.ts`
- `src/app/app-routing.module.ts`
- New `src/app/pages/contact/` and `src/app/pages/faq/`

---

## N7. Structured Telemetry (Analytics + Error Reporting)  `[P1]`

**Aligns with**: every feature.

**What**
- Introduce a thin `TelemetryService` that wraps Firebase Analytics (already in the Google config) and Sentry (Angular 17 has a first-class SDK).
- Capture:
  - Route changes (RouterModule `NavigationEnd`)
  - Payment events (F7)
  - OTP success/failure (F1)
  - Document upload failures (F10)
  - Uncaught JS errors (`ErrorHandler`)

**Why**
- There is currently no way to know why a user drops out of checkout or login. The upgrade work itself needs this feedback loop.

**Justification / intent**
- Essential for regression detection during and after the Angular/Ionic upgrade.
- Firebase is already provisioned (`google-services.json`, `GoogleService-Info.plist`), so integration is cheap.

**Touch-points**
- `src/app/services/telemetry.service.ts` (new)
- `src/app/app.module.ts` / Angular 17 `bootstrapApplication` providers

---

## N8. Dark Mode & Accessibility Pass  `[P2]`

**Aligns with**: F15 (Navigation chrome), F16 (Common widgets), F2 (Home).

**What**
- Use Ionic 7 CSS variables to support `prefers-color-scheme` with a manual toggle in the menu.
- Run an audit (`axe-core` or `@ionic/cli`'s a11y checks) and add `aria-*` attributes to the shared widgets in `src/app/common/`.

**Why**
- Dark mode is a baseline expectation on iOS/Android today.
- Accessibility issues are rampant in the current widget library (no alt text, custom buttons as `<div>`), and Ionic 7 gives us proper primitives.

**Justification / intent**
- User experience parity with peer apps, plus compliance with Play Store accessibility reviews.

**Touch-points**
- `src/theme/variables.scss`
- `src/global.scss`
- `src/app/common/*`

---

## N9. Standalone Component Migration  `[P2]`

**Aligns with**: the entire app.

**What**
- Incrementally convert feature modules to Angular 17 **standalone** components starting with the leaf widgets in `src/app/common/`.
- Retain the module exports during the transition (Angular 17 supports both styles).

**Why**
- Standalone is the default going forward in Angular. NgModule-based bootstrapping is still supported but will diverge from the happy path over time.
- Widgets in `common/` are self-contained and the safest place to start.

**Justification / intent**
- Long-term maintainability; enables deferrable loading (`@defer`) and signal-based inputs.

**Touch-points**
- `src/app/common/common.module.ts`
- every `src/app/common/<widget>/*.component.ts`

---

## N10. Replace TSLint with ESLint + Prettier  `[P2]`

**Aligns with**: project hygiene.

**What**
- Run `ng add @angular-eslint/schematics` during the Angular 12 step.
- Delete `tslint.json` and `codelyzer`.
- Add `prettier` + `eslint-plugin-prettier`.

**Why**
- TSLint has been deprecated since 2019 and will actively fight Angular 13+ tooling.

**Justification / intent**
- Required by the upgrade plan, not a "nice to have".

**Touch-points**
- `tslint.json` (delete)
- `package.json` scripts
- `.eslintrc.json` (new)
- `.prettierrc` (new)

---

## N11. Deprecate `@ionic-native/*` → `@awesome-cordova-plugins/*`  `[P0 for upgrade]`

**Aligns with**: every feature that uses a Cordova plugin (F1, F5, F10, F11, F12, F13).

**What**
- Replace every `@ionic-native/<x>` import with the equivalent `@awesome-cordova-plugins/<x>`.
- Prefer Capacitor-native replacements where they exist:
  - `@capacitor/camera` (replaces `@ionic-native/camera`)
  - `@capacitor/geolocation` (replaces `@ionic-native/geolocation`)
  - `@capacitor/filesystem` (replaces `@ionic-native/file`)
  - `@capacitor/preferences` (replaces `@ionic/storage` for small KV)
  - `@capacitor/share` (replaces `@ionic-native/social-sharing`)
  - `@capacitor/push-notifications` (replaces `@ionic-native/firebase-messaging`)
  - `@capacitor/local-notifications` (new, enables N5)

**Why**
- `@ionic-native` is officially retired. Ionic 6+ ships `@awesome-cordova-plugins` as the successor namespace, and many plugins are better served natively by Capacitor 5.

**Justification / intent**
- Required to finish the Ionic 7 upgrade cleanly.
- Reduces the Cordova footprint, which is the primary source of build-time pain on CI.

**Touch-points**
- `package.json` dependencies
- `src/app/app.module.ts` providers
- Feature services under `src/app/services/`

---

## N12. Plan Comparison Persistence & Share Link  `[P2]`

**Aligns with**: F3 (Plans), F13 (Sharing).

**What**
- Let the user persist a "comparison set" (e.g. Silver vs Gold) in `@capacitor/preferences`, and share a deep link that restores it on another device.
- Deep link format: `ccube://plans/compare?set=silver,gold`.

**Why**
- Users often compare plans with a partner or mechanic off-device. Today there is no way to share the comparison state.

**Justification / intent**
- Reinforces F3 and F13 without net new infrastructure.

**Touch-points**
- `src/app/plan-comparison/plan-comparison.component.ts`
- `src/app/services/share.service.ts`
- `src/app/app-routing.module.ts` (deep link handling)

---

## Summary – How the Proposals Map Back to Existing Features

| Proposal | Primary existing feature(s) it reinforces |
|----------|-------------------------------------------|
| N1 – Secret hygiene            | F1, F7, F11, F17 |
| N2 – Central `ApiClient`       | F1, F3, F4, F6, F7, F9, F11 |
| N3 – Offline upload queue      | F10, F12 |
| N4 – Biometric re-auth         | F1, F8 |
| N5 – Local reminders           | F6, F11 |
| N6 – Split Contact/FAQ         | F8 |
| N7 – Telemetry                 | All |
| N8 – Dark mode / a11y          | F2, F15, F16 |
| N9 – Standalone migration      | All |
| N10 – ESLint + Prettier        | Tooling |
| N11 – Drop `@ionic-native`     | F1, F5, F10, F11, F12, F13 |
| N12 – Plan comparison share    | F3, F13 |

Every proposal either reinforces an existing feature or is required for the Angular/Ionic upgrade path. None introduces a new product area that would distract from the current roadmap.
