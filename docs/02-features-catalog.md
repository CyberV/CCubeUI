# 02 – Features Catalog (Baseline)

This document enumerates every user-visible feature in the CCube / SSewa app at the baseline (Angular 9.1.1 / Ionic 5.0.7) and lists the **exact files that deliver it**. It is deliberately exhaustive: downstream work (tests, refactors, upgrades) must preserve every feature listed here with zero regression.

All paths are relative to the repository root (`ui/`).

---

## Legend

- **Component/Page** – Angular/Ionic component or page that drives UI
- **Template** – associated `.html`
- **Style** – associated `.scss`
- **Service** – Angular service providing data/behaviour
- **Module** – `@NgModule` that declares / imports the feature
- **Route** – path registered in a routing module
- **Asset** – JSON / image / script the feature depends on
- **Plugin** – Capacitor / Cordova / Ionic-Native plugin relied upon

---

## F1. Authentication & Onboarding

**Purpose**: Users register, sign in, verify identity via OTP (SMS + auto-read on Android), reset forgotten passwords, and optionally authenticate via Google or Facebook.

### Sub-features

- F1.1 Phone + OTP login (SMS auto-retrieve on Android)
- F1.2 Password-based login
- F1.3 User registration (`RegisterUserComponent`)
- F1.4 Forgot password flow
- F1.5 Social login (Google, Facebook)
- F1.6 Reusable OTP input widget (`VerifyOtpComponent`)

### Files

| Role      | Path |
|-----------|------|
| Module    | `src/app/login/login.module.ts` |
| Route     | `/signup` → `LoginModule` (lazy) in `src/app/app-routing.module.ts` |
| Page      | `src/app/login/login.page.ts` / `.html` / `.scss` |
| Component | `src/app/login/login/login.component.ts` / `.html` / `.scss` |
| Component | `src/app/login/login-form/login-form.component.ts` / `.html` / `.scss` |
| Component | `src/app/login/signin-form/signin-form.component.ts` / `.html` / `.scss` |
| Service   | `src/app/login/login.service.ts` |
| Component | `src/app/pages/initial-screens/register-user/register-user.component.ts` / `.html` / `.scss` |
| Component | `src/app/pages/initial-screens/forgot-password/forgot-password.component.ts` / `.html` / `.scss` |
| Component | `src/app/common/verify-otp/verify-otp.component.ts` / `.html` / `.scss` |
| Root wire | `src/app/app.module.ts` (SocialLoginModule, AuthServiceConfig, SmsRetriever) |
| Plugin    | `@ionic-native/sms-retriever` (auto-read SMS OTP) |
| Plugin    | `angularx-social-login` (Google + Facebook) |
| Endpoint  | `POST /otp/send`, `POST /otp/resend`, `POST /otp/verify`, `POST /user/create`, `POST /login`, `POST /login/otp` |

---

## F2. Home / Landing

**Purpose**: App entry screen showcasing benefits, counters, featured carousels, and CTAs into plans/leads/dashboard.

### Files

| Role      | Path |
|-----------|------|
| Component | `src/app/home/home.component.ts` / `.html` / `.scss` |
| Page      | `src/app/home/home.page.ts` / `.html` / `.scss` |
| Component | `src/app/home/vital-slider/vital-slider.component.ts` / `.html` / `.scss` |
| Widget    | `src/app/common/carousel/carousel.component.ts` |
| Widget    | `src/app/common/cta/cta.component.ts` |
| Widget    | `src/app/common/splash/splash.component.ts` |
| Asset     | `src/assets/featurelist.json`, `src/assets/contributionslist.json` |
| Asset     | `src/assets/one-page-scroll.min.js` (registered through `angular.json` scripts or global) |
| Route     | `/home` → `HomeComponent` |

External dependencies: `flipclock`, `flip-counter-js`, `fullpage.js`.

---

## F3. Plans & Plan Comparison

**Purpose**: Catalogue subscription plans, compare them side-by-side, show add-ons, and drive the user into checkout.

### Sub-features

- F3.1 Plan list and plan slider
- F3.2 Plan comparison table
- F3.3 Plan details modal
- F3.4 Feature availability matrix
- F3.5 Upgrade slider (compare current vs target plan)
- F3.6 Purchased plan badge

### Files

| Role      | Path |
|-----------|------|
| Page      | `src/app/plan-comparison/plan-comparison.component.ts` / `.html` / `.scss` |
| Service   | `src/app/services/plan.service.ts` |
| Service   | `src/app/plan.service.ts` (additional helpers) |
| Widget    | `src/app/common/plan-card/plan-card.component.ts` / `.html` / `.scss` |
| Widget    | `src/app/common/plan-details/plan-details.component.ts` / `.html` / `.scss` |
| Widget    | `src/app/common/plan-table/plan-table.component.ts` / `.html` / `.scss` |
| Widget    | `src/app/common/plan-slider/plan-slider.component.ts` / `.html` / `.scss` |
| Widget    | `src/app/common/upgrade-slider/upgrade-slider.component.ts` / `.html` / `.scss` |
| Widget    | `src/app/common/feature-card/feature-card.component.ts` / `.html` / `.scss` |
| Widget    | `src/app/common/feature-avail/feature-avail.component.ts` / `.html` / `.scss` |
| Widget    | `src/app/common/purchased-plan/purchased-plan.component.ts` / `.html` / `.scss` |
| Asset     | `src/assets/planslist.json` |
| Route     | `/plans` → `PlanComparisonComponent` |
| Endpoint  | `GET /plan/getCommonData` |

---

## F4. Car Selection & Management

**Purpose**: Users add their vehicle(s), select the active car (used across the app), and view / edit car details.

### Files

| Role      | Path |
|-----------|------|
| Service   | `src/app/services/car.service.ts` |
| Widget    | `src/app/common/select-car/select-car.component.ts` / `.html` / `.scss` |
| Widget    | `src/app/common/selected-car/selected-car.component.ts` / `.html` / `.scss` |
| Widget    | `src/app/common/car-display/car-display.component.ts` / `.html` / `.scss` |
| Component | `src/app/dashboard/car-form/car-form.component.ts` / `.html` / `.scss` |
| Asset     | `src/assets/carslist.json` |
| Endpoint  | `POST /car/details/{regNo}` |
| Storage   | `localStorage.currentCar`, `localStorage.backupCar`, `sessionStorage.currentAddon` |

---

## F5. City & Society (Serviceable Area)

**Purpose**: Determine whether the user is in a serviceable city/society; support GPS auto-detection with manual fallback.

### Files

| Role      | Path |
|-----------|------|
| Service   | `src/app/cities.service.ts` |
| Widget    | `src/app/common/select-city/select-city.component.ts` / `.html` / `.scss` |
| Widget    | `src/app/common/select-society/select-society.component.ts` / `.html` / `.scss` |
| Widget    | `src/app/common/confirm-location/confirm-location.component.ts` / `.html` / `.scss` |
| Plugin    | `@ionic-native/geolocation`, `@ionic-native/native-geocoder` |

---

## F6. Dashboard & Service Management

**Purpose**: Authenticated landing area showing active subscription(s), upcoming service schedule, service history, and reschedule controls.

### Files

| Role      | Path |
|-----------|------|
| Module    | `src/app/dashboard/dashboard.module.ts` |
| Routing   | `src/app/dashboard/dashboard-routing.module.ts` |
| Page      | `src/app/dashboard/dashboard-page/dashboard-page.component.ts` / `.html` / `.scss` |
| Component | `src/app/dashboard/dashboard/dashboard.component.ts` / `.html` / `.scss` |
| Component | `src/app/dashboard/service-page/service-page.component.ts` / `.html` / `.scss` |
| Widget    | `src/app/common/service-history/service-history.component.ts` / `.html` / `.scss` |
| Widget    | `src/app/common/weekly-schedule/weekly-schedule.component.ts` / `.html` / `.scss` |
| Widget    | `src/app/common/purchased-plan/purchased-plan.component.ts` |
| Widget    | `src/app/common/reschedule/reschedule.component.ts` / `.html` / `.scss` |
| Route     | `/dashboard` → `DashboardModule` (lazy) |
| Endpoint  | `POST /subscription/getsubscriptions`, `POST /subscription/rescheduleService`, `POST /subscription/updateTiming` |

---

## F7. Checkout & Payments

**Purpose**: End-to-end purchase flow: plan/add-on selection → coupon validation → Razorpay order → payment verification → confirmation.

### Files

| Role      | Path |
|-----------|------|
| Component | `src/app/dashboard/checkout/checkout.component.ts` / `.html` / `.scss` |
| Service   | `src/app/services/checkout.service.ts` |
| Service   | `src/app/services/crypto.service.ts` (HMAC-SHA256 verification) |
| Service   | `src/app/window-ref.service.ts` (Razorpay native bridge) |
| Widget    | `src/app/common/cehckout-details/cehckout-details.component.ts` (**sic – typo preserved**) |
| Widget    | `src/app/common/checkout-confirmation/checkout-confirmation.component.ts` |
| Widget    | `src/app/common/coupons-list/coupons-list.component.ts` |
| Widget    | `src/app/common/counter/counter.component.ts` |
| Widget    | `src/app/common/addon-slider/addon-slider.component.ts` |
| Widget    | `src/app/common/addon-details/addon-details.component.ts` |
| Widget    | `src/app/common/adhoc-slider/adhoc-slider.component.ts` |
| Plugin    | `com.razorpay.cordova` |
| Endpoint  | `POST /checkout/createOrder`, `POST /subscription/trycoupon`, `POST /subscription/getcouponsforuser`, `POST /subscription/addpayment`, `POST /subscription/addaddon`, `POST /subscription/addadhoc`, `POST /subscription/renewpayment`, `POST /subscription/scheduleAddon` |

> The misspelled folder `cehckout-details/` is part of the baseline and must not be renamed without touching every import that references it.

---

## F8. Profile, Referral, About, Contact

**Purpose**: `ProfileComponent` acts as a multi-context screen rendering profile, referrals, contact, and about content based on the route.

### Files

| Role      | Path |
|-----------|------|
| Component | `src/app/profile/profile.component.ts` / `.html` / `.scss` |
| Widget    | `src/app/common/refer-earn/refer-earn.component.ts` / `.html` / `.scss` |
| Widget    | `src/app/common/terms/terms.component.ts` |
| Service   | `src/app/services/share.service.ts` |
| Routes    | `/profile`, `/refer`, `/contact`, `/about` all → `ProfileComponent` |

---

## F9. Leads Capture

**Purpose**: Non-authenticated visitors (or sales) can submit leads for follow-up.

### Files

| Role      | Path |
|-----------|------|
| Module    | `src/app/leads/leads.module.ts` |
| Routing   | `src/app/leads/leads-routing.module.ts` |
| Page      | `src/app/leads/leads/leads.page.ts` / `.html` / `.scss` |
| Component | `src/app/leads/submit-leads/submit-leads.component.ts` / `.html` / `.scss` |
| Route     | `/leads` → `LeadsModule` (lazy) |
| Endpoint  | `POST /lead/create` |

---

## F10. Documents (KYC / Vehicle Documents)

**Purpose**: Users upload, view, and manage mandatory vehicle documents (Driving Licence, RC, Insurance, Pollution certificate) on a per-car basis.

### Files

| Role      | Path |
|-----------|------|
| Service   | `src/app/services/document.service.ts` |
| Widget    | `src/app/common/document-list/document-list.component.ts` / `.html` / `.scss` |
| Widget    | `src/app/common/document-uploader/document-uploader.component.ts` / `.html` / `.scss` |
| Plugin    | `@ionic-native/file-chooser`, `@ionic-native/file`, `@ionic-native/file-opener`, `@ionic-native/file-path`, `@ionic-native/preview-any-file` |
| Storage   | `@ionic/storage` key `docs-{phone}` |

---

## F11. Notifications (Push + Inbox)

**Purpose**: Receive push via FCM, store notifications locally, surface them in a notification menu with "new / historical" states.

### Files

| Role      | Path |
|-----------|------|
| Service   | `src/app/services/notification.service.ts` |
| Widget    | `src/app/common/notif-menu/notif-menu.component.ts` / `.html` / `.scss` |
| Root wire | `src/app/app.component.ts` (FCM listener) |
| Plugin    | `@ionic-native/fcm`, `@ionic-native/firebase-messaging`, `cordova-plugin-fcm-with-dependecy-updated` |
| Storage   | `localStorage` keys `newNotifications`, `historicalNotifications`, `readNotifications` |
| Endpoint  | `POST /user/updateToken` |

---

## F12. Photos / Camera

**Purpose**: Capture and persist photos via device camera; used by the demo Tab2 and by feature flows such as document upload.

### Files

| Role      | Path |
|-----------|------|
| Page      | `src/app/tab2/tab2.page.ts` / `.html` / `.scss` |
| Service   | `src/app/services/photo.service.ts` |
| Plugin    | Capacitor Camera, Filesystem, Storage (`@capacitor/core` v2) |
| Plugin    | `@ionic-native/camera`, `cordova-plugin-camera` |

> Tab2 originates from the Ionic starter. It is retained in the baseline and referenced from `src/app/tabs/`.

---

## F13. Sharing & Referral

**Purpose**: Share referral code, images, and RC details via the native share sheet.

### Files

| Role      | Path |
|-----------|------|
| Service   | `src/app/services/share.service.ts` |
| Widget    | `src/app/common/refer-earn/refer-earn.component.ts` |
| Plugin    | `@ionic-native/social-sharing`, `cordova-plugin-x-socialsharing` |

Referral code is derived from the logged-in user via `UserService`, and the share payload includes `commonData.config.APP_LINK`.

---

## F14. Monthly Savings Calculator

**Purpose**: Standalone component that illustrates projected monthly savings, linked from home/plans.

### Files

| Role      | Path |
|-----------|------|
| Component | `src/app/monthly-savings/monthly-savings.component.ts` / `.html` / `.scss` |
| Wiring    | Declared in `src/app/app.module.ts` |

---

## F15. Navigation Chrome (Header / Menu / Tabs / Modal)

**Purpose**: Cross-cutting navigation surface.

### Files

| Role      | Path |
|-----------|------|
| Component | `src/app/app.component.ts` / `.html` / `.scss` |
| Component | `src/app/components/header/header.component.ts` / `.html` / `.scss` |
| Service   | `src/app/header.service.ts` |
| Widget    | `src/app/common/navbar/navbar.component.ts` / `.html` / `.scss` |
| Widget    | `src/app/common/mobile-nav/mobile-nav.component.ts` / `.html` / `.scss` |
| Widget    | `src/app/common/menu/menu.component.ts` / `.html` / `.scss` |
| Page      | `src/app/tabs/tabs.page.ts` / `.html` / `.scss` |
| Routing   | `src/app/tabs/tabs-routing.module.ts` |
| Module    | `src/app/modal/modal.module.ts` |
| Page      | `src/app/modal/modal.page.ts` / `.html` / `.scss` |

---

## F16. Common UI Widget Library

All of the following widgets live under `src/app/common/` and are declared in `src/app/common/common.module.ts` (the `CommonComponentsModule`). They are shared across features.

| Folder                   | Purpose |
|--------------------------|---------|
| `accordion/`             | Expand/collapse section |
| `addon-details/`         | Add-on detail card |
| `addon-slider/`          | Horizontal add-on carousel |
| `adhoc-slider/`          | Ad-hoc service carousel |
| `ads-list/`              | Promotional ads |
| `book-demo/`             | Demo booking widget |
| `car-display/`           | Car info card |
| `carousel/`              | Generic carousel |
| `chart/`                 | Chart.js wrapper |
| `chart-view/`            | Enhanced chart view |
| `counter/`               | Animated counter |
| `cta/`                   | Call-to-action |
| `datepicker/`            | Date picker |
| `demo/`                  | Demo component |
| `drag-list/`             | Draggable list (CDK drag-drop) |
| `drop-bomb/`             | Drag-and-drop helper |
| `heading/`, `subheading/`| Typography |
| `highlight.directive.ts` | Highlight directive |
| `rs.directive.ts`        | Rupee formatter |
| `icon/`                  | Icon display |
| `image-toolbar/`         | Image toolbar |
| `indicator/`             | Status indicator |
| `list/`                  | Generic list |
| `mobile-input/`          | Mobile-optimised input |
| `pagination/`            | Pagination control |
| `slide/`                 | Single slide |
| `spinner/`               | Loading spinner |
| `splash/`                | Splash screen |
| `switch/`                | Toggle |
| `terms/`                 | Terms view |
| `test/`                  | Debug/test |
| `text-input/`            | Text input |
| `thanks-page/`           | Success page |
| `tips-view/`             | Tips/hints |
| `typeahead/`, `typeaway/`| Autocomplete variants |
| `verify-otp/`            | OTP input (see F1) |
| `warning/`               | Warning display |

---

## F17. Utilities

| Path                                | Purpose |
|-------------------------------------|---------|
| `src/app/util/util.ts`              | Scroll / formatting helpers |
| `src/app/util/helper.ts`            | Generic helpers |
| `src/app/endpoints.ts`              | Endpoint constants (currently minimal) |
| `src/app/services/IUser.ts`         | User interface definition |
| `src/app/services/tokenInterceptor.ts` | HTTP interceptor (provider commented out) |
| `src/app/services/crypto.service.ts`| AES + HMAC helpers |

---

## F18. Existing Spec Files (Baseline)

The repository ships with 101 `*.spec.ts` files. Most are **CLI-scaffolded** (`component.should create`) with no meaningful assertions, so real coverage is much lower than file count suggests. See [`04-testing-strategy.md`](./04-testing-strategy.md) for the baseline harness plan.

Service specs present: `app.component.spec.ts`, `cities.service.spec.ts`, `header.service.spec.ts`, `plan.service.spec.ts`, `window-ref.service.spec.ts`, `services/api.service.spec.ts`, `services/car.service.spec.ts`, `services/checkout.service.spec.ts`, `services/notification.service.spec.ts`, `services/photo.service.spec.ts`.

Notable gaps: `services/crypto.service.ts`, `services/document.service.ts`, `services/plan.service.ts`, `services/share.service.ts`, `services/user.service.ts`.

---

## F19. Configuration & Entry Points

| Path                           | Purpose |
|--------------------------------|---------|
| `src/main.ts`                  | Angular bootstrap |
| `src/polyfills.ts`             | Polyfills (zone.js) |
| `src/test.ts`                  | Karma test entry |
| `src/environments/environment.ts` / `.prod.ts` | Environment config |
| `src/theme/variables.scss`     | Global Ionic theme |
| `src/global.scss`              | Global styles |
| `angular.json`                 | Angular CLI workspace |
| `capacitor.config.json`        | Capacitor app config |
| `config.xml`                   | Cordova config |
| `ionic.config.json`            | Ionic workspace |
| `karma.conf.js`                | Karma config |
| `tsconfig.json` / `.app.json` / `.spec.json` | TS configs |

---

End of catalog.
