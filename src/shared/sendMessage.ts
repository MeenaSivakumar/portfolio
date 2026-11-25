/**
 * Delivers contact-form messages through Web3Forms (https://web3forms.com), which forwards them
 * to the inbox the access key was created for. The key is public by design — it can only send to
 * that inbox — so it lives in `.env` as VITE_WEB3FORMS_KEY and ships with the site.
 */
const ENDPOINT = 'https://api.web3forms.com/submit';
const ACCESS_KEY: string = import.meta.env.VITE_WEB3FORMS_KEY ?? '';

export interface Message {
  name: string;
  email: string;
  message: string;
  /** Honeypot: real visitors never fill it; bots usually do */
  botcheck?: string;
}

export type SendResult = { ok: true } | { ok: false; reason: 'not-configured' | 'failed' };

export const messagingConfigured = () => ACCESS_KEY.trim().length > 0;

export async function sendMessage(m: Message): Promise<SendResult> {
  if (!messagingConfigured()) return { ok: false, reason: 'not-configured' };
  // Quietly "succeed" for bots so they don't retry.
  if (m.botcheck) return { ok: true };

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: ACCESS_KEY,
        subject: `New message from ${m.name} via your portfolio`,
        from_name: 'Portfolio contact form',
        name: m.name,
        email: m.email,
        replyto: m.email,
        message: m.message,
      }),
      signal: controller.signal,
    });
    const data = (await res.json().catch(() => null)) as { success?: boolean } | null;
    return res.ok && data?.success ? { ok: true } : { ok: false, reason: 'failed' };
  } catch {
    return { ok: false, reason: 'failed' };
  } finally {
    window.clearTimeout(timer);
  }
}
