const root = document.getElementById("sizeTool");
if (root) {
  const q = (s) => root.querySelector(s);
  const variants = JSON.parse(root.dataset.variants);
  const cv = q("[data-canvas]"), sel = q("[data-variant]");
  let img = null, v = variants[0], focus = { x: 0.5, y: 0.5 }, base = "image", raf = 0, drag = false;

  const draw = (g, W, H) => {
    const cover = q("[data-fit]").value === "cover";
    g.fillStyle = q("[data-bg]").value; g.fillRect(0, 0, W, H); g.imageSmoothingQuality = "high";
    const k = cover ? Math.max(W / img.width, H / img.height) : Math.min(W / img.width, H / img.height);
    const dw = img.width * k, dh = img.height * k;
    g.drawImage(img, cover ? (W - dw) * focus.x : (W - dw) / 2, cover ? (H - dh) * focus.y : (H - dh) / 2, dw, dh);
  };
  const guides = (g, W, H) => {
    const gd = v.guide; if (!gd) return;
    g.save(); g.fillStyle = "rgba(0,0,0,.5)"; g.strokeStyle = "#fff"; g.lineWidth = Math.max(1.5, W / 400); g.font = `${Math.max(11, W / 45)}px sans-serif`; g.fillStyle = "rgba(0,0,0,.5)";
    let label = "", lx = 6, ly = 16;
    if (gd.safe) {
      const sw = (gd.safe[0] / v.w) * W, sh = (gd.safe[1] / v.h) * H, x = (W - sw) / 2, y = (H - sh) / 2;
      g.beginPath(); g.rect(0, 0, W, H); g.rect(x, y, sw, sh); g.fill("evenodd"); g.strokeRect(x, y, sw, sh); label = gd.safe[2]; lx = x + 6; ly = y + Math.max(14, W / 40);
    } else if (gd.bands) {
      g.fillRect(0, 0, W, gd.bands[0] * H); g.fillRect(0, H - gd.bands[1] * H, W, gd.bands[1] * H); label = gd.bands[2]; ly = Math.max(14, W / 40);
    } else if (gd.corner) {
      const w = gd.corner[0] * W, h = gd.corner[1] * H, x = W - w - W * 0.01, y = H - h - H * 0.02;
      g.fillRect(x, y, w, h); g.strokeRect(x, y, w, h); label = gd.corner[2]; lx = Math.max(4, x - W * 0.3); ly = y - 6;
    }
    if (label) { g.fillStyle = "#fff"; g.shadowColor = "#000"; g.shadowBlur = 4; g.fillText(label, lx, ly); }
    g.restore();
  };
  const paint = () => {
    if (!img) return;
    const sc = Math.min(1, 900 / Math.max(v.w, v.h)); cv.width = Math.round(v.w * sc); cv.height = Math.round(v.h * sc);
    const g = cv.getContext("2d"); draw(g, cv.width, cv.height);
    if (q("[data-guides]").checked) guides(g, cv.width, cv.height);
    const cover = q("[data-fit]").value === "cover";
    const up = cover ? Math.max(v.w / img.width, v.h / img.height) : Math.min(v.w / img.width, v.h / img.height);
    const warn = q("[data-warn]"); warn.hidden = up <= 1;
    warn.textContent = up > 1 ? `Your image is smaller than ${v.w}×${v.h}, so it will be enlarged and may look soft.` : "";
    q("[data-hint]").style.visibility = cover ? "visible" : "hidden";
  };
  const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(paint); };

  const load = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    try { img = await createImageBitmap(file, { imageOrientation: "from-image" }); }
    catch { try { img = await createImageBitmap(file); } catch { alert("Could not read this image."); return; } }
    base = (file.name || "image").replace(/\.[^.]+$/, "").replace(/[^\w-]+/g, "-") || "image";
    focus = { x: 0.5, y: 0.5 };
    q("[data-info]").textContent = `${img.width} × ${img.height}px → ${v.w} × ${v.h}px`;
    q("[data-controls]").hidden = false; q("[data-preview]").hidden = false; q("[data-result]").textContent = ""; schedule();
  };
  q("[data-file]").addEventListener("change", (e) => load(e.target.files[0]));
  const drop = q("[data-drop]");
  ["dragover", "dragenter"].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.add("dragover"); }));
  ["dragleave", "drop"].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.remove("dragover"); }));
  drop.addEventListener("drop", (e) => load(e.dataTransfer.files[0]));

  const setFocus = (e) => { const r = cv.getBoundingClientRect(); focus = { x: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), y: Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)) }; schedule(); };
  cv.addEventListener("pointerdown", (e) => { if (q("[data-fit]").value !== "cover") return; drag = true; cv.setPointerCapture(e.pointerId); setFocus(e); });
  cv.addEventListener("pointermove", (e) => { if (drag) setFocus(e); });
  cv.addEventListener("pointerup", () => (drag = false));
  if (sel) sel.addEventListener("change", () => { v = variants[Number(sel.value)]; if (img) q("[data-info]").textContent = `${img.width} × ${img.height}px → ${v.w} × ${v.h}px`; schedule(); });
  ["[data-fit]", "[data-bg]", "[data-guides]"].forEach((s) => q(s).addEventListener("input", schedule));

  const toBlob = (c, t, quality) => new Promise((r) => c.toBlob(r, t, quality));
  q("[data-download]").addEventListener("click", async () => {
    if (!img) return;
    const out = document.createElement("canvas"); out.width = v.w; out.height = v.h; draw(out.getContext("2d"), v.w, v.h);
    const type = q("[data-format]").value, ext = type === "image/png" ? "png" : "jpg", limit = v.maxMB * 1048576;
    let quality = Number(q("[data-quality]").value), blob = await toBlob(out, type, quality);
    if (type !== "image/png") while (blob.size > limit && quality > 0.5) { quality -= 0.06; blob = await toBlob(out, type, quality); }
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `${base}-${v.key}-${v.w}x${v.h}.${ext}`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    const kb = (blob.size / 1024).toFixed(0), over = blob.size > limit;
    q("[data-result]").textContent = `${v.w}×${v.h}, ${kb} KB ${over ? `— over the ${v.maxMB} MB target, try JPEG` : "✓"}`;
  });
}
