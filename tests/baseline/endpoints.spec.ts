// Baseline unit tests for src/app/endpoints.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import '../baseline/harness.mjs';
import Endpoints from '../../src/app/endpoints.ts';

test('endpoints: exposes the login.otp contract', () => {
  assert.ok(Endpoints.login, 'login section present');
  assert.ok(Endpoints.login.otp, 'login.otp section present');
  assert.deepEqual(Endpoints.login.otp.send, { method: 'POST', url: 'sendOtp' });
  assert.deepEqual(Endpoints.login.otp.resend, { method: 'POST', url: 'resendOtp' });
  assert.deepEqual(Endpoints.login.otp.verify, { method: 'POST', url: 'verifyOtp' });
});

test('endpoints: exposes the login.checkMobile contract', () => {
  assert.deepEqual(Endpoints.login.checkMobile, { method: 'POST', url: 'checkUserStatusByMobile' });
});

test('endpoints: every entry uses POST (baseline locks the verb set)', () => {
  const entries = [
    Endpoints.login.otp.send,
    Endpoints.login.otp.resend,
    Endpoints.login.otp.verify,
    Endpoints.login.checkMobile
  ];
  for (const e of entries) {
    assert.equal(e.method, 'POST');
    assert.equal(typeof e.url, 'string');
    assert.ok(e.url.length > 0);
  }
});
