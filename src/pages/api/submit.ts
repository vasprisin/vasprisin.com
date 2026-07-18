import type { APIRoute } from 'astro';
import { syncContact, sendTemplateEmail, brevoEnabled } from '../../lib/brevo';

export const prerender = false;

// Read at runtime (process.env), not build time. `import.meta.env` inlines
// non-PUBLIC vars during `astro build`, so host-set values would be ignored.
const BASE_ID = process.env.AIRTABLE_BASE_ID ?? 'app8hP7xVZDj3o45h';
const TABLE_NAME = process.env.AIRTABLE_TABLE ?? 'leads';
const ALLOWED_SOURCES = new Set(['contact', 'newsletter', 'popup']);
const ALLOWED_INQUIRIES = new Set(['press', 'service', 'general']);

const trim = (v: unknown, max = 5000): string => {
  if (typeof v !== 'string') return '';
  return v.trim().slice(0, max);
};

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

export const POST: APIRoute = async ({ request }) => {
  const pat = process.env.AIRTABLE_PAT;
  if (!pat) {
    console.error('[api/submit] AIRTABLE_PAT not set');
    return json(500, { ok: false, error: 'Server misconfigured.' });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json(400, { ok: false, error: 'Invalid JSON.' });
  }

  const source = trim(body.source, 32);
  if (!ALLOWED_SOURCES.has(source)) {
    return json(400, { ok: false, error: 'Invalid source.' });
  }

  const email = trim(body.email, 254).toLowerCase();
  if (!isEmail(email)) {
    return json(400, { ok: false, error: 'A valid email is required.' });
  }

  // First name is collected on every form (it is the Airtable primary field).
  const first = trim(body.first, 100);
  if (!first) {
    return json(400, { ok: false, error: 'A first name is required.' });
  }

  const fields: Record<string, string> = {
    'First Name': first,
    Email: email,
    Source: 'vasprisin.com',
    sub_source: 'form',
  };

  if (source === 'contact') {
    const last = trim(body.last, 100);
    const message = trim(body.message, 5000);
    const inquiry = trim(body.inquiry, 32);
    const title = trim(body.title, 200);
    const phone = trim(body.phone, 32);
    const linkedin = trim(body.linkedin, 300);

    if (!last || !message || !title) {
      return json(400, { ok: false, error: 'Missing required fields.' });
    }
    if (!ALLOWED_INQUIRIES.has(inquiry)) {
      return json(400, { ok: false, error: 'Invalid inquiry type.' });
    }

    fields['Last Name'] = last;
    fields['Title'] = title;
    fields['Message'] = message;
    fields['Inquiry'] = inquiry;
    if (phone) fields['Phone'] = phone;
    if (linkedin) fields['LinkedIn'] = linkedin;
  }

  const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${pat}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ records: [{ fields }], typecast: true }),
    });
  } catch (err) {
    console.error('[api/submit] network error', err);
    return json(502, { ok: false, error: 'Could not reach storage.' });
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('[api/submit] airtable error', res.status, text);
    return json(502, { ok: false, error: 'Submission failed. Please try again.' });
  }

  // Airtable is the record of truth and has already accepted the lead.
  // Brevo is best-effort from here: log failures, but always return success so
  // a Brevo outage can never cost a captured lead or prompt a duplicate resubmit.
  if (brevoEnabled()) {
    try {
      if (source === 'contact') {
        await sendTemplateEmail('BREVO_TEMPLATE_CONTACT', email, first);
      } else {
        // newsletter + popup: subscribe them, then confirm.
        await syncContact(email, first);
        await sendTemplateEmail('BREVO_TEMPLATE_NEWSLETTER', email, first);
      }
    } catch (err) {
      console.error('[api/submit] brevo step failed (submission still saved)', err);
    }
  }

  return json(200, { ok: true });
};

export const GET: APIRoute = () =>
  json(405, { ok: false, error: 'Method not allowed.' });
