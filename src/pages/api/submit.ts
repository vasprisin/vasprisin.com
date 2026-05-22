import type { APIRoute } from 'astro';

export const prerender = false;

const BASE_ID = import.meta.env.AIRTABLE_BASE_ID ?? 'app8hP7xVZDj3o45h';
const TABLE_NAME = import.meta.env.AIRTABLE_TABLE ?? 'leads';
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

  const fields: Record<string, string> = {
    Email: email,
    Source: 'vasprisin.com',
    sub_source: 'form',
  };

  if (source === 'contact') {
    const first = trim(body.first, 100);
    const last = trim(body.last, 100);
    const message = trim(body.message, 5000);
    const inquiry = trim(body.inquiry, 32);
    const title = trim(body.title, 200);
    const phone = trim(body.phone, 32);
    const linkedin = trim(body.linkedin, 300);

    if (!first || !last || !message || !title) {
      return json(400, { ok: false, error: 'Missing required fields.' });
    }
    if (!ALLOWED_INQUIRIES.has(inquiry)) {
      return json(400, { ok: false, error: 'Invalid inquiry type.' });
    }

    fields['First Name'] = first;
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

  return json(200, { ok: true });
};

export const GET: APIRoute = () =>
  json(405, { ok: false, error: 'Method not allowed.' });
