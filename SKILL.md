---
name: google-secops-triage
description: Use this skill when investigating high-severity alerts in Google SecOps or analyzing raw UDM logs for abnormal user execution. Triggers on multi-stage authentication alerts or suspicious administrative activity.
---

# Google SecOps Triage Methodology

## Step 1 — Extract UDM Indicators
- Parse the raw UDM (Unified Data Model) event payload.
- Extract target user, source IP, credential type, and targeted resource.

## Step 2 — Enrichment via Google Threat Intelligence (GTI)
- Extract all external network entities from the alert.
- Cross-reference source IPs against GTI malicious reputation bounds.
- Query historical case logs within Google SecOps for the same user asset over the last 90 days.

## Step 3 — Scope Verification
- Because Skills run in a secure code execution sandbox, Claude has file-system access. Query `reference/known-good-service-accounts.md` to check if the affected asset belongs to an excluded test environment.
- Validate if the event conforms to a known scheduled change window.

## Step 4 — Verdict Formulation
- Categorize explicitly: True Positive | False Positive | Benign | Escalation Required.
- Mandatorily append the specific UDM field strings that justified the classification.