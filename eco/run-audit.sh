#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
ENV_FILE="${ENV_FILE:-$ROOT_DIR/eco/.env}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing env file: $ENV_FILE"
  echo "Create it from eco/.env.example and fill your credentials."
  exit 1
fi

set -a
# shellcheck source=/dev/null
. "$ENV_FILE"

echo "ENV_FILE=$ENV_FILE"
echo "BF_BASE_URL='${BF_BASE_URL-}'"
echo "BF_EMAIL='${BF_EMAIL-}'"
echo "BF_PASSWORD is set? $([[ -n "${BF_PASSWORD-}" ]] && echo yes || echo no)"

set +a

: "${BF_BASE_URL:?BF_BASE_URL missing or empty}"
: "${BF_EMAIL:?BF_EMAIL missing or empty}"
: "${BF_PASSWORD:?BF_PASSWORD missing or empty}"

cd "$ROOT_DIR"

npm run audit:eco

