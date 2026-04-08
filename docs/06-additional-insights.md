# 06 – Additional Insights & Gap-Fill

This document captures facts, decisions, and concerns about the CCube / SSewa codebase that are **not** covered in `01`–`05`. It exists because the earlier docs focus on the architecture, features, testing, and upgrade plan – but leave gaps around data shapes, storage keys, hard-coded configuration, runtime quirks, and the new offline-mode subsystem added in this engagement. Future contributors should read this **after** `01–05` to get a complete picture.

---

## 1. Seed JSON assets under `src/assets/`

The app ships with several static JSON files that act as **fallback data** when the backend is unreachable. Some are consumed directly by components; others exist as historical seed data. None are currently wired to any build-time validation.

| File | Consumed by | Shape (top-level keys) | Notes |
|------|-------------|------------------------|-------|
| `src/assets/planslist.json` | `plan.service.ts` (seed fallback) | `features[]`, `plans[]` | `features[*]` is a flat catalogue; `plans[*]` is the subscription catalogue with `price`, `features[]`, `code`. |
| `src/assets/featurelist.json` | `home.component.ts` | Array of `{name, description, icon}` | Drives the "why choose us" carousel on `/home`. |
| `src/assets/carslist.json` | `car.service.ts`, `car-form` | Array of `{maker, models[]}` | Seed list for the car picker when `POST /car/details/{regNo}` has not yet returned. |
| `src/assets/contributionslist.json` | `home.component.ts` | Array of `{code, count}` | Drives animated counters via `flip-counter-js`. |
| `src/assets/faq.json` *(new, N6)* | `FaqComponent` | Array of `{question, answer, tags}` | Added by N6; see §6 below. |
| `src/assets/mock-data/*.json` *(new, Offline Mode)* | `OfflineHttpInterceptor` | Various | Added by Offline Mode; see §5 below. |

**Gap filled:** `02-features-catalog.md` lists these assets but not their shapes or consumers.

---

## 2. Hard-coded configuration surfaces

Concerns flagged in `03-proposed-features.md` N1 – enumerated here exhaustively so a future `ConfigService` refactor knows exactly what to move.

| Secret / config | File | Line (approx.) | Risk |
|-----------------|------|----------------|------|
| Razorpay test key `rzp_test_lzrrcON3EuW3nI` | `src/app/services/user.service.ts` | 13 | Low (test key) but should not be in source. |
| Razorpay API secret `caFrU097wpTYMi0xQgcCfonJ` | `src/app/services/user.service.ts` | 14 | **High** – live secrets in source. |
| Google OAuth client ID `455316244979-...` | `src/app/app.module.ts` | 53 | Medium – leaks app identity. |
| Facebook App ID `174475890475329` | `src/app/app.module.ts` | 49 | Medium. |
| Backend domain `api-ccube.herokuapp.com` | `src/app/services/checkout.service.ts:35`, `src/app/login/login.service.ts:33`, `src/app/common/common.service.ts:4` | – | **Three duplicate definitions** – must be deduplicated alongside N2. |
| Crypto salt | `src/app/services/crypto.service.ts` | – | **High** – used for Razorpay signature verification. |
| AWS credentials blob | `src/app/rootkey.csv` | – | **Critical** – committed raw AWS root key. Any upgrade step must not propagate this. |

**Gap filled:** the baseline overview mentions these risks in passing; here they are enumerated with file/line anchors.

---

## 3. Browser-storage key inventory

Every key the app reads or writes on `localStorage` / `sessionStorage`, with the service that owns it.

| Storage | Key | Owner | Lifetime | Shape |
|---------|-----|-------|----------|-------|
| `localStorage` | `commonData` | `common.service.ts` (`saveCommonData`/`readCommonData`) | Persists, refreshed on init | `{ config:[{name,value}], plans:[…], addons:[…], waterSaved, updatedAt }` |
| `localStorage` | `currentUser` | `user.service.ts` | Until logout | `IUser` (`services/IUser.ts`) |
| `localStorage` | `userToken` | `user.service.ts` | Until logout | JWT string |
| `localStorage` | `currentCar` | `car.service.ts` | Session + cross-load | Car object from `carslist.json` / API |
| `localStorage` | `backupCar` | `car.service.ts` | While a swap is in progress | Car object |
| `localStorage` | `updatedWaterCount` | `common.service.ts` | Refreshed on init | Number |
| `localStorage` | `newNotifications` | `notification.service.ts` | Until read | `Array<notif>` |
| `localStorage` | `historicalNotifications` | `notification.service.ts` | Persistent history | `Array<notif>` |
| `localStorage` | `readNotifications` | `notification.service.ts` | Persistent | `Array<id>` |
| `localStorage` | `offlineMode` *(new)* | `offline.service.ts` | Persistent preference | `'true' \| 'false'` |
| `localStorage` | `telemetryLog` *(new, N7)* | `telemetry.service.ts` | Rolling buffer (capped at 200) | Array of event records |
| `localStorage` | `themeMode` *(new, N8)* | `theme.service.ts` | Persistent preference | `'dark' \| 'light' \| 'system'` |
| `sessionStorage` | `currentAddon` | `car.service.ts` | Per session | Addon object |
| `sessionStorage` | `allowBack` | `app.component.ts` | Per route | `'true' \| 'false'` |
| `sessionStorage` | `forDemo` | `app.component.ts` | Per session | Flag |
| `@ionic/storage` | `docs-{phone}` | `document.service.ts` | Persistent | Array of document records per user |

**Gap filled:** no earlier doc enumerated the complete storage-key surface. This is important for the offline mode (which must seed these keys) and for the upgrade (which will re-key some of them when moving to `@capacitor/preferences`).

---

## 4. Routing quirks and "overloaded" components

### 4.1 `ProfileComponent` serves four routes

`src/app/profile/profile.component.ts` inspects `this.route.snapshot.routeConfig.path` inside `ionViewWillEnter` and switches on `'profile' | 'refer' | 'contact' | 'about'`. The implementation has a **known fall-through bug**: the `default:` branch is placed *before* the `case 'contact'` and `case 'about'` branches, so `/contact` and `/about` currently rely on JS's permissive switch semantics to still reach their branches. N6 (see `03-proposed-features.md`) splits this out; the historical branch is preserved for backward-compat deep links.

### 4.2 Route list vs. the navigation chrome

`/home`, `/plans`, `/profile`, `/refer`, `/contact`, `/about`, `/dashboard`, `/signup`, `/leads` are wired in `app-routing.module.ts`. In addition, the side menu in `src/app/common/menu/menu.component.ts` references `/dashboard/service` and `/dashboard/select-car` sub-routes that belong to the lazy `DashboardModule`.

**Gap filled:** `01-architecture-overview.md §5` lists only the top-level paths. The dashboard sub-routes (declared in `dashboard-routing.module.ts`) are missing. They are:

| Sub-path | Component |
|----------|-----------|
| `/dashboard/select-car` | `car-form` |
| `/dashboard/service` | `service-page` |
| `/dashboard/checkout` | `checkout` |
| `/dashboard/` (default) | `dashboard-page` |

### 4.3 Routes added by this engagement

| Path | Component | Origin |
|------|-----------|--------|
| `/contact` | `ContactComponent` (standalone) | N6 – replaces the `ProfileComponent` context switch |
| `/faq` | `FaqComponent` (standalone) | N6 – new |
| – | `/refer`, `/about` still hit `ProfileComponent` | Unchanged, backwards-compat preserved |

---

## 5. Offline Mode – design notes

Offline Mode is a new subsystem added in this engagement. It is **ON by default** and makes the entire application navigable without a live backend.

### 5.1 Goals

- Let a developer, reviewer, or demo user click through every route with **no network**.
- Zero code-changes in feature services – the switch happens inside an HTTP interceptor and a one-shot storage seeder.
- Keep the mock data shaped **exactly** like real backend responses so switching back to live mode is transparent.

### 5.2 Architecture

```
┌─────────────────────┐
│ AppComponent bootstrap │
└──────────┬──────────┘
           │
           ▼
┌──────────────────────┐   reads environment.offlineMode (true by default)
│   OfflineService     │   and localStorage['offlineMode'] override
└──────────┬───────────┘
           │ enabled?
           ▼
┌────────────────────────────┐
│ Seed localStorage:         │
│   commonData, currentUser, │
│   currentCar, newNotifs    │
└──────────┬─────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ OfflineHttpInterceptor       │
│  (wired via HTTP_INTERCEPTORS) │
│                              │
│  Matches every outbound      │
│  URL against a table in      │
│  mock-data-registry.ts and   │
│  returns a canned response   │
└──────────────────────────────┘
```

### 5.3 Files

| Path | Role |
|------|------|
| `src/environments/environment.ts` | Adds `offlineMode: true`. |
| `src/app/services/offline.service.ts` | Toggle state (RxJS `BehaviorSubject`), localStorage-backed, exposes `isOffline()`, `enable()`, `disable()`, `seed()`. |
| `src/app/services/offline.interceptor.ts` | Implements `HttpInterceptor`; short-circuits `/api/...` and social-auth calls. Matches by regex + method. |
| `src/app/services/mock-data-registry.ts` | Table mapping `{method, urlPattern} -> () => response` backed by JSON in `src/assets/mock-data/`. |
| `src/assets/mock-data/common-data.json` | Shape: `{ config[], plans[], addons[], waterSaved }` – mirrors `GET /plan/getCommonData/:city`. |
| `src/assets/mock-data/current-user.json` | Shape: `IUser` – mirrors the login response. |
| `src/assets/mock-data/subscriptions.json` | Shape: `{ subscriptions[] }` – mirrors `POST /subscription/getsubscriptions`. |
| `src/assets/mock-data/cars.json` | Shape: `{ cars[] }` – mirrors `POST /car/details/:regNo`. |
| `src/assets/mock-data/notifications.json` | Shape: `{ new[], historical[] }` – seed for the notification inbox. |
| `src/app/common/offline-badge/offline-badge.component.ts` | Small always-visible badge that says "OFFLINE DEMO". Clicking it opens a toggle. |

### 5.4 Toggle behaviour

- `environment.offlineMode === true` turns the interceptor ON at bootstrap.
- `localStorage['offlineMode']` overrides the environment (supports `'true' | 'false'`) so a reviewer can flip it without rebuilding.
- The UI badge calls `offlineService.disable()` / `.enable()` and reloads the page so the seeded storage is re-primed.

### 5.5 Non-goals

- Offline mode does **not** persist user actions (it is read-only for mutations). `POST` endpoints return `{success: true}` with the next logical state but nothing is written back; refreshing resets.
- It does **not** simulate network latency or failures. Those are follow-up concerns if we want to stress-test UI loading states.

---

## 6. N6 – Contact / FAQ split (design notes)

`ContactComponent` and `FaqComponent` are **standalone** Angular 17 components (forward-looking; `N9` will migrate the rest). They live under `src/app/pages/contact/` and `src/app/pages/faq/`.

### 6.1 Backward compatibility

The legacy `/contact` route still resolves, but it now points at `ContactComponent` instead of `ProfileComponent`. `/about` and `/refer` continue to hit `ProfileComponent` so nothing breaks. If an external deep link used `/contact`, the new component is a drop-in.

### 6.2 FAQ data source

`src/assets/faq.json` is the sole source. An entry looks like:
```json
{ "question": "…", "answer": "…", "tags": ["billing"] }
```
`FaqComponent` loads the file via `HttpClient` – meaning in offline mode the interceptor returns the asset verbatim (assets go through Angular's dev server, not the API interceptor).

### 6.3 Contact channels

Phone, email, and WhatsApp deeplink. Hard-coded at first and documented in the component class; a follow-up refactor should read them from `getConfigValue()` (which goes through `commonData.config[]`).

---

## 7. N7 – Telemetry service (design notes)

`src/app/services/telemetry.service.ts` captures structured events at key lifecycle moments. It is intentionally **vendor-agnostic** at this step – it writes to `console.debug` and `localStorage['telemetryLog']` (capped at 200 entries). A future step wires it to Firebase Analytics + Sentry.

### 7.1 Events emitted

| Event code | Trigger | Payload |
|------------|---------|---------|
| `route.change` | `Router.NavigationEnd` | `{ url, timestamp }` |
| `auth.otp.sent` | `LoginService.sendOtp` | `{ maskedPhone }` |
| `auth.otp.verified` | `LoginService.verifyOtp` | `{ success }` |
| `payment.started` | `CheckoutService.startPayment` | `{ amount, plan }` |
| `payment.completed` | `CheckoutService.verifyPayment` | `{ success, orderId }` |
| `document.upload.failed` | `DocumentService.upload` catch | `{ type, reason }` |
| `error.uncaught` | `ErrorHandler` | `{ message, stack }` |
| `feature.offline.toggle` | `OfflineService.enable/disable` | `{ enabled }` |
| `feature.theme.toggle` | `ThemeService.setMode` | `{ mode }` |

### 7.2 ErrorHandler wiring

`TelemetryErrorHandler` extends Angular's `ErrorHandler` and is provided in `app.module.ts`. It still delegates to the default handler so the dev console behaviour is unchanged.

### 7.3 Reading the buffer

`telemetryService.getEvents()` returns the buffered events. The puppeteer testbed uses this to verify that route-change events fire during a demo run.

---

## 8. N8 – Dark mode & accessibility (design notes)

### 8.1 Theme modes

`ThemeService` supports three modes:

| Mode | Behaviour |
|------|-----------|
| `system` | Follow `prefers-color-scheme` via a `MediaQueryList` listener. |
| `light` | Force the light palette regardless of system preference. |
| `dark`  | Force the dark palette regardless of system preference. |

The active mode is persisted to `localStorage['themeMode']`. On bootstrap, `ThemeService.init()` reads the preference, applies the matching `.theme-dark` / `.theme-light` class to `document.body`, and registers the media query listener when mode is `system`.

### 8.2 CSS variables

The dark palette lives in `src/theme/dark-mode.scss` and overrides Ionic's CSS variables scoped to `body.theme-dark`:

```scss
body.theme-dark {
  --ion-background-color: #121212;
  --ion-text-color: #f0f0f0;
  --ion-color-primary: #4da3ff;
  --ion-item-background: #1b1b1b;
  --ion-toolbar-background: #1b1b1b;
  --ion-border-color: #2a2a2a;
  --ccube-surface: #1e1e1e;
  --ccube-surface-alt: #262626;
  --ccube-link: #4da3ff;
}
```

Only CSS variables are overridden; component templates are untouched. This keeps the feature reversible.

### 8.3 Accessibility pass (non-exhaustive, first sweep)

`N8` also starts an accessibility audit of the shared widgets in `src/app/common/`. The first sweep adds:

- `aria-label` on the hamburger toggle in `navbar/`.
- `role="button"` + `tabindex="0"` on `div`-based buttons in `cta/` and `feature-card/`.
- Contrast correction in `offline-badge` for the dark palette.
- `aria-live="polite"` on `toast` regions in `thanks-page/`.

This is recorded here (rather than in `02-features-catalog.md`) because it cuts across many files and is ongoing.

---

## 9. Error handling – baseline observations

This is not strictly a gap in `01`, but worth recording: the baseline has **no centralised error handling**. Each service uses a different pattern:

- `user.service.ts` uses `catchError` to rethrow but also calls `alertController` directly.
- `common.service.ts` calls `alert(...)` (the native dialog) on connectivity failure.
- `login.service.ts` uses `.subscribe(success, error)` with inline callbacks.
- `checkout.service.ts` mixes promises and observables.

N2 (central `ApiClient`) and N7 (TelemetryService + `ErrorHandler`) together resolve this. This doc records it so a future contributor doesn't have to re-discover the pattern by grepping.

---

## 10. Upgrade-path implications of the new features

The features added in this engagement are intentionally forward-compatible with the upgrade plan in `05-upgrade-plan.md`:

- **Offline mode** is wired via `HTTP_INTERCEPTORS`, which is valid on Angular 9-15; on Angular 16+ it can be migrated to `provideHttpClient(withInterceptors([...]))` without behavioural change.
- **N6 standalone components** are Angular-17 shaped but declared inside an `NgModule` via the `imports: [ContactComponent]` syntax – Angular 14+ also supports this, so the migration can start earlier if desired.
- **N7 telemetry** is a plain service with no Angular-version lock-in.
- **N8 theming** only touches SCSS variables and a small `ThemeService`; it is version-agnostic.

None of the new code imports `@ionic-native/*`, and none of it depends on Cordova plugins – so `N11` (drop `@ionic-native`) will not regress it.

---

End of insights document.
