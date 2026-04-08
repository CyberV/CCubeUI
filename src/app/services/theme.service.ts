import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * ThemeService – N8 (see docs/06-additional-insights.md §8)
 *
 * Applies a dark / light / system theme by toggling classes on
 * document.body. No component templates are modified – the dark palette
 * lives in src/theme/dark-mode.scss as CSS variable overrides scoped to
 * `body.theme-dark`.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private static readonly STORAGE_KEY = 'themeMode';

  private _mode$ = new BehaviorSubject<ThemeMode>(this.loadMode());
  private mediaQuery?: MediaQueryList;
  private initialized = false;

  init(): void {
    if (this.initialized || typeof document === 'undefined') { return; }
    this.initialized = true;

    if (typeof window !== 'undefined' && window.matchMedia) {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.mediaQuery.addEventListener('change', () => this.applyCurrent());
    }

    this.applyCurrent();
  }

  events(): Observable<ThemeMode> {
    return this._mode$.asObservable();
  }

  getMode(): ThemeMode {
    return this._mode$.getValue();
  }

  /** Derived: is the current mode rendering dark? */
  isDarkActive(): boolean {
    const mode = this.getMode();
    if (mode === 'dark') { return true; }
    if (mode === 'light') { return false; }
    return !!(this.mediaQuery && this.mediaQuery.matches);
  }

  setMode(mode: ThemeMode): void {
    this._mode$.next(mode);
    try { localStorage.setItem(ThemeService.STORAGE_KEY, mode); } catch (_) {}
    this.applyCurrent();
  }

  /** Convenience for a two-state toggle (system is skipped). */
  toggle(): void {
    this.setMode(this.isDarkActive() ? 'light' : 'dark');
  }

  private applyCurrent(): void {
    if (typeof document === 'undefined') { return; }
    const dark = this.isDarkActive();
    document.body.classList.toggle('theme-dark', dark);
    document.body.classList.toggle('theme-light', !dark);
  }

  private loadMode(): ThemeMode {
    try {
      const raw = localStorage.getItem(ThemeService.STORAGE_KEY) as ThemeMode | null;
      if (raw === 'light' || raw === 'dark' || raw === 'system') { return raw; }
    } catch (_) {}
    return 'system';
  }
}
