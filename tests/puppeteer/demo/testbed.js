/*
 * CCube Offline Demo Testbed
 *
 * Minimal runtime that:
 *   - loads the SAME mock-data JSON fixtures used by the Angular
 *     OfflineHttpInterceptor (src/assets/mock-data/*.json),
 *   - drives a tiny hash-router over the view container,
 *   - reproduces the Offline Badge (Offline Mode),
 *   - reproduces the Contact/FAQ pages (N6),
 *   - reproduces the Telemetry panel (N7),
 *   - reproduces the Theme toggle (N8 dark mode).
 *
 * The testbed does not re-implement the Angular app. Its only job is
 * to provide puppeteer with an environment where each new feature is
 * observable and screenshot-able without needing a full ng build.
 */

(() => {
  // -------- Offline state (mirrors OfflineService) --------
  const Offline = {
    _enabled: (localStorage.getItem('offlineMode') !== 'false'), // default ON
    isOffline() { return this._enabled; },
    enable() { this._enabled = true; localStorage.setItem('offlineMode', 'true'); Telemetry.track('feature.offline.toggle', { enabled: true }); paintOfflineBadge(); },
    disable() { this._enabled = false; localStorage.setItem('offlineMode', 'false'); Telemetry.track('feature.offline.toggle', { enabled: false }); paintOfflineBadge(); },
    toggle() { this._enabled ? this.disable() : this.enable(); }
  };

  // -------- Telemetry (mirrors TelemetryService) --------
  const Telemetry = {
    KEY: 'telemetryLog',
    MAX: 200,
    _events: (() => { try { return JSON.parse(localStorage.getItem('telemetryLog') || '[]'); } catch (_) { return []; } })(),
    track(code, payload) {
      const evt = { code, payload: payload || {}, timestamp: Date.now(), url: location.hash || '#/home' };
      this._events.push(evt);
      while (this._events.length > this.MAX) this._events.shift();
      try { localStorage.setItem(this.KEY, JSON.stringify(this._events)); } catch (_) {}
      paintTelemetry();
      if (console && console.debug) console.debug('[telemetry]', code, payload);
    },
    clear() { this._events = []; localStorage.setItem(this.KEY, '[]'); paintTelemetry(); }
  };
  window.__Telemetry = Telemetry; // exposed for puppeteer assertions

  // -------- Theme (mirrors ThemeService) --------
  const Theme = {
    KEY: 'themeMode',
    mode: (localStorage.getItem('themeMode') || 'system'),
    isDarkActive() {
      if (this.mode === 'dark') return true;
      if (this.mode === 'light') return false;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    },
    set(mode) {
      this.mode = mode;
      try { localStorage.setItem(this.KEY, mode); } catch (_) {}
      this.apply();
      Telemetry.track('feature.theme.toggle', { mode });
    },
    apply() {
      const dark = this.isDarkActive();
      document.body.classList.toggle('theme-dark', dark);
      document.body.classList.toggle('theme-light', !dark);
      paintThemeToggle();
    }
  };

  // -------- Data loaders --------
  const Data = {
    _cache: {},
    async load(key, path) {
      if (this._cache[key]) return this._cache[key];
      const r = await fetch(path);
      const j = await r.json();
      this._cache[key] = j.data || j;
      return this._cache[key];
    },
    commonData() { return this.load('commonData', '../../../src/assets/mock-data/common-data.json'); },
    user() { return this.load('user', '../../../src/assets/mock-data/current-user.json'); },
    subs() { return this.load('subs', '../../../src/assets/mock-data/subscriptions.json'); },
    faq() { return this.load('faq', '../../../src/assets/faq.json'); }
  };

  // -------- Views --------
  const view = document.getElementById('view');

  const Pages = {
    async home() {
      const common = await Data.commonData();
      const user = await Data.user();
      view.innerHTML = `
        <section class="home-hero">
          <h1>Welcome back, ${escapeHtml(user.name)}.</h1>
          <p>Keep your ${escapeHtml(user.city)} ride shining. Choose a plan, schedule a wash, or explore the FAQ.</p>
          <div class="cta-row">
            <a href="#/plans">See plans</a>
            <a href="#/dashboard" class="secondary">Open dashboard</a>
          </div>
        </section>
        <div class="counters">
          <div class="counter-card"><div class="num">${(common.waterSaved || 0).toLocaleString()}</div><div class="label">Litres of water saved</div></div>
          <div class="counter-card"><div class="num">${(common.plans || []).length}</div><div class="label">Plans available</div></div>
          <div class="counter-card"><div class="num">${(common.cities || []).length}</div><div class="label">Cities served</div></div>
        </div>
      `;
    },

    async plans() {
      const common = await Data.commonData();
      const cards = (common.plans || []).map((p) => `
        <article class="plan-card" aria-label="${escapeHtml(p.name)} plan">
          <h3>${escapeHtml(p.name)}</h3>
          <div class="price">₹${p.price} <small>/ ${escapeHtml(p.frequency)}</small></div>
          <p>${escapeHtml(p.description)}</p>
          <ul>${(p.features || []).map((f) => `<li>${escapeHtml(f)}</li>`).join('')}</ul>
          <button type="button">Subscribe</button>
        </article>
      `).join('');
      view.innerHTML = `
        <h1>Choose your plan</h1>
        <p class="lead" style="color: var(--text-muted); margin-bottom: 20px;">All data loaded from the offline mock-data fixtures – no backend required.</p>
        <div class="plans-grid">${cards}</div>
      `;
    },

    async dashboard() {
      const subs = await Data.subs();
      const s = (subs.subscriptions || [])[0];
      if (!s) { view.innerHTML = '<p>No subscriptions found.</p>'; return; }
      view.innerHTML = `
        <h1>Dashboard</h1>
        <div class="dashboard-grid">
          <div class="dashboard-card">
            <h3>Current plan — ${escapeHtml(s.planName)}</h3>
            <p>Car: <strong>${escapeHtml(s.car.maker)} ${escapeHtml(s.car.model)}</strong> (${escapeHtml(s.car.regNo)})</p>
            <p>Status: <span class="status" style="background:#e8f5e9;color:#2e7d32;padding:2px 8px;border-radius:999px;font-size:11px;">${escapeHtml(s.status)}</span></p>
            <h3 style="margin-top:20px;">Service history</h3>
            ${(s.history || []).map((h) => `
              <div class="history-item"><span class="status">${escapeHtml(h.status)}</span>${escapeHtml(h.date)} — ${escapeHtml(h.notes)}</div>
            `).join('')}
          </div>
          <div class="dashboard-card">
            <h3>Weekly schedule</h3>
            ${(s.schedule || []).map((r) => `
              <div class="schedule-row"><span class="day">${escapeHtml(r.day)}</span><span class="time">${escapeHtml(r.time)}</span></div>
            `).join('')}
          </div>
        </div>
      `;
    },

    async profile() {
      const u = await Data.user();
      view.innerHTML = `
        <div class="profile-page">
          <h1>Your Profile</h1>
          <div class="profile-card">
            <div class="profile-avatar" aria-hidden="true">${escapeHtml(u.name[0] || '?')}</div>
            <div class="profile-details">
              <h2>${escapeHtml(u.name)}</h2>
              <div class="meta">${escapeHtml(u.phone)} &middot; ${escapeHtml(u.email)}</div>
              <div class="meta">Referral code: <strong>${escapeHtml(u.refererCode)}</strong></div>
            </div>
          </div>
        </div>
      `;
    },

    async contact() {
      const common = await Data.commonData();
      const cfg = (k) => ((common.config || []).find((c) => c.name === k) || {}).value || '';
      view.innerHTML = `
        <div class="contact-page">
          <h1>Contact ${escapeHtml(cfg('COMPANY_NAME') || 'CCube')}</h1>
          <p class="lead">We're here to help. Reach us on any channel below or send us a message.</p>
          <div class="channels">
            <a class="channel" href="tel:${escapeHtml(cfg('SUPPORT_PHONE'))}" aria-label="Call support">
              <span class="icon" aria-hidden="true">📞</span>
              <div><div class="channel-label">Phone</div><div class="channel-value">${escapeHtml(cfg('SUPPORT_PHONE'))}</div></div>
            </a>
            <a class="channel" href="mailto:${escapeHtml(cfg('SUPPORT_EMAIL'))}" aria-label="Email support">
              <span class="icon" aria-hidden="true">✉</span>
              <div><div class="channel-label">Email</div><div class="channel-value">${escapeHtml(cfg('SUPPORT_EMAIL'))}</div></div>
            </a>
            <a class="channel" href="https://wa.me/${escapeHtml((cfg('WHATSAPP_NUMBER') || '').replace(/[^0-9]/g, ''))}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
              <span class="icon" aria-hidden="true">💬</span>
              <div><div class="channel-label">WhatsApp</div><div class="channel-value">${escapeHtml(cfg('WHATSAPP_NUMBER'))}</div></div>
            </a>
          </div>
          <div style="margin-bottom: 24px;"><strong>Office:</strong> ${escapeHtml(cfg('COMPANY_ADDRESS'))}</div>
          <form class="contact-form" id="contact-form" aria-labelledby="contact-form-title">
            <h3 id="contact-form-title" style="margin-top:0;">Send us a message</h3>
            <label><span>Your name</span><input type="text" name="name" required /></label>
            <label><span>Your email</span><input type="email" name="email" required /></label>
            <label><span>Message</span><textarea name="message" rows="4" required></textarea></label>
            <button type="button" id="contact-submit">Send</button>
          </form>
        </div>
      `;
      Telemetry.track('feature.contact.viewed', {});
      document.getElementById('contact-submit').addEventListener('click', () => {
        Telemetry.track('feature.contact.submitted', {});
        document.getElementById('contact-form').innerHTML = `
          <div style="background: var(--success-bg); color: var(--success-fg); padding: 16px; border-radius: 8px;" role="status" aria-live="polite">
            <strong>Thanks – we got your message.</strong>
            <div style="margin-top:4px; font-size: 13px;">Our team will respond within 1 business day.</div>
          </div>
        `;
      });
    },

    async faq() {
      const data = await Data.faq();
      const faqs = data.faqs || [];
      view.innerHTML = `
        <div class="faq-page">
          <h1>Frequently Asked Questions</h1>
          <p class="lead" style="color: var(--text-muted); margin-bottom: 20px;">Quick answers to the questions we hear most often.</p>
          <label class="faq-search">
            <span aria-hidden="true">🔍</span>
            <input type="search" id="faq-search-input" placeholder="Search – e.g. 'refund', 'dark mode', 'offline'" aria-label="Search questions" />
          </label>
          <ul class="faq-list" id="faq-list" role="list"></ul>
        </div>
      `;
      Telemetry.track('feature.faq.viewed', {});
      const listEl = document.getElementById('faq-list');
      const render = (items) => {
        listEl.innerHTML = items.map((f, i) => `
          <li class="faq-item" data-idx="${i}">
            <button class="faq-question" type="button" aria-expanded="false">
              <span>${escapeHtml(f.question)}</span>
              <span class="chev" aria-hidden="true">▼</span>
            </button>
            <div class="faq-answer" style="display:none;">
              <p>${escapeHtml(f.answer)}</p>
              <div class="faq-tags">${(f.tags || []).map((t) => `<span class="tag">#${escapeHtml(t)}</span>`).join('')}</div>
            </div>
          </li>
        `).join('');
        Array.from(listEl.querySelectorAll('.faq-item')).forEach((el) => {
          el.querySelector('.faq-question').addEventListener('click', () => {
            const answer = el.querySelector('.faq-answer');
            const btn = el.querySelector('.faq-question');
            const isOpen = el.classList.toggle('open');
            answer.style.display = isOpen ? 'block' : 'none';
            btn.setAttribute('aria-expanded', String(isOpen));
            if (isOpen) { Telemetry.track('feature.faq.expanded', { idx: el.dataset.idx }); }
          });
        });
      };
      render(faqs);
      document.getElementById('faq-search-input').addEventListener('input', (e) => {
        const q = String(e.target.value || '').trim().toLowerCase();
        const filtered = !q ? faqs : faqs.filter((f) =>
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q) ||
          (f.tags || []).some((t) => t.toLowerCase().includes(q))
        );
        render(filtered);
      });
    },

    async about() {
      view.innerHTML = `
        <div class="profile-page">
          <h1>About CCube</h1>
          <p>CCube delivers subscription-based car care services across Faridabad, Noida, Gurgaon, and Delhi.</p>
          <p>The CCube app is a hybrid mobile app built with Angular, Ionic, and Capacitor. See <code>docs/01-architecture-overview.md</code> for the full stack.</p>
          <p>This Offline Demo mode lets you evaluate every screen without a backend.</p>
        </div>
      `;
    }
  };

  // -------- Router --------
  const Router = {
    routes: {
      '#/home': Pages.home,
      '#/plans': Pages.plans,
      '#/dashboard': Pages.dashboard,
      '#/profile': Pages.profile,
      '#/contact': Pages.contact,
      '#/faq': Pages.faq,
      '#/about': Pages.about
    },
    async navigate() {
      const hash = location.hash || '#/home';
      const handler = this.routes[hash] || Pages.home;
      Telemetry.track('route.change', { url: hash });
      document.querySelectorAll('.primary-nav a').forEach((a) => a.classList.toggle('active', a.getAttribute('href') === hash));
      await handler();
      view.scrollTop = 0;
      window.__routeReady = hash;
    }
  };

  // -------- Paint helpers --------
  function paintOfflineBadge() {
    const el = document.getElementById('offline-badge');
    const offline = Offline.isOffline();
    el.classList.toggle('is-offline', offline);
    el.querySelector('.label').textContent = offline ? 'OFFLINE DEMO' : 'ONLINE';
    el.setAttribute('aria-label', offline ? 'Offline mode is on. Click to go online.' : 'Offline mode is off. Click to enable.');
  }

  function paintThemeToggle() {
    document.querySelectorAll('#theme-toggle button').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.mode === Theme.mode);
    });
  }

  function paintTelemetry() {
    const el = document.getElementById('telemetry-list');
    if (!el) return;
    const recent = Telemetry._events.slice(-25).reverse();
    el.innerHTML = recent.map((e) => {
      const t = new Date(e.timestamp).toISOString().substring(11, 19);
      return `<li><span class="code">${escapeHtml(e.code)}</span> <span class="ts">${t}</span></li>`;
    }).join('');
  }

  // -------- Utilities --------
  function escapeHtml(s) {
    if (s == null) return '';
    return String(s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  // -------- Wire events --------
  document.getElementById('offline-badge').addEventListener('click', () => Offline.toggle());
  document.getElementById('offline-badge').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); Offline.toggle(); }
  });
  document.querySelectorAll('#theme-toggle button').forEach((btn) => {
    btn.addEventListener('click', () => Theme.set(btn.dataset.mode));
  });
  document.getElementById('telemetry-clear').addEventListener('click', () => Telemetry.clear());
  window.addEventListener('hashchange', () => Router.navigate());

  // -------- Boot --------
  Theme.apply();
  paintOfflineBadge();
  paintTelemetry();
  if (!location.hash) { location.hash = '#/home'; }
  Router.navigate();
})();
