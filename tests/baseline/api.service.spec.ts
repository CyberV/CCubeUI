// Baseline unit tests for src/app/services/api.service.ts
// (Placeholder service; we lock in its existence + zero-arg constructibility.)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import '../baseline/harness.mjs';
import { ApiService } from '../../src/app/services/api.service.ts';

test('ApiService: is constructible with no arguments', () => {
  const svc = new ApiService();
  assert.ok(svc);
});
