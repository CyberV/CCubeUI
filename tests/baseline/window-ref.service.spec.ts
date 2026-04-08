// Baseline unit tests for src/app/window-ref.service.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import '../baseline/harness.mjs';
import { WindowRefService } from '../../src/app/window-ref.service.ts';

test('WindowRefService.nativeWindow: returns the current global window object', () => {
  const svc = new WindowRefService();
  assert.equal(svc.nativeWindow, globalThis.window);
});

test('WindowRefService.nativeWindow: exposes localStorage/sessionStorage', () => {
  const svc = new WindowRefService();
  assert.ok(svc.nativeWindow.localStorage);
  assert.ok(svc.nativeWindow.sessionStorage);
});
