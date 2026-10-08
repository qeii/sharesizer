const $ = (id) => document.getElementById(id);
const out = $("peCanvas"), layer = $("peCrop"), lctx = layer.getContext("2d");
const MAX = 4000, PREVIEW = 1400;
let base = null, orig = null, logo = null, crop = null, undo = [], raf = 0;
const hasBlur = "filter" in out.getContext("2d");
const val = (id) => Number($(id).value);
const mk = (w, h) => { const c = document.createElement("canvas"); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h)); return c; };
const clone = (c) => { const n = mk(c.width, c.height); n.getContext("2d").drawImage(c, 0, 0); return n; };

const DEFAULTS = { brightness: 0, contrast: 0, saturation: 0, warmth: 0, grayscale: 0, sepia: 0, blur: 0 };
const PRESETS = {
  "Original": {},
  "Black & white": { grayscale: 100, contrast: 10 },
  "Vintage": { sepia: 55, contrast: -10, saturation: -15, warmth: 15 },
  "Vivid": { saturation: 40, contrast: 15, brightness: 5 },
  "Cool": { warmth: -40, saturation: 10 },
  "Warm": { warmth: 40, saturation: 10 },
};

function setSlider(id, v) { $(id).value = v; const o = $("out_" + id.replace("pe_", "")); if (o) o.textContent = v; }
function resetFilters() { for (const k in DEFAULTS) setSlider("pe_" + k, DEFAULTS[k]); }

async function load(file) {
  if (!file || !file.type.startsWith("image/")) return;
  let bmp;
  try { bmp = await createImageBitmap(file, { imageOrientation: "from-image" }); }
  catch { try { bmp = await createImageBitmap(file); } catch { alert("Could not read this image."); return; } }
  const s = Math.min(1, MAX / Math.max(bmp.width, bmp.height));
  base = mk(bmp.width * s, bmp.height * s);
  const g = base.getContext("2d"); g.imageSmoothingQuality = "high"; g.drawImage(bmp, 0, 0, base.width, base.height);
  orig = clone(base); undo = []; crop = null; resetFilters();
  $("peControls").hidden = false; $("peStage").hidden = false; $("peEmpty").hidden = true;
  $("peInfo").textContent = `${bmp.width} × ${bmp.height}px` + (s < 1 ? ` (scaled down to ${base.width} × ${base.height} for editing)` : "");
  syncSize(); schedule();
}

function syncSize() { $("peW").value = base.width; $("peH").value = base.height; }
function edit(fn) {
  undo.push(clone(base)); if (undo.length > 10) undo.shift();
  base = fn(base); crop = null; $("peApplyCrop").disabled = true; syncSize(); schedule();
}

/* ---------- rendering ---------- */
function adjust(g, w, h) {
  const b = val("pe_brightness"), c = val("pe_contrast"), s = val("pe_saturation"), wm = val("pe_warmth");
  const gr = val("pe_grayscale") / 100, se = val("pe_sepia") / 100;
  if (!(b || c || s || wm || gr || se)) return;
  const d = g.getImageData(0, 0, w, h), p = d.data;
  const bf = 1 + b / 100, cc = c * 2.55, cf = (259 * (cc + 255)) / (255 * (259 - cc)), sf = 1 + s / 100, wv = wm * 0.4;
  for (let i = 0; i < p.length; i += 4) {
    let r = p[i] * bf, gg = p[i + 1] * bf, bl = p[i + 2] * bf;
    r = cf * (r - 128) + 128; gg = cf * (gg - 128) + 128; bl = cf * (bl - 128) + 128;
    const l = 0.299 * r + 0.587 * gg + 0.114 * bl;
    r = l + (r - l) * sf; gg = l + (gg - l) * sf; bl = l + (bl - l) * sf;
    r += wv; bl -= wv;
    if (gr) { const l2 = 0.299 * r + 0.587 * gg + 0.114 * bl; r += (l2 - r) * gr; gg += (l2 - gg) * gr; bl += (l2 - bl) * gr; }
    if (se) {
      const sr = 0.393 * r + 0.769 * gg + 0.189 * bl, sg = 0.349 * r + 0.686 * gg + 0.168 * bl, sb = 0.272 * r + 0.534 * gg + 0.131 * bl;
      r += (sr - r) * se; gg += (sg - gg) * se; bl += (sb - bl) * se;
    }
    p[i] = r; p[i + 1] = gg; p[i + 2] = bl;
  }
  g.putImageData(d, 0, 0);
}

function renderTo(cv, w, h) {
  cv.width = w; cv.height = h;
  const g = cv.getContext("2d", { willReadFrequently: true });
  g.imageSmoothingQuality = "high";
  const blur = val("pe_blur");
  if (hasBlur && blur > 0) g.filter = `blur(${(blur * w) / base.width}px)`;
  g.drawImage(base, 0, 0, w, h); g.filter = "none";
  adjust(g, w, h);
  const text = $("pe_text").value.trim();
  if (text) {
    const size = (val("pe_tsize") / 100) * w;
    g.save(); g.globalAlpha = val("pe_topacity") / 100; g.fillStyle = $("pe_color").value;
    g.font = `${$("pe_bold").checked ? "700 " : ""}${size}px ${$("pe_font").value}`;
    g.textAlign = "center"; g.textBaseline = "middle";
    g.shadowColor = "rgba(0,0,0,.45)"; g.shadowBlur = size * 0.08;
    g.fillText(text, (val("pe_tx") / 100) * w, (val("pe_ty") / 100) * h, w * 0.98); g.restore();
  }
  if (logo) {
    const lw = (val("pe_lsize") / 100) * w, lh = (lw * logo.height) / logo.width;
    g.save(); g.globalAlpha = val("pe_lopacity") / 100;
    g.drawImage(logo, (val("pe_lx") / 100) * w - lw / 2, (val("pe_ly") / 100) * h - lh / 2, lw, lh); g.restore();
  }
}

function schedule() {
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(() => {
    if (!base) return;
    const s = Math.min(1, PREVIEW / Math.max(base.width, base.height));
    renderTo(out, Math.round(base.width * s), Math.round(base.height * s));
    layer.width = out.width; layer.height = out.height; drawCrop();
  });
}

/* ---------- crop selection ---------- */
function drawCrop() {
  lctx.clearRect(0, 0, layer.width, layer.height);
  if (!crop || crop.w < 1 || crop.h < 1) return;
  lctx.fillStyle = "rgba(0,0,0,.5)"; lctx.fillRect(0, 0, layer.width, layer.height);
  lctx.clearRect(crop.x, crop.y, crop.w, crop.h);
  lctx.strokeStyle = "#fff"; lctx.lineWidth = Math.max(2, layer.width / 400); lctx.strokeRect(crop.x, crop.y, crop.w, crop.h);
}
const pos = (e) => { const r = layer.getBoundingClientRect(); return { x: ((e.clientX - r.left) * layer.width) / r.width, y: ((e.clientY - r.top) * layer.height) / r.height }; };
let drag = null;
layer.addEventListener("pointerdown", (e) => { layer.setPointerCapture(e.pointerId); drag = pos(e); crop = { x: drag.x, y: drag.y, w: 0, h: 0 }; });
layer.addEventListener("pointermove", (e) => {
  if (!drag) return;
  const p = pos(e), r = Number($("peRatio").value);
  let w = Math.max(0, Math.min(layer.width, p.x)) - drag.x, h = Math.max(0, Math.min(layer.height, p.y)) - drag.y;
  if (r) { let a = Math.abs(w), b = Math.abs(h); if (a / r > b) a = b * r; else b = a / r; w = Math.sign(w || 1) * a; h = Math.sign(h || 1) * b; }
  crop = { x: Math.min(drag.x, drag.x + w), y: Math.min(drag.y, drag.y + h), w: Math.abs(w), h: Math.abs(h) }; drawCrop();
});
layer.addEventListener("pointerup", () => { drag = null; if (crop && (crop.w < 8 || crop.h < 8)) crop = null; drawCrop(); $("peApplyCrop").disabled = !crop; });

/* ---------- wiring ---------- */
const drop = $("peDrop");
$("peFile").addEventListener("change", (e) => load(e.target.files[0]));
["dragover", "dragenter"].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.add("dragover"); }));
["dragleave", "drop"].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.remove("dragover"); }));
drop.addEventListener("drop", (e) => load(e.dataTransfer.files[0]));

$("peRotL").onclick = () => edit((b) => rot(b, -1));
$("peRotR").onclick = () => edit((b) => rot(b, 1));
function rot(b, d) { const n = mk(b.height, b.width), g = n.getContext("2d"); g.translate(n.width / 2, n.height / 2); g.rotate((d * Math.PI) / 2); g.drawImage(b, -b.width / 2, -b.height / 2); return n; }
const flip = (hor) => edit((b) => { const n = mk(b.width, b.height), g = n.getContext("2d"); g.translate(hor ? b.width : 0, hor ? 0 : b.height); g.scale(hor ? -1 : 1, hor ? 1 : -1); g.drawImage(b, 0, 0); return n; });
$("peFlipH").onclick = () => flip(true); $("peFlipV").onclick = () => flip(false);

$("peW").addEventListener("input", () => { if ($("peLock").checked && base) $("peH").value = Math.round((val("peW") * base.height) / base.width); });
$("peH").addEventListener("input", () => { if ($("peLock").checked && base) $("peW").value = Math.round((val("peH") * base.width) / base.height); });
$("peApplyResize").onclick = () => {
  const w = Math.min(8000, val("peW")), h = Math.min(8000, val("peH"));
  if (!(w > 0 && h > 0)) return;
  edit((b) => { const n = mk(w, h), g = n.getContext("2d"); g.imageSmoothingQuality = "high"; g.drawImage(b, 0, 0, n.width, n.height); return n; });
};
$("peApplyCrop").onclick = () => {
  if (!crop) return;
  const k = base.width / layer.width, sx = Math.round(crop.x * k), sy = Math.round(crop.y * k);
  const sw = Math.min(base.width - sx, Math.round(crop.w * k)), sh = Math.min(base.height - sy, Math.round(crop.h * k));
  edit((b) => { const n = mk(sw, sh); n.getContext("2d").drawImage(b, sx, sy, sw, sh, 0, 0, sw, sh); return n; });
};
$("peClearCrop").onclick = () => { crop = null; $("peApplyCrop").disabled = true; drawCrop(); };

document.querySelectorAll("[data-preset]").forEach((btn) => btn.addEventListener("click", () => {
  const p = PRESETS[btn.dataset.preset]; for (const k in DEFAULTS) setSlider("pe_" + k, p[k] ?? 0); schedule();
}));
$("peControls").addEventListener("input", (e) => {
  const o = e.target.id && $("out_" + e.target.id.replace("pe_", ""));
  if (o) o.textContent = e.target.value;
  schedule();
});
if (!hasBlur) { $("pe_blur").disabled = true; $("peBlurNote").hidden = false; }

$("peLogoFile").addEventListener("change", async (e) => { const f = e.target.files[0]; if (f) { try { logo = await createImageBitmap(f); schedule(); } catch { alert("Could not read this logo."); } } e.target.value = ""; });
$("peLogoClear").onclick = () => { logo = null; schedule(); };
$("peUndo").onclick = () => { if (undo.length) { base = undo.pop(); crop = null; syncSize(); schedule(); } };
$("peReset").onclick = () => {
  if (!orig) return; base = clone(orig); undo = []; crop = null; logo = null; $("pe_text").value = ""; resetFilters(); syncSize(); schedule();
};
$("peDownload").onclick = () => {
  if (!base) return;
  let t = mk(1, 1); renderTo(t, base.width, base.height);
  const type = $("peFormat").value;
  if (type === "image/jpeg") { const f = mk(t.width, t.height), g = f.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, f.width, f.height); g.drawImage(t, 0, 0); t = f; }
  t.toBlob((blob) => {
    if (!blob) return;
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "sharesizer-edit." + type.split("/")[1].replace("jpeg", "jpg"); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }, type, val("peQuality"));
};
