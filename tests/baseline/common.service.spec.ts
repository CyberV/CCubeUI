// Baseline unit tests for src/app/common/common.service.ts
// (getConfigValue + planData – the pure-logic exports)
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { resetStorage, seedCommonData } from '../baseline/harness.mjs';
import { getConfigValue, planData } from '../../src/app/common/common.service.ts';

beforeEach(() => {
  resetStorage();
});

test('getConfigValue: returns null when commonData is absent', () => {
  assert.equal(getConfigValue('ANYTHING'), null);
});

test('getConfigValue: returns the value for a known config key', () => {
  seedCommonData();
  assert.equal(getConfigValue('RENEW_ADDON_PERIOD'), 15);
  assert.equal(getConfigValue('DISCOUNT_QUARTERLY'), 10);
});

test('getConfigValue: returns undefined for an unknown key when data IS present', () => {
  seedCommonData();
  assert.equal(getConfigValue('NOT_A_REAL_KEY'), undefined);
});

test('planData: returns the cached commonData object once it has been saved', () => {
  seedCommonData();
  const d = planData();
  assert.ok(d);
  assert.ok(Array.isArray(d.plansList.plans));
  assert.equal(d.plansList.plans.length, 4);
});

test('planData: returns null when commonData has not been initialised', () => {
  assert.equal(planData(), null);
});
