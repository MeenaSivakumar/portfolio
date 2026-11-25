/** Storage helpers that never throw (private mode, blocked storage, sandboxed iframes). */
export function readStore<T>(key: string, fallback: T, area: 'local' | 'session' = 'local'): T {
  try {
    const raw = (area === 'local' ? window.localStorage : window.sessionStorage).getItem(key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeStore(key: string, value: unknown, area: 'local' | 'session' = 'local') {
  try {
    (area === 'local' ? window.localStorage : window.sessionStorage).setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}
