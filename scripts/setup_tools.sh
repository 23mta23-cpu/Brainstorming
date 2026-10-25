#!/usr/bin/env bash
# Rebuild the studio toolchain in a fresh (ephemeral) container. Idempotent. ~5 min, ~1 GB.
# Needs: uv, node + global playwright/chromium, ffmpeg (all preinstalled in Claude Code cloud).
set -euo pipefail
T=/home/user/tools; R="$(cd "$(dirname "$0")/.." && pwd)"; mkdir -p "$T"
"$R/scripts/fetch_repos.sh" /home/user/vendor
# 1) SkillSpector (security gate) from the audited commit, isolated venv
[ -x "$T/skillspector-venv/bin/skillspector" ] || { uv venv -q --python 3.13 "$T/skillspector-venv"
  uv pip install -q --python "$T/skillspector-venv/bin/python" /home/user/vendor/SkillSpector; }
# 2) Piper TTS + the CC0 German voices we use
[ -x "$T/piper-venv/bin/python" ] || { uv venv -q --python 3.13 "$T/piper-venv"
  uv pip install -q --python "$T/piper-venv/bin/python" piper-tts==1.8.0 numpy; }
mkdir -p "$T/piper-voices"; B=https://huggingface.co/rhasspy/piper-voices/resolve/main/de/de_DE
for v in thorsten/high thorsten_emotional/medium kerstin/low; do n=${v%/*}; q=${v#*/}; f=de_DE-$n-$q
  for x in onnx onnx.json; do [ -s "$T/piper-voices/$f.$x" ] || curl -sSfL -o "$T/piper-voices/$f.$x" "$B/$n/$q/$f.$x"; done
  [ -s "$T/piper-voices/$f.card.md" ] || curl -sSfL -o "$T/piper-voices/$f.card.md" "$B/$n/$q/MODEL_CARD"; done
# 3) optional: RTK output compressor (tested, not hooked in): ./scripts/setup_tools.sh --rtk
if [[ "${1:-}" == "--rtk" ]]; then (cd /home/user/vendor/rtk && SANDBOX_HOME="$T/rtk-home" "$R/scripts/sandbox-run.sh" --net cargo build --release -q); fi
echo "tools ready: $(ls "$T")"
