import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable, filter } from 'rxjs';

export interface TelemetryEvent {
  code: string;
  payload: any;
  timestamp: number;
  url: string;
}

/**
 * TelemetryService – N7 (see docs/06-additional-insights.md §7)
 *
 * Thin, vendor-agnostic event capture. Writes to `console.debug` and to a
 * rolling buffer in localStorage (`telemetryLog`, capped at 200 entries).
 * A future step wires this to Firebase Analytics + Sentry; the call sites
 * do not need to change.
 */
@Injectable({ providedIn: 'root' })
export class TelemetryService {
  private static readonly STORAGE_KEY = 'telemetryLog';
  private static readonly MAX_ENTRIES = 200;

  private _events$ = new BehaviorSubject<TelemetryEvent[]>(this.load());
  private initialized = false;

  /** Must be called once, typically from AppComponent. */
  init(router: Router): void {
    if (this.initialized) { return; }
    this.initialized = true;

    router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.track('route.change', { url: e.urlAfterRedirects });
      });

    this.track('app.bootstrap', { userAgent: (typeof navigator !== 'undefined' && navigator.userAgent) || 'unknown' });
  }

  track(code: string, payload: any = {}): void {
    const evt: TelemetryEvent = {
      code,
      payload: this.sanitize(payload),
      timestamp: Date.now(),
      url: (typeof window !== 'undefined' && window.location && window.location.pathname) || ''
    };

    if (typeof console !== 'undefined' && console.debug) {
      console.debug('[telemetry]', evt.code, evt.payload);
    }

    const list = [...this._events$.getValue(), evt];
    while (list.length > TelemetryService.MAX_ENTRIES) {
      list.shift();
    }
    this._events$.next(list);
    this.save(list);
  }

  events(): Observable<TelemetryEvent[]> {
    return this._events$.asObservable();
  }

  getEvents(): TelemetryEvent[] {
    return this._events$.getValue();
  }

  clear(): void {
    this._events$.next([]);
    this.save([]);
  }

  /** Strip anything that looks like a credential from the payload. */
  private sanitize(p: any): any {
    if (!p || typeof p !== 'object') { return p; }
    const clone: any = Array.isArray(p) ? [] : {};
    for (const k of Object.keys(p)) {
      if (/password|secret|token|otp/i.test(k)) {
        clone[k] = '[redacted]';
      } else {
        clone[k] = p[k];
      }
    }
    return clone;
  }

  private load(): TelemetryEvent[] {
    try {
      const raw = localStorage.getItem(TelemetryService.STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  }

  private save(list: TelemetryEvent[]): void {
    try {
      localStorage.setItem(TelemetryService.STORAGE_KEY, JSON.stringify(list));
    } catch (_) { /* quota, private mode, ignore */ }
  }
}
