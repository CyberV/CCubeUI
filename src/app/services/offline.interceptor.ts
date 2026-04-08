import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { OfflineService } from './offline.service';
import { MOCK_REGISTRY, MockEntry } from './mock-data-registry';

/**
 * OfflineHttpInterceptor – see docs/06-additional-insights.md §5
 *
 * When offline mode is active, this interceptor short-circuits every outbound
 * HTTP request that matches a known backend endpoint and returns a canned
 * response. Asset requests (anything under /assets/) are ALWAYS passed
 * through – the mock JSON files themselves have to load normally.
 */
@Injectable()
export class OfflineHttpInterceptor implements HttpInterceptor {
  constructor(private offlineService: OfflineService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.offlineService.isOffline()) {
      return next.handle(req);
    }

    // Asset files must load normally.
    if (/\/assets\//.test(req.url)) {
      return next.handle(req);
    }

    const match = this.findMatch(req.url, req.method);
    if (!match) {
      // Unmatched non-asset request while offline: return a default stub so
      // components don't error out with "observable closed without value".
      return of(new HttpResponse({ status: 200, body: { success: true, offline: true, url: req.url } }))
        .pipe(delay(25));
    }

    const responseBody = match.response({ url: req.url, method: req.method, body: req.body });

    // If the registry signals that the body should come from an asset, fetch
    // that asset (still through `fetch` so we don't recurse back through the
    // interceptor chain) and return its contents.
    if (responseBody && responseBody.__mockAsset) {
      return this.loadAsset(responseBody.__mockAsset).pipe(
        switchMap((body) => of(new HttpResponse({ status: 200, body })))
      );
    }

    return of(new HttpResponse({ status: 200, body: responseBody })).pipe(delay(25));
  }

  private findMatch(url: string, method: string): MockEntry | undefined {
    return MOCK_REGISTRY.find(
      (e) => (e.method === '*' || e.method === method) && e.pattern.test(url)
    );
  }

  private loadAsset(path: string): Observable<any> {
    return new Observable((observer) => {
      fetch(path)
        .then((r) => r.json())
        .then((j) => {
          observer.next(j && j.data ? j.data : j);
          observer.complete();
        })
        .catch((err) => {
          observer.next({ success: false, error: String(err) });
          observer.complete();
        });
    });
  }
}
