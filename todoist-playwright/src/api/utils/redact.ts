const SENSITIVE_HEADERS = ['authorization', 'cookie', 'set-cookie', 'x-api-key', 'x-auth-token'];
const BODY_MAX = Number(process.env.LOG_BODY_MAX ?? 2048);

export function redactHeaders(h: Record<string, string | undefined>) {
  const out: Record<string, string> = {};

  for (const [k, v] of Object.entries(h || {})) {
    const lower = k.toLowerCase();
    out[k] = SENSITIVE_HEADERS.includes(lower) ? '[REDACTED]' : String(v ?? '');
  }

  return out;
}

export function safeBodyPreview(body: unknown) {
  try {
    const s = typeof body === 'string' ? body : JSON.stringify(body);
    return s.length > BODY_MAX ? s.slice(0, BODY_MAX) + '…[truncated]' : s;
  } catch { return '[unserializable]'; }
}
