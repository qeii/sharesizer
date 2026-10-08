import { zipSync } from "fflate";
const $ = (id) => document.getElementById(id);
import { YOUTUBE_SIZES as SIZES } from "../../data/platforms.js";
let img = null, base = "youtube", focus = { x: 0.5, y: 0.5 }, raf = 0;
const on = new Set(SIZES.map((s) => s.id));

/* ---- build cards ---- */
const grid = $("ypGrid");
SIZES.forEach((s) => {
  const el = document.createElement("div"); el.className = "yp-item"; el.id = "yp-" + s.id;
  el.innerHTML = `<div class="t"><label><input type="checkbox" checked data-id="${s.id}" /> ${s.name}</label><span class="m">${s.w}×${s.h}</span></div>
    <canvas></canvas><div class="m">${s.note}</div><div class="w" hidden></div><button class="btn secondary" type="button" data-dl="${s.id}">Download</button>`;
  grid.appendChild(el);
});
grid.addEventListener("change", (e) => {
  const id = e.target.dataset.id; if (!id) return;
  e.target.checked ? on.add(id) : on.delete(id);
  $("yp-" + id).classList.toggle("off", !e.target.checked);
});

/* ---- drawing ---- */
function draw(g, W, H, safe) {
  const fit = $("ypFit").value, iw = img.width, ih = img.height;
  g.fillStyle = $("ypBg").value; g.fillRect(0, 0, W, H);
  g.imageSmoothingQuality = "high";
  const k = fit === "cover" ? Math.max(W / iw, H / ih) : Math.min(W / iw, H / ih);
  const dw = iw * k, dh = ih * k;
  const dx = fit === "cover" ? (W - dw) * focus.x : (W - dw) / 2, dy = fit === "cover" ? (H - dh) * focus.y : (H - dh) / 2;
  g.drawImage(img, dx, dy, dw, dh);
  return k;
}
function overlay(g, W, H, type) {
  g.save(); g.fillStyle = "rgba(0,0,0,.55)"; g.strokeStyle = "#fff"; g.lineWidth = Math.max(1.5, W / 300);
  if (type === "banner") {
    const sw = (1546 / 2560) * W, sh = (423 / 1440) * H, x = (W - sw) / 2, y = (H - sh) / 2;
    g.beginPath(); g.rect(0, 0, W, H); g.rect(x, y, sw, sh); g.fill("evenodd"); g.strokeRect(x, y, sw, sh);
  } else {
    g.beginPath(); g.rect(0, 0, W, H); g.arc(W / 2, H / 2, W / 2, 0, Math.PI * 2, true); g.fill("evenodd");
    g.beginPath(); g.arc(W / 2, H / 2, W / 2 - 1, 0, Math.PI * 2); g.stroke();
  }
  g.restore();
}
function schedule() { cancelAnimationFrame(raf); raf = requestAnimationFrame(paint); }
function paint() {
  if (!img) return;
  const showSafe = $("ypSafe").checked;
  SIZES.forEach((s) => {
    const el = $("yp-" + s.id), cv = el.querySelector("canvas"), sc = Math.min(1, 360 / Math.max(s.w, s.h));
    cv.width = Math.round(s.w * sc); cv.height = Math.round(s.h * sc);
    const g = cv.getContext("2d"), k = draw(g, cv.width, cv.height);
    if (showSafe && s.overlay) overlay(g, cv.width, cv.height, s.overlay);
    const warn = el.querySelector(".w"), up = $("ypFit").value === "cover" ? Math.max(s.w / img.width, s.h / img.height) : Math.min(s.w / img.width, s.h / img.height);
    warn.hidden = up <= 1; warn.textContent = up > 1 ? `Your image is smaller than ${s.w}×${s.h}, so it will be enlarged and may look soft.` : "";
  });
  const src = $("ypSrc"), g = src.getContext("2d");
  const k = Math.min(1, 420 / img.width, 300 / img.height);
  src.width = Math.round(img.width * k); src.height = Math.round(img.height * k);
  g.drawImage(img, 0, 0, src.width, src.height);
  const cx = focus.x * src.width, cy = focus.y * src.height;
  g.strokeStyle = "#fff"; g.lineWidth = 2; g.shadowColor = "#000"; g.shadowBlur = 4;
  g.beginPath(); g.arc(cx, cy, 10, 0, Math.PI * 2); g.moveTo(cx - 18, cy); g.lineTo(cx + 18, cy); g.moveTo(cx, cy - 18); g.lineTo(cx, cy + 18); g.stroke();
}

/* ---- loading ---- */
async function load(file) {
  if (!file || !file.type.startsWith("image/")) return;
  try { img = await createImageBitmap(file, { imageOrientation: "from-image" }); }
  catch { try { img = await createImageBitmap(file); } catch { alert("Could not read this image."); return; } }
  base = file.name.replace(/\.[^.]+$/, "").replace(/[^\w-]+/g, "-") || "youtube";
  focus = { x: 0.5, y: 0.5 };
  $("ypInfo").textContent = `${img.width} × ${img.height}px` + (img.width < 2560 ? " — for the banner, 2560px wide or more looks best." : "");
  $("ypCtl").hidden = false; $("ypWork").hidden = false; $("ypReport").innerHTML = ""; schedule();
}
$("ypFile").addEventListener("change", (e) => load(e.target.files[0]));
const drop = $("ypDrop");
["dragover", "dragenter"].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.add("dragover"); }));
["dragleave", "drop"].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.remove("dragover"); }));
drop.addEventListener("drop", (e) => load(e.dataTransfer.files[0]));
$("ypSrc").addEventListener("pointerdown", (e) => {
  const r = e.target.getBoundingClientRect();
  focus = { x: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), y: Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)) }; schedule();
});
["ypFit", "ypBg", "ypSafe"].forEach((id) => $(id).addEventListener("input", schedule));

/* ---- export ---- */
const toBlob = (cv, type, q) => new Promise((res) => cv.toBlob(res, type, q));
async function make(s) {
  const cv = document.createElement("canvas"); cv.width = s.w; cv.height = s.h; draw(cv.getContext("2d"), s.w, s.h);
  const type = $("ypFormat").value, ext = type === "image/png" ? "png" : "jpg";
  let q = Number($("ypQuality").value), blob = await toBlob(cv, type, q);
  if (type !== "image/png" && s.max) while (blob.size > s.max * 1048576 && q > 0.5) { q -= 0.06; blob = await toBlob(cv, type, q); }
  const over = s.max && blob.size > s.max * 1048576;
  return { blob, name: `${base}-youtube-${s.id}-${s.w}x${s.h}.${ext}`, over, label: `${s.name} ${s.w}×${s.h} — ${(blob.size / 1024).toFixed(0)} KB${over ? ` ⚠ over the ${s.max} MB limit (try JPEG)` : " ✓"}` };
}
function save(blob, name) { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); }
grid.addEventListener("click", async (e) => {
  const id = e.target.dataset.dl; if (!id || !img) return;
  const r = await make(SIZES.find((s) => s.id === id)); save(r.blob, r.name); $("ypReport").innerHTML = `<li>${r.label}</li>`;
});
$("ypZip").addEventListener("click", async () => {
  if (!img || !on.size) return;
  const btn = $("ypZip"); btn.disabled = true; btn.textContent = "Preparing…";
  try {
    const files = {}, lines = [];
    for (const s of SIZES.filter((x) => on.has(x.id))) { const r = await make(s); files[r.name] = new Uint8Array(await r.blob.arrayBuffer()); lines.push(r.label); }
    save(new Blob([zipSync(files, { level: 0 })], { type: "application/zip" }), `${base}-youtube-pack.zip`);
    $("ypReport").innerHTML = lines.map((l) => `<li>${l}</li>`).join("");
  } finally { btn.disabled = false; btn.textContent = "Download all as ZIP"; }
});
