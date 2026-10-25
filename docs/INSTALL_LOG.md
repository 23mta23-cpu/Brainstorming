# Install Log

Alle Installationen projektlokal/isoliert unter `/home/user/tools` bzw. `/home/user/vendor` (außerhalb Git). Container ist flüchtig →
Wiederherstellung: `scripts/setup_tools.sh` (+ `--rtk`).

| Datum | Komponente | Version / Commit | Ort | Methode | Ergebnis |
|---|---|---|---|---|---|
| 2026-10-25 | 17 Repositories | siehe `scripts/fetch_repos.sh` | /home/user/vendor | `git clone --depth 1` (keine Submodule) | OK, 1,3 GB |
| 2026-10-25 | SkillSpector | 2.12.0 @ d7338f5 | tools/skillspector-venv | `uv pip install` aus geprüftem Clone | OK, `--version` + 11 Scans |
| 2026-10-25 | Piper TTS | piper-tts 1.8.0 (PyPI, piper1-gpl, GPL-3.0) | tools/piper-venv | `uv pip install` | OK |
| 2026-10-25 | Piper-Stimmen (de_DE) | thorsten-high, thorsten_emotional-medium, kerstin-low (genutzt); mls, eva_k, karlsson, ramona, pavoque (nur evaluiert) | tools/piper-voices | HTTPS von huggingface.co/rhasspy/piper-voices | OK; Model Cards abgelegt |
| 2026-10-25 | RTK | @ 32b2ec4 | vendor/rtk/target/release/rtk | `cargo build --release` via sandbox-run | OK, 15,6 MB; nicht als Hook aktiviert |
| 2026-10-25 | OpenMontage-Deps | requirements(-dev).txt @ e01dbf4 | tools/om-venv | `uv pip install` via sandbox-run | OK; 1328 Tests grün |
| 2026-10-25 | PyTorch CPU + diffusers 0.42 + transformers 5.20 | torch 2.14.1+cpu | tools/gen-venv | `uv pip` (Sandbox) | OK; `Flux2KleinPipeline` |
| 2026-10-25 | FLUX.2-klein-4B (Apache-2.0) | HF black-forest-labs/FLUX.2-klein-4B (diffusers-Komponenten, 15 GB) | tools/models/flux2-klein-4b | `snapshot_download` (Sandbox) | OK, 65 s/Bild |
| 2026-10-25 | Chatterbox Multilingual (MIT) | chatterbox-tts 0.1.7 `--no-deps` + Deps ohne gradio; Gewichte t3_mtl23ls_v2, s3gen, ve (3 GB) | tools/tts2-venv (Python 3.14), tools/models/chatterbox | `uv pip` (Sandbox) | OK |
| 2026-10-25 | faster-whisper + Systran/faster-whisper-small (MIT) | 464 MB | tts2-venv, tools/models/whisper-small | `uv pip` / `snapshot_download` | OK (ASR-QC) |
| 2026-10-25 | Qwen3-TTS (Apache-2.0, Modellquelle aus VoiceStudio-Liste; VoiceStudio selbst AGPL → nicht genutzt) | qwen-tts 0.1.1 `--no-deps` + torch 2.14.1+cpu, transformers 4.57.3, accelerate 1.12.0, librosa, soundfile, sox, onnxruntime, einops | tools/qwen-venv (Python 3.12, 1,4 GB) | `uv pip` (Sandbox) | OK |
| 2026-10-25 | Qwen3-TTS-12Hz-1.7B-VoiceDesign | HF Qwen/… (4,3 GB) | tools/models/qwen3-tts-voicedesign | `snapshot_download` (Sandbox) | OK; 12 Casting-Stimmen entworfen, danach **gelöscht** (Platz; neu ladbar für neue Figuren) |
| 2026-10-25 | Qwen3-TTS-12Hz-1.7B-Base (Klon) | HF Qwen/… (4,3 GB) | tools/models/qwen3-tts-base | `snapshot_download` (Sandbox) | OK; spricht alle Zeilen mit den gewählten Casting-Stimmen |
| 2026-10-25 | Chatterbox-Gewichte + tts2-venv | — | tools/models/chatterbox, tools/tts2-venv | — | **gelöscht** (ersetzt durch Qwen3-TTS). tts2-venv war defekt: sein Python 3.14 lag im temporären Sandbox-HOME und verschwand beim Aufräumen |
| 2026-10-25 | faster-whisper 1.2.1, ctranslate2 4.8.3, av 19.0.2 | PyPI | tools/qwen-venv | `uv pip` (Sandbox) | OK; Whisper-QC + Take-Auswahl jetzt im Stimm-venv |
| 2026-10-25 | Fonts Caveat, Cinzel | google/fonts main (OFL) | pipeline/assets/fonts (in Git) | HTTPS | OK, OFL-Lizenztexte beigelegt |

Bereits vorhanden (nicht installiert): Python 3.13.17, Node 22.22.0, FFmpeg 6.1.1, uv 0.11.32, Docker 29.9.2, Cargo/Rust,
Chromium 153 + Playwright (global), Inter-Font. Hardware: 4 vCPU, 15 GiB RAM, **keine GPU**.

Kaltstart-Test 2026-10-25: `TOOLS_DIR`/`VENDOR_DIR` auf leere Verzeichnisse → 41 s, exit 0, 17/17 Repos am auditierten Commit, SkillSpector + TTS funktionsfähig.

Platzmanagement (24 GB Kontingent): gelöscht wurden nur reproduzierbare Dinge — RTK-`target/` (neu baubar), uv-Cache, OpenMontage-Test-venv,
die 17 Vendor-Klone (per `scripts/fetch_repos.sh` exakt wiederherstellbar; SkillSpector läuft aus eigenem venv), Qwen-VoiceDesign- und Chatterbox-Gewichte.
Regel: venvs nur mit System-Python (`/usr/bin/python3.x`) anlegen, nie per uv-Python im Sandbox-HOME.
`scripts/sandbox-run.sh` ließ je Lauf ein temporäres HOME (pip/HF-Caches) in /tmp zurück → räumt jetzt selbst auf.

Fehlschläge & Korrekturen: OpenMontage-Install 1. Versuch scheiterte (falscher uv-Pfad), 2. Versuch (`VIRTUAL_ENV` von `env -i` entfernt) → mit `--python` gelöst.
