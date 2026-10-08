// Pure image measurements for the Thumbnail Tester. No DOM, so they can be tested in Node.
// All thresholds are heuristics, not YouTube rules. The UI labels them that way.
export const WORK = { w: 640, h: 360 };
export const SMALL = { w: 168, h: 94 };

const luma = (d) => { const n = d.length / 4, L = new Float32Array(n); for (let i = 0, j = 0; i < n; i++, j += 4) L[i] = 0.299 * d[j] + 0.587 * d[j + 1] + 0.114 * d[j + 2]; return L; };

export function bilinear(src, sw, sh, dw, dh) {
  const out = new Float32Array(dw * dh), xr = (sw - 1) / (dw - 1), yr = (sh - 1) / (dh - 1);
  for (let y = 0; y < dh; y++) {
    const fy = y * yr, y0 = Math.floor(fy), y1 = Math.min(sh - 1, y0 + 1), ty = fy - y0;
    for (let x = 0; x < dw; x++) {
      const fx = x * xr, x0 = Math.floor(fx), x1 = Math.min(sw - 1, x0 + 1), tx = fx - x0;
      const a = src[y0 * sw + x0] * (1 - tx) + src[y0 * sw + x1] * tx, b = src[y1 * sw + x0] * (1 - tx) + src[y1 * sw + x1] * tx;
      out[y * dw + x] = a * (1 - ty) + b * ty;
    }
  }
  return out;
}

// Share of pixels with a strong local gradient inside a box [x0,y0,x1,y1] (defaults to the whole image)
export function edgeDensity(L, w, h, box = [0, 0, w, h], thr = 30) {
  const x0 = Math.max(1, Math.floor(box[0])), y0 = Math.max(1, Math.floor(box[1])), x1 = Math.min(w - 1, Math.ceil(box[2])), y1 = Math.min(h - 1, Math.ceil(box[3]));
  let n = 0, c = 0;
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { const i = y * w + x; if ((Math.abs(L[i + 1] - L[i - 1]) + Math.abs(L[i + w] - L[i - w])) / 2 > thr) c++; n++; }
  return n ? c / n : 0;
}

export function dominantColors(d, k = 4) {
  const buckets = new Map();
  for (let i = 0; i < d.length; i += 4) {
    const key = ((d[i] >> 4) << 8) | ((d[i + 1] >> 4) << 4) | (d[i + 2] >> 4);
    let e = buckets.get(key); if (!e) buckets.set(key, (e = [0, 0, 0, 0]));
    e[0]++; e[1] += d[i]; e[2] += d[i + 1]; e[3] += d[i + 2];
  }
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  const picked = [];
  for (const e of [...buckets.values()].sort((a, b) => b[0] - a[0])) {
    const rgb = [e[1] / e[0], e[2] / e[0], e[3] / e[0]];
    let near = null, nd = Infinity;
    for (const p of picked) { const dd = dist(p.rgb, rgb); if (dd < nd) { nd = dd; near = p; } }
    if (near && (nd < 60 || picked.length >= k)) near.count += e[0]; else picked.push({ rgb, count: e[0] });
  }
  const total = d.length / 4, hex = (v) => Math.round(v).toString(16).padStart(2, "0");
  return picked.sort((a, b) => b.count - a.count).map((p) => ({ hex: "#" + p.rgb.map(hex).join(""), pct: Math.round((p.count / total) * 100) }));
}

// big / small: { data: RGBA array, w, h } of the same picture at ~640px and ~168px wide
export function analyze(big, small) {
  const L = luma(big.data), n = L.length, hist = new Uint32Array(256);
  let sum = 0, sat = 0, satN = 0;
  for (let i = 0, j = 0; i < n; i++, j += 4) {
    const v = Math.round(L[i]); hist[v]++; sum += L[i];
    const mx = Math.max(big.data[j], big.data[j + 1], big.data[j + 2]), mn = Math.min(big.data[j], big.data[j + 1], big.data[j + 2]);
    if (mx > 20) { sat += (mx - mn) / mx; satN++; }
  }
  const at = (p) => { let acc = 0; for (let i = 0; i < 256; i++) { acc += hist[i]; if (acc >= n * p) return i; } return 255; };
  const Ls = luma(small.data), back = bilinear(Ls, small.w, small.h, big.w, big.h);
  let diff = 0, dev = 0; const mean = sum / n;
  for (let i = 0; i < n; i++) { diff += Math.abs(L[i] - back[i]); dev += Math.abs(L[i] - mean); }
  // Share of the image's own tonal detail that survives shrinking to 168 px. null when the image is nearly flat.
  const mad = dev / n, detailKept = mad < 4 ? null : Math.round(Math.max(0, Math.min(1, 1 - diff / n / mad)) * 100);
  const { w, h } = big, cornerW = w * 0.14, cornerH = h * 0.1;
  const bx = w * 0.025, by = h * 0.025;
  const border = (edgeDensity(L, w, h, [0, 0, w, by]) + edgeDensity(L, w, h, [0, h - by, w, h]) + edgeDensity(L, w, h, [0, 0, bx, h]) + edgeDensity(L, w, h, [w - bx, 0, w, h])) / 4;
  return {
    brightness: Math.round(sum / n), range: at(0.95) - at(0.05), colorfulness: Math.round((satN ? sat / satN : 0) * 100),
    detailKept, smallEdges: edgeDensity(Ls, small.w, small.h),
    corner: edgeDensity(L, w, h, [w - cornerW - w * 0.01, h - cornerH - h * 0.02, w - w * 0.01, h - h * 0.02]), border,
    colors: dominantColors(big.data),
  };
}

// Plain-English comparison. Measurements only; never a click prediction.
export function summarize(items) {
  if (items.length < 2) return [];
  const best = (list, f) => list.reduce((b, c) => (f(c) > f(b) ? c : b));
  const top2 = (list, f) => list.map(f).sort((a, b) => b - a);
  const bc = best(items, (x) => x.a.range), cs = top2(items, (x) => x.a.range), cClear = cs[0] - cs[1] >= 6;
  const withDetail = items.filter((x) => x.a.detailKept !== null);
  let bd = null, dClear = false;
  if (withDetail.length >= 2) { bd = best(withDetail, (x) => x.a.detailKept); const ds = top2(withDetail, (x) => x.a.detailKept); dClear = ds[0] - ds[1] >= 5; }
  const lines = [];
  if (cClear && dClear && bc === bd) lines.push(`Thumbnail ${bc.label} has stronger contrast and keeps more of its detail when shrunk to 168 px.`);
  else {
    lines.push(cClear ? `Thumbnail ${bc.label} has the strongest contrast (tonal range ${bc.a.range} vs ${cs[1]}).` : "Contrast is very similar across your thumbnails.");
    if (dClear) lines.push(`Thumbnail ${bd.label} keeps the most detail at 168 px (${bd.a.detailKept}%).`);
    else if (withDetail.length >= 2) lines.push("Detail holds up about equally when shrunk.");
  }
  return lines;
}
