// Baseline unit tests for src/app/services/car.service.ts
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { resetStorage } from '../baseline/harness.mjs';
import { CarService } from '../../src/app/services/car.service.ts';

beforeEach(() => {
  resetStorage();
});

test('CarService.getCurrentCar: returns null when localStorage is empty', () => {
  const svc = new CarService();
  assert.equal(svc.getCurrentCar(), null);
});

test('CarService.changeCar: persists a normalised car object to localStorage', () => {
  const svc = new CarService();
  svc.changeCar({ maker: 'Honda', model: 'City', regNo: 'HR26AA0001', bodyType: 'sedan' });
  const raw = globalThis.localStorage.getItem('currentCar');
  assert.ok(raw && raw !== 'null');
  const saved = JSON.parse(raw!);
  assert.equal(saved.regNo, 'HR26AA0001');
  assert.equal(saved.maker, 'Honda');
});

test('CarService.getCurrentCar: returns the saved car after changeCar', () => {
  const svc = new CarService();
  svc.changeCar({ maker: 'Maruti', model: 'Swift', regNo: 'DL01AB1234' });
  const car = svc.getCurrentCar();
  assert.ok(car);
  assert.equal(car.regNo, 'DL01AB1234');
});

test('CarService.changeCar: a null/undefined car is a no-op', () => {
  const svc = new CarService();
  svc.changeCar(null);
  assert.equal(svc.getCurrentCar(), null);
});

test('CarService.changeAddon: saves the addon to sessionStorage and echoes it back', () => {
  const svc = new CarService();
  const addon = { name: 'Monthly Waxing', code: 'MWX' };
  const out = svc.changeAddon(addon);
  assert.deepEqual(out, addon);
  assert.equal(svc.getCurrentAddon().name, 'Monthly Waxing');
});

test('CarService.changeAddon: null addon returns null and does not touch storage', () => {
  const svc = new CarService();
  assert.equal(svc.changeAddon(null), null);
  assert.equal(svc.getCurrentAddon(), null);
});

test('CarService.getCurrentAddon: returns null when no addon is stored', () => {
  const svc = new CarService();
  assert.equal(svc.getCurrentAddon(), null);
});

test('CarService.clear: wipes current car + addon + included state', () => {
  const svc = new CarService();
  svc.changeCar({ maker: 'VW', model: 'Polo', regNo: 'KA05AA9999' });
  svc.changeAddon({ name: 'Detail' });
  globalThis.sessionStorage.setItem('includedAddons', JSON.stringify([{ x: 1 }]));
  globalThis.sessionStorage.setItem('includedAdhocs', JSON.stringify([{ y: 1 }]));

  svc.clear();

  assert.equal(svc.getCurrentCar(), null);
  assert.equal(svc.getCurrentAddon(), null);
  assert.equal(globalThis.sessionStorage.getItem('includedAddons'), 'null');
  assert.equal(globalThis.sessionStorage.getItem('includedAdhocs'), 'null');
});

test('CarService.clear(addonOnly=true): preserves the current car', () => {
  const svc = new CarService();
  svc.changeCar({ maker: 'VW', model: 'Polo', regNo: 'KA05AA9999' });
  svc.changeAddon({ name: 'Detail' });
  svc.clear(true);
  assert.ok(svc.getCurrentCar(), 'current car should survive an addon-only clear');
  assert.equal(svc.getCurrentAddon(), null);
});

test('CarService.backupCar + restoreBackup: round-trip the current car', () => {
  const svc = new CarService();
  svc.changeCar({ maker: 'Honda', model: 'City', regNo: 'HR26AA0001', bodyType: 'sedan' });
  svc.backupCar();
  // Simulate the user clearing the active selection.
  globalThis.localStorage.setItem('currentCar', 'null');
  assert.equal(svc.getCurrentCar(), null);

  svc.restoreBackup();
  const restored = svc.getCurrentCar();
  assert.ok(restored);
  assert.equal(restored.regNo, 'HR26AA0001');
});

test('CarService.restoreBackup: no-op when there is no backup', () => {
  const svc = new CarService();
  svc.restoreBackup();
  assert.equal(svc.getCurrentCar(), null);
});
