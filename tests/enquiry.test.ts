import { test, type TestContext } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { POST, GET } from "../app/api/enquiry/route";
import { enquiryDeliveryEnabled } from "../lib/enquiry-config";
import {
  validateEnquiry,
  resolveService,
  isPhone,
  type EnquiryFields,
} from "../lib/enquiry";
import { EnquiryForm } from "../components/enquiry-form";
import { allServices } from "../lib/practice";

const valid: EnquiryFields = {
  name: "Synthetic Test",
  contactMethod: "Email",
  contact: "test@example.invalid",
  consent: true,
  service: "antenatal",
  preferredDate: "",
  preferredSlot: "",
  message: "Synthetic non-clinical test",
};
const request = (body: unknown) =>
  new Request("http://localhost/api/enquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

for (const value of [null, [], 17, "invalid", true]) {
  test(`API returns 400, not 500, for ${JSON.stringify(value)}`, async (t) => {
    const delivery = t.mock.method(globalThis, "fetch", async () => {
      throw new Error("Delivery must not be reached");
    });
    assert.equal((await POST(request(value))).status, 400);
    assert.equal(delivery.mock.callCount(), 0);
  });
}

test("malformed JSON and native form submissions fail safely without echoing data", async () => {
  const invalid = new Request("http://localhost/api/enquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{",
  });
  assert.equal((await POST(invalid)).status, 400);
  const native = await POST(
    new Request("http://localhost/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "name=PRIVATE&message=PRIVATE",
    }),
  );
  assert.equal(native.status, 415);
  assert.doesNotMatch(await native.text(), /PRIVATE/);
});

for (const contentLength of [undefined, "1", "100000"]) {
  test(`request body is bounded with Content-Length ${contentLength ?? "absent"}`, async (t) => {
    const delivery = t.mock.method(globalThis, "fetch", async () => {
      throw new Error("Unexpected delivery");
    });
    const response = await POST(
      new Request("http://localhost/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(contentLength ? { "Content-Length": contentLength } : {}),
        },
        body: JSON.stringify({ ...valid, message: "x".repeat(9000) }),
      }),
    );
    assert.equal(response.status, 413);
    assert.equal(delivery.mock.callCount(), 0);
  });
}

for (const [label, data, field] of [
  [
    "impossible date",
    { ...valid, preferredDate: "2026-11-31", preferredSlot: "Early morning" },
    "preferredDate",
  ],
  [
    "digitless telephone",
    { ...valid, contactMethod: "Telephone", contact: "---------" },
    "contact",
  ],
  ["missing consent", { ...valid, consent: false }, "consent"],
  [
    "pending WhatsApp",
    { ...valid, contactMethod: "WhatsApp", contact: "0820000000" },
    "contactMethod",
  ],
  ["unknown service", { ...valid, service: "unsupported" }, "service"],
  ["oversized note", { ...valid, message: "x".repeat(801) }, "message"],
] as const) {
  test(`API rejects ${label} before delivery`, async (t) => {
    const delivery = t.mock.method(globalThis, "fetch", async () => {
      throw new Error("Unexpected delivery");
    });
    const response = await POST(request(data));
    assert.equal(response.status, 422);
    const result = await response.json();
    assert.ok(result.errors[field]);
    assert.equal(delivery.mock.callCount(), 0);
  });
}

function restoreEnvironment(t: TestContext) {
  const keys = [
    "ENQUIRY_ENABLED",
    "ENQUIRY_WEBHOOK_URL",
    "ENQUIRY_WEBHOOK_TOKEN",
  ] as const;
  const previous = Object.fromEntries(
    keys.map((key) => [key, process.env[key]]),
  );
  t.after(() => {
    for (const key of keys) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  });
}

test("activation is explicit; missing, invalid and non-HTTPS receivers fail closed", async (t) => {
  restoreEnvironment(t);
  const delivery = t.mock.method(globalThis, "fetch", async () => {
    throw new Error("Unexpected delivery");
  });
  for (const [enabled, url] of [
    ["false", "https://delivery.example.invalid"],
    ["true", ""],
    ["true", "not-a-url"],
    ["true", "http://delivery.example.invalid"],
    ["true", "https://user:pass@delivery.example.invalid"],
  ]) {
    process.env.ENQUIRY_ENABLED = enabled;
    process.env.ENQUIRY_WEBHOOK_URL = url;
    assert.equal(enquiryDeliveryEnabled(), false);
    assert.equal((await POST(request(valid))).status, 503);
  }
  assert.equal(delivery.mock.callCount(), 0);
});

test("configured delivery forwards only intended fields with a readable service and canonical ID", async (t) => {
  restoreEnvironment(t);
  process.env.ENQUIRY_ENABLED = "true";
  process.env.ENQUIRY_WEBHOOK_URL = "https://delivery.example.invalid/enquiry";
  process.env.ENQUIRY_WEBHOOK_TOKEN = "synthetic-test-token";
  const delivery = t.mock.method(
    globalThis,
    "fetch",
    async (_url: string | URL | Request, init?: RequestInit) => {
      const data = JSON.parse(String(init?.body));
      assert.equal(data.serviceId, "antenatal");
      assert.equal(data.service, "Antenatal care");
      assert.equal(data.name, valid.name);
      assert.equal(data.source, "website-enquiry");
      for (const key of [
        "company",
        "startedAt",
        "ip",
        "userAgent",
        "unexpected",
      ])
        assert.equal(data[key], undefined);
      assert.equal(init?.redirect, "error");
      assert.equal(init?.cache, "no-store");
      return new Response(null, { status: 204 });
    },
  );
  const response = await POST(
    request({ ...valid, unexpected: "not forwarded" }),
  );
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(delivery.mock.callCount(), 1);
});

test("receiver rejection and network failure never produce a receipt", async (t) => {
  restoreEnvironment(t);
  process.env.ENQUIRY_ENABLED = "true";
  process.env.ENQUIRY_WEBHOOK_URL = "https://delivery.example.invalid/enquiry";
  const delivery = t.mock.method(
    globalThis,
    "fetch",
    async () => new Response(null, { status: 503 }),
  );
  assert.equal((await POST(request(valid))).status, 502);
  delivery.mock.mockImplementation(async () => {
    throw new Error("Synthetic offline receiver");
  });
  assert.equal((await POST(request(valid))).status, 502);
});

test("honeypot rejection does not falsely claim a message was received", async (t) => {
  const delivery = t.mock.method(globalThis, "fetch", async () => {
    throw new Error("Unexpected delivery");
  });
  const response = await POST(
    request({ ...valid, company: "Automated submission" }),
  );
  assert.equal(response.status, 422);
  assert.equal((await response.json()).ok, false);
  assert.equal(delivery.mock.callCount(), 0);
});

test("GET remains method-not-allowed and advertises the allowed method", async () => {
  const response = await GET();
  assert.equal(response.status, 405);
  assert.equal(response.headers.get("allow"), "POST");
});

test("service resolution supports every ID and legacy title but not unknown values", () => {
  for (const service of allServices) {
    assert.equal(resolveService(service.id), service.id);
    assert.equal(resolveService(service.title), service.id);
  }
  assert.equal(resolveService("unsupported"), "");
  assert.equal(resolveService(["antenatal"]), "");
});

test("client/server validation shares date/slot keys and meaningful telephone digits", () => {
  assert.ok(
    validateEnquiry({ ...valid, preferredSlot: "Late morning" }, "2026-11-01")
      .preferredDate,
  );
  assert.ok(
    validateEnquiry({ ...valid, preferredDate: "2026-11-02" }, "2026-11-01")
      .preferredSlot,
  );
  for (const value of ["---------", "()()()()()", "+", "123", "+12+123456789"])
    assert.equal(isPhone(value), false);
  for (const value of ["082 000 0000", "+27 (82) 000-0000"])
    assert.equal(isPhone(value), true);
});

test("unconfigured booking stays visible as a non-submitting local planner", () => {
  const html = renderToStaticMarkup(
    createElement(EnquiryForm, { onlineEnabled: false, today: "2026-11-01", days: ["2026-11-02"] }),
  );
  assert.match(html, /Online sending is not connected/);
  assert.match(html, /tel:/);
  assert.match(html, /mailto:/);
  assert.match(html, /data-enquiry-mode="direct"/);
  assert.match(html, /data-date="2026-11-02"/);
  assert.match(html, /id="enq-name"/);
  assert.match(html, /type="date"/);
  // Sunday is still a valid preference: do not infer today from Monday's rail.
  assert.match(html, /min="2026-11-01"/);
  assert.match(html, /max="2027-01-30"/);
  assert.match(html, /<fieldset[^>]*disabled=""/);
  assert.doesNotMatch(html, /<form|action=|type="submit"|Request received/);
});

test("configured form has a safe POST action and is disabled before hydration", () => {
  const html = renderToStaticMarkup(
    createElement(EnquiryForm, { onlineEnabled: true, today: "2026-11-02", days: ["2026-11-02"] }),
  );
  assert.match(html, /method="post"/);
  assert.match(html, /action="\/api\/enquiry"/);
  assert.match(html, /<fieldset[^>]*disabled=""/);
  assert.match(html, /needs JavaScript/);
  assert.match(html, /href="\/patient-info#privacy"/);
  assert.doesNotMatch(html, /delivery\.example\.invalid|synthetic-test-token/);
});

test("malformed field types cannot silently become a general consultation or no preference", async (t) => {
  restoreEnvironment(t);
  process.env.ENQUIRY_ENABLED = "true";
  process.env.ENQUIRY_WEBHOOK_URL = "https://delivery.example.invalid/enquiry";
  const delivery = t.mock.method(
    globalThis,
    "fetch",
    async () => new Response(null, { status: 204 }),
  );
  for (const field of [
    "name",
    "contactMethod",
    "contact",
    "preferredDate",
    "preferredSlot",
    "service",
    "message",
  ] as const) {
    for (const value of [17, {}, [], null]) {
      const response = await POST(request({ ...valid, [field]: value }));
      assert.equal(response.status, 422, `${field}: ${JSON.stringify(value)}`);
      assert.ok((await response.json()).errors[field]);
    }
  }
  for (const value of ["true", 1, null, {}]) {
    assert.equal(
      (await POST(request({ ...valid, consent: value }))).status,
      422,
    );
  }
  assert.equal((await POST(request({ ...valid, company: {} }))).status, 422);
  assert.equal(delivery.mock.callCount(), 0);
});
