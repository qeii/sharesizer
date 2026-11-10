"use strict";
export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return "—";
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function isImage(file) {
  return Boolean(file && file.type && file.type.startsWith("image/"));
}

export function mimeToExtension(mime) {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "png";
}

export function makeFileName(original, suffix, mime) {
  const base = (original || "image").replace(/\.[^/.]+$/, "");
  return `${base}-${suffix}.${mimeToExtension(mime)}`;
}

export async function readImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.decoding = "async";

    img.onload = () => resolve({ img, url });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not load image"));
    };

    img.src = url;
  });
}

export function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}

export function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function bindFilePicker(dropId, inputId, onFile) {
  const drop = document.getElementById(dropId);
  const input = document.getElementById(inputId);

  if (!drop || !input) return;

  drop.addEventListener("dragover", (e) => {
    e.preventDefault();
    drop.classList.add("dragover");
  });

  drop.addEventListener("dragleave", () => {
    drop.classList.remove("dragover");
  });

  drop.addEventListener("drop", (e) => {
    e.preventDefault();
    drop.classList.remove("dragover");

    const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) {
      onFile(file);
    }
  });

  input.addEventListener("change", () => {
    if (input.files && input.files[0]) {
      onFile(input.files[0]);
    }
  });

  attachIntake(drop, onFile);
}


// ---- Extra ways to add an image: paste (Ctrl+V), paste a link, drag a picture from another tab, drop anywhere ----
const looksUrl = (t) => /^https?:\/\/\S+$/i.test((t || "").trim());

export async function fileFromUrl(raw) {
  const url = raw.trim();
  let res;
  try { res = await fetch(url); } catch { throw new Error("blocked"); }
  if (!res.ok) throw new Error("blocked");
  const blob = await res.blob();
  if (!blob.type.startsWith("image/")) throw new Error("notimage");
  let name = "image";
  try { name = decodeURIComponent(new URL(url).pathname.split("/").pop() || "image"); } catch {}
  name = name.replace(/[^\w.\-]+/g, "-") || "image";
  if (!/\.[a-z0-9]{2,5}$/i.test(name)) name += "." + mimeToExtension(blob.type);
  return new File([blob], name, { type: blob.type });
}

export function attachIntake(drop, onFile) {
  if (!drop || drop.dataset.intake) return;
  drop.dataset.intake = "1";

  const row = document.createElement("div");
  row.className = "url-intake";
  row.innerHTML = '<input type="url" inputmode="url" placeholder="…or paste an image link (https://…)" aria-label="Image link" /><button type="button" class="btn secondary">Load</button><p class="hint" role="status"></p>';
  drop.insertAdjacentElement("afterend", row);
  const input = row.querySelector("input"), msg = row.querySelector("p");

  const loadUrl = async (u) => {
    msg.textContent = "Loading image…";
    try {
      const f = await fileFromUrl(u);
      msg.textContent = "";
      input.value = "";
      await onFile(f);
    } catch (e) {
      msg.textContent = e.message === "notimage"
        ? "That link is not an image."
        : "That website does not allow loading its images here. Right-click the image, choose Copy image, then press Ctrl+V on this page. Or save it and drop the file.";
    }
  };

  row.querySelector("button").addEventListener("click", () => looksUrl(input.value) ? loadUrl(input.value) : (msg.textContent = "Paste a link that starts with https://"));
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); row.querySelector("button").click(); } });
  input.addEventListener("paste", () => setTimeout(() => looksUrl(input.value) && loadUrl(input.value), 0));

  const fromTransfer = (dt) => {
    if (!dt) return false;
    const file = Array.from(dt.files || []).find(isImage);
    if (file) { onFile(file); return true; }
    const text = (dt.getData("text/uri-list") || dt.getData("text/plain") || "").split("\n")[0];
    if (looksUrl(text)) { loadUrl(text); return true; }
    return false;
  };

  // Ctrl+V anywhere on the page (but not while typing in a text field)
  document.addEventListener("paste", (e) => {
    const t = e.target;
    if (t && (t.isContentEditable || t.tagName === "TEXTAREA" || (t.tagName === "INPUT" && !/^(checkbox|radio|range|file|button|color)$/.test(t.type)))) return;
    const cd = e.clipboardData;
    if (!cd) return;
    const items = Array.from(cd.items || []).map((i) => (i.kind === "file" ? i.getAsFile() : null)).filter(Boolean);
    const file = items.find(isImage) || Array.from(cd.files || []).find(isImage);
    if (file) { e.preventDefault(); onFile(file); return; }
    const text = cd.getData("text");
    if (looksUrl(text)) { e.preventDefault(); loadUrl(text); }
  });

  // A picture dragged from another browser tab arrives as a link, not a file
  drop.addEventListener("drop", (e) => { if (!(e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length)) fromTransfer(e.dataTransfer); });

  // Dropping a picture outside the box: use it instead of letting the browser open it
  window.addEventListener("dragover", (e) => {
    const types = Array.from((e.dataTransfer && e.dataTransfer.types) || []);
    if (types.includes("Files")) e.preventDefault();
  });
  window.addEventListener("drop", (e) => {
    if (e.defaultPrevented) return;
    e.preventDefault();
    fromTransfer(e.dataTransfer);
  });
}

export function bindQuality(formatId, qualityId, labelId) {
  const format = document.getElementById(formatId);
  const quality = document.getElementById(qualityId);
  const label = document.getElementById(labelId);

  if (!format || !quality) return;

  const update = () => {
    if (label) label.textContent = quality.value;
    quality.disabled = format.value === "image/png";
  };

  format.addEventListener("change", update);
  quality.addEventListener("input", update);
  update();
}

