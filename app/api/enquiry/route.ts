import { NextResponse } from "next/server";

/**
 * Appointment enquiry endpoint.
 *
 * Privacy-by-design notes:
 *  - The form intentionally collects only what is needed to return a call:
 *    a name, one contact method, an optional requested date and time window,
 *    an optional service interest, and an optional free-text note. The UI warns
 *    patients not to include clinical detail. A requested slot is a *request*:
 *    the route never treats it as a confirmed appointment.
 *  - Nothing is persisted by this route. It validates and forwards the enquiry
 *    to the practice's inbox through a provider configured in the environment.
 *    Without that configuration the route fails closed and tells the patient to
 *    call instead — it never silently drops an enquiry.
 *  - Honeypot + minimum-completion-time checks reduce automated abuse without
 *    adding friction for patients or a third-party captcha.
 */

export const runtime = "nodejs";

type Payload = {
  name?: unknown;
  contactMethod?: unknown;
  contact?: unknown;
  preferred?: unknown;
  preferredDate?: unknown;
  preferredSlot?: unknown;
  service?: unknown;
  message?: unknown;
  consent?: unknown;
  company?: unknown; // honeypot
  startedAt?: unknown;
};

const MAX = { name: 120, contact: 160, message: 800, date: 10, slot: 20, service: 80 };
const PREFERRED = ["Any time", "Morning", "Afternoon"];
const METHODS = ["Telephone", "Email", "WhatsApp"];
const SLOTS = ["Early morning", "Late morning", "Early afternoon", "Late afternoon"];

function clean(value: unknown, limit: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, limit);
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function isPhone(value: string) {
  return /^[+()\d\s-]{9,20}$/.test(value);
}

/** ISO calendar date, and never in the past (same-day requests are allowed). */
function isValidPreferredDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const requested = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(requested.getTime())) return false;
  const today = new Date();
  const startOfToday = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  // Allow today through 90 days ahead; anything else is a mistake or abuse.
  const diffDays = (requested.getTime() - startOfToday) / 86_400_000;
  return diffDays >= 0 && diffDays <= 90;
}

export async function POST(request: Request) {
  let body: Payload;

  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "We could not read that request. Please try again." },
      { status: 400 },
    );
  }

  // Honeypot: real patients never fill a hidden field.
  if (clean(body.company, 50)) {
    return NextResponse.json({ ok: true });
  }

  // Bots post instantly; humans take a few seconds to read the form.
  const startedAt = typeof body.startedAt === "number" ? body.startedAt : 0;
  if (startedAt && Date.now() - startedAt < 1500) {
    return NextResponse.json(
      { ok: false, error: "That was a little too quick — please try again." },
      { status: 429 },
    );
  }

  const name = clean(body.name, MAX.name);
  const contactMethod = clean(body.contactMethod, 20);
  const contact = clean(body.contact, MAX.contact);
  const preferred = clean(body.preferred, 20);
  const preferredDate = clean(body.preferredDate, MAX.date);
  const preferredSlot = clean(body.preferredSlot, MAX.slot);
  const service = clean(body.service, MAX.service);
  const message = clean(body.message, MAX.message);
  const consent = body.consent === true;

  const errors: Record<string, string> = {};

  if (name.length < 2) errors.name = "Please tell us your name.";

  if (!METHODS.includes(contactMethod)) {
    errors.contactMethod = "Please choose how you would like to be contacted.";
  }

  if (contactMethod === "Email" && !isEmail(contact)) {
    errors.contact = "Please check that email address.";
  }

  if (contactMethod !== "Email" && !isPhone(contact)) {
    errors.contact = "Please check that telephone number.";
  }

  if (preferred && !PREFERRED.includes(preferred)) {
    errors.preferred = "Please choose a valid time of day.";
  }

  if (preferredDate && !isValidPreferredDate(preferredDate)) {
    errors.preferredDate = "Please choose a date in the next three months.";
  }

  if (preferredSlot && !SLOTS.includes(preferredSlot)) {
    errors.preferredSlot = "Please choose a valid time.";
  }

  // A slot without a date (or the reverse) would produce an unworkable request.
  if (preferredDate && !preferredSlot) {
    errors.preferredSlot = "Please choose a time for that date.";
  }
  if (preferredSlot && !preferredDate) {
    errors.preferredDate = "Please choose a date for that time.";
  }

  if (!consent) {
    errors.consent =
      "Please confirm that the practice may use these details to respond to your enquiry.";
  }

  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const endpoint = process.env.ENQUIRY_WEBHOOK_URL;

  if (!endpoint) {
    // Fail closed: never pretend an enquiry was delivered.
    return NextResponse.json(
      {
        ok: false,
        error:
          "Online enquiries are not connected yet. Please call the practice on 011 842 7651 or email chrisscrcross2013@gmail.com — we would rather you reach us directly than have your message go astray.",
      },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.ENQUIRY_WEBHOOK_TOKEN
          ? { Authorization: `Bearer ${process.env.ENQUIRY_WEBHOOK_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({
        source: "website-enquiry",
        receivedAt: new Date().toISOString(),
        name,
        contactMethod,
        contact,
        preferred: preferred || "Any time",
        // The patient's requested appointment window. Labelled as a request,
        // never as a booking, in every downstream copy.
        preferredDate: preferredDate || null,
        preferredSlot: preferredSlot || null,
        service: service || null,
        message: message || null,
        // No IP address, user agent or clinical detail is forwarded.
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) throw new Error(`Upstream ${response.status}`);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Something went wrong sending your enquiry. Please call 011 842 7651 or email chrisscrcross2013@gmail.com.",
      },
      { status: 502 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ ok: false, error: "Method not allowed." }, { status: 405 });
}
