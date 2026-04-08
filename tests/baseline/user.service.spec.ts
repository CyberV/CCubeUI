// Baseline unit tests for src/app/services/user.service.ts
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { resetStorage } from '../baseline/harness.mjs';
import { UserService } from '../../src/app/services/user.service.ts';

const httpStub: any = { get() { return { pipe() { return { subscribe() {} }; } }; } };
const alertStub: any = { create: async () => ({ present() {} }) };
const platformStub: any = { is: () => false };
const winRefStub: any = { nativeWindow: globalThis.window };

function freshUserService() {
  return new UserService(httpStub, alertStub, platformStub, winRefStub);
}

beforeEach(() => {
  resetStorage();
});

test('UserService.isLoggedIn: false by default when no currentUser in storage', () => {
  const svc = freshUserService();
  assert.equal(svc.isLoggedIn(), false);
});

test('UserService.setCurrentUser: stores the user and emits LOGGED_IN', () => {
  const svc = freshUserService();
  const events: any[] = [];
  svc.listner().subscribe((e: any) => events.push(e));
  svc.setCurrentUser({ phone: '9999999999', name: 'Tester' } as any);
  assert.equal(svc.isLoggedIn(), true);
  assert.equal(events.length, 1);
  assert.equal(events[0].event, 'LOGGED_IN');
  assert.equal(events[0].user.phone, '9999999999');
});

test('UserService.setCurrentUser(null): stores null and emits LOGGED_OUT', () => {
  const svc = freshUserService();
  svc.setCurrentUser({ phone: '8888' } as any);
  const events: any[] = [];
  svc.listner().subscribe((e: any) => events.push(e));
  svc.setCurrentUser(null as any);
  assert.equal(events[0].event, 'LOGGED_OUT');
});

test('UserService.getCurrentUser: reads the user from localStorage', () => {
  const svc = freshUserService();
  svc.setCurrentUser({ phone: '7777', name: 'Bob' } as any);
  const u = svc.getCurrentUser();
  assert.equal(u.phone, '7777');
});

test('UserService.getCurrentUser: returns null when localStorage holds the sentinel "null"', () => {
  const svc = freshUserService();
  globalThis.localStorage.setItem('currentUser', 'null');
  assert.equal(svc.getCurrentUser(), null);
});

test('UserService.setUserToken: persists the token under "userToken"', () => {
  const svc = freshUserService();
  svc.setUserToken('abc123');
  assert.equal(globalThis.localStorage.getItem('userToken'), 'abc123');
});

test('UserService.listner: re-creates a subject once the previous one is closed', () => {
  const svc = freshUserService();
  const first = svc.listner();
  (svc as any)._userSubject.closed = true;
  const second = svc.listner();
  assert.notEqual(first, second);
});

test('UserService constructor: rehydrates currentUser from localStorage', () => {
  globalThis.localStorage.setItem('currentUser', JSON.stringify({ phone: '1234', name: 'Preloaded' }));
  const svc = freshUserService();
  assert.equal(svc.isLoggedIn(), true);
  assert.equal(svc.getCurrentUser().phone, '1234');
});

test('UserService.handleError: returns an observable-like throwError without crashing', () => {
  const svc = freshUserService();
  const errObs = svc.handleError(new Error('boom'));
  assert.ok(errObs, 'handleError should return an observable wrapper');
});
