// Baseline Test Harness
// ---------------------
// Purpose: let us run Node's built-in test runner (`node --test`) against
// selected business-logic files from src/app without having to boot the
// Angular/Karma pipeline (which is broken on the current Node 22 toolchain
// for a v9 Angular project).
//
// Strategy:
//   1. Register a minimal in-process stub for `@angular/core` so that
//      Angular's `@Injectable()` decorator becomes a no-op.
//   2. Provide a jsdom-free `localStorage` / `sessionStorage` / `window`
//      polyfill attached to `globalThis`.
//   3. Expose helpers for stubbing `localStorage.commonData` before each
//      test so `PlanService`/`CitiesService`/etc. behave deterministically.
//
// Every baseline *.spec.ts under tests/baseline/ must import this file
// before touching any code under src/app.

import Module from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');

// ------------------------------------------------------------------
// 1. In-memory DOM/browser globals
// ------------------------------------------------------------------

class MemoryStorage {
  constructor() { this._data = new Map(); }
  getItem(k) { return this._data.has(k) ? this._data.get(k) : null; }
  setItem(k, v) { this._data.set(k, v == null ? 'null' : String(v)); }
  removeItem(k) { this._data.delete(k); }
  clear() { this._data.clear(); }
  get length() { return this._data.size; }
  key(i) { return Array.from(this._data.keys())[i] || null; }
}

if (typeof globalThis.localStorage === 'undefined') {
  globalThis.localStorage = new MemoryStorage();
}
if (typeof globalThis.sessionStorage === 'undefined') {
  globalThis.sessionStorage = new MemoryStorage();
}
if (typeof globalThis.window === 'undefined') {
  globalThis.window = {
    localStorage: globalThis.localStorage,
    sessionStorage: globalThis.sessionStorage,
    location: { pathname: '/', reload() {}, href: 'http://localhost/' },
    history: { back() {} },
    open() {}
  };
}
if (typeof globalThis.document === 'undefined') {
  globalThis.document = {
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: () => null,
    addEventListener: () => {},
    removeEventListener: () => {}
  };
}
// jQuery-ish stub used by src/app/util/util.ts. Returns an array that is
// also indexable and whose [length-1] element has a writable `scrollTop`
// (to keep the production code paths happy in tests).
if (typeof globalThis.$ === 'undefined') {
  const makeFakeContainer = () => ({ scrollTop: 0 });
  const jq = function () {
    const fake = makeFakeContainer();
    const arr = [fake];
    arr.toArray = () => [fake];
    arr.offset = () => ({ top: 0 });
    arr.forEach = Array.prototype.forEach;
    return arr;
  };
  globalThis.$ = jq;
}

// ------------------------------------------------------------------
// 2. Intercept imports the TS sources depend on
// ------------------------------------------------------------------
// The spec files import compiled-at-runtime TS modules. The real
// @angular/core is present in node_modules but loads zone.js which is
// brittle on Node 22. We short-circuit @angular/core and @ionic/angular
// to tiny stubs so the service files compile and run as plain classes.

const noop = () => () => {};
const noopDecorator = () => (target) => target;

const angularStub = {
  Injectable: noopDecorator,
  Component: noopDecorator,
  NgModule: noopDecorator,
  Directive: noopDecorator,
  Pipe: noopDecorator,
  Input: noopDecorator,
  Output: noopDecorator,
  ViewChild: noopDecorator,
  ViewChildren: noopDecorator,
  ContentChild: noopDecorator,
  HostListener: noopDecorator,
  HostBinding: noopDecorator,
  EventEmitter: class {
    constructor() { this._listeners = []; }
    emit(v) { this._listeners.forEach(fn => fn(v)); }
    subscribe(fn) { this._listeners.push(fn); return { unsubscribe() {} }; }
  },
  ElementRef: class {},
  Renderer2: class {},
  NgZone: class { run(fn) { return fn(); } runOutsideAngular(fn) { return fn(); } },
  ChangeDetectorRef: class { detectChanges() {} markForCheck() {} },
  TemplateRef: class {},
  ViewContainerRef: class {},
  Inject: noopDecorator,
  Optional: noopDecorator,
  Self: noopDecorator,
  SkipSelf: noopDecorator,
  forwardRef: (fn) => fn(),
  CUSTOM_ELEMENTS_SCHEMA: Symbol('CUSTOM_ELEMENTS_SCHEMA')
};

const ionicAngularStub = {
  IonicModule: {},
  IonicRouteStrategy: class {},
  Platform: class {
    ready() { return Promise.resolve(); }
    is() { return false; }
  },
  NavController: class {
    navigateBack() {} navigateForward() {} navigateRoot() {}
  },
  ModalController: class { async create() { return { present() {}, dismiss() {} }; } },
  ToastController: class {
    async create() { return { present() {}, dismiss() {} }; }
  },
  AlertController: class {
    async create() { return { present() {}, dismiss() {}, onWillDismiss() { return Promise.resolve(); } }; }
  },
  MenuController: class { enable() {} toggle() {} close() {} },
  PopoverController: class {
    async create() { return { present() {}, onWillDismiss() { return Promise.resolve(); } }; }
  },
  LoadingController: class {
    async create() { return { present() {}, dismiss() {} }; }
  },
  IonItem: class {}
};

const routerStub = {
  Router: class {
    navigate(path) { this.lastNavigation = path; return Promise.resolve(true); }
  },
  ActivatedRoute: class {
    snapshot = { params: {}, queryParams: {}, data: {} };
    url = { subscribe() { return { unsubscribe() {} }; } };
  },
  RouterModule: {}
};

const commonHttpStub = {
  HttpClient: class {
    constructor() { this.calls = []; }
    get(url, opts) { this.calls.push(['GET', url, null, opts]); return { pipe: () => ({ subscribe: () => ({ unsubscribe() {} }) }) }; }
    post(url, body, opts) { this.calls.push(['POST', url, body, opts]); return { pipe: () => ({ subscribe: () => ({ unsubscribe() {} }) }) }; }
    put(url, body, opts) { this.calls.push(['PUT', url, body, opts]); return { pipe: () => ({ subscribe: () => ({ unsubscribe() {} }) }) }; }
    delete(url, opts) { this.calls.push(['DELETE', url, null, opts]); return { pipe: () => ({ subscribe: () => ({ unsubscribe() {} }) }) }; }
  },
  HttpHeaders: class { constructor(init) { this._headers = { ...(init || {}) }; } set(k, v) { this._headers[k] = v; return this; } get(k) { return this._headers[k]; } },
  HTTP_INTERCEPTORS: Symbol('HTTP_INTERCEPTORS')
};

// Register import hooks using Module._resolveFilename + custom resolver
const originalResolve = Module._resolveFilename;
const stubs = new Map();

function registerStub(name, obj) {
  stubs.set(name, obj);
}

registerStub('@angular/core', angularStub);
registerStub('@angular/core/testing', { TestBed: { configureTestingModule() { return this; }, inject: (t) => new t(), createComponent: () => ({ componentInstance: {} }) }, async: (fn) => fn });
registerStub('@ionic/angular', ionicAngularStub);
registerStub('@angular/router', routerStub);
registerStub('@angular/common/http', commonHttpStub);
registerStub('@angular/common', { CommonModule: {}, DatePipe: class { transform(v) { return String(v); } } });
registerStub('@angular/forms', { FormsModule: {}, ReactiveFormsModule: {}, FormBuilder: class { group(c) { return { value: c, get: () => ({ value: null }) }; } }, Validators: { required: () => null, email: () => null } });

Module._resolveFilename = function (request, parent, ...rest) {
  if (stubs.has(request)) {
    return `stub:${request}`;
  }
  return originalResolve.call(this, request, parent, ...rest);
};

const originalLoad = Module._load;
Module._load = function (request, parent, ...rest) {
  if (stubs.has(request)) {
    return stubs.get(request);
  }
  if (request.startsWith('stub:')) {
    return stubs.get(request.slice(5));
  }
  return originalLoad.call(this, request, parent, ...rest);
};

// ------------------------------------------------------------------
// 3. Test helpers
// ------------------------------------------------------------------

export function resetStorage() {
  globalThis.localStorage.clear();
  globalThis.sessionStorage.clear();
}

export function seedCommonData(partial = {}) {
  const data = {
    config: [
      { name: 'INBUILTDISCOUNT_CONFIG', value: { plan: { secondCar: 100 }, addon: { withPlan: 50 } } },
      { name: 'RENEW_ADDON_PERIOD', value: 15 },
      { name: 'DISCOUNT_QUARTERLY', value: 10 },
      { name: 'COUPON_CONFIG', value: [{ code: 'SAVE10', discount: 10 }] }
    ],
    plansList: {
      plans: [
        { name: 'Work From Home', code: 'WFH', pricing: { sedan: 200, suv: 250, hatchback: 180 }, features: ['F1'], uniqueFeatures: ['F1'] },
        { name: 'Standard', code: 'STD', pricing: { sedan: 500, suv: 600, hatchback: 450 }, features: ['F1','F2'], uniqueFeatures: ['F2'] },
        { name: 'Deluxe', code: 'DLX', pricing: { sedan: 900, suv: 1100, hatchback: 800 }, features: ['F1','F2','F3'], uniqueFeatures: ['F3'] },
        { name: 'Elite', code: 'ELT', pricing: { sedan: 1500, suv: 1800, hatchback: 1300 }, features: ['F1','F2','F3','F4'], uniqueFeatures: ['F4'] }
      ],
      features: [
        { code: 'F1', name: 'Daily Wash', isAdhoc: false, active: true, pricing: { sedan: 50, suv: 60, hatchback: 45 } },
        { code: 'F2', name: 'Weekly Interior', isAdhoc: false, active: true, pricing: { sedan: 80, suv: 90, hatchback: 70 } },
        { code: 'F3', name: 'Monthly Waxing', isAdhoc: false, active: true, pricing: { sedan: 150, suv: 180, hatchback: 140 } },
        { code: 'F4', name: 'Ad-hoc Detailing', isAdhoc: true, active: true, pricing: { sedan: 300, suv: 350, hatchback: 280 } }
      ]
    },
    societies: [{ name: 'Puri Pratham' }, { name: 'SRS Residency' }],
    allSocieties: [
      { city: 'faridabad', societies: [{ name: 'Puri Pratham' }, { name: 'SRS Residency' }] }
    ],
    ...partial
  };
  globalThis.localStorage.setItem('commonData', JSON.stringify(data));
  return data;
}

export { repoRoot };
