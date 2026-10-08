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

