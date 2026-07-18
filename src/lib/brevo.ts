/**
 * Brevo integration — contact list sync + transactional confirmation emails.
 *
 * Every function here is best-effort: Airtable is the record of truth, so a
 * Brevo outage must never fail a form submission. Callers should not await
 * these for correctness, only for ordering. All failures are logged and
 * swallowed.
 *
 * Required env (all read at runtime, not build time):
 *   BREVO_API_KEY             — transactional + contacts API key
 *   BREVO_LIST_ID             — numeric id of the newsletter contact list
 *   BREVO_TEMPLATE_NEWSLETTER — template id sent to new subscribers
 *   BREVO_TEMPLATE_CONTACT    — template id sent to contact-form senders
 *
 * If BREVO_API_KEY is unset the module no-ops silently, so the site keeps
 * working (and keeps writing to Airtable) before Brevo is configured.
 */

const API_BASE = 'https://api.brevo.com/v3';

const key = () => process.env.BREVO_API_KEY ?? '';

export const brevoEnabled = () => Boolean(key());

const numericEnv = (name: string): number | null => {
  const raw = process.env[name];
  if (!raw) return null;
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : null;
};

async function call(path: string, body: unknown): Promise<boolean> {
  const apiKey = key();
  if (!apiKey) return false;

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error(`[brevo] ${path} failed`, res.status, text.slice(0, 500));
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[brevo] ${path} network error`, err);
    return false;
  }
}

/**
 * Upsert a contact into the newsletter list. `updateEnabled` makes a repeat
 * signup a no-op update rather than a 400 duplicate error.
 */
export async function syncContact(email: string, first: string): Promise<boolean> {
  const listId = numericEnv('BREVO_LIST_ID');
  if (!listId) {
    console.warn('[brevo] BREVO_LIST_ID not set — skipping contact sync');
    return false;
  }

  return call('/contacts', {
    email,
    attributes: { FIRSTNAME: first },
    listIds: [listId],
    updateEnabled: true,
  });
}

/** Send one of the configured Brevo templates to a single recipient. */
export async function sendTemplateEmail(
  templateEnvName: string,
  email: string,
  first: string,
  params: Record<string, string> = {},
): Promise<boolean> {
  const templateId = numericEnv(templateEnvName);
  if (!templateId) {
    console.warn(`[brevo] ${templateEnvName} not set — skipping confirmation email`);
    return false;
  }

  return call('/smtp/email', {
    to: [{ email, name: first }],
    templateId,
    params: { FIRSTNAME: first, ...params },
  });
}
