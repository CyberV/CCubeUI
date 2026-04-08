# 01 – Architecture Overview

## 1. Application Identity

| Attribute         | Value |
|-------------------|-------|
| Package name      | `ccubeapp` (see `package.json`) |
| Product name      | CCube / SSewa |
| Bundle ID         | `com.ccube.customers` (see `capacitor.config.json`, `config.xml`) |
| Domain            | Automotive / car care subscription services |
| Distribution      | iOS, Android, Web (PWA) from a single codebase |

## 2. Tech Stack (Baseline – pre-upgrade)

| Layer             | Technology                                    | Version (baseline) |
|-------------------|-----------------------------------------------|--------------------|
| Framework         | Angular                                       | 9.1.1 |
| UI kit            | Ionic Angular                                 | 5.0.7 |
| Native bridge     | Capacitor                                     | 2.0.1 |
| Native bridge     | Cordova (Android)                             | 9.0.0 |
| Native bridge     | Cordova (iOS)                                 | 6.1.1 |
| Language          | TypeScript                                    | 3.8.3 |
| Reactive layer    | RxJS                                          | 6.5.5 |
| Zone library      | zone.js                                       | 0.10.3 |
| Design system     | Angular Material                              | 9.2.4 |
| Charting          | Chart.js / ng2-charts                         | 2.9.3 / 2.3.2 |
| Payment           | Razorpay (Cordova + REST)                     | 2.0.6 |
| Auth              | angularx-social-login (Google, Facebook)      | 2.3.1 |
| Encryption        | crypto-js                                     | 4.0.0 |
| Cloud storage     | aws-sdk / aws-s3                              | 2.819.0 / 2.0.5 |
| Date/time         | moment                                        | 2.29.1 |
| Storage           | @ionic/storage                                | 2.3.1 |
| Test runner       | Karma + Jasmine                               | 5.0.1 / 3.5 |
| Coverage          | karma-coverage-istanbul-reporter              | 2.1.1 |
| Linter            | TSLint (legacy)                               | 6.1.1 |

## 3. Project Structure

```
ui/
├── angular.json                # Angular CLI workspace
├── ionic.config.json           # Ionic workspace
├── capacitor.config.json       # Capacitor config (appId, webDir)
├── config.xml                  # Cordova config (platforms, plugins, permissions)
├── karma.conf.js               # Karma test runner config
├── tsconfig*.json              # TypeScript configs
├── tslint.json                 # TSLint rules (pre-ESLint era)
├── patch.js                    # Pre-build patch helper
├── resources/                  # App icons / splash
├── e2e/                        # Protractor end-to-end tests
├── src/
│   ├── main.ts                 # Bootstrap entry
│   ├── polyfills.ts
│   ├── index.html
│   ├── environments/           # env.ts / env.prod.ts
│   ├── theme/                  # SCSS variables
│   ├── assets/                 # JSON data, images, one-page-scroll
│   └── app/                    # Application source (see section 4)
└── docs/                       # This folder
```

## 4. Module Map

Top-level `@NgModule` tree, rooted at `src/app/app.module.ts`:

```
AppModule (src/app/app.module.ts)
├── BrowserModule
├── BrowserAnimationsModule
├── IonicModule.forRoot()
├── IonicStorageModule.forRoot()
├── HttpClientModule
├── FormsModule / ReactiveFormsModule
├── AppRoutingModule           -> src/app/app-routing.module.ts
├── CommonComponentsModule     -> src/app/common/common.module.ts  (shared UI)
├── ModalPageModule            -> src/app/modal/modal.module.ts
├── SocialLoginModule          -> angularx-social-login
├── TooltipsModule / TooltipModule
└── NgxIonicImageViewerModule
```

Lazy-loaded feature modules:

| Route path   | Module file                                    |
|--------------|-----------------------------------------------|
| `/signup`    | `src/app/login/login.module.ts`               |
| `/leads`     | `src/app/leads/leads.module.ts`               |
| `/dashboard` | `src/app/dashboard/dashboard.module.ts`       |

Eager components declared in `AppModule`:
`AppComponent`, `HomeComponent`, `PlanComparisonComponent`, `MonthlySavingsComponent`, `RegisterUserComponent`, `ProfileComponent`.

## 5. Routing

Defined in `src/app/app-routing.module.ts` using `PreloadAllModules`:

| Path         | Target                                           |
|--------------|--------------------------------------------------|
| `/signup`    | `LoginModule` (lazy)                             |
| `/leads`     | `LeadsModule` (lazy)                             |
| `/home`      | `HomeComponent`                                  |
| `/plans`     | `PlanComparisonComponent`                        |
| `/profile`   | `ProfileComponent`                               |
| `/refer`     | `ProfileComponent` (context switched internally) |
| `/contact`   | `ProfileComponent` (context switched internally) |
| `/about`     | `ProfileComponent` (context switched internally) |
| `/dashboard` | `DashboardModule` (lazy)                         |
| `/`          | redirect → `/home`                               |

## 6. Cross-cutting Services

| Service file                                  | Responsibility |
|------------------------------------------------|----------------|
| `src/app/services/user.service.ts`             | Auth state, current user, login/logout events (RxJS) |
| `src/app/services/api.service.ts`              | HTTP helper placeholder |
| `src/app/services/tokenInterceptor.ts`         | HTTP interceptor for auth headers (currently wired off in AppModule) |
| `src/app/services/crypto.service.ts`           | AES + HMAC-SHA256 (used for Razorpay verification) |
| `src/app/services/car.service.ts`              | Current / backup car state, addon context |
| `src/app/services/checkout.service.ts`         | Order/payment flow |
| `src/app/services/document.service.ts`         | Vehicle document persistence (Ionic Storage) |
| `src/app/services/notification.service.ts`     | Notification inbox state |
| `src/app/services/photo.service.ts`            | Capacitor camera / filesystem / storage |
| `src/app/services/plan.service.ts`             | Plan catalogue + pricing helpers |
| `src/app/services/share.service.ts`            | Social sharing wrapper |
| `src/app/services/user.service.ts`             | User CRUD helpers |
| `src/app/plan.service.ts`                      | Additional plan logic (root-level) |
| `src/app/cities.service.ts`                    | Cities / states / societies data |
| `src/app/header.service.ts`                    | Header state + config |
| `src/app/window-ref.service.ts`                | `window` access for Razorpay bridge |
| `src/app/common/common.service.ts`             | Shared UI config + formatting helpers |

## 7. Native Integrations

**Capacitor plugins** (bundled via `@capacitor/core` 2.x):
- Camera, Filesystem, Storage, SplashScreen

**Cordova plugins** (see `package.json` → `cordova.plugins`):

| Plugin                                        | Purpose |
|-----------------------------------------------|---------|
| `cordova-plugin-fcm-with-dependecy-updated`   | FCM push |
| `cordova-plugin-camera`                       | Camera |
| `cordova-plugin-datepicker`                   | Native date picker |
| `cordova-plugin-file` / `-filepath` / `-filechooser` / `-file-opener2` | Document flow |
| `cordova-plugin-preview-any-file`             | In-app file preview |
| `cordova-plugin-sms-retriever-manager` / `-sms-receive` | Auto OTP read |
| `cordova-plugin-x-socialsharing`              | Share sheet |
| `cordova-plugin-geolocation` / `-nativegeocoder` | Location & reverse geocode |
| `cordova-plugin-foreground-service`           | Foreground worker |
| `cordova-plugin-ionic-webview` / `-ionic-keyboard` | WebView / keyboard |
| `cordova-plugin-splashscreen` / `-statusbar`  | Native chrome |
| `com.razorpay.cordova`                        | Razorpay native SDK |
| `cordova-sqlite-storage`                      | SQLite backend for Ionic Storage |

Ionic Native wrappers (`@ionic-native/*`) provide DI-friendly façades around each plugin.

## 8. External Services

| Service                    | Usage |
|----------------------------|-------|
| `https://api-ccube.herokuapp.com/api/` | REST backend (observed in services) |
| Razorpay                   | Payments (native + REST) |
| Firebase Cloud Messaging   | Push notifications |
| Google OAuth (client `455316244979-...`) | Social login |
| Facebook OAuth (app `174475890475329`)   | Social login |
| AWS S3                     | Document / media uploads |

## 9. Build & Test Pipeline

### Build
- `npm run build` → runs `node patch.js && ng build --base-href=/`
- Production bundle emitted to `www/` (from `angular.json`).
- Budgets: initial warning 2 MB / error 5 MB.

### Serve
- `npm start` → `ng serve`
- Ionic Cordova serve/build targets wired via `@ionic/angular-toolkit`.

### Test
- `npm test` → `ng test` → Karma + Jasmine in Chrome.
- `karma.conf.js` writes coverage to `../coverage` relative to the config file. For CI clarity the regression harness (see [`04-testing-strategy.md`](./04-testing-strategy.md)) pins this to the project root.

### Lint
- `npm run lint` → TSLint (legacy; deprecated in Angular 13+).

## 10. Known Baseline Risks

These are facts – not opinions – relevant to the upgrade:

1. **TSLint is deprecated.** Must migrate to ESLint starting at Angular 11/12 during the upgrade.
2. **Cordova + Capacitor co-exist.** Several features (payments, OTP, FCM) still depend on Cordova plugins; Capacitor 3+ changes the plugin contract.
3. **`@ionic-native/*` is deprecated.** Replaced by `@awesome-cordova-plugins/*` from Ionic 6 onward.
4. **`angularx-social-login` is an unmaintained fork.** Breaks on Angular 13+; needs replacement (`@abacritt/angularx-social-login`) during upgrade.
5. **`@ionic/storage` v2** uses the old API. Ionic 6+ ships `@ionic/storage-angular` with a different initialisation flow.
6. **`ng2-charts` 2.x** is locked to Chart.js 2.x; Angular 14+ requires ng2-charts 4.x and Chart.js 3+.
7. **`zone.js` 0.10** is incompatible with Angular 11+; must move to 0.11/0.12/0.13 along the way.
8. **Secrets in source** (`rootkey.csv`, Razorpay keys, crypto salt) – not an upgrade blocker but flagged for hardening in [`03-proposed-features.md`](./03-proposed-features.md).
9. **101 spec files exist** but most are Angular CLI scaffolding; baseline coverage is low. See [`04-testing-strategy.md`](./04-testing-strategy.md).
