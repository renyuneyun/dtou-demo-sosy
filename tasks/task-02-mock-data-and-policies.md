# Task 02 — Mock Data, Shared Vocabulary & Data Policies

## Goal

Create the static fixture files that represent Alice's Solid Pod: mock health data
(Turtle), a shared DToU vocabulary, and the DToU data policies (`.dtou` files).
These are committed under `fixtures/` and uploaded to the Solid server via `setup.sh`.

---

## Background: DToU Policy Language

Policies are written in Turtle using the canonical DToU core namespace
`@prefix dtou: <urn:dtou:core#>`.

Key building blocks used in data policies and app policies:

| Class | Used in | Purpose |
|-------|---------|---------|
| `dtou:Attribute` | DataPolicy | A name/class/value triple attached to data |
| `dtou:PurposeTag` | DataPolicy | Tags data with an allowed purpose |
| `dtou:Prohibition` | DataPolicy | Prohibits a specific app+purpose combination |
| `dtou:Obligation` | DataPolicy | Triggered obligation when a purpose matches |
| `dtou:DataPolicy` | DataPolicy root | Container: `dtou:attribute`, `dtou:tagging`, `dtou:prohibition`, `dtou:obligation` |
| `dtou:Data` | DataPolicy wrapper | Links a resource URI to its DataPolicy (required for server lookup) |
| `dtou:PurposeExpectation` | AppPolicy | App declares which purpose it will use data for; `dtou:descriptor` holds the concept URI |
| `dtou:SecurityProvide` | AppPolicy | App commits to a security requirement |
| `dtou:InputSpec` | AppPolicy | Describes one data input: `dtou:data`, `dtou:port`, `dtou:purpose`, `dtou:provide`, `dtou:downstream` |
| `dtou:OutputSpec` | AppPolicy | Describes one data output: `dtou:port`, `dtou:from` (input ports), `dtou:refinement` |
| `dtou:AppPolicy` | AppPolicy root | Container: `dtou:name`, `dtou:input_spec`, `dtou:output_spec` |

> For an explanation of how tags, taggings, requirements, and conflict types relate,
> see the "DToU Tag Terminology" section in OVERVIEW.md.

> **Non-coordination through shared vocabulary:**
> Both data owners and apps must use the **same URIs** for purpose concepts. This is
> the "shared ontology" aspect of DToU — there is no bilateral negotiation, but both
> sides agree on a common vocabulary (like `urn:dtou-demo:vocab#health-suggestions`),
> rooted in standard vocabularies like DPV.

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
        container.dtou                # Container-level data policy (served as .dtou)
        2024-03-01.ttl
        2024-03-01.ttl.dtou
        2024-03-02.ttl
        2024-03-02.ttl.dtou
      steps/
        container.dtou
        2024-03-01.ttl
        2024-03-01.ttl.dtou
        2024-03-02.ttl
        2024-03-02.ttl.dtou
      sleep/
        container.dtou
        2024-03-01.ttl
        2024-03-01.ttl.dtou
        2024-03-02.ttl
        2024-03-02.ttl.dtou
  setup.sh
  README.md
```

> **Note on container.dtou:** All three apps reference container URLs
> (e.g. `http://localhost:3000/alice/health/heartrate/`) in their `dtou:data` fields.
> The server appends `.dtou` to that URL and fetches the container-level policy.
> `container.dtou` is uploaded by `setup.sh` as `.dtou` (not `container.dtou`).
> It includes a `dtou:Data` wrapper with `dtou:uri` matching the container URL.

---

## `fixtures/vocab.ttl` — Shared Demo Vocabulary

Pure terminology file defining the purpose concepts used by both Alice's data
policy and the app policies. Uses DPV (`dpv:Purpose`) as the base — each concept
is an `rdfs:subClassOf dpv:Purpose`, analogous to how DPV sub-purposes work.
This file defines *what concepts mean*, not how they are used in any specific
framework. Both data owners and apps reference these same concept URIs; the DToU
reasoner matches on URI equality without any bilateral coordination.

> For an explanation of DToU tag types (Tagging, Requirement, PurposeTag, etc.)
> and the three conflict types, see the "DToU Tag Terminology" section in OVERVIEW.md.

**How concept URIs link both sides:**
The `dtou:descriptor` on a `PurposeExpectation` (app side) must equal the
`dtou:class` of the `Attribute` referenced by the data's `PurposeTag` (data
policy side). The reasoner matches on URI equality — so both sides must use the
same shared vocabulary URI.

```turtle
@prefix rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#> .
@prefix skos:  <http://www.w3.org/2004/02/skos/core#> .
@prefix dpv:   <https://w3id.org/dpv#> .
@prefix vocab: <urn:dtou-demo:vocab#> .

vocab:health-suggestions a rdfs:Class ;
    rdfs:subClassOf dpv:Purpose ;
    rdfs:label "Health Suggestions" ;
    skos:definition "Use of personal health data to provide personalised health suggestions, insights, or recommendations directly to the data subject." .

vocab:commercial-research a rdfs:Class ;
    rdfs:subClassOf dpv:Purpose ;
    rdfs:label "Commercial Research" ;
    skos:definition "Aggregation and use of personal health data for commercial research purposes, including sharing with third-party commercial research partners." .
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

Each health data container has a `container.dtou` file (uploaded as `.dtou`).
The per-file `*.ttl.dtou` files share the same policy structure but without the
`dtou:Data` wrapper (they're only used if apps reference specific file URLs).

### Explanation

Alice's data policy expresses three things:

1. **Attribute**: carries the data-level information referenced by the PurposeTag.
   `dtou:class` holds the concept URI; the reasoner matches this against the app's
   `dtou:descriptor` on its PurposeExpectation.

2. **PurposeTag** (for `vocab:health-suggestions`): Alice tags her health data as
   suitable for providing personal health suggestions. Apps that declare this purpose
   via `dtou:descriptor vocab:health-suggestions` will find the matching tag and pass
   (`UnmatchedExpectation` does NOT fire). Apps declaring any other purpose they
   expect to find will get `UnmatchedExpectation` if no corresponding tag exists.

3. **Prohibition** (`vocab:commercial-research`): any app whose PurposeExpectation
   has `dtou:descriptor vocab:commercial-research` is blocked. `dtou:app` is omitted
   — it matches any app. Combined with the absent commercial-research tag, App C
   gets both `UnmatchedExpectation` (tag absent) and `ProhibitedUse` (prohibited).

### `container.dtou` (same structure for heartrate, steps, sleep)

```turtle
@prefix dtou:  <urn:dtou:core#> .
@prefix demo:  <urn:dtou-demo:> .
@prefix vocab: <urn:dtou-demo:vocab#> .

# Required wrapper: dtou:uri must match the container URL in InputSpec dtou:data
demo:data-heartrate a dtou:Data ;
    dtou:uri <http://localhost:3000/alice/health/heartrate/> ;
    dtou:policy demo:health-data-policy .

demo:attr-health-suggest a dtou:Attribute ;
    dtou:name  demo:health-suggest-attr-name ;
    dtou:class vocab:health-suggestions ;
    dtou:value vocab:nil .

demo:tagging-health-suggest a dtou:PurposeTag ;
    dtou:attribute_ref demo:attr-health-suggest .

# dtou:app omitted → matches any app, regardless of its name
demo:prohibition-commercial a dtou:Prohibition ;
    dtou:mode dtou:Use ;
    dtou:activation_condition [
        dtou:purpose vocab:commercial-research
    ] .

demo:health-data-policy a dtou:DataPolicy ;
    dtou:attribute   demo:attr-health-suggest ;
    dtou:tagging     demo:tagging-health-suggest ;
    dtou:prohibition demo:prohibition-commercial .
```

> **Demo talking point:** Alice's prohibition omits `dtou:app` entirely — it blocks
> *any* app that claims a commercial research purpose, including apps that don't
> exist yet. And because she didn't add a `commercial-research` PurposeTag,
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
    # container.dtou is the container-level policy; served at ".dtou" (not "container.dtou")
    if [ "$fname" = "container.dtou" ]; then
      upload "$f" "/alice/health/$subdir/.dtou"
    else
      upload "$f" "/alice/health/$subdir/$fname"
    fi
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
| Attribute | `demo:attr-health-suggest` — info holder; `dtou:class vocab:health-suggestions` |
| PurposeTag | `demo:tagging-health-suggest` — tags data as suitable for health suggestions |
| Prohibition | Block **any app** declaring `vocab:commercial-research` purpose (`dtou:app` omitted) |

**Why App C is denied:** App C's PurposeExpectation has `dtou:descriptor vocab:commercial-research`.
Two conflicts fire:
1. `UnmatchedExpectation` — Alice's data has no PurposeTag with `dtou:class vocab:commercial-research`
2. `ProhibitedUse` — Alice's prohibition matches (`dtou:app` omitted, `dtou:purpose` matches)

**Why Apps A and B are allowed:** They declare only `dtou:descriptor vocab:health-suggestions`.
Alice's data HAS a matching PurposeTag → no `UnmatchedExpectation`.
The prohibition only covers `commercial-research` → no `ProhibitedUse`. No conflicts.

## Shared Vocabulary

`vocab.ttl` defines purpose/security resources used by both Alice's data policies
and the app policies. This is the "shared ontology" that enables non-coordinated
policy compatibility checking.
```

---

## Acceptance Criteria

- All `.ttl` files parse as valid Turtle.
- All `.dtou` files are valid Turtle and contain a `dtou:DataPolicy` subject.
- `container.dtou` files also contain a `dtou:Data` wrapper with the correct `dtou:uri`.
- `vocab.ttl` defines `vocab:purpose-health-suggestions` and `vocab:purpose-commercial-research`.
- The prohibition in each `container.dtou` references `vocab:commercial-research` as `dtou:purpose`
  and omits `dtou:app` (no app-name restriction).
- `setup.sh` uploads `container.dtou` as `.dtou` (the container-level policy endpoint).
- `setup.sh` is executable.
