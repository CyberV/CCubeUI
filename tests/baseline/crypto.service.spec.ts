// Baseline unit tests for src/app/services/crypto.service.ts
// Pure functions — no DI, no Angular.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import '../baseline/harness.mjs';
import { encrypt, decrypt, hash } from '../../src/app/services/crypto.service.ts';

test('crypto.encrypt: returns a non-empty string distinct from input', () => {
  const enc = encrypt('hello world');
  assert.equal(typeof enc, 'string');
  assert.notEqual(enc, 'hello world');
  assert.ok(enc.length > 0);
});

test('crypto.decrypt: round-trips with encrypt for ASCII text', () => {
  const enc = encrypt('top secret message');
  assert.equal(decrypt(enc), 'top secret message');
});

test('crypto.decrypt: round-trips with encrypt for unicode', () => {
  const enc = encrypt('नमस्ते ⭐');
  assert.equal(decrypt(enc), 'नमस्ते ⭐');
});

test('crypto.decrypt: round-trips for empty string', () => {
  const enc = encrypt('');
  assert.equal(decrypt(enc), '');
});

test('crypto.encrypt: two calls with the same plain text produce different cipher (random IV)', () => {
  const a = encrypt('same');
  const b = encrypt('same');
  assert.notEqual(a, b, 'AES encryption should use a random IV and not yield deterministic output');
});

test('crypto.hash: returns a 64-char lowercase hex string (HMAC-SHA256)', () => {
  const h = hash('payload', 'secret');
  assert.equal(typeof h, 'string');
  assert.equal(h.length, 64);
  assert.match(h, /^[0-9a-f]{64}$/);
});

test('crypto.hash: deterministic for the same (text, secret)', () => {
  assert.equal(hash('payload', 'secret'), hash('payload', 'secret'));
});

test('crypto.hash: different secrets yield different hashes', () => {
  assert.notEqual(hash('payload', 's1'), hash('payload', 's2'));
});

test('crypto.hash: uses the default secret when one is not passed', () => {
  // Default secret is hard-coded inside crypto.service.ts; we only assert the
  // shape, not the exact value — the point of the baseline is to detect
  // regressions in the public contract, not to reproduce the salt.
  const h = hash('payload');
  assert.equal(h.length, 64);
  assert.match(h, /^[0-9a-f]{64}$/);
});
