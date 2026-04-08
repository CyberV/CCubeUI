import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Offline Mode – see docs/06-additional-insights.md §5
 *
 * Owns the runtime on/off state of Offline Mode and seeds the localStorage
 * keys that the rest of the app expects to find populated. This runs before
 * any feature service is asked for data.
 *
 * Default: ON (via environment.offlineMode). Users can override via the
 * OfflineBadgeComponent toggle, which persists to localStorage.
 */
@Injectable({ providedIn: 'root' })
export class OfflineService {
  private _enabled$ = new BehaviorSubject<boolean>(this.resolveInitial());

  constructor() {
    if (this._enabled$.getValue()) {
      this.seed();
    }
  }

  private resolveInitial(): boolean {
    try {
      const override = localStorage.getItem('offlineMode');
      if (override === 'true') { return true; }
      if (override === 'false') { return false; }
    } catch (_) { /* private mode, fall through */ }
    return !!environment.offlineMode;
  }

  /** Emits the current state and every toggle. */
  events(): Observable<boolean> {
    return this._enabled$.asObservable();
  }

  isOffline(): boolean {
    return this._enabled$.getValue();
  }

  enable(): void {
    try { localStorage.setItem('offlineMode', 'true'); } catch (_) {}
    this.seed();
    this._enabled$.next(true);
  }

  disable(): void {
    try { localStorage.setItem('offlineMode', 'false'); } catch (_) {}
    this._enabled$.next(false);
  }

  /**
   * Seed localStorage with the shapes that services expect. We do NOT blow
   * away an existing commonData if one is already cached – that way a user
   * who logged in while online and then switched to offline still has their
   * own session. Only unset keys get the mock defaults.
   */
  seed(): void {
    this.seedFromJson('commonData', 'assets/mock-data/common-data.json', (j) => j && j.data);
    this.seedFromJson('currentUser', 'assets/mock-data/current-user.json', (j) => j && j.data);
    // Notifications seed – only when empty, never overwrite.
    try {
      if (!localStorage.getItem('newNotifications')) {
        localStorage.setItem('newNotifications', JSON.stringify([
          { id: 'n-1001', title: 'Service Reminder', body: 'Your next wash is scheduled tomorrow at 7:30 AM.' }
        ]));
      }
      if (!localStorage.getItem('historicalNotifications')) {
        localStorage.setItem('historicalNotifications', JSON.stringify([
          { id: 'n-1000', title: 'Payment Received', body: 'We received your Gold plan renewal. Thanks!' }
        ]));
      }
    } catch (_) {}
  }

  /**
   * Best-effort sync seeding. We use XHR (not HttpClient) because this runs
   * from the constructor BEFORE HttpClient and its interceptors are wired.
   * Failures are swallowed – the feature services all have their own
   * fallbacks.
   */
  private seedFromJson(storageKey: string, assetPath: string, pick: (j: any) => any) {
    try {
      if (localStorage.getItem(storageKey)) { return; }
      const xhr = new XMLHttpRequest();
      xhr.open('GET', assetPath, false); // sync, bootstrap only
      xhr.send();
      if (xhr.status === 200) {
        const parsed = JSON.parse(xhr.responseText);
        const picked = pick(parsed);
        if (picked) {
          localStorage.setItem(storageKey, JSON.stringify(picked));
        }
      }
    } catch (_) { /* swallow */ }
  }
}
