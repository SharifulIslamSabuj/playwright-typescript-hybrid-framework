# Known AUT Limitations

## 1. Purpose

This document records known limitations in the Application Under Test (AUT) —
`automationexercise.com` — that affect automated test execution but are outside
this project's control. It exists so that a recurring, non-blocking test result
is understood as a documented condition, not an unexplained or ignored failure.

## 2. Scope

This document covers AUT-level behavior only. It does not track framework
defects, and it is not a general defect register. Framework-level issues are
addressed directly in code and reviewed as part of the normal step-by-step
hardening process already used throughout this project.

## 3. Ownership

| Area | Owner |
|------|-------|
| Automation Framework | This Repository |
| Automation Exercise Application | External AUT |
| GitHub Actions Pipeline | This Repository |

## 4. Known Limitation Summary

| Field | Value |
|---|---|
| Limitation ID | AE-KL-001 |
| Related test | AE-TC-UI-006 |
| Module | Contact Us |
| Type | External AUT limitation |
| Status | Open / Monitored |
| Root cause | Not confirmed |
| Business impact | Low to Medium |
| Automation impact | Medium |
| Framework impact | No confirmed framework defect |
| CI handling | Isolated and non-blocking |
| Risk acceptance | Accepted for portfolio demonstration |

## 5. Related Test Case

**AE-TC-UI-006** — Submit Contact Us form (`tests/ui/contact-us.spec.ts`).
The test fills the Contact Us form with valid data, submits it, and checks for
the application's own success feedback element (`.status.alert-success`).

## 6. Observed Behavior

On some automated runs, after a valid Contact Us form submission, the expected
success feedback does not become visible within the automation's observation
window. The element associated with `.status.alert-success` can be present in
the page's DOM but remain hidden during the affected runs.

## 7. Expected Behavior

After a valid submission, the application is expected to display a visible
success message confirming the form was submitted.

## 8. Classification

This is classified as a **suspected application rendering or timing behavior**
on the public AUT, not as a defect in the automation framework. The framework's
page object, locator, and assertion for this flow are unchanged from the
pattern used successfully elsewhere in the suite.

## 9. Root Cause Status

**Not confirmed.** This project has no access to the AUT's server-side logs,
source code, or infrastructure, so no definitive root cause can be established
from the client side alone. Any explanation beyond the observed symptom
(element present in DOM, not visible) would be speculative and is intentionally
not asserted here.

## 10. Impact Assessment

| Dimension | Assessment |
|---|---|
| Business impact | Low to Medium — affects confirmation feedback on one contact form, not a core commerce flow |
| Automation impact | Medium — one test is intermittently affected; it does not block validation of the rest of the suite |
| Framework impact | No confirmed framework defect — the same page-object and assertion pattern is stable across the rest of the suite |

## 11. Current Engineering Handling

- The test **remains in the suite** — not deleted, skipped, or silently suppressed.
- Tagged `@regression` (not `@smoke`), so it does not gate every commit.
- In CI (`.github/workflows/playwright.yml`), it runs as its own named step on
  every trigger, with `continue-on-error: true` so it cannot fail the required
  job status.
- Its report and evidence (screenshots/traces on failure) are preserved via
  the same artifact-upload steps used for every other test.
- The CI job summary explicitly labels its result as informational, not a
  framework-gating failure.

## 12. Validation / Closure Criteria

Can be closed or reclassified if: the success feedback is observed to render
reliably across a sustained series of runs; direct access to AUT-side logs or
source becomes available and identifies an actual cause; or a deterministic,
black-box technique is found to distinguish true failure from this symptom.

## 13. Final Note

This entry makes an already-visible, already-isolated test result explicit and
traceable — normal, mature handling of a third-party public demo application's
behavior, not a gap in the automation framework's own correctness. This record
is suitable for portfolio demonstration and technical discussion.
