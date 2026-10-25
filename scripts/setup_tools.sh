#!/usr/bin/env bash
# Rebuild the studio toolchain in a fresh (ephemeral) container. Idempotent. Base ~5 min/~1 GB; v3 models ~22 GB on top.
# Needs: uv, node + global playwright/chromium, ffmpeg (all preinstalled in Claude Code cloud).
set -euo pipefail
T="${TOOLS_DIR:-/home/user/tools}"; V="${VENDOR_DIR:-/home/user/vendor}"; R="$(cd "$(dirname "$0")/.." && pwd)"; mkdir -p "$T"
"$R/scripts/fetch_repos.sh" "$V"
# 1) SkillSpector (security gate) from the audited commit, isolated venv
[ -x "$T/skillspector-venv/bin/skillspector" ] || { uv venv -q --python 3.13 "$T/skillspector-venv"
  uv pip install -q --python "$T/skillspector-venv/bin/python" "$V/SkillSpector"; }
# 2) Piper TTS + the CC0 German voices we use
[ -x "$T/piper-venv/bin/python" ] || { uv venv -q --python 3.13 "$T/piper-venv"
  uv pip install -q --python "$T/piper-venv/bin/python" piper-tts==1.8.0 numpy; }
mkdir -p "$T/piper-voices"; B=https://huggingface.co/rhasspy/piper-voices/resolve/main/de/de_DE
for v in thorsten/high thorsten_emotional/medium kerstin/low; do n=${v%/*}; q=${v#*/}; f=de_DE-$n-$q
  for x in onnx onnx.json; do [ -s "$T/piper-voices/$f.$x" ] || curl -sSfL -o "$T/piper-voices/$f.$x" "$B/$n/$q/$f.$x"; done
  [ -s "$T/piper-voices/$f.card.md" ] || curl -sSfL -o "$T/piper-voices/$f.card.md" "$B/$n/$q/MODEL_CARD"; done
# 3) v3 production (~22 GB, mostly model weights): image venv + voice venv (system Python only: a uv-managed Python would live in the
#    temporary sandbox HOME and vanish), third-party installs/downloads through the sandbox
S="$R/scripts/sandbox-run.sh"; UV="$(command -v uv)"; CPU=https://download.pytorch.org/whl/cpu
[ -x "$T/gen-venv/bin/python" ] || { "$UV" venv -q --python /usr/bin/python3.13 "$T/gen-venv"
  "$S" --net "$UV" pip install -q --python "$T/gen-venv/bin/python" --index-url $CPU torch==2.14.1
  "$S" --net "$UV" pip install -q --python "$T/gen-venv/bin/python" diffusers==0.42.0 transformers==5.20.2 accelerate==1.15.0 safetensors huggingface_hub pillow numpy; }
[ -x "$T/qwen-venv/bin/python" ] || { "$UV" venv -q --python /usr/bin/python3.12 "$T/qwen-venv"
  "$S" --net "$UV" pip install -q --python "$T/qwen-venv/bin/python" --index-url $CPU torch==2.14.1 torchaudio
  "$S" --net "$UV" pip install -q --python "$T/qwen-venv/bin/python" transformers==4.57.3 accelerate==1.12.0 librosa soundfile sox onnxruntime einops huggingface_hub \
    faster-whisper==1.2.1 ctranslate2==4.8.3 av==19.0.2
  "$S" --net "$UV" pip install -q --python "$T/qwen-venv/bin/python" --no-deps qwen-tts==0.1.1; }
dl() { [ -e "$T/models/$2/.done" ] || { "$S" --net "$T/qwen-venv/bin/python" -c "import sys; from huggingface_hub import snapshot_download as d
d(sys.argv[1], local_dir=sys.argv[2], allow_patterns=sys.argv[3].split(',') if sys.argv[3] else None)" "$1" "$T/models/$2" "${3:-}" && touch "$T/models/$2/.done"; }; }
dl black-forest-labs/FLUX.2-klein-4B flux2-klein-4b "model_index.json,scheduler/*,text_encoder/*,tokenizer/*,transformer/*,vae/*,LICENSE.md,README.md"
dl Systran/faster-whisper-small whisper-small
dl Qwen/Qwen3-TTS-12Hz-1.7B-Base qwen3-tts-base   # new character voices: also Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign -> qwen3-tts-voicedesign
# 4) optional: RTK output compressor (tested, not hooked in): ./scripts/setup_tools.sh --rtk
if [[ "${1:-}" == "--rtk" ]]; then (cd "$V/rtk" && SANDBOX_HOME="$T/rtk-home" "$R/scripts/sandbox-run.sh" --net cargo build --release -q); fi
echo "tools ready: $(ls "$T")"
