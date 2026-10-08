import { $, $$, clamp, isImage, makeFileName, readImage, canvasToBlob, triggerDownload, bindFilePicker, bindQuality } from "../shared.js";

const cr = {
  img: null,
  file: null,
  url: null,
  crop: { x: 0.12, y: 0.12, w: 0.76, h: 0.76 }
};

bindFilePicker("crDrop", "crFile", async (file) => {
  if (!isImage(file)) {
    alert("Please choose an image file.");
    return;
  }

  try {
    const data = await readImage(file);

    if (cr.url) URL.revokeObjectURL(cr.url);

    cr.file = file;
    cr.img = data.img;
    cr.url = data.url;

    const imgEl = $("#crImage");
    imgEl.src = data.url;

    $("#crEmpty").classList.add("hidden");
    $("#crStage").classList.remove("hidden");

    const init = () => {
      cr.crop = { x: 0.12, y: 0.12, w: 0.76, h: 0.76 };
      renderCrop();
      updateCropInfo();
    };

    if (imgEl.complete) {
      init();
    } else {
      imgEl.onload = init;
    }
  } catch (error) {
    alert("Could not load image.");
  }
});

export function renderCrop() {
  const imgEl = $("#crImage");
  const box = $("#crBox");

  if (!imgEl || !box || !imgEl.clientWidth || !imgEl.clientHeight) return;

  box.style.left = `${cr.crop.x * imgEl.clientWidth}px`;
  box.style.top = `${cr.crop.y * imgEl.clientHeight}px`;
  box.style.width = `${cr.crop.w * imgEl.clientWidth}px`;
  box.style.height = `${cr.crop.h * imgEl.clientHeight}px`;
}

function updateCropInfo() {
  if (!cr.img) return;

  const width = Math.round(cr.crop.w * cr.img.naturalWidth);
  const height = Math.round(cr.crop.h * cr.img.naturalHeight);

  $("#crInfo").textContent = `${width} × ${height} px`;
}

function startCropDrag(event, mode) {
  if (!cr.img) return;

  event.preventDefault();
  event.stopPropagation();

  const imgEl = $("#crImage");
  const rect = imgEl.getBoundingClientRect();

  const startX = event.clientX;
  const startY = event.clientY;
  const start = { ...cr.crop };

  const minW = Math.min(0.9, 20 / rect.width);
  const minH = Math.min(0.9, 20 / rect.height);

  function onMove(ev) {
    const dx = (ev.clientX - startX) / rect.width;
    const dy = (ev.clientY - startY) / rect.height;

    const c = { ...start };

    if (mode === "move") {
      c.x = clamp(start.x + dx, 0, 1 - start.w);
      c.y = clamp(start.y + dy, 0, 1 - start.h);
    } else {
      if (mode.includes("e")) {
        c.w = clamp(start.w + dx, minW, 1 - start.x);
      }

      if (mode.includes("s")) {
        c.h = clamp(start.h + dy, minH, 1 - start.y);
      }

      if (mode.includes("w")) {
        const newW = clamp(start.w - dx, minW, start.x + start.w);
        c.x = start.x + start.w - newW;
        c.w = newW;
      }

      if (mode.includes("n")) {
        const newH = clamp(start.h - dy, minH, start.y + start.h);
        c.y = start.y + start.h - newH;
        c.h = newH;
      }
    }

    cr.crop = c;
    renderCrop();
    updateCropInfo();
  }

  function onUp() {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("pointercancel", onUp);
  }

  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  window.addEventListener("pointercancel", onUp);
}

$("#crBox").addEventListener("pointerdown", (e) => startCropDrag(e, "move"));

$$("#crBox .handle").forEach((handle) => {
  handle.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
    startCropDrag(e, handle.dataset.handle);
  });
});

$("#crButton").addEventListener("click", async () => {
  if (!cr.img) {
    alert("Upload an image first.");
    return;
  }

  const sx = Math.round(cr.crop.x * cr.img.naturalWidth);
  const sy = Math.round(cr.crop.y * cr.img.naturalHeight);
  const sw = Math.max(1, Math.round(cr.crop.w * cr.img.naturalWidth));
  const sh = Math.max(1, Math.round(cr.crop.h * cr.img.naturalHeight));

  const format = $("#crFormat").value;
  const quality = parseFloat($("#crQuality").value);

  const canvas = document.createElement("canvas");
  canvas.width = sw;
  canvas.height = sh;

  const ctx = canvas.getContext("2d");

  if (format === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, sw, sh);
  }

  ctx.drawImage(cr.img, sx, sy, sw, sh, 0, 0, sw, sh);

  const blob = await canvasToBlob(canvas, format, format === "image/png" ? undefined : quality);

  if (!blob) {
    alert("Export failed. Try PNG or JPEG.");
    return;
  }

  triggerDownload(blob, makeFileName(cr.file && cr.file.name, "cropped", format));
});

window.addEventListener("resize", renderCrop);


bindQuality("crFormat", "crQuality", "crQualityValue");
