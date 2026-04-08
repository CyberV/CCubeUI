// Baseline unit tests for src/app/util/util.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import '../baseline/harness.mjs';
import { prettyDate, scrollToBottom, scrollToTop, getContainer, scrollElementToTop } from '../../src/app/util/util.ts';

test('prettyDate: formats a Date into "Mon DD"', () => {
  const out = prettyDate('2025-01-15');
  // "Mon DD" is derived from `new Date(...).toString().split(' ').slice(1,3).join(' ')`
  // which yields strings like "Jan 15" — just assert the shape.
  assert.match(out, /^[A-Z][a-z]{2} \d{1,2}$/);
});

test('prettyDate: handles a timestamp number', () => {
  const out = prettyDate(new Date('2024-06-01').getTime());
  assert.match(out, /^[A-Z][a-z]{2} \d{1,2}$/);
});

test('getContainer / scrollToTop / scrollToBottom: do not throw when jQuery stub is in place', () => {
  // These just exercise the code paths; they rely on the $ stub from harness.mjs.
  assert.doesNotThrow(() => getContainer());
  assert.doesNotThrow(() => scrollToBottom());
  assert.doesNotThrow(() => scrollToTop());
});

test('scrollElementToTop: no-op on null element', () => {
  assert.doesNotThrow(() => scrollElementToTop(null));
});

test('scrollElementToTop: handles an element with a focus() method', () => {
  let focused = false;
  const fakeEl: any = {
    focus() { focused = true; },
    className: 'some-class'
  };
  assert.doesNotThrow(() => scrollElementToTop(fakeEl));
  assert.equal(focused, true);
});
