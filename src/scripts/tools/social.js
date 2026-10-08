import { $, formatBytes, isImage, makeFileName, readImage, canvasToBlob, bindFilePicker, bindQuality } from "../shared.js";
import "./platform-selects.js";
import { SOCIAL_SPECS } from "../../data/platforms.js";

const sm = {
  img: null,
  file: null,
  url: null,
  resultUrl: null
};

bindFilePicker("smDrop", "smFile", async (file) => {
  if (!isImage(file)) {
    alert("Please choose an image file.");
    return;
  }

  try {
    const data = await readImage(file);

    if (sm.url) URL.revokeObjectURL(sm.url);
    if (sm.resultUrl) URL.revokeObjectURL(sm.resultUrl);

    sm.file = file;
    sm.img = data.img;
    sm.url = data.url;

    $("#smFileSize").textContent = formatBytes(file.size);
    $("#smOrig").textContent = `${data.img.naturalWidth} × ${data.img.naturalHeight}`;
    $("#smPreview").innerHTML = `<img src="${data.url}" alt="Preview" />`;
    $("#smResult").classList.add("hidden");
  } catch (error) {
    alert("Could not load image.");
  }
});

$("#smButton").addEventListener("click", async () => {
  if (!sm.img) {
    alert("Upload an image first.");
    return;
  }

  const spec = SOCIAL_SPECS.find((item) => item.id === $("#smPlatform").value);
  if (!spec) return;

  const fit = $("#smFit").value;
  const background = $("#smBackground").value;
  const format = $("#smFormat").value;
  const quality = parseFloat($("#smQuality").value);

  const canvas = document.createElement("canvas");
  canvas.width = spec.width;
  canvas.height = spec.height;

  const ctx = canvas.getContext("2d");

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, spec.width, spec.height);

  const iw = sm.img.naturalWidth;
  const ih = sm.img.naturalHeight;

  const scale =
    fit === "cover"
      ? Math.max(spec.width / iw, spec.height / ih)
      : Math.min(spec.width / iw, spec.height / ih);

  const dw = iw * scale;
  const dh = ih * scale;
  const dx = (spec.width - dw) / 2;
  const dy = (spec.height - dh) / 2;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(sm.img, dx, dy, dw, dh);

  const blob = await canvasToBlob(canvas, format, format === "image/png" ? undefined : quality);

  if (!blob) {
    alert("This browser cannot export that format. Try PNG or JPEG.");
    return;
  }

  if (sm.resultUrl) URL.revokeObjectURL(sm.resultUrl);
  sm.resultUrl = URL.createObjectURL(blob);

  $("#smPreview").innerHTML = `<img src="${sm.resultUrl}" alt="${spec.name} preview" />`;
  $("#smResultSize").textContent = `${spec.name} • ${spec.width} × ${spec.height} • ${formatBytes(blob.size)}`;

  const dl = $("#smDownload");
  dl.href = sm.resultUrl;
  dl.download = makeFileName(sm.file && sm.file.name, spec.id, format);

  $("#smResult").classList.remove("hidden");
});


bindQuality("smFormat", "smQuality", "smQualityValue");
