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
| 2026-10-25 | Fonts Caveat, Cinzel | google/fonts main (OFL) | pipeline/assets/fonts (in Git) | HTTPS | OK, OFL-Lizenztexte beigelegt |

Bereits vorhanden (nicht installiert): Python 3.13.17, Node 22.22.0, FFmpeg 6.1.1, uv 0.11.32, Docker 29.9.2, Cargo/Rust,
Chromium 153 + Playwright (global), Inter-Font. Hardware: 4 vCPU, 15 GiB RAM, **keine GPU**.

Kaltstart-Test 2026-10-25: `TOOLS_DIR`/`VENDOR_DIR` auf leere Verzeichnisse → 41 s, exit 0, 17/17 Repos am auditierten Commit, SkillSpector + TTS funktionsfähig.

Fehlschläge & Korrekturen: OpenMontage-Install 1. Versuch scheiterte (falscher uv-Pfad), 2. Versuch (`VIRTUAL_ENV` von `env -i` entfernt) → mit `--python` gelöst.
