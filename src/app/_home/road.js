// هندسة الطريق: رياضيات بحتة (من غير DOM)، فنفس الأرقام على السيرفر والمتصفح.
// الطريق منحنى ناعم (Catmull-Rom → Bézier) بيعدّي على النقاط، والمحطات على النقاط الداخلية.
const N = 48; // عدد العينات لكل مقطع

function build({ key, w, h, axis, road, pts, col }) {
  const n = pts.length;
  const segs = [];
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || pts[i + 1];
    segs.push([
      p1,
      [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6],
      [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6],
      p2,
    ]);
  }
  const f = (v) => +v.toFixed(1);
  const d = `M${f(pts[0][0])} ${f(pts[0][1])}` + segs.map(([, c1, c2, e]) => ` C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(e[0])} ${f(e[1])}`).join("");

  const xs = [pts[0][0]], ys = [pts[0][1]], ls = [0], knot = [0];
  let L = 0;
  segs.forEach(([a, b, c, e]) => {
    for (let s = 1; s <= N; s++) {
      const t = s / N, m = 1 - t;
      const x = m * m * m * a[0] + 3 * m * m * t * b[0] + 3 * m * t * t * c[0] + t * t * t * e[0];
      const y = m * m * m * a[1] + 3 * m * m * t * b[1] + 3 * m * t * t * c[1] + t * t * t * e[1];
      L += Math.hypot(x - xs[xs.length - 1], y - ys[ys.length - 1]);
      xs.push(x); ys.push(y); ls.push(L);
    }
    knot.push(L);
  });

  const ai = axis === "x" ? 0 : 1;
  const c0 = pts[0][ai], c1 = pts[n - 1][ai];
  const stages = pts.slice(1, n - 1).map(([x, y]) => ({ x, y }));
  return {
    key, w, h, axis, road, col, d, xs, ys, ls, S: L, stages,
    F: knot.slice(1, n - 1).map((v) => v / L),                              // مكان المحطة على الطول (0..1)
    PA: stages.map((s) => ((axis === "x" ? s.x : s.y) - c0) / (c1 - c0)),    // مكانها على محور التقدم (0..1)
    c0, c1,
  };
}

export const DESK = build({
  key: "desk", w: 1200, h: 620, axis: "x", road: 68,
  pts: [[30, 345], [170, 265], [365, 415], [560, 265], [755, 415], [950, 265], [1100, 395], [1180, 335]],
});
export const MOB = build({
  key: "mob", w: 400, h: 1450, axis: "y", road: 70, col: 208,
  pts: [[115, 30], [70, 170], [160, 385], [70, 600], [160, 815], [70, 1030], [160, 1245], [115, 1420]],
});

// نقطة وزاوية على الطريق عند نسبة الطول u
export function at(m, u) {
  const s = Math.min(Math.max(u, 0), 1) * m.S, ls = m.ls;
  let lo = 0, hi = ls.length - 1;
  while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (ls[mid] <= s) lo = mid; else hi = mid; }
  const t = (s - ls[lo]) / (ls[hi] - ls[lo] || 1);
  const x = m.xs[lo] + (m.xs[hi] - m.xs[lo]) * t;
  const y = m.ys[lo] + (m.ys[hi] - m.ys[lo]) * t;
  const a = Math.max(lo - 2, 0), b = Math.min(hi + 2, ls.length - 1);
  return [x, y, (Math.atan2(m.ys[b] - m.ys[a], m.xs[b] - m.xs[a]) * 180) / Math.PI];
}

// تقدّم السكرول (0..1 على المحور) → نسبة الطول u (القطر بيمشي مع السكرول بالظبط)
export function uFromAxis(m, p) {
  const arr = m.axis === "x" ? m.xs : m.ys;
  const target = m.c0 + Math.min(Math.max(p, 0), 1) * (m.c1 - m.c0);
  let lo = 0, hi = arr.length - 1;
  while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (arr[mid] <= target) lo = mid; else hi = mid; }
  const t = (target - arr[lo]) / (arr[hi] - arr[lo] || 1);
  return (m.ls[lo] + (m.ls[hi] - m.ls[lo]) * Math.min(Math.max(t, 0), 1)) / m.S;
}
