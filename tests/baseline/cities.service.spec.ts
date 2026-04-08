// Baseline unit tests for src/app/cities.service.ts
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { resetStorage, seedCommonData } from '../baseline/harness.mjs';
import { CitiesService } from '../../src/app/cities.service.ts';

beforeEach(() => {
  resetStorage();
  seedCommonData();
});

test('CitiesService: constructor loads hardcoded city short-list + societies', () => {
  const svc = new CitiesService();
  const cities = svc.getAllCities();
  // The baseline hardcodes 14 serviceable cities in the source.
  assert.equal(cities.length, 14);
  assert.ok(cities.includes('Faridabad'));
  assert.ok(cities.includes('Gurugram'));
  assert.ok(cities.includes('Delhi'));
});

test('CitiesService: getAllSocieties returns societies from commonData', () => {
  const svc = new CitiesService();
  const socs = svc.getAllSocieties();
  assert.deepEqual(socs.sort(), ['Puri Pratham', 'SRS Residency'].sort());
});

test('CitiesService.findMatchingCities: case-insensitive substring match', () => {
  const svc = new CitiesService();
  assert.deepEqual(svc.findMatchingCities('fari'), ['Faridabad']);
  assert.deepEqual(svc.findMatchingCities('GUR'), ['Gurugram']);
  assert.deepEqual(svc.findMatchingCities('noida').sort(), ['Greater Noida', 'Noida'].sort());
});

test('CitiesService.findMatchingCities: empty query returns all', () => {
  const svc = new CitiesService();
  assert.equal(svc.findMatchingCities('').length, 14);
});

test('CitiesService.findMatchingCities: non-matching query returns empty array', () => {
  const svc = new CitiesService();
  assert.deepEqual(svc.findMatchingCities('zzz_no_city'), []);
});

test('CitiesService.findMatchingSocieties: case-insensitive substring match', () => {
  const svc = new CitiesService();
  assert.deepEqual(svc.findMatchingSocieties('pur'), ['Puri Pratham']);
  assert.deepEqual(svc.findMatchingSocieties('residency'), ['SRS Residency']);
});

test('CitiesService.findMatchingStates: case-insensitive substring match', () => {
  const svc = new CitiesService();
  assert.ok(svc.findMatchingStates('har').includes('Haryana'));
  assert.ok(svc.findMatchingStates('UTTA').some((s) => s.toLowerCase().includes('uttar')));
});

test('CitiesService.findStateForCity: finds a state for a known city', () => {
  const svc = new CitiesService();
  // Faridabad is in the Haryana row (index 13) of the `cities` array.
  const state = svc.findStateForCity('Faridabad');
  assert.equal(state, 'Haryana');
});

test('CitiesService.findStateForCity: returns null for unknown city', () => {
  const svc = new CitiesService();
  assert.equal(svc.findStateForCity('Atlantis'), null);
});

test('CitiesService.getSocietiesForCity: returns empty array when city is falsy', () => {
  const svc = new CitiesService();
  assert.deepEqual(svc.getSocietiesForCity(null), []);
  assert.deepEqual(svc.getSocietiesForCity(''), []);
});

test('CitiesService.getSocietiesForCity: matches city from allSocieties', () => {
  // Re-seed with a city that maps to a specific society list.
  seedCommonData({
    allSocieties: [{ city: 'faridabad', societies: [{ name: 'Alpha' }, { name: 'Beta' }] }]
  });
  const svc = new CitiesService();
  assert.deepEqual(svc.getSocietiesForCity('Faridabad'), ['Alpha', 'Beta']);
});

test('CitiesService.getSocietiesForCity: returns empty array for an unknown city', () => {
  const svc = new CitiesService();
  assert.deepEqual(svc.getSocietiesForCity('Atlantis'), []);
});
