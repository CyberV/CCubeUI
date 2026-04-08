/**
 * Mock-Data Registry – see docs/06-additional-insights.md §5
 *
 * Maps backend endpoints to canned responses. The registry is consulted by
 * OfflineHttpInterceptor; if a request matches one of these patterns, the
 * network call is short-circuited and the response is returned directly.
 *
 * Everything here is **read-only** – POSTs that would mutate state return
 * a plausible success payload but do not persist anything.
 */

export interface MockEntry {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | '*';
  pattern: RegExp;
  /** Called with the matched URL and body; must return the response body. */
  response: (ctx: { url: string; method: string; body?: any }) => any;
}

/** The commonData seeded by OfflineService is the source of truth. */
function getCommonData(): any {
  try {
    const raw = localStorage.getItem('commonData');
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

function getCurrentUser(): any {
  try {
    const raw = localStorage.getItem('currentUser');
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

export const MOCK_REGISTRY: MockEntry[] = [
  // --- F3 Plans / Common data -----------------------------------------------
  {
    method: 'GET',
    pattern: /\/plan\/getCommonData(\/.*)?$/,
    response: () => ({ success: true, data: getCommonData() })
  },

  // --- F1 Auth --------------------------------------------------------------
  {
    method: 'POST',
    pattern: /\/(sendOtp|resendOtp)$/,
    response: () => ({ success: true, message: 'OTP sent (offline demo)' })
  },
  {
    method: 'POST',
    pattern: /\/verifyOtp$/,
    response: () => ({ success: true, data: getCurrentUser(), token: 'offline-mode-demo-token' })
  },
  {
    method: 'POST',
    pattern: /\/checkUserStatusByMobile$/,
    response: () => ({ success: true, data: { exists: true, status: 'Active' } })
  },
  {
    method: 'POST',
    pattern: /\/login(\/otp)?$/,
    response: () => ({ success: true, data: getCurrentUser(), token: 'offline-mode-demo-token' })
  },
  {
    method: 'POST',
    pattern: /\/user\/create$/,
    response: ({ body }) => ({ success: true, data: { ...getCurrentUser(), ...(body || {}) } })
  },
  {
    method: 'POST',
    pattern: /\/user\/updateToken$/,
    response: () => ({ success: true })
  },

  // --- F4 Car ---------------------------------------------------------------
  {
    method: 'POST',
    pattern: /\/car\/details\/.+$/,
    response: () => {
      // Returned verbatim from the mock-data/cars.json fixture (loaded by the interceptor).
      return { __mockAsset: 'assets/mock-data/cars.json' };
    }
  },

  // --- F6 Dashboard / subscriptions -----------------------------------------
  {
    method: 'POST',
    pattern: /\/subscription\/getsubscriptions$/,
    response: () => ({ __mockAsset: 'assets/mock-data/subscriptions.json' })
  },
  {
    method: 'POST',
    pattern: /\/subscription\/rescheduleService$/,
    response: ({ body }) => ({ success: true, data: { rescheduled: true, ...(body || {}) } })
  },
  {
    method: 'POST',
    pattern: /\/subscription\/updateTiming$/,
    response: () => ({ success: true })
  },
  {
    method: 'POST',
    pattern: /\/subscription\/(addpayment|addaddon|addadhoc|renewpayment|scheduleAddon)$/,
    response: () => ({ success: true, message: 'Offline demo – mutation accepted but not persisted' })
  },
  {
    method: 'POST',
    pattern: /\/subscription\/(trycoupon|getcouponsforuser)$/,
    response: () => ({ __mockAsset: 'assets/mock-data/coupons.json' })
  },

  // --- F7 Checkout ----------------------------------------------------------
  {
    method: 'POST',
    pattern: /\/checkout\/createOrder$/,
    response: () => ({
      success: true,
      data: {
        orderId: 'order_offline_demo_' + Date.now(),
        amount: 2499,
        currency: 'INR',
        status: 'created'
      }
    })
  },

  // --- F9 Leads -------------------------------------------------------------
  {
    method: 'POST',
    pattern: /\/lead\/create$/,
    response: () => ({ success: true, message: 'Lead captured (offline demo)' })
  },

  // --- Catch-all: any other /api/ call ---------------------------------------
  {
    method: '*',
    pattern: /\/api\//,
    response: ({ url, method }) => ({
      success: true,
      offline: true,
      message: `Offline demo – ${method} ${url} intercepted with a default stub`
    })
  }
];
