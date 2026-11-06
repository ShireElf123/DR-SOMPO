# Appointment enquiries: activation and operations

## Current safe state

Online collection is **off by default**. With no approved delivery configuration, Contact still renders the calendar and form interface as a local-only planner. It uses a non-submitting container, does not send or persist drafts, and provides telephone/email actions. The endpoint cannot report success or forward an enquiry without an explicit enable flag and a valid credential-free HTTPS receiver URL. A syntactically valid URL does **not** prove that the receiver works or that processing is approved.

No real enquiries were sent during the repair work. Browser tests intercept submissions; route tests mock `fetch`. The `.invalid` receiver in Playwright configuration is a test fixture, never a production receiver. No provider, retention schedule, legal approval or distributed rate-limiting service was commissioned by this change.

The existing telephone/email details remain practice-supplied contact information, not newly verified contact channels. Confirm them with the practice before launch. An enquiry is **not a confirmed booking** and is **not an emergency or clinical channel**.

## Required approval before enabling

The practice owner must sign off all of these, not just the environment variables:

- [ ] Confirm contact details, consulting hours, scheduling preferences and who monitors enquiries. Do not restore unverified open-now indicators or response-time promises.
- [ ] Select and approve the delivery provider, destination, authorised recipients, authentication, hosting region, subprocessors and any cross-border processing.
- [ ] Establish a retention/deletion schedule covering the receiver, mailbox, queues, backups and hosting/access/diagnostic logs. Configure those systems accordingly. Review analytics/session replay too; do not record form contents.
- [ ] Review the public privacy notice and consent copy with the practice's responsible privacy adviser. Name the actual processing arrangements and retention policy once known. The current generic notice is not a POPIA compliance certification or a substitute for this approval.
- [ ] Configure **distributed abuse protection** at the platform/firewall and receiver. A serverless instance-local counter, a client timestamp or the honeypot is not sufficient. Apply a suitable POST `/api/enquiry` rate limit, a global receiver delivery cap, monitoring and cost safeguards. Agree thresholds with the practice, allowing for shared/mobile networks. If a challenge is used, verify its token on the server and assess its accessibility/privacy impact.
- [ ] Require authentication/verification at the receiver; do not create an unauthenticated public email relay. Keep the destination fixed by server configuration, not submitted fields.
- [ ] Verify that the receiver acknowledges only after durably accepting the enquiry for the approved workflow. A generic webpage returning HTTP 200 is not a receiver.
- [ ] Test timeout, rejection, outage and retry behaviour with synthetic information in a separate preview environment. Establish receiver-side duplicate handling and document what to do if an acknowledgement is lost. The website does not provide an exactly-once delivery guarantee.
- [ ] With explicit practice permission, perform a controlled end-to-end receipt check, verify arrival with the intended recipient and delete the synthetic record under the agreed policy. **Mocked tests do not establish delivery.**
- [ ] Assign an owner for outages, privacy requests, complaints, secret rotation and disabling collection. Record who approved activation and when outside the public repository.

Approved real doctor/premises photographs and clinical/credential content approval are separate launch items. Current images remain generated placeholders, not verified photographs of the doctor or practice. Visible image-provenance badges and notices are not part of the requested design; retain factual alternative text and replace placeholders with approved, licensed photography.

## Server-only configuration

| Variable | Purpose |
| --- | --- |
| `ENQUIRY_ENABLED` | Exact value `true` explicitly enables collection, subject to URL validation. Leave unset or `false` until the checklist is complete. |
| `ENQUIRY_WEBHOOK_URL` | Approved HTTPS endpoint, without a username/password in the URL. Prefer header-based credentials rather than secrets in URLs that can appear in logs. |
| `ENQUIRY_WEBHOOK_TOKEN` | Optional Bearer token for receivers that use this authentication scheme. The receiver must actually enforce its chosen authentication. |
| `NEXT_PUBLIC_SITE_URL` | Public canonical website URL; **not** a delivery setting. |

Manage secrets through the hosting platform's secured environment controls. Never put them in client props, `NEXT_PUBLIC_` variables, Git, screenshots or chat. Configure preview and production separately. Rotate a leaked or revoked token at both ends.

Set the receiver/token first. After the approval and receipt checks, enable the flag **last** and deploy/restart the intended environment. Check the resulting environment rather than assuming a saved variable immediately updated an existing deployment. Contact evaluates the gate on the server and sends only a boolean plus date-only calendar values to the browser.

The local viewer uses `ARENA_PREVIEW=true` **at build time** to omit the frame-embedding restriction for Arena's preview. This flag is not a delivery setting and must not be enabled on production. Production keeps `X-Frame-Options: SAMEORIGIN`.

## Data flow and receiver contract

1. When delivery is disabled, the calendar and fields remain usable after hydration, inside a named section rather than a submitting HTML form. There is no submit control, native form action, storage, or API call; entered details stay in client memory. Telephone/email links do not embed draft values.
2. When configured, server-rendered form fields remain disabled until hydration. The explicit native action is POST, never GET. Without JavaScript, users can telephone/email instead; a native POST is rejected with 415 rather than putting their details in a URL.
3. The client and API share service, contact and date/slot validation. Dates are strict `YYYY-MM-DD`, interpreted against the practice's SAST date; quick-pick days are weekdays, with a native picker for any valid date within 90 days; both are preferences, **not calendar availability**. Optional date and time must be supplied together. WhatsApp remains unavailable until the practice's availability setting is confirmed.
4. The API caps the incoming stream at 8 KiB even if Content-Length is absent or dishonest. It rejects malformed root objects, wrong field types, invalid/impossible dates, invalid contact values, unapproved contact methods, unknown services, excessive field lengths and missing consent. Optional text fields may be omitted; non-string values are not silently converted to a general consultation or no preference.
5. A non-empty honeypot is rejected. This is only a soft spam filter; see the mandatory abuse-control checklist.
6. The server forwards JSON to the configured endpoint. It has an eight-second outbound timeout, refuses redirects and uses `cache: no-store`. The API sets `Cache-Control: no-store` and does not log enquiry bodies or receiver exceptions.
7. Only a successful HTTP response from that endpoint yields `{ "ok": true }`. The UI calls this a received **request**, not a booking. Outages and rejected requests do not produce a success receipt.

Forwarded fields:

| Field | Meaning |
| --- | --- |
| `source` | Constant `website-enquiry`. |
| `receivedAt` | Server-generated ISO timestamp, not a client anti-spam timestamp. |
| `name`, `contactMethod`, `contact` | Validated contact details supplied by the person enquiring. |
| `preferred` | Legacy receiver compatibility value `Any time`; use the structured fields below when supplied. |
| `preferredDate`, `preferredSlot` | Date-only string and allowed time preference, or null. No availability is promised. |
| `serviceId`, `service` | Canonical service ID and readable title, or null for an unspecified consultation. |
| `message` | Optional short note, or null. The UI asks for non-clinical information, but this cannot guarantee that a person will not enter sensitive content. |

The payload omits the honeypot, consent control, untrusted client timestamps, IP/user-agent fields and unrelated submitted properties. Submission requires consent to be exactly boolean true, but this is not a persisted consent audit log. Decide with the privacy adviser whether the approved workflow needs a consent-version audit record and implement it before activation if required. Receiver retention, logging and onward delivery are outside this repository's guarantees. Do not describe the entire system as “storing nothing.”

## Response and failure handling

| Status | Meaning |
| --- | --- |
| 200 | Configured receiver accepted the request; not proof of a booked appointment or human acknowledgement. |
| 400 | Unreadable JSON/body or non-object payload. |
| 405 | GET is not allowed; `Allow: POST`. |
| 413 | Body exceeds the bounded size. |
| 415 | Unsupported content type/native form submission. |
| 422 | Validation/type/consent/honeypot rejection; no forwarding. |
| 503 | Valid enquiry, but delivery is not explicitly configured/enabled. |
| 502 | Receiver rejected the request, timed out, redirected or was unreachable. |

Other HTTP methods retain the framework's method handling. A firewall or delivery provider may impose its own statuses (including 429); configure a suitable accessible failure response. The application does **not** currently implement a distributed 429 rate limiter. Do not promise otherwise.

Validation focuses a visible summary with links to the correct fields. Delivery failures focus their alert and offer direct contact. Retry keeps entered details; a success receipt can reset the form explicitly. Selecting the mobile Book action on Contact scrolls to the existing form without navigation or clearing its service query/draft.

If a timeout happens after a receiver actually accepted a message, its eventual arrival is uncertain from the website's perspective. Do not blindly replay real enquiries. Follow the approved duplicate/incident policy and the user's direct follow-up.

## Safe testing

```sh
npm ci
npm run build
npm run typecheck
npm run lint
npm test
npx playwright install --with-deps chromium
npm run test:e2e
```

Playwright owns an enabled server on 3010 with test-only delivery variables and a delivery-off server on 3012. Tests must continue intercepting all valid browser submissions; unit tests mock the actual route's `fetch`. When using `PLAYWRIGHT_BASE_URL`, Playwright does **not** configure external servers; also set `PLAYWRIGHT_DIRECT_BASE_URL` to a separately managed delivery-off instance. Do not run the active-form suite against production or enable real collection merely to make tests pass.

For a safe ordinary local preview, keep collection explicitly off:

```sh
ENQUIRY_ENABLED=false npm run start -- -H 0.0.0.0 -p 3010
```

Before publishing, separately verify the disabled fallback, the configured synthetic flow, failure handling and the unknown-route/404 path. Automated Chromium and axe checks are not physical iOS/Safari, screen-reader, clinical, legal or real-delivery certification.

## Incident response and rollback

1. If delivery, monitoring, privacy or abuse controls fail, set `ENQUIRY_ENABLED=false` and deploy/restart. Verify Contact shows telephone/email alternatives and a valid synthetic API POST returns 503 without forwarding.
2. Review metadata/status/error-rate monitoring without copying patient details into public logs or tickets. Preserve only the evidence authorised by the incident/retention policy.
3. Investigate receiver queues and logs with the authorised operator. Revoke/rotate affected credentials and follow the practice's incident and notification process where applicable.
4. Fix and retest the entire path in a separate preview. Obtain approval before re-enabling. Never merge PR #1 as a shortcut to deployment.

For a presentation regression, redeploy an approved known-good site revision. Do not restore the old false-receipt behaviour, unsafe native GET submission or an unconfigured submitting form as part of a visual rollback.
