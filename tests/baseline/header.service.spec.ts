// Baseline unit tests for src/app/header.service.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import '../baseline/harness.mjs';
import { HeaderService } from '../../src/app/header.service.ts';

test('HeaderService.setText: emits { key: "text", data } on the listener', () => {
  const svc = new HeaderService();
  const received: any[] = [];
  svc.listner().subscribe((e) => received.push(e));
  svc.setText('Hello');
  assert.equal(received.length, 1);
  assert.deepEqual(received[0], { key: 'text', data: 'Hello' });
});

test('HeaderService.hideHeader: emits { key: "hide", data: true }', () => {
  const svc = new HeaderService();
  const received: any[] = [];
  svc.listner().subscribe((e) => received.push(e));
  svc.hideHeader();
  assert.deepEqual(received[0], { key: 'hide', data: true });
});

test('HeaderService.setView: emits { key: "view", data: { viewName, viewOptions } }', () => {
  const svc = new HeaderService();
  const received: any[] = [];
  svc.listner().subscribe((e) => received.push(e));
  svc.setView('plan', { id: 1 });
  assert.deepEqual(received[0], {
    key: 'view',
    data: { viewName: 'plan', viewOptions: { id: 1 } }
  });
});

test('HeaderService.listner: returns the same subject across calls', () => {
  const svc = new HeaderService();
  assert.equal(svc.listner(), svc.listner());
});

test('HeaderService: multiple subscribers each receive every event', () => {
  const svc = new HeaderService();
  const a: any[] = [];
  const b: any[] = [];
  svc.listner().subscribe((e) => a.push(e));
  svc.listner().subscribe((e) => b.push(e));
  svc.setText('one');
  svc.setText('two');
  assert.equal(a.length, 2);
  assert.equal(b.length, 2);
  assert.equal(a[0].data, 'one');
  assert.equal(b[1].data, 'two');
});
