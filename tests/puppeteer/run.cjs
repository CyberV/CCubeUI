#!/usr/bin/env node
/*
 * Puppeteer testbed runner (CommonJS so it picks up the global puppeteer
 * install from NODE_PATH without needing a local node_modules).
 *
 * Serves tests/puppeteer/demo/ over a tiny static HTTP server, then drives
 * the app through scenarios that exercise:
 *   - Offline Mode (default ON)
 *   - N6 Contact / FAQ
 *   - N7 Telemetry
 *   - N8 Dark mode
 *
 * Screenshots are written under tests/puppeteer/screenshots/<feature>/.
 */

const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const puppeteer = require('puppeteer');

const ROOT = path.resolve(__dirname, '..', '..');
const SHOT_DIR = path.resolve(ROOT, 'tests', 'puppeteer', 'screenshots');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png'
};

function startServer(rootDir) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let u = decodeURIComponent(req.url.split('?')[0]);
      if (u === '/') u = '/tests/puppeteer/demo/index.html';
      const full = path.join(rootDir, u);
      if (!full.startsWith(rootDir)) { res.writeHead(403); res.end('Forbidden'); return; }
      fs.stat(full, (err, stat) => {
        if (err || !stat.isFile()) { res.writeHead(404); res.end('Not found: ' + u); return; }
        const ext = path.extname(full).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        fs.createReadStream(full).pipe(res);
      });
    });
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      resolve({ server, url: `http://127.0.0.1:${addr.port}` });
    });
  });
}

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }

async function snapshot(page, feature, name) {
  const dir = path.join(SHOT_DIR, feature);
  ensureDir(dir);
  const file = path.join(dir, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(`  📸 ${path.relative(ROOT, file)}`);
}

async function waitForRoute(page, hash) {
  await page.waitForFunction((h) => window.__routeReady === h, {}, hash);
}

async function goto(page, serverUrl, hash) {
  const target = `${serverUrl}/tests/puppeteer/demo/index.html${hash || ''}`;
  await page.goto(target, { waitUntil: 'networkidle0' });
  if (hash) { await waitForRoute(page, hash); }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function run() {
  ensureDir(SHOT_DIR);
  console.log('Starting static server…');
  const { server, url: serverUrl } = await startServer(ROOT);
  console.log(`  -> ${serverUrl}`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,860']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 860, deviceScaleFactor: 1 });

  try {
    // ----- Feature 1: Offline Mode -----
    console.log('\n[offline-mode] capturing screenshots');
    await page.goto(serverUrl + '/tests/puppeteer/demo/index.html');
    await page.evaluate(() => { localStorage.clear(); });
    await goto(page, serverUrl, '#/home');
    await snapshot(page, 'offline-mode', '01-default-on-home');

    await goto(page, serverUrl, '#/plans');
    await snapshot(page, 'offline-mode', '02-plans-loaded-from-mock');

    await goto(page, serverUrl, '#/dashboard');
    await snapshot(page, 'offline-mode', '03-dashboard-mock-subscription');

    await goto(page, serverUrl, '#/profile');
    await snapshot(page, 'offline-mode', '04-profile-mock-user');

    await page.click('#offline-badge');
    await sleep(150);
    await snapshot(page, 'offline-mode', '05-badge-toggled-online');

    await page.click('#offline-badge');
    await sleep(150);
    await snapshot(page, 'offline-mode', '06-badge-toggled-offline-again');

    // ----- Feature 2: N6 Contact + FAQ -----
    console.log('\n[n6-contact-faq] capturing screenshots');
    await goto(page, serverUrl, '#/contact');
    await snapshot(page, 'n6-contact-faq', '01-contact-page-default');

    await page.type('input[name="name"]', 'Jane Reviewer');
    await page.type('input[name="email"]', 'jane@example.com');
    await page.type('textarea[name="message"]', 'Hello from the puppeteer testbed - just saying hi.');
    await snapshot(page, 'n6-contact-faq', '02-contact-form-filled');

    await page.click('#contact-submit');
    await sleep(200);
    await snapshot(page, 'n6-contact-faq', '03-contact-form-submitted');

    await goto(page, serverUrl, '#/faq');
    await snapshot(page, 'n6-contact-faq', '04-faq-page-initial');

    await page.click('.faq-item[data-idx="0"] .faq-question');
    await sleep(100);
    await snapshot(page, 'n6-contact-faq', '05-faq-first-item-expanded');

    await page.type('#faq-search-input', 'offline');
    await sleep(100);
    await snapshot(page, 'n6-contact-faq', '06-faq-filtered-offline');

    // ----- Feature 3: N7 Telemetry -----
    console.log('\n[n7-telemetry] capturing screenshots');
    await goto(page, serverUrl, '#/home');
    await goto(page, serverUrl, '#/plans');
    await goto(page, serverUrl, '#/dashboard');
    await goto(page, serverUrl, '#/contact');
    await goto(page, serverUrl, '#/faq');
    await snapshot(page, 'n7-telemetry', '01-telemetry-panel-populated');

    const events = await page.evaluate(() => window.__Telemetry._events.map((e) => e.code));
    const expected = ['route.change', 'feature.contact.viewed', 'feature.faq.viewed'];
    const missing = expected.filter((c) => !events.includes(c));
    if (missing.length) {
      console.error('  FAIL: telemetry missing expected events:', missing);
      process.exitCode = 1;
    } else {
      console.log(`  OK: telemetry captured ${events.length} events including route/contact/faq`);
    }

    await page.evaluate(() => window.__Telemetry.track('error.uncaught', { message: 'synthetic demo error' }));
    await sleep(50);
    await snapshot(page, 'n7-telemetry', '02-telemetry-with-error-event');

    // ----- Feature 4: N8 Dark mode -----
    console.log('\n[n8-dark-mode] capturing screenshots');
    await goto(page, serverUrl, '#/home');
    await page.click('#theme-toggle button[data-mode="light"]');
    await sleep(100);
    await snapshot(page, 'n8-dark-mode', '01-home-light-mode');

    await page.click('#theme-toggle button[data-mode="dark"]');
    await sleep(100);
    await snapshot(page, 'n8-dark-mode', '02-home-dark-mode');

    await goto(page, serverUrl, '#/plans');
    await snapshot(page, 'n8-dark-mode', '03-plans-dark-mode');

    await goto(page, serverUrl, '#/faq');
    await page.click('.faq-item[data-idx="0"] .faq-question');
    await sleep(100);
    await snapshot(page, 'n8-dark-mode', '04-faq-dark-mode-expanded');

    await goto(page, serverUrl, '#/contact');
    await snapshot(page, 'n8-dark-mode', '05-contact-dark-mode');

    await page.click('#theme-toggle button[data-mode="system"]');
    await sleep(100);
    await snapshot(page, 'n8-dark-mode', '06-system-mode-applied');

    console.log('\nScreenshots written to tests/puppeteer/screenshots/');
  } catch (err) {
    console.error('Testbed run failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
    server.close();
  }
}

run();
