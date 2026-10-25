// THE ECHO ARCHIVE — world lock: locations, light, particles, finishing. Shared by all episodes.
const W = 1080, H = 1920;
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
const lerp = (a, b, t) => a + (b - a) * t;
const seq = (u, a, b) => ease((u - a) / (b - a)); // eased 0..1 between times a and b

function rng(seed) { // mulberry32: deterministic per frame/shot
  return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

function grad(id, stops, vertical = true) {
  return `<linearGradient id="${id}" x1="0" y1="0" x2="${vertical ? 0 : 1}" y2="${vertical ? 1 : 0}">${stops.map(([o, c, a = 1]) =>
    `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join("")}</linearGradient>`;
}
function rgrad(id, stops, cx = 0.5, cy = 0.5, r = 0.5) {
  return `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c, a = 1]) =>
    `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join("")}</radialGradient>`;
}

// Archive halls: tall shelves of glowing echo jars, parallax by camX.
function archiveBg(o = {}) {
  const camX = o.camX || 0, dim = o.dim ?? 1, g1 = uid("abg"), g2 = uid("afl");
  let s = `<defs>${grad(g1, [[0, "#070b18"], [0.55, "#121b33"], [1, "#0b0f1d"]])}${grad(g2, [[0, "#1a2340", 0], [1, "#05070f", 1]])}</defs>
    <rect width="${W}" height="${H}" fill="url(#${g1})"/>`;
  for (const [layer, par, col, scale] of [[0, 0.3, "#0f1730", 0.7], [1, 0.65, "#0a1124", 1.0]]) {
    const r = rng(11 + layer);
    const sp = 300 * scale;
    for (let i = -1; i < 6; i++) {
      const x = i * sp + ((camX * par) % sp) + (layer ? 60 : 0);
      s += `<rect x="${x}" y="${300 - 120 * layer}" width="${sp * 0.78}" height="${H}" fill="${col}"/>`;
      for (let row = 0; row < 9; row++) {
        const y = 420 + row * 150 * scale - 120 * layer;
        s += `<rect x="${x}" y="${y}" width="${sp * 0.78}" height="${10 * scale}" fill="#1c2747"/>`;
        for (let j = 0; j < 3; j++) {
          if (r() < 0.45) continue;
          const jx = x + 30 * scale + j * 70 * scale, c = r() < 0.6 ? "#f2c86b" : "#62d6c7";
          const fl = 0.55 + 0.45 * Math.sin((o.t || 0) * (1 + r() * 2) + r() * 6);
          s += `<circle cx="${jx}" cy="${y - 22 * scale}" r="${(20 + r() * 8) * scale}" fill="${c}" opacity="${0.07 * fl * dim}"/>
                <rect x="${jx - 12 * scale}" y="${y - 44 * scale}" width="${24 * scale}" height="${44 * scale}" rx="${6 * scale}" fill="#1a2440" stroke="${c}" stroke-opacity="${0.35 * dim}" stroke-width="2"/>
                <circle cx="${jx}" cy="${y - 20 * scale}" r="${6 * scale}" fill="${c}" opacity="${0.75 * fl * dim}"/>`;
        }
      }
    }
  }
  return s + `<rect y="${H * 0.55}" width="${W}" height="${H * 0.45}" fill="url(#${g2})"/>`;
}

// Archive seal: 7 engraved notches; the 8th exists but only glows when rule eight is touched.
function seal(o = {}) {
  const g = uid("seal"), n8 = o.eighth || 0;
  let s = `<defs>${rgrad(g, [[0, "#b98a45"], [0.7, "#7a5526"], [1, "#3d2a14"]], 0.4, 0.35, 0.7)}</defs>
    <circle r="300" fill="url(#${g})"/><circle r="300" fill="none" stroke="#e0b866" stroke-width="6" opacity="0.6"/>
    <circle r="236" fill="none" stroke="#3a2812" stroke-width="10"/><circle r="150" fill="none" stroke="#3a2812" stroke-width="6"/>
    <g transform="rotate(${o.rot || 0})">`;
  for (let i = 0; i < 8; i++) {
    const lit = i < 7 ? 0.6 + 0.35 * (o.glow || 0) : n8; // 7 lit rules; the 8th slot stays dark unless rule eight is touched
    s += `<g transform="rotate(${i * 45})"><path d="M-20,-290 L20,-290 L0,-232 Z" fill="${i < 7 ? "#2b1d0c" : "#140d06"}"/>
      <path d="M-20,-290 L20,-290 L0,-232 Z" fill="${i < 7 ? "#f2c86b" : "#ff5a3c"}" opacity="${lit}"/>
      ${i < 7 ? `<circle cy="-268" r="26" fill="#f2c86b" opacity="${lit * 0.18}"/>` : ""}</g>`;
  }
  s += `</g><g opacity="0.9">${[40, 80, 120].map((r) => `<circle r="${r}" fill="none" stroke="#2b1d0c" stroke-width="5"/>`).join("")}
    <circle r="16" fill="#2b1d0c"/></g>`;
  return wrap(o, s);
}

function door(o = {}) { // arched vault door; o.open 0..1 slides halves apart; o.sealRot turns the seal
  const op = o.open || 0, gap = op * 360, g = uid("door"), lg = uid("dl");
  return wrap(o, `<defs>${grad(g, [[0, "#3a2c1d"], [1, "#1d150d"]])}${rgrad(lg, [[0, "#fff6dc"], [0.4, "#f2c86b", 0.8], [1, "#f2c86b", 0]])}</defs>
    <path d="M-380,560 L-380,-200 A380,380 0 0 1 380,-200 L380,560 Z" fill="#05060b"/>
    ${op > 0 ? `<ellipse cx="0" cy="100" rx="${200 + 300 * op}" ry="${460 + 200 * op}" fill="url(#${lg})" opacity="${op}"/>` : ""}
    <g transform="translate(${-gap},0)"><path d="M-360,560 L-360,-200 A360,360 0 0 1 0,-560 L0,560 Z" fill="url(#${g})" stroke="#5a4328" stroke-width="6"/></g>
    <g transform="translate(${gap},0)"><path d="M360,560 L360,-200 A360,360 0 0 0 0,-560 L0,560 Z" fill="url(#${g})" stroke="#5a4328" stroke-width="6"/></g>
    ${op < 0.25 ? seal({ y: 0, s: 0.8 * (1 - op * 2), rot: o.sealRot || 0, glow: o.glow, eighth: o.eighth }) : ""}
    <path d="M-400,580 L-400,-200 A400,400 0 0 1 400,-200 L400,580" fill="none" stroke="#2a2016" stroke-width="44"/>`);
}

function motes(t, seed, n, box, col = "#f2c86b", size = 3, op = 0.6) { // drifting dust/echo particles
  const r = rng(seed); let s = "";
  for (let i = 0; i < n; i++) {
    const x0 = box[0] + r() * box[2], y0 = box[1] + r() * box[3], sp = 8 + r() * 25, ph = r() * 6.28;
    const x = x0 + Math.sin(t * 0.6 + ph) * 18, y = box[1] + ((y0 - box[1] - t * sp) % box[3] + box[3]) % box[3];
    s += `<circle cx="${x}" cy="${y}" r="${size * (0.5 + r())}" fill="${col}" opacity="${op * (0.4 + 0.6 * Math.abs(Math.sin(t + ph)))}"/>`;
  }
  return s;
}

function snow(t, seed, n) {
  const r = rng(seed); let s = "";
  for (let i = 0; i < n; i++) {
    const x0 = r() * W, sp = 60 + r() * 120, ph = r() * H, z = 0.4 + r();
    const y = ((ph + t * sp * z) % (H + 40)) - 20, x = x0 + Math.sin(t * 0.8 + i) * 24;
    s += `<circle cx="${x}" cy="${y}" r="${2.5 * z + 1}" fill="#ffffff" opacity="${0.45 + 0.4 * z / 1.4}"/>`;
  }
  return s;
}

function lightCone(x, y, w, h, col = "#f6e3b0", op = 0.25) {
  const g = uid("cone");
  return `<defs>${grad(g, [[0, col, op], [1, col, 0]])}</defs><path d="M${x - 40},${y} L${x + 40},${y} L${x + w / 2},${y + h} L${x - w / 2},${y + h} Z" fill="url(#${g})"/>`;
}

function vignette(strength = 0.75, col = "#000") {
  const g = uid("vig");
  return `<defs>${rgrad(g, [[0.45, col, 0], [1, col, strength]], 0.5, 0.48, 0.75)}</defs><rect width="${W}" height="${H}" fill="url(#${g})"/>`;
}

function camera(inner, zoom = 1, cx = W / 2, cy = H / 2, dx = 0, dy = 0, rot = 0) {
  return `<g transform="translate(${cx + dx},${cy + dy}) rotate(${rot}) scale(${zoom}) translate(${-cx},${-cy})">${inner}</g>`;
}
