#!/usr/bin/env node
// Baseline test runner.
// -----------------------------------------------------------
// Invokes Node 22's built-in `node:test` runner against every
// *.spec.ts file in tests/baseline/, with:
//   - our ts-loader (to compile TS decorators)
//   - our harness (to stub out @angular/core + browser globals)
//   - --experimental-test-coverage so LCOV + text summary are emitted
//
// Usage: node tests/baseline/run-baseline.mjs
//
// Produces:
//   results/baseline-test-output.txt   (TAP output)
//   results/baseline-coverage.lcov     (LCOV for CI consumption)
//   results/baseline-summary.txt       (text-summary from node:test)

import { spawn } from 'node:child_process';
import { mkdirSync, createWriteStream, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');
const resultsDir = path.join(repoRoot, 'results');
mkdirSync(resultsDir, { recursive: true });

const resultFile = path.join(resultsDir, 'baseline-test-output.txt');
const lcovFile = path.join(resultsDir, 'baseline-coverage.lcov');
const summaryFile = path.join(resultsDir, 'baseline-summary.txt');

// The registration snippet injected by `--import` can't be a file path
// under Windows-style drive letters without a URL scheme, so we write a
// tiny shim to node_modules/.cache/ and import it.
const loaderShim = `
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
register(${JSON.stringify(pathToFileURL(path.join(__dirname, 'ts-loader.mjs')).href)}, pathToFileURL('./'));
// The harness is not a loader — it installs globals, so import it eagerly.
await import(${JSON.stringify(pathToFileURL(path.join(__dirname, 'harness.mjs')).href)});
`;
const shimPath = path.join(__dirname, '.loader-shim.mjs');
writeFileSync(shimPath, loaderShim);

const args = [
  '--import', pathToFileURL(shimPath).href,
  '--test',
  '--test-reporter=tap',
  `--test-reporter-destination=${resultFile}`,
  '--test-reporter=lcov',
  `--test-reporter-destination=${lcovFile}`,
  '--experimental-test-coverage',
  '--test-coverage-include=src/app/services/**',
  '--test-coverage-include=src/app/cities.service.ts',
  '--test-coverage-include=src/app/header.service.ts',
  '--test-coverage-include=src/app/window-ref.service.ts',
  '--test-coverage-include=src/app/endpoints.ts',
  '--test-coverage-include=src/app/util/**',
  '--test-coverage-include=src/app/common/common.service.ts',
  '--test-coverage-exclude=tests/**',
  '--test-coverage-exclude=src/app/services/*.spec.ts'
];

// Pass every *.spec.ts in this directory.
import { readdirSync } from 'node:fs';
const specs = readdirSync(__dirname)
  .filter((f) => f.endsWith('.spec.ts'))
  .map((f) => path.join(__dirname, f));
args.push(...specs);

console.log(`\n[baseline] running ${specs.length} spec files via node:test\n`);

const proc = spawn(process.execPath, args, {
  stdio: ['inherit', 'pipe', 'pipe'],
  cwd: repoRoot
});

const summaryChunks = [];
proc.stdout.on('data', (d) => {
  process.stdout.write(d);
  summaryChunks.push(d);
});
proc.stderr.on('data', (d) => {
  process.stderr.write(d);
  summaryChunks.push(d);
});

proc.on('close', (code) => {
  writeFileSync(summaryFile, Buffer.concat(summaryChunks));
  console.log(`\n[baseline] exit code: ${code}`);
  console.log(`[baseline] TAP output:  ${path.relative(repoRoot, resultFile)}`);
  console.log(`[baseline] LCOV output: ${path.relative(repoRoot, lcovFile)}`);
  console.log(`[baseline] Summary:     ${path.relative(repoRoot, summaryFile)}`);
  process.exit(code ?? 0);
});
