# Baseline Regression Report – Pre-Upgrade

**Project:** ccubeapp (CCube / SSewa)
**Angular (at capture):** 9.1.1
**Ionic (at capture):** 5.0.7
**Node runtime:** v22.22.0
**Harness:** `tests/baseline/run-baseline.mjs` (node:test + node:test-coverage)
**Captured:** 2026-04-06

---

## Summary

| Metric            | Value  |
|-------------------|--------|
| Tests executed    | **116** |
| Passing           | **116** |
| Failing           | **0** |
| Cancelled         | 0      |
| Skipped / Todo    | 0      |
| Line coverage     | **83.29 %** |
| Branch coverage   | **76.61 %** |
| Function coverage | **92.73 %** |
| Runtime           | ~44 s (single-process) |

Target in the task brief was **50 % line & branch coverage**. The baseline exceeds both.

---

## Per-File Coverage

| File | Line % | Branch % | Func % |
|------|-------:|---------:|-------:|
| `src/app/cities.service.ts`               | 100.00 |  77.42 | 100.00 |
| `src/app/common/common.service.ts`        |  43.16 | 100.00 |  57.14 |
| `src/app/endpoints.ts`                    |  96.00 | 100.00 | 100.00 |
| `src/app/header.service.ts`               |  80.00 |  50.00 | 100.00 |
| `src/app/services/api.service.ts`         | 100.00 |  90.00 | 100.00 |
| `src/app/services/car.service.ts`         |  89.34 |  76.32 | 100.00 |
| `src/app/services/crypto.service.ts`      | 100.00 | 100.00 | 100.00 |
| `src/app/services/notification.service.ts`|  94.40 |  79.41 | 100.00 |
| `src/app/services/plan.service.ts`        |  79.53 |  75.38 |  91.86 |
| `src/app/services/user.service.ts`        |  94.95 |  70.83 |  80.00 |
| `src/app/util/util.ts`                    |  72.58 |  80.00 | 100.00 |
| `src/app/window-ref.service.ts`           |  61.11 |  83.33 | 100.00 |
| **All targeted files**                    | **83.29** | **76.61** | **92.73** |

> `common.service.ts` sits lower on line coverage because the bulk of its body is the async `init()` function that talks to a remote HTTP endpoint. The baseline deliberately avoids exercising real network calls. The pure-logic exports (`getConfigValue`, `planData`) are fully covered.

## Spec files

```
tests/baseline/
├── api.service.spec.ts          (1 test)
├── car.service.spec.ts          (11 tests)
├── cities.service.spec.ts       (12 tests)
├── common.service.spec.ts       (5 tests)
├── crypto.service.spec.ts       (9 tests)
├── endpoints.spec.ts            (3 tests)
├── header.service.spec.ts       (5 tests)
├── notification.service.spec.ts (10 tests)
├── plan.service.spec.ts         (42 tests)
├── user.service.spec.ts         (9 tests)
├── util.spec.ts                 (5 tests)
└── window-ref.service.spec.ts   (2 tests)
                           TOTAL: 116 tests
```

## Reproducing this report

```bash
node tests/baseline/run-baseline.mjs
```

- TAP output: `results/baseline-test-output.txt`
- LCOV output: `results/baseline-coverage.lcov`
- Captured stdout/stderr: `results/baseline-summary.txt`
- This report: `results/baseline-report.md`

## Interpretation

- **This is the regression oracle** for the Angular 9 → 17 and Ionic 5 → 7 upgrade. Every pass in this report is a behaviour that must still pass after the upgrade.
- The legacy 101 `*.spec.ts` files shipped with the repo are **not** part of this baseline. They were CLI-scaffolded, rely on packages not in `package.json` (e.g. `@ionic-native/splash-screen`), and have been unrunnable in the current toolchain since at least 2020-03. They will be re-executed via `ng test` post-upgrade in Task 7, unmodified, per the task brief – any failures there are expected and will not be fixed.
- Any new failure in this file after an upgrade step is a real regression and must be investigated before the next step.
