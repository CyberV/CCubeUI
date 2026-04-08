import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { TelemetryService } from './telemetry.service';

/**
 * N7 – Angular ErrorHandler that forwards uncaught errors to
 * TelemetryService before delegating to the default handler. We use
 * `Injector.get` rather than constructor DI to avoid cycles at bootstrap
 * (Angular instantiates ErrorHandler very early).
 */
@Injectable()
export class TelemetryErrorHandler extends ErrorHandler {
  constructor(private injector: Injector) {
    super();
  }

  override handleError(error: any): void {
    try {
      const telemetry = this.injector.get(TelemetryService);
      telemetry.track('error.uncaught', {
        message: (error && error.message) || String(error),
        stack: error && error.stack ? String(error.stack).split('\n').slice(0, 5).join('\n') : undefined
      });
    } catch (_) { /* swallow – must not break rendering */ }
    super.handleError(error);
  }
}
