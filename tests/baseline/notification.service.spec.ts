// Baseline unit tests for src/app/services/notification.service.ts
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { resetStorage } from '../baseline/harness.mjs';
import { NotificationService } from '../../src/app/services/notification.service.ts';

beforeEach(() => {
  resetStorage();
});

function buildNotif(partial: any = {}) {
  return {
    title: 'Welcome',
    body: 'Thanks for joining',
    data: JSON.stringify({ foo: 'bar' }),
    ...partial
  };
}

test('NotificationService: starts with all three inboxes empty', () => {
  const svc = new NotificationService();
  const all = svc.getAllNotifications();
  assert.deepEqual(all.new, []);
  assert.deepEqual(all.historical, []);
  assert.deepEqual(all.read, []);
});

test('NotificationService.saveNewNotification: stores the notif in the "new" inbox', () => {
  const svc = new NotificationService();
  svc.saveNewNotification(buildNotif());
  const all = svc.getAllNotifications();
  assert.equal(all.new.length, 1);
  assert.equal(all.new[0].title, 'Welcome');
  assert.ok(all.new[0].date, 'date should be stamped');
});

test('NotificationService.saveNewNotification: sets action=refresh when title contains "activated"', () => {
  const svc = new NotificationService();
  svc.saveNewNotification(buildNotif({ title: 'Plan Activated!' }));
  const all = svc.getAllNotifications();
  assert.equal(all.new[0].action, 'refresh');
});

test('NotificationService.saveNewNotification: explicit data.action wins over title heuristic', () => {
  const svc = new NotificationService();
  svc.saveNewNotification(buildNotif({
    title: 'Plan Activated',
    data: JSON.stringify({ action: 'refer' })
  }));
  assert.equal(svc.getNewNotifications()[0].action, 'refer');
});

test('NotificationService.saveNewNotification: latest notification is at the head of the list', () => {
  const svc = new NotificationService();
  svc.saveNewNotification(buildNotif({ body: 'first' }));
  svc.saveNewNotification(buildNotif({ body: 'second' }));
  const notifs = svc.getNewNotifications();
  assert.equal(notifs[0].body, 'second');
  assert.equal(notifs[1].body, 'first');
});

test('NotificationService.markNotificationAsRead: moves a new notif into read, then to history', () => {
  const svc = new NotificationService();
  svc.saveNewNotification(buildNotif({ body: 'a' }));
  svc.saveNewNotification(buildNotif({ body: 'b' }));
  svc.markNotificationAsRead({ body: 'a' });

  const newIbx = svc.getNewNotifications();
  assert.equal(newIbx.length, 1);
  assert.equal(newIbx[0].body, 'b');

  // markNotificationAsRead also calls moveNotificationsToHistory, so the
  // read inbox is cleared and the historical inbox now holds 'a'.
  assert.equal(svc.getReadNotifications().length, 0);
  assert.equal(svc.getHistoricalNotifications().length, 1);
  assert.equal(svc.getHistoricalNotifications()[0].body, 'a');
});

test('NotificationService.markAllNotificationsAsRead: moves everything to historical', () => {
  const svc = new NotificationService();
  svc.saveNewNotification(buildNotif({ body: '1' }));
  svc.saveNewNotification(buildNotif({ body: '2' }));
  svc.markAllNotificationsAsRead();
  assert.equal(svc.getNewNotifications().length, 0);
  assert.equal(svc.getHistoricalNotifications().length, 2);
});

test('NotificationService.clear: empties all three inboxes', () => {
  const svc = new NotificationService();
  svc.saveNewNotification(buildNotif());
  svc.markAllNotificationsAsRead();
  svc.clear();
  assert.deepEqual(svc.getAllNotifications(), { new: [], historical: [], read: [] });
});

test('NotificationService.sendNotificationUpdate: emits the current state on the subject', () => {
  const svc = new NotificationService();
  const received: any[] = [];
  svc.events().subscribe((e: any) => received.push(e));
  svc.saveNewNotification(buildNotif());
  assert.equal(received.length, 1);
  assert.equal(received[0].new.length, 1);
});

test('NotificationService.events: re-creates the subject after it closes', () => {
  const svc = new NotificationService();
  const subject = svc.events();
  (subject as any).complete?.();
  (svc.notificationsEmitter as any).closed = true;
  const reborn = svc.events();
  assert.notEqual(reborn, subject, 'events() should hand back a fresh subject once the old one is closed');
});
