// THE ECHO ARCHIVE — character lock. Every episode draws characters ONLY through these functions,
// so silhouettes, palettes and costumes cannot drift between shots or episodes.
// Local coords: head centre = (0,0), head height ~220 units. Facing camera unless noted.
// Continuity: Nox' coat is navy on HIS right side (viewer's left when facing us), ochre on his left.

const PAL = {
  ink: "#141826",
  nox: { skin: "#ecc9aa", skinSh: "#c99a7c", hair: "#1b2031", hairHi: "#3b4664", navy: "#243352", navySh: "#18233b",
         ochre: "#c8924a", ochreSh: "#9b6c32", shirt: "#e9e1d0", gold: "#e6bb5e", iris: "#4b3526" },
  mira: { skin: "#b9805f", skinSh: "#94603f", hair: "#1f1519", hairHi: "#4a3138", teal: "#1f5653", tealSh: "#143c3a",
          plate: "#e8dcc0", plateSh: "#b9a988", silver: "#d5dde3", iris: "#3a2418",
          glove: "#2b3038", gloveHi: "#4a525e" }, // archivists wear gloves (rule 2); Nox' bare hand = rule-breaking
  lina: { skin: "#f0cfb3", skinSh: "#cfa184", hair: "#4a2d20", scarf: "#c8362d", scarfSh: "#8f231d", coat: "#e9e2d4",
          coatSh: "#bdb3a2", iris: "#5a3a26" },
  pip: { brass: "#d1a84e", brassSh: "#8d6a28", glass: "#f4ecd6", needle: "#c8362d" },
  echo: "#f2c86b",
};

let _uid = 0;
const uid = (p) => `${p}${++_uid}`;
const resetUid = () => { _uid = 0; };

function eyes(o, c) {
  const open = Math.max(0, 1 - (o.blink || 0));
  const [lx, ly] = o.look || [0, 0];
  const blank = o.blank || 0; // 0 = normal, 1 = memory gone (iris greys out, pupil shrinks)
  let s = "";
  for (const side of [-1, 1]) {
    const cx = side * c.sep, id = uid("eye");
    const ry = Math.max(1.6, c.ry * open);
    const irisCol = blank ? mixCol(c.iris, "#9aa3ad", blank) : c.iris;
    s += `<g transform="translate(${cx},${c.y})">
      <clipPath id="${id}"><ellipse rx="${c.rx}" ry="${ry}"/></clipPath>
      <ellipse rx="${c.rx}" ry="${ry}" fill="#fbf7ef"/>
      <g clip-path="url(#${id})">
        <circle cx="${lx * c.rx * 0.42}" cy="${ly * c.ry * 0.3 + 2}" r="${c.rx * 0.78}" fill="${irisCol}"/>
        <circle cx="${lx * c.rx * 0.42}" cy="${ly * c.ry * 0.3 + 2}" r="${c.rx * (0.4 - 0.18 * blank)}" fill="#0f0b09"/>
        <circle cx="${lx * c.rx * 0.42 - c.rx * 0.28}" cy="${ly * c.ry * 0.3 - c.ry * 0.28}" r="${c.rx * 0.24}" fill="#fff" opacity="${1 - blank * 0.7}"/>
        ${o.wet ? `<ellipse cx="${lx * c.rx * 0.42 + c.rx * 0.2}" cy="${c.ry * 0.45}" rx="${c.rx * 0.5}" ry="${c.ry * 0.16}" fill="#fff" opacity="${0.55 * o.wet}"/>` : ""}
      </g>
      <path d="M${-c.rx - 3},${-ry * 0.15} Q0,${-ry - 7} ${c.rx + 3},${-ry * 0.15}" fill="none" stroke="${PAL.ink}" stroke-width="${c.lid}" stroke-linecap="round"/>
      ${c.lash ? `<path d="M${side * (c.rx + 2)},${-ry * 0.2} l${side * 9},-7" stroke="${PAL.ink}" stroke-width="4" stroke-linecap="round"/>` : ""}
    </g>`;
    const b = o.brow || 0, inner = -b * 9;
    s += `<path d="M${cx - side * c.rx * 0.95},${c.y - c.ry - 14 + inner} Q${cx},${c.y - c.ry - 24 + inner * 0.4} ${cx + side * c.rx * 1.05},${c.y - c.ry - 14 - inner * 0.3}"
      fill="none" stroke="${c.browCol}" stroke-width="${c.browW}" stroke-linecap="round"/>`;
  }
  return s;
}

function mouth(o, y, col, w = 16) {
  const m = o.mouth || 0;
  if (m < 0.08) {
    const sm = o.smile || 0;
    return `<path d="M${-w},${y} Q0,${y + sm * 10} ${w},${y}" fill="none" stroke="${col}" stroke-width="4.5" stroke-linecap="round"/>`;
  }
  return `<ellipse cx="0" cy="${y + 3}" rx="${w * (0.65 + 0.35 * m)}" ry="${3 + 13 * m}" fill="#4a1d22"/>
          <ellipse cx="0" cy="${y + 7 + 9 * m}" rx="${w * 0.45}" ry="${2 + 4 * m}" fill="#b5545a" opacity="0.8"/>`;
}

function mixCol(a, b, t) {
  const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return "#" + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, "0")).join("");
}

function wrap(o, inner) {
  return `<g transform="translate(${o.x || 0},${o.y || 0}) rotate(${o.rot || 0}) scale(${(o.flip ? -1 : 1) * (o.s || 1)},${o.s || 1})">${inner}</g>`;
}

const FACE = "M-90,-12 C-90,-82 -50,-112 0,-112 C50,-112 90,-82 90,-12 C90,48 52,100 0,110 C-52,100 -90,48 -90,-12 Z";

// ---------- NOX ----------
function noxHead(o) {
  const P = PAL.nox, gid = uid("nsk");
  return `<g transform="rotate(${o.tilt || 0})">
    <defs><linearGradient id="${gid}" x1="0" x2="1"><stop offset="0.55" stop-color="${P.skin}"/><stop offset="1" stop-color="${P.skinSh}"/></linearGradient></defs>
    <ellipse cx="0" cy="-30" rx="104" ry="100" fill="${P.hair}"/>
    <ellipse cx="-90" cy="8" rx="13" ry="22" fill="${P.skinSh}"/><ellipse cx="90" cy="8" rx="13" ry="22" fill="${P.skinSh}"/>
    <path d="${FACE}" fill="url(#${gid})"/>
    <ellipse cx="-46" cy="50" rx="16" ry="8" fill="#e59a86" opacity="0.35"/><ellipse cx="46" cy="50" rx="16" ry="8" fill="#e59a86" opacity="0.35"/>
    ${eyes(o, { sep: 40, y: 10, rx: 19, ry: 24, iris: P.iris, lid: 5, browCol: P.hair, browW: 7 })}
    <path d="M3,30 q7,10 -3,15" fill="none" stroke="${P.skinSh}" stroke-width="4" stroke-linecap="round"/>
    ${mouth(o, 70, "#8a4b45", 15)}
    <path d="M-100,-20 C-108,-104 -38,-136 12,-130 C74,-124 108,-86 100,-18 L90,-34 L84,16 L68,-40 L50,24 L36,-50 L12,-24 L-6,-62 L-34,-34 L-52,-62 L-76,-26 L-84,-56 Z" fill="${P.hair}"/>
    <path d="M-60,-108 C-20,-126 40,-124 70,-100" fill="none" stroke="${P.hairHi}" stroke-width="6" stroke-linecap="round" opacity="0.8"/>
  </g>`;
}

function noxBody(o) {
  const P = PAL.nox;
  // sleeves: his right arm = viewer's left = navy
  return `<g>
    <rect x="-26" y="88" width="52" height="80" fill="${P.skinSh}"/>
    <path d="M-62,150 C-125,160 -172,192 -188,262 L-204,640 L0,640 L0,150 Z" fill="${P.navy}"/>
    <path d="M62,150 C125,160 172,192 188,262 L204,640 L0,640 L0,150 Z" fill="${P.ochre}"/>
    <path d="M-188,262 C-214,330 -222,480 -214,600 L-168,610 C-170,480 -160,360 -150,300 Z" fill="${P.navySh}"/>
    <path d="M188,262 C214,330 222,480 214,600 L168,610 C170,480 160,360 150,300 Z" fill="${P.ochreSh}"/>
    <path d="M-40,150 L0,236 L40,150 Z" fill="${P.shirt}"/>
    <path d="M-62,150 L-16,268 L-104,214 Z" fill="${P.navySh}"/><path d="M62,150 L16,268 L104,214 Z" fill="${P.ochreSh}"/>
    <line x1="0" y1="238" x2="0" y2="640" stroke="#efe2c0" stroke-width="3" stroke-dasharray="10 8" opacity="0.7"/>
    <circle cx="74" cy="208" r="14" fill="none" stroke="${P.gold}" stroke-width="5" stroke-dasharray="66 22" transform="rotate(-40 74 208)"/>
  </g>`;
}

function noxCasual() { // before the Archive (childhood photos/visions): no archive coat, no insignia; colour bridge navy + ochre
  const P = PAL.nox;
  return `<g><rect x="-26" y="88" width="52" height="80" fill="${P.skinSh}"/>
    <path d="M-60,150 C-120,160 -166,192 -180,262 L-196,640 L196,640 L180,262 C166,192 120,160 60,150 Z" fill="${P.navy}"/>
    <path d="M-180,262 C-204,330 -212,480 -204,600 L-160,610 C-162,480 -152,360 -144,300 Z" fill="${P.navySh}"/>
    <path d="M-70,128 C-30,156 30,156 70,128 L76,166 C30,190 -30,190 -76,166 Z" fill="${P.ochre}"/>
    <path d="M30,170 L52,260 L30,264 L16,176 Z" fill="${P.ochreSh}"/></g>`;
}

function nox(o = {}) { return wrap(o, (o.noBody ? "" : o.casual ? noxCasual() : noxBody(o)) + noxHead(o)); }

function noxBack(o = {}) { // seen from behind: navy now on viewer's RIGHT
  const P = PAL.nox;
  return wrap(o, `<rect x="-26" y="88" width="52" height="80" fill="${P.skinSh}"/>
    <path d="M62,150 C125,160 172,192 188,262 L204,640 L0,640 L0,150 Z" fill="${P.navy}"/>
    <path d="M-62,150 C-125,160 -172,192 -188,262 L-204,640 L0,640 L0,150 Z" fill="${P.ochre}"/>
    <path d="M-66,148 C-30,170 30,170 66,148 L60,190 C20,206 -20,206 -60,190 Z" fill="${P.ochreSh}" opacity="0.6"/>
    <line x1="0" y1="190" x2="0" y2="640" stroke="#efe2c0" stroke-width="3" stroke-dasharray="10 8" opacity="0.7"/>
    <ellipse cx="0" cy="-20" rx="104" ry="112" fill="${P.hair}"/>
    <path d="M-80,60 L-60,100 L-30,72 L0,108 L30,74 L58,102 L82,58 Z" fill="${P.hair}"/>
    <path d="M-50,-100 C-10,-122 40,-118 70,-92" fill="none" stroke="${P.hairHi}" stroke-width="6" stroke-linecap="round"/>`);
}

function noxHand(o = {}) { // right hand reaching right, navy sleeve; fingertip at local (215,-6)
  const P = PAL.nox;
  return wrap(o, `<path d="M-260,-60 L-40,-52 L-34,52 L-260,62 Z" fill="${P.navy}"/>
    <path d="M-48,-54 L-30,-54 L-26,54 L-44,54 Z" fill="${P.gold}" opacity="0.85"/>
    <path d="M-30,-40 C20,-58 90,-46 120,-30 C150,-26 190,-22 212,-14 C226,-8 222,6 208,6 L126,2
             C132,14 128,30 112,34 C92,52 40,58 -26,44 Z" fill="${P.skin}"/>
    <path d="M60,20 C80,22 100,24 112,30" fill="none" stroke="${P.skinSh}" stroke-width="4" stroke-linecap="round"/>
    <path d="M126,2 C150,4 170,8 186,6" fill="none" stroke="${P.skinSh}" stroke-width="3"/>
    <path d="M20,-50 C60,-60 100,-48 118,-34" fill="none" stroke="${P.skinSh}" stroke-width="3" opacity="0.6"/>`);
}

// ---------- MIRA ----------
function miraHead(o) {
  const P = PAL.mira, gid = uid("msk");
  const tear = o.tear ? `<path d="M${-40 + 6},${40} q-6,${30 * o.tear} 2,${70 * o.tear}" fill="none" stroke="#e8f4ff" stroke-width="6" stroke-linecap="round" opacity="0.85"/>
    <circle cx="${-36}" cy="${40 + 72 * o.tear}" r="${5 + 2 * o.tear}" fill="#f2f9ff" opacity="0.9"/>` : "";
  return `<g transform="rotate(${o.tilt || 0})">
    <defs><linearGradient id="${gid}" x1="0" x2="1"><stop offset="0.55" stop-color="${P.skin}"/><stop offset="1" stop-color="${P.skinSh}"/></linearGradient></defs>
    <path d="M-112,-30 C-116,-166 116,-166 112,-30 L112,96 L64,96 L64,54 L-64,54 L-64,96 L-112,96 Z" fill="${P.hair}"/>
    <path d="${FACE}" fill="url(#${gid})"/>
    <ellipse cx="-44" cy="52" rx="15" ry="7" fill="#d9776a" opacity="0.3"/><ellipse cx="44" cy="52" rx="15" ry="7" fill="#d9776a" opacity="0.3"/>
    ${eyes(o, { sep: 39, y: 12, rx: 17, ry: 21, iris: P.iris, lid: 6, lash: true, browCol: P.hair, browW: 6 })}
    ${tear}
    <path d="M3,32 q6,9 -3,13" fill="none" stroke="${P.skinSh}" stroke-width="4" stroke-linecap="round"/>
    ${mouth(o, 70, "#6e3330", 14)}
    <path d="M-102,-28 C-108,-160 108,-160 102,-28 L102,-24 L-102,-24 Z" fill="${P.hair}"/>
    <path d="M-60,-104 C-20,-120 30,-120 66,-104" fill="none" stroke="${P.hairHi}" stroke-width="6" stroke-linecap="round" opacity="0.8"/>
    <g transform="translate(-78,-48) rotate(-28)"><rect x="-22" y="-6" width="44" height="12" rx="4" fill="${P.silver}"/><rect x="-16" y="-3" width="20" height="3" fill="#fff" opacity="0.8"/></g>
  </g>`;
}

function miraBody(o) {
  const P = PAL.mira;
  return `<g>
    <path d="M-58,140 C-120,150 -168,186 -182,258 L-198,640 L198,640 L182,258 C168,186 120,150 58,140 Z" fill="${P.teal}"/>
    <path d="M-182,258 C-206,330 -214,480 -206,600 L-160,610 C-162,480 -152,360 -144,300 Z" fill="${P.tealSh}"/>
    <rect x="-54" y="78" width="108" height="92" rx="18" fill="${P.teal}"/>
    <path d="M-54,150 L54,150" stroke="${P.tealSh}" stroke-width="6"/>
    <path d="M36,150 L188,176 L206,270 L118,252 L56,196 Z" fill="${P.plate}"/>
    <path d="M56,196 L118,252 L206,270 L204,282 L114,262 L50,206 Z" fill="${P.plateSh}"/>
    <path d="M36,150 L188,176" stroke="${PAL.nox.gold}" stroke-width="4"/>
    <circle cx="0" cy="214" r="7" fill="${P.silver}"/><circle cx="0" cy="262" r="7" fill="${P.silver}"/>
  </g>`;
}

function mira(o = {}) { return wrap(o, (o.noBody ? "" : miraBody(o)) + miraHead(o)); }

function miraHand(o = {}) { // gloved grabbing hand + teal sleeve, sleeve enters from left
  const P = PAL.mira;
  return wrap(o, `<path d="M-300,-46 L-30,-40 L-26,42 L-300,50 Z" fill="${P.teal}"/>
    <path d="M-40,-42 L-24,-42 L-20,44 L-36,44 Z" fill="${P.silver}"/>
    <path d="M-24,-36 C10,-50 54,-44 70,-26 C84,-10 84,16 70,30 C54,44 10,46 -22,36 Z" fill="${P.glove}"/>
    <path d="M30,-30 C40,-8 40,14 30,34 M50,-26 C58,-6 58,12 50,30" fill="none" stroke="${P.gloveHi}" stroke-width="4" stroke-linecap="round"/>`);
}

// ---------- LINA (child, seen in visions / photo) ----------
function linaFull(o = {}) {
  const P = PAL.lina, gid = uid("lsk");
  return wrap(o, `
    <rect x="-34" y="300" width="26" height="90" rx="10" fill="#3d3a45"/><rect x="8" y="300" width="26" height="90" rx="10" fill="#3d3a45"/>
    <ellipse cx="-22" cy="392" rx="26" ry="12" fill="#2a2730"/><ellipse cx="22" cy="392" rx="26" ry="12" fill="#2a2730"/>
    <path d="M-70,110 C-96,150 -104,250 -96,316 L96,316 C104,250 96,150 70,110 Z" fill="${P.coat}"/>
    <path d="M-96,316 L-70,110 C-84,150 -90,250 -84,316 Z" fill="${P.coatSh}"/>
    <path d="M-36,196 L36,196 L40,250 L-40,250 Z" fill="#fbfaf6" stroke="#c9c2b4" stroke-width="2"/>
    <circle cx="0" cy="224" r="9" fill="${P.scarf}"/>
    <ellipse cx="-46" cy="226" rx="18" ry="14" fill="${P.skin}"/><ellipse cx="46" cy="226" rx="18" ry="14" fill="${P.skin}"/>
    <path d="M-74,92 C-40,120 40,120 74,92 L80,124 C40,148 -40,148 -80,124 Z" fill="${P.scarf}"/>
    <path d="M40,120 L66,200 L44,204 L28,126 Z" fill="${P.scarfSh}"/>
    <g transform="scale(0.78)">
      <defs><linearGradient id="${gid}" x1="0" x2="1"><stop offset="0.55" stop-color="${P.skin}"/><stop offset="1" stop-color="${P.skinSh}"/></linearGradient></defs>
      <ellipse cx="0" cy="-26" rx="102" ry="96" fill="${P.hair}"/>
      <circle cx="-96" cy="40" r="26" fill="${P.hair}"/><circle cx="96" cy="40" r="26" fill="${P.hair}"/>
      <path d="M-86,-6 C-86,-80 -48,-104 0,-104 C48,-104 86,-80 86,-6 C86,52 50,96 0,100 C-50,96 -86,52 -86,-6 Z" fill="url(#${gid})"/>
      ${eyes(o, { sep: 36, y: 14, rx: 20, ry: 25, iris: P.iris, lid: 5, browCol: P.hair, browW: 6 })}
      ${mouth(o, 66, "#9a5a52", 12)}
      <ellipse cx="-44" cy="52" rx="15" ry="8" fill="#ef8f80" opacity="0.45"/><ellipse cx="44" cy="52" rx="15" ry="8" fill="#ef8f80" opacity="0.45"/>
      <path d="M-92,-20 C-96,-96 -30,-124 10,-118 C66,-112 98,-80 92,-20 C70,-56 40,-60 20,-40 C0,-64 -40,-60 -92,-20 Z" fill="${P.hair}"/>
    </g>`);
}

// ---------- PIP ----------
function pip(o = {}) {
  const P = PAL.pip, gid = uid("pip");
  return wrap(o, `<defs><radialGradient id="${gid}" cx="0.35" cy="0.3"><stop offset="0" stop-color="#f3d58a"/><stop offset="1" stop-color="${P.brassSh}"/></radialGradient></defs>
    <ellipse cx="-20" cy="52" rx="14" ry="8" fill="${P.brassSh}"/><ellipse cx="20" cy="52" rx="14" ry="8" fill="${P.brassSh}"/>
    <circle r="48" fill="url(#${gid})"/>
    <circle r="35" fill="${P.glass}"/>
    ${[0, 90, 180, 270].map((a) => `<line x1="0" y1="-31" x2="0" y2="-25" stroke="${P.brassSh}" stroke-width="3" transform="rotate(${a})"/>`).join("")}
    <g transform="rotate(${o.needle || 0})"><path d="M0,-28 L7,0 L0,6 L-7,0 Z" fill="${P.needle}"/><path d="M0,28 L7,0 L-7,0 Z" fill="#e9e4d8"/></g>
    <circle r="4" fill="${P.brassSh}"/>
    <circle cx="0" cy="-56" r="9" fill="none" stroke="${P.brass}" stroke-width="5"/>
    <g transform="translate(0,${-46 + (o.blink ? 2 : 0)})">
      <ellipse cx="-22" cy="0" rx="8" ry="${o.blink ? 1.5 : 10}" fill="${PAL.ink}"/><ellipse cx="22" cy="0" rx="8" ry="${o.blink ? 1.5 : 10}" fill="${PAL.ink}"/>
      <circle cx="-24" cy="-3" r="3" fill="#fff"/><circle cx="20" cy="-3" r="3" fill="#fff"/></g>`);
}

// ---------- PROPS ----------
function watch(o = {}) { // pocket watch, face side. o.sec = second-hand angle, o.glow 0..1
  const gid = uid("wg"), fid = uid("wf");
  return wrap(o, `<defs><radialGradient id="${gid}" cx="0.35" cy="0.3"><stop offset="0" stop-color="#fbe3a2"/><stop offset="0.6" stop-color="#d4a548"/><stop offset="1" stop-color="#7d5b1f"/></radialGradient>
      <radialGradient id="${fid}"><stop offset="0" stop-color="#fffaf0"/><stop offset="1" stop-color="#e8dcc0"/></radialGradient></defs>
    ${o.glow ? `<circle r="${150 + 40 * o.glow}" fill="${PAL.echo}" opacity="${0.18 * o.glow}"/><circle r="${135 + 20 * o.glow}" fill="${PAL.echo}" opacity="${0.22 * o.glow}"/>` : ""}
    <path d="M-30,-128 C-90,-240 90,-260 140,-200" fill="none" stroke="#c99b3f" stroke-width="7" stroke-dasharray="14 6"/>
    <rect x="-16" y="-142" width="32" height="24" rx="6" fill="#c99b3f"/><circle cx="0" cy="-156" r="16" fill="none" stroke="#c99b3f" stroke-width="7"/>
    <circle r="122" fill="url(#${gid})"/><circle r="100" fill="url(#${fid})"/><circle r="100" fill="none" stroke="#8d6a28" stroke-width="4"/>
    ${Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="-90" x2="0" y2="${i % 3 ? -82 : -74}" stroke="#3a2f22" stroke-width="${i % 3 ? 3 : 5}" transform="rotate(${i * 30})"/>`).join("")}
    <line x1="0" y1="0" x2="0" y2="-52" stroke="#2b2219" stroke-width="7" stroke-linecap="round" transform="rotate(-62)"/>
    <line x1="0" y1="0" x2="0" y2="-72" stroke="#2b2219" stroke-width="5" stroke-linecap="round" transform="rotate(48)"/>
    <line x1="0" y1="14" x2="0" y2="-80" stroke="${PAL.lina.scarf}" stroke-width="2.5" transform="rotate(${o.sec || 0})"/>
    <circle r="7" fill="#2b2219"/>`);
}

function brokenCircle(x, y, r, col, w, draw = 1) { // Nox' signature mark
  const c = 2 * Math.PI * r, arc = c * 0.78;
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round"
    stroke-dasharray="${arc * draw} ${c}" transform="rotate(-40 ${x} ${y})"/>`;
}
