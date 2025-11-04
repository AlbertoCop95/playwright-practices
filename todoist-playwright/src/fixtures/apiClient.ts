// tests/fixtures/apiClient.ts
import { request, APIRequestContext } from '@playwright/test';
import { redactHeaders, safeBodyPreview } from '../api/utils/redact';
import { test as base } from './logger';

export const test = base.extend<{ request: APIRequestContext }>({
  request: async ({ logger }, use) => {
    const ctx = await request.newContext({
      baseURL: process.env.BASE_URL,
      extraHTTPHeaders: {
        'x-trace-id': logger.traceId,                  // propagate test trace id
        ...(process.env.USER_TOKEN ? { Authorization: `Bearer ${process.env.USER_TOKEN}` } : {})
      }
    });

    // lightweight wrapper for fetch to log each call
    const orig = ctx.fetch.bind(ctx);
    (ctx as any).fetch = async (url: string, init: any = {}) => {
      const started = Date.now();
      const reqHeaders = redactHeaders(init?.headers || {});
      const reqBody = init?.data ?? init?.body;

      logger.info({
        category: 'api',
        phase: 'request',
        msg: `${init?.method ?? 'GET'} ${url}`,
        req: { method: init?.method ?? 'GET', url, headers: reqHeaders },
        req_body_preview: process.env.LOG_VERBOSE_BODY === '1' ? safeBodyPreview(reqBody) : undefined
      });

      const res = await orig(url, init);
      const duration = Date.now() - started;

      // const headersObj: Record<string, string> = {};
      // for (const [k, v] of res.headers()) headersObj[k] = v;

      const raw = res.headers(); // Record<string, string>
      const headersObj: Record<string, string> = Object.fromEntries(
        Object.entries(raw).map(([k, v]) => [k, String(v)])
      );

      logger.info({
        category: 'api',
        phase: 'response',
        msg: `${init?.method ?? 'GET'} ${url} -> ${res.status()}`,
        res: { status: res.status(), duration_ms: duration, headers: redactHeaders(headersObj) },
        res_body_preview: process.env.LOG_VERBOSE_BODY === '1'
          ? safeBodyPreview(await maybePeekJson(res))
          : undefined
      });

      // Re-create response if body was consumed
      return res;
    };

    await use(ctx);
    await ctx.dispose();
  }
});

async function maybePeekJson(res: any) {
  try {
    const ct = res.headers()['content-type'] || '';
    if (ct.includes('application/json')) return await res.json();
    if (ct.includes('text/')) return await res.text();
    return `[${ct}]`;
  } catch { return '[unavailable]'; }
}

export const expect = test.expect;
