#!/usr/bin/env bash
# Upload Alice's Pod fixtures to a local Community Solid Server (CSS + solid-dtou)
# Usage: ./setup.sh [SERVER_URL] [ALICE_EMAIL] [ALICE_PASSWORD]
#
# Authentication uses CSS's Client Credentials flow (script-friendly OIDC):
#   1. Register Alice (first run only)
#   2. POST /idp/credentials → get client_id + client_secret
#   3. Exchange for a Bearer token via client_credentials grant
#   4. Upload all fixtures with Authorization: Bearer <token>

set -euo pipefail

SERVER="${1:-http://localhost:3000}"
EMAIL="${2:-alice@example.org}"
PASSWORD="${3:-alice123}"

check_server() {
  curl -s -o /dev/null -w "%{http_code}" "$SERVER/" | grep -q "^[23]"
}

if ! check_server; then
  echo "ERROR: Server at $SERVER is not reachable. Start it and retry."
  exit 1
fi

# ── Step 1: Register Alice ──────────────────────────────────────────────────
echo "==> Registering Alice (idempotent — ok if already exists)..."
REG=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$SERVER/idp/register/" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\",
    \"confirmPassword\": \"$PASSWORD\",
    \"createWebId\": true,
    \"register\": true,
    \"createPod\": true,
    \"podName\": \"alice\"
  }")
echo "    Registration status: $REG (409 = already exists, both are fine)"

# ── Step 2: Create client credentials ──────────────────────────────────────
# This is CSS's script-friendly mechanism — no browser needed.
echo ""
echo "==> Creating client credentials..."

# Some CSS versions require a session cookie to create credentials.
# First obtain a session by doing an email/password login to the IDP.
SESSION_COOKIE=$(mktemp)
LOGIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -c "$SESSION_COOKIE" \
  -X POST "$SERVER/idp/login/" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
echo "    IDP login status: $LOGIN_STATUS"

CREDS_RESPONSE=$(curl -s -b "$SESSION_COOKIE" \
  -X POST "$SERVER/idp/credentials/" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"dtou-setup-token\",\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

echo "    Credentials response: $CREDS_RESPONSE"

CLIENT_ID=$(echo "$CREDS_RESPONSE"     | jq -r '.id     // empty')
CLIENT_SECRET=$(echo "$CREDS_RESPONSE" | jq -r '.secret // empty')
rm -f "$SESSION_COOKIE"

# ── Step 3: Exchange credentials for a Bearer token ─────────────────────────
TOKEN=""
if [ -n "$CLIENT_ID" ] && [ -n "$CLIENT_SECRET" ]; then
  echo ""
  echo "==> Exchanging credentials for access token..."
  ENCODED=$(printf '%s:%s' "$CLIENT_ID" "$CLIENT_SECRET" | base64 | tr -d '\n')
  TOKEN=$(curl -s -X POST "$SERVER/.oidc/token" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -H "Authorization: Basic $ENCODED" \
    -d "grant_type=client_credentials&scope=webid" \
    | jq -r '.access_token // empty')
  if [ -n "$TOKEN" ]; then
    echo "    Got access token."
  else
    echo "    WARN: Token exchange returned empty. Will try uploading without auth."
  fi
else
  echo "    WARN: Could not obtain client credentials."
  echo "    The server may require browser-based login (see fixtures/README.md)."
fi

# ── Step 4: Upload ──────────────────────────────────────────────────────────
upload() {
  local src="$1" dest="$2" ct="${3:-text/turtle}"
  echo "  PUT $dest"
  if [ -n "$TOKEN" ]; then
    HTTP=$(curl -s -o /dev/null -w "%{http_code}" \
      -X PUT "$SERVER$dest" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: $ct" \
      --data-binary @"$src")
  else
    HTTP=$(curl -s -o /dev/null -w "%{http_code}" \
      -X PUT "$SERVER$dest" \
      -H "Content-Type: $ct" \
      --data-binary @"$src")
  fi
  if [[ "$HTTP" =~ ^(200|201|204|205)$ ]]; then
    echo "    → $HTTP OK"
  else
    echo "    → $HTTP FAILED"
  fi
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
POD="$SCRIPT_DIR/alice-pod"

echo ""
echo "==> Uploading shared vocabulary (into Alice's Pod — /public/ requires server admin)..."
upload "$SCRIPT_DIR/vocab.ttl" "/alice/public/vocab.ttl"

echo ""
echo "==> Uploading health data and policies..."
for subdir in heartrate steps sleep; do
  for f in "$POD/health/$subdir/"*.ttl; do
    fname="$(basename "$f")"
    upload "$f" "/alice/health/$subdir/$fname"
  done
  for f in "$POD/health/$subdir/"*.dtou; do
    fname="$(basename "$f")"
    # container.dtou is the container-level policy; it must be served at ".dtou"
    # (the server appends .dtou to the container URL to locate the policy).
    if [ "$fname" = "container.dtou" ]; then
      upload "$f" "/alice/health/$subdir/.dtou"
    else
      upload "$f" "/alice/health/$subdir/$fname"
    fi
  done
done

echo ""
echo "==> Done. Alice's Pod: $SERVER/alice/"
