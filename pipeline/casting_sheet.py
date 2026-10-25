"""Casting sheet for a human listener: one vertical video, per candidate a card (character image, label, description) + its voice.
Usage: python3 pipeline/casting_sheet.py series/echo-archiv/voices/casting.json out.mp4"""
import json, subprocess, sys, tempfile
from pathlib import Path

HERE = Path(__file__).parent
FONT = HERE / "assets" / "fonts" / "Cinzel.ttf"
ROLE = {"nox": "NOX (17)", "mira": "MIRA (18)", "lina": "LINA (Kind, 10)", "erzaehler": "ERZÄHLER"}
REF = {"nox": "look/refs/nox.png", "mira": "look/refs/mira.png", "lina": "look/refs/lina.png", "erzaehler": "episodes/E001/kf/S03.png"}


def esc(t):
    return t.replace("\\", "\\\\").replace(":", "\\:").replace("'", "’").replace("%", "\\%")


def main(spec, out):
    spec = Path(spec)
    series = spec.parent.parent
    parts = []
    with tempfile.TemporaryDirectory() as tmp:
        for i, c in enumerate(json.loads(spec.read_text())["candidates"]):
            wav = spec.parent / "casting" / f"{c['id']}.wav"
            label = f"{ROLE[c['role']]} · {c['id'][-1].upper()}"
            part = Path(tmp) / f"{i:02d}.mp4"
            vf = (f"[1:v]scale=-1:900[img];[0:v][img]overlay=(W-w)/2:260[b];"
                  f"[b]drawtext=fontfile={FONT}:text='{esc(label)}':fontsize=84:fontcolor=0xf2c86b:x=(w-tw)/2:y=1250,"
                  f"drawtext=fontfile={FONT}:text='{esc(c['text'])}':fontsize=34:fontcolor=white:x=(w-tw)/2:y=1400[v]")
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i", "color=c=0x0b0d16:s=1080x1920:r=30",
                            "-i", str(series / REF[c["role"]]), "-i", str(wav), "-filter_complex", vf, "-map", "[v]", "-map", "2:a",
                            "-af", "apad=pad_dur=0.8,aresample=48000", "-shortest", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", str(part)], check=True)
            parts.append(part)
        (Path(tmp) / "list.txt").write_text("".join(f"file '{p}'\n" for p in parts))
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(Path(tmp) / "list.txt"),
                        "-c", "copy", str(out)], check=True)
    print("wrote", out)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
