"""Timecoded shotlist from episode.json + build/timeline.json (real durations after TTS).
Usage: python3 pipeline/shotlist.py series/echo-archiv/episodes/E001  -> writes SHOTLIST.md in that folder"""
import json, sys
from pathlib import Path

d = Path(sys.argv[1])
ep = json.load(open(d / "episode.json"))
tl = json.load(open(d / "build" / "timeline.json"))
times = {s["id"]: s for s in tl["shots"]}
lines = {l["shot"]: l for l in tl["lines"]}
tc = lambda t: f"{int(t // 60)}:{t % 60:05.2f}"
out = [f"# {ep['episode_id']} – {ep['title']} · Shotlist", "",
       f"Generiert aus `episode.json` + `build/timeline.json`. Gesamtdauer **{tl['duration']:.2f} s**, {len(tl['shots'])} Shots. "
       "Zeiten sind die realen Werte nach TTS (nicht geschätzt).", "",
       "| # | Zeitcode | Dauer | Bild | Kamera | Dialog / VO | Audio | Funktion | Emotion | Schnitt |",
       "|---|---|---|---|---|---|---|---|---|---|"]
for s in ep["shots"]:
    t, l = times[s["id"]], lines.get(s["id"])
    vo = f"**{l['who']}** ({tc(l['start'])}): „{l['text']}“" if l else (f"Text: „{s['onscreen_text']}“" if s.get("onscreen_text") else "—")
    sfx = ", ".join(n for n, _ in s.get("sfx", [])) or "Bett"
    out.append(f"| {s['id']} | {tc(t['start'])}–{tc(t['end'])} | {t['end'] - t['start']:.2f}s | {s['visual']} | {s['camera']} | {vo} | {sfx} "
               f"| {s['fn']} | {s['emotion']} | {s['cut']} |")
out += ["", "## Kontinuität", "", "- Figuren nur über `series/echo-archiv/characters/characters.js` (Character Lock).",
        "- Nox: rechter Ärmel navy, linker ocker; gebrochener Kreis am linken Kragen.",
        "- Lina-Motivfarbe Rot (Schal, Sekundenzeiger der Uhr).", ""]
(d / "SHOTLIST.md").write_text("\n".join(out), encoding="utf-8")
print(f"wrote {d / 'SHOTLIST.md'}")
