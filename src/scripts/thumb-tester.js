import { analyze, summarize, WORK, SMALL } from "./thumb-analysis.js";
const root = document.getElementById("thumbTester");
if (root) {
  const q = (s) => root.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const LABELS = ["A", "B", "C", "D"];
  let cands = [], comps = [];
  const kb = (b) => (b >= 1048576 ? (b / 1048576).toFixed(2) + " MB" : Math.round(b / 1024) + " KB");

  const sample = (bmp, w, h) => {
    const c = document.createElement("canvas"); c.width = w; c.height = h; const g = c.getContext("2d", { willReadFrequently: true });
    const k = Math.max(w / bmp.width, h / bmp.height), dw = bmp.width * k, dh = bmp.height * k;
    g.imageSmoothingQuality = "high"; g.drawImage(bmp, (w - dw) / 2, (h - dh) / 2, dw, dh);
    const d = g.getImageData(0, 0, w, h); return { data: d.data, w, h };
  };
  const checks = (c) => {
    const { bmp, file, a } = c, out = [], add = (lvl, t) => out.push([lvl, t]);
    add(bmp.width >= 1280 ? "ok" : bmp.width >= 640 ? "warn" : "bad", bmp.width >= 1280 ? `${bmp.width}×${bmp.height}px, large enough.` : bmp.width >= 640 ? `${bmp.width}×${bmp.height}px works, but 1280×720 is recommended and may look sharper.` : `${bmp.width}×${bmp.height}px is under the 640 px minimum width.`);
    const r = bmp.width / bmp.height; add(Math.abs(r - 16 / 9) < 0.02 ? "ok" : "warn", Math.abs(r - 16 / 9) < 0.02 ? "16:9 ratio." : `Ratio is ${r.toFixed(2)}:1, not 16:9, so it may be cropped or letterboxed. The checks below use a centered 16:9 crop.`);
    add(file.size <= 2097152 ? "ok" : "bad", file.size <= 2097152 ? `File size ${kb(file.size)}, under the 2 MB limit.` : `File size ${kb(file.size)} is over YouTube's 2 MB limit.`);
    const t = file.type; add(/jpeg|png/.test(t) ? "ok" : "warn", /jpeg|png/.test(t) ? "JPG/PNG format." : `${t || "This format"} may not be accepted. Export as JPG or PNG.`);
    add(a.brightness < 55 ? "warn" : a.brightness > 205 ? "warn" : "ok", a.brightness < 55 ? "Very dark overall. It may disappear on dark-mode feeds." : a.brightness > 205 ? "Very bright overall. Details may look washed out." : "Balanced brightness.");
    add(a.range < 40 ? "warn" : "ok", a.range < 40 ? "Low contrast: the image may look flat next to others." : a.range >= 70 ? "Strong contrast." : "Moderate contrast.");
    add(a.smallEdges < 0.02 ? "warn" : a.smallEdges > 0.28 ? "warn" : "ok", a.smallEdges < 0.02 ? "Very little detail at small size. Consider a clearer subject or bigger text." : a.smallEdges > 0.28 ? "Busy at small size, which can look cluttered." : "Good amount of detail at small size.");
    if (a.detailKept === null) add("warn", "Almost no fine detail to measure. The detail check was skipped.");
    else add(a.detailKept >= 60 ? "ok" : "warn", `${a.detailKept}% of the detail survives shrinking to 168 px.${a.detailKept < 60 ? " Thin text or small objects may become hard to read." : ""}`);
    if (a.corner > 0.22) add("warn", "The bottom-right corner is busy. The video length badge may cover important details.");
    if (a.border > 0.18) add("warn", "Content runs to the edges, so different screens may crop part of it.");
    return out;
  };

  const renderResults = () => {
    const box = q("[data-results]"); const items = cands.map((c, i) => ({ label: LABELS[i], a: c.a }));
    box.innerHTML = cands.map((c, i) => {
      const a = c.a, ck = checks(c);
      return `<div class="tt-cand"><div><div class="top"><h3>Thumbnail ${LABELS[i]}</h3><button class="btn secondary" style="padding:6px 10px;font-size:12px" data-rm="${i}" type="button">Remove</button></div>
        <img class="big" src="${c.url}" alt="Thumbnail ${LABELS[i]}"><div class="tt-sizes"><div><img src="${c.url}" width="168" alt="">168 px</div><div><img src="${c.url}" width="100" alt="">100 px</div></div></div>
        <div><div class="muted" style="font-size:13px;margin-bottom:8px">${esc(c.file.name)}</div>
        <div class="tt-metrics"><span>Brightness <strong>${a.brightness}/255</strong></span><span>Tonal range <strong>${a.range}</strong></span><span>Color intensity <strong>${a.colorfulness}%</strong></span><span>Detail kept at 168 px <strong>${a.detailKept === null ? "n/a" : a.detailKept + "%"}</strong></span></div>
        <ul class="tt-checks">${ck.map(([l, t]) => `<li><span class="tt-dot ${l === "ok" ? "" : l}"></span><span>${esc(t)}</span></li>`).join("")}</ul>
        <div class="tt-sw">Main colors: ${a.colors.map((k) => `<b style="background:${k.hex}" title="${k.hex}"></b>${k.pct}%`).join(" ")}</div></div></div>`;
    }).join("");
    const lines = summarize(items), sm = q("[data-summary]");
    sm.hidden = !lines.length;
    sm.innerHTML = lines.length ? `<strong>Comparison</strong><br>${lines.map(esc).join("<br>")}<br><span class="muted">These are measurements of the images, not predictions of clicks. Check your real audience's reaction too.</span>` : "";
    const wh = q("[data-which]"); const prev = wh.value; wh.innerHTML = cands.map((_, i) => `<option value="${i}">Thumbnail ${LABELS[i]}</option>`).join(""); if (prev && prev < cands.length) wh.value = prev;
    q("[data-feedwrap]").hidden = !cands.length; renderFeed();
  };

  const PAL = { neutral: (i) => `hsl(${(i * 47) % 360} 16% ${52 + (i % 3) * 9}%)`, vivid: (i) => `hsl(${(i * 53) % 360} 78% ${48 + (i % 2) * 8}%)`, dark: (i) => `hsl(${(i * 61) % 360} 32% ${17 + (i % 3) * 6}%)` };
  const COUNT = { home: 8, search: 5, upnext: 8, mobile: 4 }, SLOT = { home: 2, search: 1, upnext: 2, mobile: 1 };
  const renderFeed = () => {
    if (!cands.length) return;
    const ctx = q("[data-ctx]").value, feed = q("[data-feed]"), pal = PAL[q("[data-pal]").value], mine = Number(q("[data-which]").value) || 0;
    feed.dataset.ctx = ctx; feed.classList.toggle("dark", q("[data-dark]").checked);
    const dur = ["8:42", "12:05", "3:17", "21:30", "6:58", "15:12", "9:40", "4:26"];
    let ci = 0, html = "";
    for (let i = 0; i < COUNT[ctx]; i++) {
      const isMine = i === SLOT[ctx], url = isMine ? cands[mine].url : comps.length ? comps[ci++ % comps.length] : null;
      const inner = url ? `<img src="${url}" alt="">` : `<i style="background:linear-gradient(135deg,${pal(i)},${pal(i + 3)})"></i>`;
      html += `<div class="tt-card${isMine ? " mine" : ""}"><div class="tt-thumb">${inner}${isMine ? `<span class="tt-tag">${LABELS[mine]}</span>` : ""}<span class="tt-dur">${dur[i % dur.length]}</span></div><div class="tt-meta"><div class="tt-av"></div><div class="tt-lines"><i></i><i></i></div></div></div>`;
    }
    feed.innerHTML = `<div class="tt-list">${html}</div>`;
  };

  const addFiles = async (files) => {
    const msg = q("[data-msg]"); msg.textContent = "";
    for (const f of [...files]) {
      if (!f.type.startsWith("image/")) continue;
      if (cands.length >= 4) { msg.textContent = "You can compare up to 4 thumbnails. Remove one to add another."; break; }
      let bmp; try { bmp = await createImageBitmap(f, { imageOrientation: "from-image" }); } catch { msg.textContent = `Could not read ${f.name}.`; continue; }
      const a = analyze(sample(bmp, WORK.w, WORK.h), sample(bmp, SMALL.w, SMALL.h));
      cands.push({ file: f, bmp, a, url: URL.createObjectURL(f) });
    }
    renderResults();
  };
  q("[data-file]").addEventListener("change", (e) => { addFiles(e.target.files); e.target.value = ""; });
  const drop = q("[data-drop]");
  ["dragover", "dragenter"].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.add("dragover"); }));
  ["dragleave", "drop"].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.remove("dragover"); }));
  drop.addEventListener("drop", (e) => addFiles(e.dataTransfer.files));
  q("[data-results]").addEventListener("click", (e) => { const i = e.target.dataset.rm; if (i === undefined) return; URL.revokeObjectURL(cands[i].url); cands.splice(Number(i), 1); renderResults(); });
  q("[data-comp]").addEventListener("change", (e) => { [...e.target.files].filter((f) => f.type.startsWith("image/")).slice(0, 8).forEach((f) => comps.push(URL.createObjectURL(f))); comps = comps.slice(0, 8); e.target.value = ""; renderFeed(); });
  q("[data-compclear]").addEventListener("click", () => { comps.forEach(URL.revokeObjectURL); comps = []; renderFeed(); });
  ["[data-ctx]", "[data-which]", "[data-pal]", "[data-dark]"].forEach((s) => q(s).addEventListener("input", renderFeed));
}
