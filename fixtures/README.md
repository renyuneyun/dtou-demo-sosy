# Fixtures — Alice's Demo Pod

## Quick Start

1. Start a Community Solid Server with solid-dtou:
   See https://github.com/renyuneyun/solid-dtou

2. Upload fixtures:
   ```sh
   cd fixtures && chmod +x setup.sh && ./setup.sh
   ```

3. Copy `.env.example` → `.env` in each app; set `VITE_SOLID_SERVER`.

4. For a live demo without a server, set `VITE_DTOU_MOCK=true`.

## Data Policy Summary

Alice's standing policy for all health data:

| Mechanism | Content |
|-----------|---------|
| Attribute | `demo:attr-health-suggest` — info holder for the `provide-health-suggestions` concept |
| Purpose Tagging | `demo:tagging-health-suggest` — tags data as suitable for health suggestions |
| Prohibition | Block **any app** from declaring `vocab:commercial-research` purpose (`:app` omitted) |

**Why App C is denied:** App C's InputSpec declares `:purpose vocab:commercial-research`.
Two conflicts fire:
1. `UnmatchedExpectation` — Alice's data has no `commercial-research` Purpose Tagging
2. `ProhibitedUse` — Alice's prohibition matches (`:app` omitted, `:purpose` matches)

**Why Apps A and B are allowed:** They declare only `:purpose vocab:provide-health-suggestions`.
Alice's data HAS a matching Purpose Tagging → no `UnmatchedExpectation`.
The prohibition only covers `commercial-research` → no `ProhibitedUse`. No conflicts.

## Shared Vocabulary

`vocab.ttl` defines purpose/security resources used by both Alice's data policies
and the app policies. This is the "shared ontology" that enables non-coordinated
policy compatibility checking.
