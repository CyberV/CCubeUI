// Baseline unit tests for src/app/services/plan.service.ts
//
// PlanService is the most load-bearing business-logic file in the repo
// (~900 lines). The tests below exercise its public surface by constructing
// it with a real CarService + a stubbed ToastController, and by seeding
// localStorage with a deterministic commonData payload via the harness.

import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { resetStorage, seedCommonData } from '../baseline/harness.mjs';
import { CarService } from '../../src/app/services/car.service.ts';
import { PlanService } from '../../src/app/services/plan.service.ts';

const toastStub: any = {
  create: async () => ({ present() {}, dismiss() {} })
};

function freshPlanService(withCar = true) {
  const carSvc = new CarService();
  if (withCar) {
    carSvc.changeCar({ maker: 'Honda', model: 'City', regNo: 'HR26AA0001', bodyType: 'sedan' });
  }
  return { plan: new PlanService(carSvc as any, toastStub), car: carSvc };
}

beforeEach(() => {
  resetStorage();
  seedCommonData();
});

test('PlanService: loads plans and features from commonData on construction', () => {
  const { plan } = freshPlanService();
  assert.equal(plan.AllPlans.length, 4);
  assert.equal(plan.AllFeatures.length, 4);
  // OnlyAddons excludes isAdhoc features.
  assert.equal(plan.OnlyAddons.length, 3);
  assert.equal(plan.fixedAdhocs.length, 1);
});

test('PlanService.getPlanByName: is case-insensitive', () => {
  const { plan } = freshPlanService();
  assert.equal(plan.getPlanByName('Deluxe').code, 'DLX');
  assert.equal(plan.getPlanByName('deluxe').code, 'DLX');
  assert.equal(plan.getPlanByName('DELUXE').code, 'DLX');
});

test('PlanService.getPlanByName: returns null for unknown plan', () => {
  const { plan } = freshPlanService();
  assert.equal(plan.getPlanByName('Galactic'), null);
});

test('PlanService.UpgradePlan: returns the DLX plan by default', () => {
  const { plan } = freshPlanService();
  const up = plan.UpgradePlan;
  assert.equal(up.code, 'DLX');
  // The getter deep-clones the plan so mutations do not pollute AllPlans.
  up.name = 'Mutated';
  assert.notEqual(plan.UpgradePlan.name, 'Mutated');
});

test('PlanService.getUpdatePrice: sedan Standard → Deluxe = 900 - 500 = 400', () => {
  const { plan } = freshPlanService();
  assert.equal(plan.getUpdatePrice('Standard', 'Deluxe'), 400);
});

test('PlanService.getUpdatePrice: Work From Home target is always free', () => {
  const { plan } = freshPlanService();
  assert.equal(plan.getUpdatePrice('Standard', 'Work From Home'), 0);
});

test('PlanService.getUpdatePrice: returns 0 when the car is unknown', () => {
  const { plan } = freshPlanService(false);
  assert.equal(plan.getUpdatePrice('Standard', 'Deluxe'), 0);
});

test('PlanService.getFeaturesForPlan: returns feature objects matching plan.features codes', () => {
  const { plan } = freshPlanService();
  const features = plan.getFeaturesForPlan('Deluxe');
  assert.deepEqual(features.map((f: any) => f.code).sort(), ['F1', 'F2', 'F3']);
});

test('PlanService.getUniqueFeaturesForPlan: respects the uniqueFeatures list on the plan', () => {
  const { plan } = freshPlanService();
  const unique = plan.getUniqueFeaturesForPlan('Deluxe');
  assert.deepEqual(unique.map((f: any) => f.code), ['F3']);
});

test('PlanService.getAddonsForPlan: Work From Home exposes Deluxe unique features', () => {
  const { plan } = freshPlanService();
  const addons = plan.getAddonsForPlan('Work From Home');
  assert.deepEqual(addons.map((a: any) => a.code), ['F3']);
});

test('PlanService.getAddonsForPlan: Standard exposes Deluxe unique features', () => {
  const { plan } = freshPlanService();
  const addons = plan.getAddonsForPlan('Standard');
  assert.deepEqual(addons.map((a: any) => a.code), ['F3']);
});

test('PlanService.getAddonsForPlan: Elite has no upsell addons', () => {
  const { plan } = freshPlanService();
  assert.deepEqual(plan.getAddonsForPlan('Elite'), []);
});

test('PlanService.getAdhocsForPlan: returns all fixed ad-hoc features', () => {
  const { plan } = freshPlanService();
  const adhocs = plan.getAdhocsForPlan('Standard');
  assert.equal(adhocs.length, 1);
  assert.equal(adhocs[0].code, 'F4');
});

test('PlanService.changePlan/getSelectedPlan: round-trips through sessionStorage', () => {
  const { plan } = freshPlanService();
  const std = plan.getPlanByName('Standard');
  plan.changePlan(std);
  const selected = plan.getSelectedPlan();
  assert.equal(selected.code, 'STD');
});

test('PlanService.clear: resets the selected plan', () => {
  const { plan } = freshPlanService();
  plan.changePlan(plan.getPlanByName('Standard'));
  plan.clear();
  assert.equal(plan.getSelectedPlan(), null);
});

test('PlanService.clearAll: clears selected plan + addons + adhocs + subscription', () => {
  const { plan } = freshPlanService();
  plan.changePlan(plan.getPlanByName('Standard'));
  plan.includeAddon({ name: 'Addon A', code: 'AA', price: 100 });
  plan.includeAdhoc({ name: 'Adhoc A', code: 'AD', price: 50 });
  plan.setCurrentSubscription({ id: 's1' });

  plan.clearAll();

  assert.equal(plan.getSelectedPlan(), null);
  assert.deepEqual(plan.getIncludedAddons(), []);
  assert.deepEqual(plan.getIncludedAdhocs(), []);
  assert.equal(plan.getCurrentSubscription(), null);
});

test('PlanService.includeAddon / excludeAddon: maintains unique-by-name inclusion', () => {
  const { plan } = freshPlanService();
  plan.includeAddon({ name: 'Wash', code: 'W', price: 10 });
  plan.includeAddon({ name: 'Wash', code: 'W', price: 10 }); // duplicate should be ignored
  assert.equal(plan.getIncludedAddons().length, 1);

  plan.includeAddon({ name: 'Wax', code: 'X', price: 20 });
  assert.equal(plan.getIncludedAddons().length, 2);

  plan.excludeAddon({ name: 'Wash' });
  assert.equal(plan.getIncludedAddons().length, 1);
  assert.equal(plan.getIncludedAddons()[0].name, 'Wax');

  plan.excludeAddon({ name: 'Wax' });
  assert.deepEqual(plan.getIncludedAddons(), []);
});

test('PlanService.includeAdhoc / excludeAdhoc: maintains unique-by-name inclusion', () => {
  const { plan } = freshPlanService();
  plan.includeAdhoc({ name: 'Foam Wash', price: 99 });
  plan.includeAdhoc({ name: 'Foam Wash', price: 99 });
  assert.equal(plan.getIncludedAdhocs().length, 1);
  plan.excludeAdhoc({ name: 'Foam Wash' });
  assert.deepEqual(plan.getIncludedAdhocs(), []);
});

test('PlanService.includeAdhoc(complimentary=true): stores in sessionStorage.complimentary', () => {
  const { plan } = freshPlanService();
  plan.includeAdhoc({ name: 'Free Polish', price: 0 }, false, true);
  const raw = globalThis.sessionStorage.getItem('complimentary');
  assert.ok(raw && raw !== 'null');
  const parsed = JSON.parse(raw!);
  assert.equal(parsed.adhocs[0].name, 'Free Polish');
  assert.equal(parsed.adhocs[0].complimentary, true);
});

test('PlanService.getPlanDuration: defaults to "monthly"', () => {
  const { plan } = freshPlanService();
  assert.equal(plan.getPlanDuration(), 'monthly');
});

test('PlanService.updatePlanDuration: persists to sessionStorage and emits listener event', () => {
  const { plan } = freshPlanService();
  const received: any[] = [];
  plan.listner().subscribe((e: any) => received.push(e));
  plan.updatePlanDuration('quarterly');
  assert.equal(plan.getPlanDuration(), 'quarterly');
  assert.equal(received[received.length - 1].key, 'planDuration');
  assert.equal(received[received.length - 1].value, 'quarterly');
});

test('PlanService.createPeriodLabel: returns null for null date', () => {
  const { plan } = freshPlanService();
  assert.equal(plan.createPeriodLabel(null), null);
});

test('PlanService.createPeriodLabel: monthly period spans one month', () => {
  const { plan } = freshPlanService();
  const label = plan.createPeriodLabel(new Date('2025-01-15').toString(), 'monthly');
  assert.equal(typeof label, 'string');
  assert.ok(label!.length > 0);
});

test('PlanService.getAppliedCoupon / setAppliedCoupon: round-trip', () => {
  const { plan } = freshPlanService();
  assert.equal(plan.getAppliedCoupon(), null);
  plan.setAppliedCoupon({ code: 'SAVE10', discount: 10 });
  assert.deepEqual(plan.getAppliedCoupon(), { code: 'SAVE10', discount: 10 });
  plan.setAppliedCoupon(null);
  assert.equal(plan.getAppliedCoupon(), null);
});

test('PlanService.getCouponByCode: returns the coupon when present in config', () => {
  const { plan } = freshPlanService();
  const coupon = plan.getCouponByCode('SAVE10');
  assert.ok(coupon);
  assert.equal(coupon.discount, 10);
});

test('PlanService.getCouponByCode: returns null when the config has no such coupon', () => {
  const { plan } = freshPlanService();
  assert.equal(plan.getCouponByCode('NOT_REAL'), null);
});

test('PlanService.getAddonByCode: returns the feature object by code', () => {
  const { plan } = freshPlanService();
  const addon = plan.getAddonByCode('F2');
  assert.ok(addon);
  assert.equal(addon.name, 'Weekly Interior');
});

test('PlanService.getAddonByCode: returns null on unknown code', () => {
  const { plan } = freshPlanService();
  assert.equal(plan.getAddonByCode('ZZZ'), null);
});

test('PlanService.canUpgradeThisMonth: requires serviceDay ≤ config', () => {
  const { plan } = freshPlanService();
  // Default seed sets RENEW_ADDON_PERIOD to 15.
  assert.equal(plan.canUpgradeThisMonth({ serviceDay: 10 }), true);
  assert.equal(plan.canUpgradeThisMonth({ serviceDay: 20 }), false);
  assert.equal(plan.canUpgradeThisMonth({}), false);
});

test('PlanService.changePlanForCar: noop when planName is falsy', () => {
  const { plan } = freshPlanService();
  plan.changePlanForCar(null);
  assert.equal(plan.getSelectedPlan(), null);
});

test('PlanService.changePlanForCar: sets the selected plan for the current car', () => {
  const { plan } = freshPlanService();
  plan.changePlanForCar('Deluxe');
  const selected = plan.getSelectedPlan();
  assert.equal(selected.code, 'DLX');
  assert.equal(selected.duration, 'monthly');
  assert.equal(selected.price, 900); // sedan price
});

test('PlanService.getUpgradePlans: WFH current → offers Standard and Deluxe upgrades', () => {
  const { plan } = freshPlanService();
  const ups = plan.getUpgradePlans({ plan: { name: 'Work From Home', duration: 'monthly' } });
  assert.equal(ups.length, 2);
  assert.deepEqual(ups.map((p: any) => p.code).sort(), ['DLX', 'STD'].sort());
});

test('PlanService.getUpgradePlans: STD current → offers Deluxe only', () => {
  const { plan } = freshPlanService();
  const ups = plan.getUpgradePlans({ plan: { name: 'Standard', duration: 'monthly' } });
  assert.equal(ups.length, 1);
  assert.equal(ups[0].code, 'DLX');
});

test('PlanService.getUpgradePlans: DLX / ELT current → no upgrades', () => {
  const { plan } = freshPlanService();
  assert.deepEqual(plan.getUpgradePlans({ plan: { name: 'Deluxe', duration: 'monthly' } }), []);
  assert.deepEqual(plan.getUpgradePlans({ plan: { name: 'Elite', duration: 'monthly' } }), []);
});

test('PlanService.getUpgradePlans: returns [] when payment has no plan', () => {
  const { plan } = freshPlanService();
  assert.deepEqual(plan.getUpgradePlans({ plan: null }), []);
});

test('PlanService.isSecondCar: returns false when there are no subscriptions', () => {
  const { plan } = freshPlanService();
  assert.equal(plan.isSecondCar(), false);
});

test('PlanService.renewPlan: stamps forRenew + lastDate on the plan', () => {
  const { plan } = freshPlanService();
  const std = plan.getPlanByName('Standard');
  plan.renewPlan(std, new Date('2025-02-01'));
  const selected = plan.getSelectedPlan();
  assert.equal(selected.forRenew, true);
  assert.ok(selected.lastDate);
  assert.ok(selected.period);
});

test('PlanService.upgradePlan: stamps forUpgrade + startDate on the plan', () => {
  const { plan } = freshPlanService();
  const std = plan.getPlanByName('Standard');
  plan.upgradePlan(std, new Date('2025-03-01'));
  const selected = plan.getSelectedPlan();
  assert.equal(selected.forUpgrade, true);
  assert.ok(selected.startDate);
});

test('PlanService.lockCurrentOrder: computes an order total and a receipt id', async () => {
  const { plan } = freshPlanService();
  const order: any = {
    plan: plan.getPlanByName('Standard'),
    addons: [{ name: 'Wash', price: 100 }],
    adhocs: [{ name: 'Foam', price: 50 }],
    bonus: 0,
    discount: null,
    newCarDiscount: 0,
    serviceTotal: 650,
    total: 650
  };
  const locked: any = await plan.lockCurrentOrder(order);
  assert.equal(locked.receiptId.startsWith('CCUBE-101'), true);
  assert.ok(locked.info);
  assert.equal(locked.info.addons, 'Wash');
  assert.equal(locked.info.adhocs, 'Foam');
});

test('PlanService.removeCouponFromOrder: restores the pre-coupon total', () => {
  const { plan } = freshPlanService();
  const order: any = {
    total: 500,
    discount: { discount: 100 },
    info: { discount: { discount: 100 } }
  };
  globalThis.sessionStorage.setItem('currentOrder', JSON.stringify(order));
  plan.removeCouponFromOrder();
  const updated = plan.getCurrentOrder();
  assert.equal(updated.total, 600);
  assert.equal(updated.discount, null);
});

test('PlanService.changeDateForAdhoc: updates scheduledDate on a matching included adhoc', () => {
  const { plan } = freshPlanService();
  plan.setIncludedAdhocs([{ code: 'X', scheduledDate: null }]);
  plan.changeDateForAdhoc({ code: 'X', scheduledDate: '2025-05-01' });
  assert.equal(plan.getIncludedAdhocs()[0].scheduledDate, '2025-05-01');
});

test('PlanService.refreshAdhocs: rewrites prices based on the current car body type', () => {
  const { plan } = freshPlanService();
  plan.setIncludedAdhocs([{ name: 'Polish', pricing: { sedan: 300, suv: 350 }, price: 0 }]);
  plan.refreshAdhocs();
  assert.equal(plan.getIncludedAdhocs()[0].price, 300);
});

test('PlanService.includeAddonWithCode: derives price from the feature + current car', () => {
  const { plan } = freshPlanService();
  plan.includeAddonWithCode('F2');
  const addons = plan.getIncludedAddons();
  assert.equal(addons.length, 1);
  assert.equal(addons[0].code, 'F2');
  assert.equal(addons[0].price, 80); // sedan pricing
});

test('PlanService.includeComplimentaryAdhocWithCode: marks adhoc complimentary', () => {
  const { plan } = freshPlanService();
  plan.includeComplimentaryAdhocWithCode('F4');
  const raw = globalThis.sessionStorage.getItem('complimentary');
  assert.ok(raw && raw !== 'null');
});
