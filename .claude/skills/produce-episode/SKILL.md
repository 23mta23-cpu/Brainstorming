---
name: produce-episode
description: End-to-end production of one Echo-Archiv TikTok episode (script JSON → story review → scene → TTS/SFX → render → QC → launch draft). Use when asked to write, revise, render or check an episode.
---

# Produce an episode

Paths: `E=series/echo-archiv/episodes/E00X`. Tools must exist: run `scripts/setup_tools.sh` in a fresh container.
Python for pipeline = `/home/user/tools/piper-venv/bin/python` (numpy + piper).

1. **Outline check** — episode must exist in `docs/STORY_BIBLE.md` §6 and its threads in `docs/STORY_TRACKER.md`.
2. **Script** — write `$E/episode.json` (copy schema from E001: hook, micro/macro loop, twist, cliffhanger, plants, cast, shots[]).
   Each shot: `id, min, fn, emotion, visual, camera, line{who,text,pre,post}?, sfx[[name,offset]], cut`.
   SFX names: drone, alarm, whoosh_short, whoosh_down, metal, tick, heart, shimmer, logo, silence (= "Ton bricht ab").
   German speech ≈ 2.5–3 words/s; target 28–40 s; shot avg ≈ 2.3 s, emotional beats longer.
3. **Story review** — run the `story-reviewer` agent on `$E/episode.json`. Fix all BLOCKERS before step 4.
4. **Audio + timeline** — `$PY pipeline/build.py $E --skip-render` → prints duration and per-line lengths; adjust text/`min` until in target.
5. **Scene** — `$E/scene.html`: copy E001 skeleton; one function per shot id in `SHOTS`; draw characters ONLY via
   `characters.js` / `world.js` (never redraw a character inline). Mark off-screen speakers in `OFFSCREEN` (italic captions).
6. **Preview** — stills per shot: `node pipeline/render.mjs $E/scene.html $E/build/timeline.json x 30 1080 1920 --png DIR --times t1,t2,…`,
   tile with `ffmpeg -pattern_type glob -i 'DIR/*.jpg' -vf scale=270:480,tile=7x2 sheet.jpg`, then **look at the sheet** (Read).
   Check: silhouettes readable, captions not covering mouths, text inside safe area (x 110–930, y 220–1480), continuity (Nox: right sleeve navy).
7. **Build** — `$PY pipeline/build.py $E` → `$E/final/*.mp4` + `.qc.json`. QC must be `OVERALL: PASS`.
   `--reuse-video` re-mixes audio without re-rendering.
8. **Shotlist** — `python3 pipeline/shotlist.py $E`.
9. **Creative QC** — frame sheet from the final MP4 + waveform (`showwavespic`); write honest notes in `$E/LAUNCH.md` (what is weak).
10. **Launch draft** — `$E/LAUNCH.md`: title, caption, 3–5 hashtags, pinned comment, AIGC toggle reminder. Never upload. Hand to the human.
11. Update `docs/STORY_TRACKER.md` + `NEXT_SESSION.md`.
