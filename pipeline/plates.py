"""Keyframes -> render plates. Run with the image venv (numpy + PIL).
- upscale every kf/<id>.png (720x1280) to plates/<id>.jpg at 1188x2112 (10 % headroom for camera moves), Lanczos + unsharp
- for kf entries with "patch": diff against the base keyframe, keep only the strongest connected change region
  (mouth/eyes) - inside a window around "at" [x, y] (keyframe px) when given, so drift elsewhere (e.g. the other face)
  is ignored - feather it, write plates/<id>.png as RGBA overlay. Global drift (region too large) -> no patch, warning.
- "patch": "fix" = permanent local retouch (expression, artefact): the edit replaces a feathered disk ("at", radius "r")
  of the base plate.
Usage: /home/user/tools/gen-venv/bin/python pipeline/plates.py series/echo-archiv/episodes/E001"""
import json, sys
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SIZE = (1188, 2112)
CELL = 16          # coarse grid for region growing
MAX_AREA = 0.06    # a mouth/eye change should cover well under 6 % of the frame
WINDOW = 70        # keyframe px around "at": a mouth plus a little jaw


def upscale(im, dst):
    f = SIZE[0] / 720  # keyframes are 720 wide; inserts (e.g. a photo) keep their own aspect ratio
    im = im.convert("RGB").resize((round(im.width * f), round(im.height * f)), Image.LANCZOS)
    im.filter(ImageFilter.UnsharpMask(radius=1.6, percent=70, threshold=2)).save(dst, quality=92)


def disk(size, at, r):
    m = Image.new("L", size, 0)
    ImageDraw.Draw(m).ellipse([at[0] - r * 0.8, at[1] - r * 0.8, at[0] + r * 0.8, at[1] + r * 0.8], fill=255)
    return m.filter(ImageFilter.GaussianBlur(r * 0.2))


def change_mask(base, var, at=None):
    a = np.asarray(base.convert("RGB"), np.float32)
    b = np.asarray(var.convert("RGB"), np.float32)
    d = np.abs(a - b).mean(axis=2)
    d = np.asarray(Image.fromarray(d.astype(np.uint8)).filter(ImageFilter.GaussianBlur(3)), np.float32)
    gh, gw = d.shape[0] // CELL, d.shape[1] // CELL
    energy = d[: gh * CELL, : gw * CELL].reshape(gh, CELL, gw, CELL).mean(axis=(1, 3))
    if at:  # only the speaker's mouth may change
        yy, xx = np.mgrid[:gh, :gw]
        energy[np.hypot((xx + 0.5) * CELL - at[0], (yy + 0.5) * CELL - at[1]) > WINDOW] = 0
    thr = max(10.0, energy.mean() + 3 * energy.std())
    seed = np.unravel_index(np.argmax(energy), energy.shape)
    region, q = np.zeros_like(energy, bool), deque([seed])
    while q:  # 4-connected growth from the strongest change cell
        y, x = q.popleft()
        if not (0 <= y < gh and 0 <= x < gw) or region[y, x] or energy[y, x] < thr * 0.5:
            continue
        region[y, x] = True
        q.extend([(y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)])
    area = region.mean()
    m = np.kron(region, np.ones((CELL, CELL))).astype(np.float32)
    full = np.zeros(d.shape, np.float32)
    full[: m.shape[0], : m.shape[1]] = m
    alpha = Image.fromarray((full * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(10))
    return alpha, area


def main(epdir):
    epdir = Path(epdir)
    ep = json.loads((epdir / "episode.json").read_text())
    (epdir / "plates").mkdir(exist_ok=True)
    report = {}
    for s in ep["shots"]:
        for k in s.get("kf", []):
            src = epdir / "kf" / f"{k['id']}.png"
            if not src.exists():
                report[k["id"]] = "missing keyframe"
                continue
            if k.get("patch") == "fix":
                base = Image.open(epdir / "kf" / f"{k['edit_of']}.png").convert("RGB")
                upscale(Image.composite(Image.open(src).convert("RGB"), base, disk(base.size, k["at"], k.get("r", WINDOW))),
                        epdir / "plates" / f"{k['edit_of']}.jpg")  # replaces the base plate written just before
                report[k["id"]] = f"fix of {k['edit_of']} at {k['at']}"
            elif "patch" in k:
                alpha, area = change_mask(Image.open(epdir / "kf" / f"{k['edit_of']}.png"), Image.open(src), k.get("at"))
                if area > MAX_AREA:
                    report[k["id"]] = f"skipped: change covers {area:.0%} of frame (edit drifted)"
                    continue
                var = Image.open(src).convert("RGB")
                rgba = var.resize(SIZE, Image.LANCZOS).convert("RGBA")
                rgba.putalpha(alpha.resize(SIZE, Image.LANCZOS))
                rgba.save(epdir / "plates" / f"{k['id']}.png")
                report[k["id"]] = f"patch {area:.1%}"
            else:
                upscale(Image.open(src), epdir / "plates" / f"{k['id']}.jpg")
                report[k["id"]] = "plate"
    (epdir / "plates" / "report.json").write_text(json.dumps(report, indent=1))
    for k, v in report.items():
        print(f"{k:6} {v}")


def selftest():
    base = Image.new("RGB", (720, 1280), (40, 60, 80))
    var = base.copy()
    var.paste((200, 90, 90), (240, 430, 280, 460))   # "mouth" opens
    var.paste((250, 250, 250), (500, 200, 600, 300))  # drift on the other face (bigger change)
    _, a_all = change_mask(base, var)
    alpha, a_win = change_mask(base, var, [260, 445])
    ys, xs = np.nonzero(np.asarray(alpha) > 128)
    assert a_win < a_all and xs.max() < 400 and ys.min() > 300, (a_win, a_all)  # window keeps only the mouth
    print("selftest ok")


if __name__ == "__main__":
    selftest() if sys.argv[1] == "--selftest" else main(sys.argv[1])
