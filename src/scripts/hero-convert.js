// Quick convert on the home page: drop/click/paste an image, choose PNG / JPG / WebP (AVIF where the browser can save it), download.
const $ = (id) => document.getElementById(id);
const drop = $("qcDrop");
if (drop) {
  const FMT = { png: ["image/png", "png"], jpg: ["image/jpeg", "jpg"], webp: ["image/webp", "webp"], avif: ["image/avif", "avif"] };
  const S = { img: null, file: null, srcUrl: null, outUrl: null, fmt: "jpg", timer: 0, token: 0 };

  // AVIF only if this browser can really encode it.
  try {
    const c = document.createElement("canvas"); c.width = c.height = 1;
    if (c.toDataURL("image/avif").startsWith("data:image/avif")) {
      const b = document.createElement("button");
      b.type = "button"; b.className = "qc-chip"; b.dataset.f = "avif"; b.setAttribute("aria-pressed", "false"); b.textContent = "AVIF";
      $("qcFormats").appendChild(b);
    }
  } catch (e) {}

  const bytes = (n) => (n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(n < 10240 ? 1 : 0)} KB` : `${(n / 1048576).toFixed(2)} MB`);
  const say = (t) => { $("qcMsg").textContent = t || ""; };

  function reset() {
    S.token++;
    if (S.srcUrl) URL.revokeObjectURL(S.srcUrl);
    if (S.outUrl) URL.revokeObjectURL(S.outUrl);
    Object.assign(S, { img: null, file: null, srcUrl: null, outUrl: null });
    $("qcWork").hidden = true; drop.hidden = false; say(""); $("qcFile").value = "";
  }

  function setFormat(f) {
    S.fmt = f;
    document.querySelectorAll("#qcFormats .qc-chip").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.f === f)));
    $("qcQ").hidden = f === "png";
    convert();
  }

  function pickDefault(type) {
    if (type === "image/png") return "jpg";
    if (type === "image/jpeg") return "webp";
    return "jpg";
  }

  async function load(file) {
    if (!file || !file.type.startsWith("image/")) { say("Please choose an image file (PNG, JPG, WebP, GIF, BMP or SVG)."); return; }
    reset();
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      S.img = img; S.file = file; S.srcUrl = url;
      const w = img.naturalWidth || 1024, h = img.naturalHeight || 1024;
      $("qcImg").src = url;
      $("qcName").textContent = file.name || "Pasted image";
      $("qcMeta").textContent = `${w} × ${h} px · ${bytes(file.size)} · ${(file.type.split("/")[1] || "image").toUpperCase().replace("JPEG", "JPG")}`;
      drop.hidden = true; $("qcWork").hidden = false; say("");
      setFormat(pickDefault(file.type));
    };
    img.onerror = () => { URL.revokeObjectURL(url); say("This browser can't open that file type. Try a PNG, JPG, WebP, GIF or BMP."); };
    img.src = url;
  }

  function convert() {
    clearTimeout(S.timer);
    S.timer = setTimeout(async () => {
      if (!S.img) return;
      const my = ++S.token;
      const [mime, ext] = FMT[S.fmt];
      const w = S.img.naturalWidth || 1024, h = S.img.naturalHeight || 1024;
      try {
        const c = document.createElement("canvas"); c.width = w; c.height = h;
        const ctx = c.getContext("2d");
        if (S.fmt === "jpg") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h); }
        ctx.drawImage(S.img, 0, 0, w, h);
        const q = S.fmt === "png" ? undefined : Number($("qcQuality").value) / 100;
        const blob = await new Promise((res) => c.toBlob(res, mime, q));
        if (my !== S.token) return;
        if (!blob || blob.type !== mime) { say(`This browser can't save ${ext.toUpperCase()} files. Pick another format.`); $("qcOut").textContent = ""; $("qcDl").removeAttribute("href"); return; }
        if (S.outUrl) URL.revokeObjectURL(S.outUrl);
        S.outUrl = URL.createObjectURL(blob);
        const base = (S.file.name || "image").replace(/\.[^.]+$/, "") || "image";
        const dl = $("qcDl"); dl.href = S.outUrl; dl.download = `${base}.${ext}`;
        const diff = Math.round((1 - blob.size / S.file.size) * 100);
        $("qcOut").textContent = `${base}.${ext} · ${bytes(blob.size)}` + (Math.abs(diff) >= 1 ? ` (${diff > 0 ? "−" : "+"}${Math.abs(diff)}%)` : "");
        say(S.fmt === "jpg" ? "JPG has no transparency, so transparent areas become white." : "");
      } catch (e) { say("Could not convert this image. It may be too large for your browser."); }
    }, 120);
  }

  $("qcFile").addEventListener("change", (e) => load(e.target.files[0]));
  drop.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); $("qcFile").click(); } });
  ["dragenter", "dragover"].forEach((n) => drop.addEventListener(n, (e) => { e.preventDefault(); drop.classList.add("over"); }));
  ["dragleave", "drop"].forEach((n) => drop.addEventListener(n, (e) => { e.preventDefault(); drop.classList.remove("over"); }));
  drop.addEventListener("drop", (e) => load(e.dataTransfer.files[0]));
  $("qcFormats").addEventListener("click", (e) => { const b = e.target.closest(".qc-chip"); if (b) setFormat(b.dataset.f); });
  $("qcQuality").addEventListener("input", (e) => { $("qcQv").textContent = e.target.value; convert(); });
  $("qcAgain").addEventListener("click", reset);
  document.addEventListener("paste", (e) => {
    const it = [...(e.clipboardData ? e.clipboardData.items : [])].find((i) => i.type.startsWith("image/"));
    if (it) { e.preventDefault(); load(it.getAsFile()); }
  });
}
