#!/usr/bin/env bash
# Run third-party code without our credentials. Only PATH/locale/temp HOME pass through.
# --net additionally passes the egress proxy + CA bundle (needed for installs/builds), never tokens.
# ponytail: env scrubbing only, no filesystem/network isolation; use docker if a repo needs real isolation.
set -euo pipefail
net=(); if [[ "${1:-}" == "--net" ]]; then shift
  for v in HTTPS_PROXY https_proxy NO_PROXY no_proxy SSL_CERT_FILE REQUESTS_CA_BUNDLE CURL_CA_BUNDLE PIP_CERT NODE_EXTRA_CA_CERTS CARGO_HTTP_CAINFO GIT_SSL_CAINFO; do
    [[ -n "${!v:-}" ]] && net+=("$v=${!v}"); done; fi
if [[ -n "${SANDBOX_HOME:-}" ]]; then home="$SANDBOX_HOME"; else home="$(mktemp -d)"; trap 'rm -rf "$home"' EXIT; fi  # temp HOME caches add up to GBs
env -i PATH="/root/.cargo/bin:/usr/local/bin:/usr/bin:/bin" HOME="$home" LANG=C.UTF-8 CARGO_HOME=/root/.cargo RUSTUP_HOME=/root/.rustup "${net[@]}" "$@"
