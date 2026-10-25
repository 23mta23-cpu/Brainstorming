"""Procedural sound design (numpy only). Everything is synthesized here, so we own all rights.
Deliberately non-melodic: ambience, impacts, pulses — see docs/CONTENT_POLICY.md (music is an open decision)."""
import numpy as np

SR = 48000
rng = np.random.default_rng(7)


def t(d):
    return np.arange(int(d * SR)) / SR


def env(n, a=0.01, r=0.3):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e


def lowpass(x, cutoff):
    # ponytail: first-order response applied in the frequency domain; scipy.signal if steep filters are ever needed
    f = np.fft.rfftfreq(len(x) * 2, 1 / SR)
    return np.fft.irfft(np.fft.rfft(x, len(x) * 2) / (1 + 1j * f / cutoff))[: len(x)]


def fftconv(a, b):
    n = len(a) + len(b) - 1
    return np.fft.irfft(np.fft.rfft(a, n) * np.fft.rfft(b, n), n)


def reverb(x, secs=1.6, mix=0.35):
    ir = rng.standard_normal(int(secs * SR)) * np.exp(-np.linspace(0, 7, int(secs * SR)))
    wet = fftconv(x, ir)
    wet /= np.abs(wet).max() + 1e-9
    dry = np.pad(x, (0, len(wet) - len(x)))
    return (1 - mix) * dry + mix * wet * np.abs(x).max()


def drone(d):
    tt = t(d)
    lfo = 0.5 + 0.5 * np.sin(2 * np.pi * 0.11 * tt)
    hum = 0.5 * np.sin(2 * np.pi * 49 * tt) + 0.25 * np.sin(2 * np.pi * 73.5 * tt + 1)
    air = lowpass(rng.standard_normal(len(tt)), 300) * 3
    return (hum * (0.6 + 0.4 * lfo) + air * 0.25) * env(len(tt), 1.5, 1.5) * 0.18


def alarm(d, rate=2.0):
    tt = t(d)
    pulse = (np.sin(2 * np.pi * rate * tt) > 0).astype(float)
    pulse = lowpass(pulse, 30)
    tone = np.tanh(3 * np.sin(2 * np.pi * 196 * tt)) * 0.5
    return lowpass(tone, 1200) * pulse * env(len(tt), 0.02, 0.2) * 0.35


def metal_echo(d=2.5):
    tt = t(d)
    partials = [(211, 1.0), (523, 0.6), (871, 0.45), (1297, 0.3), (1840, 0.2)]  # inharmonic = metal, not a chord
    x = sum(a * np.sin(2 * np.pi * f * tt) * np.exp(-tt * (2 + f / 400)) for f, a in partials)
    x[: int(0.01 * SR)] += rng.standard_normal(int(0.01 * SR)) * 0.8
    return reverb(x * 0.5, 2.2, 0.5)[: len(tt)]


def whoosh(d=0.8, up=True):
    tt = t(d)
    n = rng.standard_normal(len(tt))
    sweep = np.linspace(200, 3000, len(tt)) if up else np.linspace(3000, 200, len(tt))
    # band-ish: difference of two lowpasses, cutoff moves in blocks
    out = np.zeros_like(n)
    blk = 960
    for i in range(0, len(n), blk):
        c = sweep[i]
        seg = n[i:i + blk]
        out[i:i + blk] = lowpass(seg, c) - lowpass(seg, c * 0.4)
    return out * np.sin(np.pi * np.linspace(0, 1, len(tt))) ** 2 * 1.2


def heartbeat(beats=3, bpm=58):
    period = 60 / bpm
    out = np.zeros(int((beats * period + 0.5) * SR))
    th = t(0.18)
    thump = np.sin(2 * np.pi * 52 * th) * np.exp(-th * 22)
    for b in range(beats):
        for off, g in [(0, 1.0), (0.24, 0.6)]:
            i = int((b * period + off) * SR)
            out[i:i + len(thump)] += thump * g
    return out * 0.9


def shimmer(d=2.5, density=40):
    tt = t(d)
    out = np.zeros(len(tt))
    g = t(0.12)
    for _ in range(int(density * d)):
        i = rng.integers(0, len(tt) - len(g))
        f = rng.uniform(2500, 6000)
        out[i:i + len(g)] += np.sin(2 * np.pi * f * g) * np.hanning(len(g)) * rng.uniform(0.05, 0.15)
    return reverb(out, 1.0, 0.4)[: len(tt)] * env(len(tt), 0.3, 0.8)


def tick(n=6, interval=0.5):
    out = np.zeros(int((n * interval + 0.2) * SR))
    c = t(0.015)
    click = np.sin(2 * np.pi * 3200 * c) * np.exp(-c * 400)
    for k in range(n):
        i = int(k * interval * SR); out[i:i + len(click)] += click * 0.3
    return out


def echo_logo():
    """Audio logo: reversed swell into a soft ping that repeats and fades (the 'echo')."""
    ping_t = t(1.2)
    ping = sum(a * np.sin(2 * np.pi * f * ping_t) for f, a in [(880, 1), (1318.5, 0.35)]) * np.exp(-ping_t * 5)
    swell = reverb(ping, 1.2, 0.9)[::-1][: int(0.9 * SR)] * 0.5
    tail = np.zeros(int(2.4 * SR))
    for k, g in enumerate([1, 0.45, 0.2, 0.08]):
        i = int(k * 0.38 * SR); tail[i:i + len(ping)] += ping[: len(tail) - i] * g
    return np.concatenate([swell, tail]) * 0.5


if __name__ == "__main__":
    for name, x in [("drone", drone(3)), ("alarm", alarm(1)), ("metal", metal_echo()), ("whoosh", whoosh()),
                    ("heart", heartbeat()), ("shimmer", shimmer()), ("tick", tick()), ("logo", echo_logo())]:
        assert np.isfinite(x).all() and len(x) > 0, name
        assert np.abs(x).max() < 4, (name, np.abs(x).max())
    print("sfx ok")
