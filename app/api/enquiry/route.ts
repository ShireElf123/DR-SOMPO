import { NextResponse } from "next/server";
import { allServices, practice } from "@/lib/practice";
import { enquiryDeliveryEnabled } from "@/lib/enquiry-config";
import {
  resolveService,
  validateEnquiry,
  type EnquiryErrors,
  type EnquiryFields,
} from "@/lib/enquiry";

export const runtime = "nodejs";
const MAX_BODY_BYTES = 8 * 1024;
const directContact = `Please call ${practice.phone} or email ${practice.email}.`;
const json = (body: object, status: number) =>
  NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });

/** Read a bounded stream; a forged/missing Content-Length must not defeat the cap. */
async function readBody(request: Request): Promise<unknown> {
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES)
    throw new RangeError("body size");
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError("empty body");
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new RangeError("body size");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
}

const clean = (value: unknown) =>
  typeof value === "string"
    ? value.replace(/[\u0000-\u001f\u007f]/g, " ").trim()
    : "";

/** Validate before forwarding. Never log request bodies or claim receipt on failure.
 * A honeypot is a soft filter, not a rate limiter. Production activation also
 * requires receiver/platform abuse controls; see docs/enquiry-operations.md. */
export async function POST(request: Request) {
  if (
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
    "application/json"
  ) {
    return json(
      {
        ok: false,
        error: `The online form requires JavaScript. ${directContact}`,
      },
      415,
    );
  }
  let parsed: unknown;
  try {
    parsed = await readBody(request);
  } catch (error) {
    return json(
      {
        ok: false,
        error:
          error instanceof RangeError
            ? "That request is too large. Please keep your note short."
            : `We could not read that request. ${directContact}`,
      },
      error instanceof RangeError ? 413 : 400,
    );
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return json(
      { ok: false, error: "Please submit a valid enquiry object." },
      400,
    );
  }
  const body = parsed as Record<string, unknown>;
  // Do not silently turn a malformed optional field into "no preference" or
  // a general consultation. Omitted optional strings are allowed; other types are not.
  const typeErrors: EnquiryErrors = {};
  for (const field of [
    "name",
    "contactMethod",
    "contact",
    "preferredDate",
    "preferredSlot",
    "service",
    "message",
  ] as const) {
    if (body[field] !== undefined && typeof body[field] !== "string")
      typeErrors[field] = "Please enter this value as text.";
  }
  if (Object.keys(typeErrors).length)
    return json({ ok: false, errors: typeErrors }, 422);
  if (body.company !== undefined && typeof body.company !== "string") {
    return json(
      { ok: false, error: "Please submit a valid enquiry object." },
      422,
    );
  }
  if (clean(body.company))
    return json(
      {
        ok: false,
        error: `We could not accept that request. ${directContact}`,
      },
      422,
    );

  const data: EnquiryFields = {
    name: clean(body.name),
    contactMethod: clean(body.contactMethod),
    contact: clean(body.contact),
    preferredDate: clean(body.preferredDate),
    preferredSlot: clean(body.preferredSlot),
    service: clean(body.service),
    message: clean(body.message),
    consent: body.consent === true,
  };
  const errors = validateEnquiry(data);
  if (Object.keys(errors).length) return json({ ok: false, errors }, 422);

  if (!enquiryDeliveryEnabled()) {
    return json(
      {
        ok: false,
        error: `Online enquiries are not connected yet. ${directContact}`,
      },
      503,
    );
  }
  const serviceId = resolveService(data.service);
  try {
    const response = await fetch(process.env.ENQUIRY_WEBHOOK_URL!, {
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
        name: data.name,
        contactMethod: data.contactMethod,
        contact: data.contact,
        preferred: "Any time",
        preferredDate: data.preferredDate || null,
        preferredSlot: data.preferredSlot || null,
        service:
          allServices.find((item) => item.id === serviceId)?.title ?? null,
        serviceId: serviceId || null,
        message: data.message || null,
      }),
      signal: AbortSignal.timeout(8000),
      redirect: "error", // Do not send personal details to an unexpected redirect destination.
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Receiver unavailable");
    return json({ ok: true }, 200);
  } catch {
    return json(
      {
        ok: false,
        error: `We could not deliver your enquiry. ${directContact}`,
      },
      502,
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { ok: false, error: "Method not allowed." },
    {
      status: 405,
      headers: { Allow: "POST", "Cache-Control": "no-store" },
    },
  );
}
