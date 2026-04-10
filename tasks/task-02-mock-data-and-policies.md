# Task 02 — Mock Data, Shared Vocabulary & Data Policies

## Goal

Create the static fixture files that represent Alice's Solid Pod: mock health data
(Turtle), a shared DToU vocabulary, and the DToU data policies (`.dtou` files).
These are committed under `fixtures/` and uploaded to the Solid server via `setup.sh`.

---

## Background: DToU Policy Language

Policies are written in Turtle using the DToU core namespace
`@prefix : <http://example.org/ns#>`.

Key building blocks:

| Class | Used in | Purpose |
|-------|---------|---------|
| `:Attribute` | DataPolicy | A name/class/value triple attached to data |
| `:Purpose` | DataPolicy | Tags data with an allowed purpose (subclass of `:Tag`) |
| `:Prohibition` | DataPolicy | Prohibits a specific app+purpose combination |
| `:Obligation` | DataPolicy | Triggered obligation when a purpose matches |
| `:DataPolicy` | DataPolicy root | Container: `:attribute`, `:tag`, `:requirement`, `:prohibition`, `:obligation` |
| `:PurposeExpectation` | AppPolicy | App declares which purpose it will use data for |
| `:SecurityProvide` | AppPolicy | App commits to a security requirement |
| `:InputSpec` | AppPolicy | Describes one data input: `:data`, `:port`, `:purpose`, `:provide`, `:downstream` |
| `:OutputSpec` | AppPolicy | Describes one data output: `:port`, `:from` (input ports), `:refinement` |
| `:AppPolicy` | AppPolicy root | Container: `:name`, `:input_spec`, `:output_spec` |

The DToU reasoner detects three types of conflicts (all subclasses of `:Conflict`):
- `:UnsatisfiedRequirement` — app fails to provide something the data policy requires
- `:UnmatchedExpectation` — app expects a tag the data doesn't have
- `:ProhibitedUse` — app (identified by its `:name` URI) uses data for a prohibited purpose

> **Non-coordination through shared vocabulary:**
> Both data owners and apps must use the **same URIs** for purpose concepts. This is
> the "shared ontology" aspect of DToU — there is no bilateral negotiation, but both
> sides agree on a common vocabulary (like `urn:dtou-demo:purpose-personal-benefit`).

---

## File Layout

```
fixtures/
  vocab.ttl                           # Shared DToU vocabulary (purpose URIs etc.)
  alice-pod/
    profile/
      card.ttl
    health/
      heartrate/
        2024-03-01.ttl
        2024-03-01.ttl.dtou
        2024-03-02.ttl
        2024-03-02.ttl.dtou
      steps/
        2024-03-01.ttl
        2024-03-01.ttl.dtou
        2024-03-02.ttl
        2024-03-02.ttl.dtou
      sleep/
        2024-03-01.ttl
        2024-03-01.ttl.dtou
        2024-03-02.ttl
        2024-03-02.ttl.dtou
  setup.sh
  README.md
```

---

## `fixtures/vocab.ttl` — Shared DToU Vocabulary

Shared concept URIs and PurposeExpectation resources referenced by both Alice's
data policy and the app policies.

**DToU Tag terminology:**
- **Tag** — umbrella class, covers both **Tagging** and **Requirement**
  - **Tagging** — informational tags the app can `:expect`; subtypes: Purpose, Integrity
    - **Purpose** — a widely-used Tagging type with `:purpose` shorthand on InputSpec
  - **Requirement** — mandatory; app must `:provide` matching value; subtype: Security

**How `:purpose` on InputSpec works (two roles):**
1. Tag expectation (Tagging side) — data must have a Purpose Tagging whose `:name`
   matches; `UnmatchedExpectation` fires if absent. Extra Taggings on data beyond
   what the app declares are fine.
2. Prohibition check — `ProhibitedUse` fires if the prohibition's
   `:activation_condition :purpose` references the same resource.

**How concept URIs link both sides:**
The PurposeExpectation's `:name` must equal the `:class` of the Attribute referenced
by Alice's Purpose Tagging — that `:class` value becomes the Tagging's `:name`
(via `:TagName :sameAs :AttributeClass`). The reasoner matches on `:type` + `:name`.

```turtle
@prefix :      <http://example.org/ns#> .
@prefix vocab: <http://example.org/dtou-demo/vocab#> .

# ── PurposeExpectation resources ─────────────────────────────────────────────

# "Provide personalised health suggestions to the user"
# Alice's data HAS a Purpose Tagging with this :name.
# Apps declaring this purpose: tag expectation passes, not prohibited → allowed.
vocab:provide-health-suggestions a :PurposeExpectation ;
    :name <urn:dtou-demo:purpose-health-suggestions> .

# "Commercial research — aggregate and share data with a commercial third party"
# Alice's data does NOT have a Purpose Tagging with this :name (UnmatchedExpectation).
# Alice also prohibits this purpose (ProhibitedUse).
# An app declaring this purpose gets both conflicts.
vocab:commercial-research a :PurposeExpectation ;
    :name <urn:dtou-demo:purpose-commercial-research> .
```

---

## Health Data Fixtures

### `fixtures/alice-pod/profile/card.ttl`

```turtle
@prefix foaf:  <http://xmlns.com/foaf/0.1/> .
@prefix solid: <http://www.w3.org/ns/solid/terms#> .

<#me>
  a foaf:Person ;
  foaf:name "Alice Demo" ;
  foaf:mbox <mailto:alice@example.org> ;
  solid:oidcIssuer <http://localhost:3000/> .
```

### `fixtures/alice-pod/health/heartrate/2024-03-01.ttl`

```turtle
@prefix ex:  <http://example.org/health#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

<#r1> a ex:HeartRateMeasurement ; ex:bpm 72 ;
      ex:timestamp "2024-03-01T08:00:00Z"^^xsd:dateTime .
<#r2> a ex:HeartRateMeasurement ; ex:bpm 68 ;
      ex:timestamp "2024-03-01T12:00:00Z"^^xsd:dateTime .
<#r3> a ex:HeartRateMeasurement ; ex:bpm 75 ;
      ex:timestamp "2024-03-01T20:00:00Z"^^xsd:dateTime .
```

### `fixtures/alice-pod/health/heartrate/2024-03-02.ttl`

Same structure; use BPM values 70, 65, 78 and date `2024-03-02`.

### `fixtures/alice-pod/health/steps/2024-03-01.ttl`

```turtle
@prefix ex:  <http://example.org/health#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

<#r> a ex:DailySteps ; ex:stepCount 8423 ;
     ex:date "2024-03-01"^^xsd:date .
```

### `fixtures/alice-pod/health/steps/2024-03-02.ttl`

Same; stepCount 10251, date `2024-03-02`.

### `fixtures/alice-pod/health/sleep/2024-03-01.ttl`

```turtle
@prefix ex:  <http://example.org/health#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

<#r> a ex:SleepRecord ;
     ex:durationHours "7.5"^^xsd:decimal ;
     ex:qualityScore 82 ;
     ex:date "2024-03-01"^^xsd:date .
```

### `fixtures/alice-pod/health/sleep/2024-03-02.ttl`

Same; durationHours 6.5, qualityScore 71, date `2024-03-02`.

---

## Data Policy Files (`.dtou`)

All six health data resources share the same data policy.
Copy this content verbatim into each of the six `.dtou` files.

### Explanation

Alice's data policy expresses three things:

1. **Attribute**: carries the data-level information referenced by the Purpose Tagging.
   Attributes do not permit or prohibit anything by themselves — they are
   information holders referenced via `:attribute_ref`.

2. **Purpose Tagging** (`vocab:provide-health-suggestions`): Alice tags her health
   data as suitable for providing personal health suggestions. Apps that declare
   this purpose (via InputSpec `:purpose`) will find the matching Tagging and
   pass that check (`UnmatchedExpectation` does NOT fire).
   Apps that declare any OTHER purpose they expect to find will get
   `UnmatchedExpectation` if Alice's data has no corresponding Tagging for it.

3. **Prohibition** (`vocab:commercial-research`): any app declaring
   `vocab:commercial-research` as an InputSpec `:purpose` is blocked.
   `:app` is omitted — it matches any app regardless of its name.
   Combined with the absent `commercial-research` Tagging, App C gets both
   `UnmatchedExpectation` (tag absent) and `ProhibitedUse` (actively prohibited).

### All six `.dtou` files

```turtle
@prefix :      <http://example.org/ns#> .
@prefix demo:  <http://example.org/dtou-demo#> .
@prefix vocab: <http://example.org/dtou-demo/vocab#> .

# ── Attribute ────────────────────────────────────────────────────────────────
# Information holder for the "provide health suggestions" purpose concept.
# :class value becomes the Purpose Tagging's :name (TagName = AttributeClass).
# This is what the PurposeExpectation :name on the app side must match.

demo:attr-health-suggest a :Attribute ;
    :name  demo:health-suggest-id ;
    :class <urn:dtou-demo:purpose-health-suggestions> ;
    :value :nil .

# ── Purpose Tagging ──────────────────────────────────────────────────────────
# Tags this data as suitable for "provide health suggestions" use.
# Apps that :purpose vocab:provide-health-suggestions will find this Tagging.
# UnmatchedExpectation does NOT fire for those apps.

demo:tagging-health-suggest a :Purpose ;
    :attribute_ref demo:attr-health-suggest .

# ── Prohibition ──────────────────────────────────────────────────────────────
# Block ANY app from using this data for commercial research.
# :app is omitted → matches any app, regardless of its name.
# Combined with the absent commercial-research Tagging, App C gets both:
#   - UnmatchedExpectation (no such Tagging on data)
#   - ProhibitedUse (active prohibition)

demo:prohibition-commercial a :Prohibition ;
    :mode :Use ;
    :activation_condition [
        :purpose vocab:commercial-research
    ] .

# ── Data Policy ──────────────────────────────────────────────────────────────

demo:health-data-policy a :DataPolicy ;
    :attribute   demo:attr-health-suggest ;
    :tag         demo:tagging-health-suggest ;
    :prohibition demo:prohibition-commercial .
```

> **Demo talking point:** Alice's prohibition omits `:app` entirely — it blocks
> *any* app that claims a commercial research purpose, including apps that don't
> exist yet. And because she didn't add a `commercial-research` Purpose Tagging,
> even without the prohibition App C would already get `UnmatchedExpectation`.
> Compare this to WAC/ACP: Alice would need to update an ACL for every new app
> she wants to block, and there's no automated check at all.

---

## `fixtures/setup.sh`

```bash
#!/usr/bin/env bash
# Upload Alice's Pod fixtures to a local Community Solid Server (CSS + solid-dtou)
# Usage: ./setup.sh [SERVER_URL] [ALICE_PASSWORD]

set -euo pipefail

SERVER="${1:-http://localhost:3000}"
PASSWORD="${2:-alice123}"

echo "==> Registering Alice..."
curl -s -X POST "$SERVER/idp/register/" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"alice@example.org\",
    \"password\": \"$PASSWORD\",
    \"confirmPassword\": \"$PASSWORD\",
    \"createWebId\": true,
    \"register\": true,
    \"createPod\": true,
    \"podName\": \"alice\"
  }" | jq '.webId // "already exists or registration not needed"'

echo ""
echo "==> Obtaining access token..."
TOKEN=$(curl -s -X POST "$SERVER/.oidc/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password&username=alice@example.org&password=$PASSWORD&scope=openid" \
  | jq -r '.access_token // empty')

if [ -z "$TOKEN" ]; then
  echo "WARN: Could not get token via password grant."
  echo "     The server may require browser-based login."
  echo "     Set TOKEN manually and re-run, or use VITE_DTOU_MOCK=true for the demo."
  AUTH_HEADER=""
else
  AUTH_HEADER="Authorization: Bearer $TOKEN"
fi

upload() {
  local src="$1" dest="$2" ct="${3:-text/turtle}"
  echo "  PUT $dest"
  if [ -n "$AUTH_HEADER" ]; then
    curl -s -X PUT "$SERVER$dest" -H "$AUTH_HEADER" -H "Content-Type: $ct" --data-binary @"$src"
  else
    curl -s -X PUT "$SERVER$dest" -H "Content-Type: $ct" --data-binary @"$src"
  fi
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
POD="$SCRIPT_DIR/alice-pod"

echo ""
echo "==> Uploading shared vocabulary..."
upload "$SCRIPT_DIR/vocab.ttl" "/public/dtou-demo-vocab.ttl"

echo ""
echo "==> Uploading health data and policies..."
for subdir in heartrate steps sleep; do
  for f in "$POD/health/$subdir/"*.ttl; do
    fname="$(basename "$f")"
    upload "$f" "/alice/health/$subdir/$fname"
  done
  for f in "$POD/health/$subdir/"*.dtou; do
    fname="$(basename "$f")"
    upload "$f" "/alice/health/$subdir/$fname"
  done
done

echo ""
echo "==> Done. Alice's Pod: $SERVER/alice/"
```

## `fixtures/README.md`

```markdown
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
```

---

## Acceptance Criteria

- All `.ttl` files parse as valid Turtle.
- All `.dtou` files are valid Turtle and contain a `:DataPolicy` subject.
- `vocab.ttl` defines `vocab:personal-benefit` and `vocab:commercial-research`.
- The prohibition in each `.dtou` references `vocab:commercial-research` as `:purpose`
  and omits `:app` (no app-name restriction).
- `setup.sh` is executable.
