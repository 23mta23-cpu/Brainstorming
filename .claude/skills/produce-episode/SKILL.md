---
name: produce-episode
description: End-to-end production of one Echo-Archiv TikTok episode (script JSON → story review → voices → keyframes → overlays → render → QC → launch draft). Use when asked to write, revise, render or check an episode.
---

# Produce an episode (v3: local AI keyframes + overlays, 0 €)

Paths: `E=series/echo-archiv/episodes/E00X`. Fresh container: `scripts/setup_tools.sh`. Never run image generation and TTS at the same time (RAM).
`PY=/home/user/tools/piper-venv/bin/python` · `GEN=/home/user/tools/gen-venv/bin/python` · `VOX=/home/user/tools/qwen-venv/bin/python`

1. **Outline check** — episode in `docs/SERIEN_HANDBUCH.md` §6, threads in `docs/STORY_TRACKER.md`.
2. **Script** — `$E/episode.json`, schema = E001/E002 (hook, decision, micro/macro loop, twist, cliffhanger, plants, cast, shots[]).
   Shot: `id, min, fn, emotion, visual, camera, line{who,text,pre,takes?}, kf[], plate_of?, motion{zoom,x,y,shake,from,to}, fx[], fx_at{}, fx_txt[], fx_img{}, talk{}, cap_y?, sfx, cut`.
   - First line must END ≤ 1.8 s (QC). German ~3.5–4.5 syllables/s; target 55–70 s.
   - Every keyframe showing a hand/face of a character gets that character's ref (`refs`) — without it the model invents a stranger.
   - Story props that must be exact (counts, text, signs, photos) are **overlays**, not prompts: `notches`, `pin`, `texts` (`fx_txt`: handwriting/stamp/labels), `photo` (`fx_img`), `engraving`, `handwriting`. Prompt the surface blank.
   - Mouth flaps: `kf` entry `{"id":"S05m","edit_of":"S05","patch":"mouth","at":[x,y]}` + `talk:{"mira":"S05m"}`.
3. **Story review** — `story-reviewer` agent; fix all BLOCKERS (re-review via the same agent) before any audio/image work.
4. **Voices** — `$PY pipeline/build.py $E --skip-render` (Qwen3-TTS clone of the cast clips in `voices/casting/`, sandboxed; 4 takes, Whisper picks + trims; new character = `voice_design.py` casting, Co-CEO picks) → `$VOX pipeline/asr_check.py $E` must be 15/15-style OK; listen-check list for the human.
5. **Keyframes** — `python3 pipeline/keyframes.py $E` (one batch; ~20 min cold load + 1.5–4.5 min per image). **Look at every image**:
   identity vs `look/refs`, location, props, policy. Reject = move the file away, fix prompt/refs, re-run (resumable).
   Cheap repairs: camera crop (`motion`), `patch:"fix"` (edit + soft disk; works for expressions, not for removing objects), `clone` (classic clone stamp).
6. **Calibrate overlays** in keyframe pixels (crop with a grid to read coordinates), then `$GEN pipeline/plates.py $E` (check report: patches skipped?).
7. **Preview** — `$PY pipeline/build.py $E --skip-render`, then `node pipeline/render.mjs series/echo-archiv/scene.html $E/build/timeline.json x 30 1080 1920 --times t1,… --png DIR`;
   tile and **look**: captions not on key images (`cap_y`), text in safe area (x 110–930, y 220–1480), overlays sit on their surfaces.
8. **Build** — `$PY pipeline/build.py $E` → `$E/final/*.mp4` + `.qc.json`, QC `OVERALL: PASS`; then `$VOX pipeline/asr_check.py $E`.
9. **Shotlist** — `python3 pipeline/shotlist.py $E`. **Creative QC** — frame sheet from the final MP4; honest notes.
10. **Launch draft** — `$E/LAUNCH.md` (caption, 3–5 hashtags, pinned comment, AIGC toggle, credits, weaknesses, listen-first list). Never upload.
11. Update `docs/STORY_TRACKER.md`, `docs/QUALITY_STANDARDS.md`, `NEXT_SESSION.md`; commit + push after every block.
