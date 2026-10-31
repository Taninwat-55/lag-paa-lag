// A drawing hand for build-time SVG. Shapes are sampled into points, nudged
// by smooth seeded noise (so a line wanders, it doesn't jitter), then joined
// with Catmull-Rom curves. Same seed, same drawing, every build.

export type Pt = [number, number];

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Smooth 1D noise: random knots every `step` units, cosine-blended. */
function noise(seed: number, step = 46) {
  const r = rng(seed);
  const knots: number[] = [];
  return (s: number) => {
    const i = Math.floor(s / step);
    while (knots.length <= i + 1) knots.push(r() * 2 - 1);
    const f = (1 - Math.cos(((s / step) - i) * Math.PI)) / 2;
    return knots[i] * (1 - f) + knots[i + 1] * f;
  };
}

const f1 = (n: number) => Math.round(n * 2) / 2; // half units: finer than the 2.6-unit ink line

/** Push each point sideways along its normal by smooth noise. */
export function wobble(pts: Pt[], seed: number, amp = 1.6, closed = false): Pt[] {
  const n = noise(seed);
  const m = noise(seed + 999, 13); // a little fine tremor on top
  let s = 0;
  return pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + 1)];
    if (i) s += Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]);
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    const k = amp * (n(s) + 0.25 * m(s));
    // closed shapes: ease the offset to zero at the seam so it meets itself
    const seam = closed ? Math.min(1, i / 3, (pts.length - 1 - i) / 3) : 1;
    return [p[0] + (-dy / len) * k * seam, p[1] + (dx / len) * k * seam];
  });
}

/** Catmull-Rom through the points, as cubic Bézier path data. */
export function curve(pts: Pt[], closed = false): string {
  if (pts.length < 2) return "";
  const P = closed ? [pts.at(-1)!, ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts.at(-1)!];
  // Catmull-Rom tangents are symmetric, so after the first segment the
  // first control point is implied and the shorter S command is exact.
  const n = (v: number) => String(f1(v) || 0); // no "-0"
  // a minus sign separates numbers on its own; decide on the rounded text, not the raw value
  const xy = (x: number, y: number) => { const b = n(y); return n(x) + (b[0] === "-" ? "" : " ") + b; };
  let d = `M${xy(P[1][0], P[1][1])}`;
  for (let i = 1; i < P.length - 2; i++) {
    const [p0, p1, p2, p3] = [P[i - 1], P[i], P[i + 1], P[i + 2]];
    const c2 = xy(p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6);
    d += i === 1 ? `C${xy(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)} ${c2} ${xy(p2[0], p2[1])}` : `S${c2} ${xy(p2[0], p2[1])}`;
  }
  return closed ? d + "Z" : d;
}

/** Hand-drawn path through points. */
export const ink = (pts: Pt[], seed: number, amp = 1.6, closed = false) =>
  curve(wobble(pts, seed, amp, closed), closed);

/** Points along an ellipse arc, angles in radians (0 = right, π/2 = front). */
export function arc(cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, n = 24): Pt[] {
  return Array.from({ length: n + 1 }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / n;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)] as Pt;
  });
}

/** Points along a straight line. */
export function line(a: Pt, b: Pt, n = 6): Pt[] {
  return Array.from({ length: n + 1 }, (_, i) => [a[0] + ((b[0] - a[0]) * i) / n, a[1] + ((b[1] - a[1]) * i) / n] as Pt);
}

/** Silhouette of an upright cylinder: left side, front bottom arc, right side, back top arc. */
export function drum(cx: number, top: number, bottom: number, rx: number, ry: number): Pt[] {
  return [
    ...line([cx - rx, top], [cx - rx, bottom], 4),
    ...arc(cx, bottom, rx, ry, Math.PI, 0, 18).slice(1),
    ...line([cx + rx, bottom], [cx + rx, top], 4).slice(1),
    ...arc(cx, top, rx, ry, 0, -Math.PI, 18).slice(1, -1),
  ];
}

export { rng };
