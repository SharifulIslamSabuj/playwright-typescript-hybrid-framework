# Quality Risk Assessment

## 1. Purpose

This document summarizes the current quality posture of the automation
framework: what is implemented and validated, the key residual risks, and a
realistic readiness conclusion. It is intended as a concise engineering
record, not a formal compliance or certification artifact.

## 2. Assessment Scope

Covers the UI, API, and Hybrid automation suites; the GitHub Actions CI
pipeline; Docker execution support; reporting/evidence handling; and the
known AUT limitation tracked in `KNOWN_AUT_LIMITATIONS.md`.

## 3. Current Capability Status

| Capability | Status |
|---|---|
| UI automation | Implemented, validated |
| API automation | Implemented, validated |
| Hybrid automation (API + UI) | Implemented, validated |
| GitHub Actions CI | Operational (PR gate, push, manual, scheduled runs) |
| Docker execution | Implemented, validated locally |
| Reporting and evidence (HTML report, traces, screenshots) | Operational |
| Known AUT limitation handling (AE-TC-UI-006) | Monitored, isolated, non-blocking |

## 4. Key Quality Risks

1. Public demo AUT availability and instability
2. AE-TC-UI-006 success-feedback limitation
3. External test data and application-state dependency
4. Chromium-focused CI validation
5. Third-party or network variability

## 5. Risk Matrix

| Risk ID | Description | Likelihood | Impact | Mitigation | Residual Risk |
|---|---|---|---|---|---|
| R-01 | The AUT is a shared public demo site outside this project's control and may be unavailable or change without notice | Medium | Medium | Retries enabled in CI; isolated known-limitation handling; scheduled run acts as an early-warning signal | Medium |
| R-02 | AE-TC-UI-006 success feedback may not become visible on some runs (AE-KL-001) | Medium | Low | Isolated non-blocking CI step; test kept visible with preserved evidence; not counted against the core gate | Low |
| R-03 | Tests depend on the AUT's live product/account data and state, which this project cannot control or reset | Low | Medium | Dynamic account/email generation per run; no shared or hardcoded account state | Low |
| R-04 | Automated validation currently runs Chromium only in CI and Docker; Firefox/WebKit are configured but not actively exercised | Medium | Low | Cross-browser projects remain configured and available for on-demand local execution | Medium |
| R-05 | Public network conditions and third-party infrastructure can introduce variability outside this project's control | Low | Low | CI retries; failure evidence (trace/screenshot/video) captured on failure | Low |

## 6. Mitigation Summary

Mitigations already in place are structural, not aspirational: dynamic test
data generation removes shared-state risk (R-03); the known-limitation test
is isolated at the CI-step level so it cannot block the required gate (R-02);
retries and a scheduled daily run provide some resilience against transient
AUT/network conditions (R-01, R-05); and cross-browser projects remain
configured, so extending validation beyond Chromium is a configuration change,
not a redesign (R-04).

## 7. Residual Risk

After mitigation, residual risk is concentrated in factors outside this
project's control — the public AUT's own availability, behavior, and data —
rather than in the automation framework's own design or implementation.

## 8. Portfolio Readiness Recommendation

The framework is suitable for portfolio demonstration and technical
discussion, with known external AUT and environment constraints clearly
documented above and in `KNOWN_AUT_LIMITATIONS.md`.

## 9. Final Assessment

This is a demonstration-grade automation framework with real CI and Docker
execution, evidence-based test design, and one honestly documented external
limitation. It is not presented as production-ready for real business release
without further adaptation to a controlled, owned application environment.

---

*This assessment reflects the current state of the automation framework only.
It should not be interpreted as production release approval for the
Automation Exercise application.*
