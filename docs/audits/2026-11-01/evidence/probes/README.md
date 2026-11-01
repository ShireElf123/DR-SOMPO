# Audit probe source snapshots

These are the one-off scripts used for the 1 November 2026 audit of application revision `e1d66e914888660fd381f07101cb16f767d97519`. They are evidence/provenance, **not new CI tests or application changes**.

## Recorded environment

- Repository: `/home/user/DR-SOMPO`
- Target: a local Next production build at `http://127.0.0.1:3010`
- Node: 22.22.3
- Playwright: installed in the repository's `node_modules`
- Chromium executable: `/tmp/chromium`
- Browser shared libraries: `/tmp/al2023/lib`, supplied through `LD_LIBRARY_PATH`
- Additional audit tools: axe-core 4.14.0 and Lighthouse 13.6.0, installed outside the application under `/home/user/.cache/dr-sompo-audit-tools`
- Temporary outputs: `/home/user/.cache/dr-sompo-full-audit`

The scripts retain their original sandbox paths. Adapt paths and install the relevant tooling to reproduce them elsewhere. Browser executables, `node_modules`, full Lighthouse payloads and temporary output directories are not bundled. The report and compact outputs are retained one directory above.

## Files

| Script | Coverage / safety |
| --- | --- |
| `matrix.mjs` | Twelve routes at eight widths; layout, heading clipping, metadata, links, image loading and footer observations. Enquiry API requests are blocked. |
| `interactions.mjs` | Fifteen targeted interactions. Enquiry responses are intercepted/mocked. The no-JavaScript native GET uses synthetic data and the local server only. |
| `accessibility.mjs` | axe scans on all twelve routes at phone and desktop widths. API requests are blocked. |
| `api.mjs` | Actual route source evaluated with a stubbed environment, a fixed date and **stubbed outbound fetch**. No real webhook is used. |
| `verification.mjs` | Final radio-focus and responsive-image measurements. API requests are blocked. An 800 ms initial wait lets hydration settle before locating the form. |

The initial attempt at the final verification encountered a detached element while the page was hydrating. The script was stabilised and rerun successfully; that harness timing event is not reported as an application defect. The earlier image-only probe had an unmatched selector; only the corrected `verification.json` is used as DOM evidence for hidden hero images.

Example execution **inside the original audit environment**, after recreating the temporary output directory:

```sh
mkdir -p /home/user/.cache/dr-sompo-full-audit/screens
LD_LIBRARY_PATH=/tmp/al2023/lib node docs/audits/2026-11-01/evidence/probes/matrix.mjs
```

For the recorded Lighthouse runs:

```sh
CHROME_PATH=/tmp/chromium LD_LIBRARY_PATH=/tmp/al2023/lib \
node /home/user/.cache/dr-sompo-audit-tools/node_modules/lighthouse/cli/index.js \
http://127.0.0.1:3010/contact \
--quiet --only-categories=performance --output=json \
--output-path=/home/user/.cache/dr-sompo-full-audit/lighthouse-contact.json \
--chrome-flags='--headless --no-sandbox --disable-dev-shm-usage'
```

Home and `/services/laparoscopy` were also run. Do not run other browser workloads concurrently when comparing performance measurements.

**Safety:** do not repoint submission probes at production or remove interception to obtain a delivery test. A real receiver test requires separate practice approval. The direct local `null` request cannot reach delivery because it fails while accessing `body.company`; its retained response is `../local-null-request.json`.

For maintained regression coverage, convert the relevant cases into focused tests in the repository's normal test suite, with explicit expected outcomes and mocked delivery. Do not treat these observational scripts or the passing pre-existing 50 checks as comprehensive production sign-off.
